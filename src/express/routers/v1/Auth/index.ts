import express from "express";
import bcrypt from "bcrypt";
import prisma from "../../../../utils/databases/prisma";
import jwt from "jsonwebtoken";
import { Config } from "../../../../static/config";
import functions from "../../../../utils/functions/index";
import ms from "ms";
import randomString from "randomstring";
const router = express.Router();
router.post("/state", async (req, res) => {
	if (!["form", "google", "discord"].includes(req.body?.platform)) return res.json({ code: 400, msgCode: "a-a-400", detail: "platform" });
	if (!["login"].includes(req.body?.type)) return res.json({ code: 400, msgCode: "a-a-400", detail: "type" });
	const state = randomString.generate({ length: 30 });
	await prisma.login_states.create({
		data: {
			id: functions.system.createSnowflakeId(),
			user_id: "",
			create_at: Date.now().toString(),
			state: state,
			platform: req.body.platform,
			type: req.body.type,
			next_step: "auth",
			status: "pending",
		},
	});
	return res.json({ code: 200, msgCode: "a-a-200", state });
});
router.get("/callback", async (req, res) => {
	// oauth2 login
});
router.post("/revoke", async (req, res) => {
	if (req.body.access_token) {
		jwt.verify(req.body.access_token, `${process.env.JWT_ACCESS_SECRET}`, async function (err: any, decoded: any) {
			if (decoded?.id) {
				const findUserSession: any = await prisma.user_sessions?.findFirst({
					where: {
						access_token: req.body.access_token,
					},
				});
				if (!findUserSession) return res.json({ code: 400, msgCode: "a-a-401" });

				await prisma.user_sessions?.update({
					where: {
						access_token: req.body.access_token,
					},
					data: {
						expire_at: Date.now().toString(),
					},
				});
				return res.json({
					code: 200,
					msgCode: "a-a-200",
				});
			}
			return res.json({ code: 400, msgCode: "a-a-404" });
		});
	} else {
		return res.json({ code: 400, msgCode: "a-u-400" });
	}
});
router.post("/token", async (req, res) => {
	if (req.body.refresh_token) {
		jwt.verify(req.body.refresh_token, `${process.env.JWT_REFRESH_SECRET}`, async function (err: any, decoded: any) {
			if (decoded?.id) {
				const findUserSession: any = await prisma.user_sessions?.findFirst({
					where: {
						refresh_token: req.body.refresh_token,
					},
				});
				if (!findUserSession) return res.json({ code: 400, msgCode: "a-a-401" });
				const access_token = await jwt.sign({ id: findUserSession.user_id }, `${process.env.JWT_ACCESS_SECRET}`, {
					expiresIn: ms(`${process.env.JWT_ACCESS_TIME_LIVE}`),
				});
				const refresh_token = await jwt.sign({ id: findUserSession.user_id }, `${process.env.JWT_REFRESH_SECRET}`, {
					expiresIn: ms(`${process.env.JWT_REFRESH_TIME_LIVE}`),
				});
				await prisma.user_sessions?.update({
					where: {
						refresh_token: req.body.refresh_token,
					},
					data: {
						access_token,
						refresh_token,
						expire_at: (Date.now() + ms("1h")).toString(),
					},
				});
				return res.json({
					code: 200,
					msgCode: "a-a-200",
					access_token,
					refresh_token,
				});
			}
			return res.json({ code: 400, msgCode: "a-a-404" });
		});
	} else {
		return res.json({ code: 400, msgCode: "a-u-400" });
	}
});
router.post("/callback", async (req, res) => {
	if (!req.body.state) return res.json({ code: 400, msgCode: "a-u-100" });

	const findLoginState: any = await prisma.login_states?.findFirst({
		where: {
			state: req.body.state,
		},
	});
	if (!findLoginState || findLoginState?.create_at + ms("5m") < Date.now() || findLoginState.status == "finished") return res.json({ code: 400, msgCode: "a-u-101" });
	switch (findLoginState.next_step) {
		case "auth":
			if (!req.body.identify || !req.body.password) return res.json({ code: 400, msgCode: "a-u-100" }); // this means no login info was provided

			let user: any;
			const findUserById: any = await prisma.users?.findFirst({
				where: {
					id: req.body.identify,
				},
			});
			if (findUserById) user = findUserById;
			const findUserByUsername: any = await prisma.users?.findFirst({
				where: {
					username: req.body.identify,
				},
			});
			if (findUserByUsername) user = findUserByUsername;
			const findUserByEmail: any = await prisma.users?.findFirst({
				where: {
					email: req.body.identify,
				},
			});
			if (findUserByEmail) user = findUserByEmail;
			if (!user) return res.json({ code: 400, msgCode: "a-u-404" });

			bcrypt.compare(req.body.password, user.hashed_password, async function (err, isTrue) {
				if (isTrue) {
					await prisma.login_states?.update({
						where: {
							state: req.body.state,
						},
						data: {
							user_id: user.id,
						},
					});
					if (user.flags.includes("2fa")) {
						await prisma.login_states?.update({
							where: {
								state: req.body.state,
							},
							data: {
								next_step: "2fa",
							},
						});
						return res.json({ code: 201, msgCode: "a-u-105" }); // need an additional step
					} else {
						return createLoginSession({ state: findLoginState.state, user });
					}
				} else {
					return res.json({ code: 400, msgCode: "a-u-103" }); // invalid login info
				}
			});

            break;
        case '2fa':
            break;
        default:
            break;
    }
    async function createLoginSession(data: any) {
        await prisma.login_states?.update({
            where: {
                state: req.body.state
            },
            data: {
                status: 'finished',
                next_step: ''
            }
        });
        const access_token = await jwt.sign({id: data.user.id}, `${process.env.JWT_ACCESS_SECRET}`, {
            expiresIn: ms(`${process.env.JWT_ACCESS_TIME_LIVE}`)//thử xem // đc kìa yep
        });
        const refresh_token = await jwt.sign({id: data.user.id}, `${process.env.JWT_REFRESH_SECRET}`, {
            expiresIn: ms(`${process.env.JWT_REFRESH_TIME_LIVE}`)//thử xem // đc kìa yep
        });
        const agent : any = req.useragent
        await prisma.user_sessions.create({
            data: {
                id: functions.system.createSnowflakeId(),
                create_at: Date.now().toString(),
                create_by: data.user.id,
                user_id: data.user.id,
                expire_at: (Date.now() + ms('1h')).toString(),
                state: req.body.state,
                access_token,
                refresh_token,
                agent: agent.source,
                platform: agent.platform,
                ip: ''
            }
        })
        return res.json({
            code: 200,
            msgCode: 'a-a-200',
            access_token,
            refresh_token
        });
    }
});
router.post("/register", async (req, res) => {
	if (!req.body.email) return res.json({ code: 400, msgCode: "a-u-400", detail: "email" });
	if (!req.body.username) return res.json({ code: 400, msgCode: "a-u-400", detail: "username" });
	if (!req.body.password) return res.json({ code: 400, msgCode: "a-u-400", detail: "password" });
	const findUserByUsername = await prisma.users?.findFirst({
		where: {
			username: req.body.username,
		},
	});
	if (findUserByUsername) return res.json({ code: 400, msgCode: "a-u-410", detail: "username" }); //username esixt
	const findUserByEmail = await prisma.users?.findFirst({
		where: {
			email: req.body.email,
		},
	});
	if (findUserByEmail) return res.json({ code: 400, msgCode: "a-u-410", detail: "email" }); //username esixt

	bcrypt.hash(req.body.password, 10, async function (err, hash) {
		await prisma.users.create({
			data: {
				id: functions.system.createSnowflakeId().toString(),
				username: req.body.username,
				hashed_password: hash,
				create_at: Date.now().toString(),
				email: req.body.email,
				flags: "['member']",
			},
		});
		return res.json({
			code: 200,
			msgCode: "a-u-200",
		});
	});
});
export default router;
