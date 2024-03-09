import express from 'express'
import bcrypt from 'bcrypt'
import prisma from '../../../../utils/databases/prisma'
import jwt from 'jsonwebtoken'
import { Config } from '../../../../static/config'
import functions from '../../../../utils/functions/index'
import ms from 'ms';
import randomString from 'randomstring';
const router = express.Router();
router.post('/state', async (req, res) => {
    if (!['form', 'google', 'discord'].includes(req.body?.platform)) return res.json({ code: 400, msgCode: 'a-a-400', detail: 'platform' });
    if (!['login'].includes(req.body?.type)) return res.json({ code: 400, msgCode: 'a-a-400', detail: 'type' });
    const state = randomString.generate({length: 30});
    await prisma.login_states.create({
        data: {
            id: functions.system.createSnowflakeId(),
            user_id: '',
            create_at: Date.now().toString(),
            state: state,
            platform: req.body.platform,
            type: req.body.type,
            next_step: 'auth',
            status: 'pending'
        }
    });
    return res.json({code: 200, msgCode: 'a-a-200', state})
});
/**
 *  payload JWT TEST {
    "username": "Peter Tuan Anh",
    "email": "petertuananh@hotmail.com",
    "iat": 1516239022
    }
 */
router.get('/callback', async (req, res) => {
    // oauth2 login
});
router.post('/revoke', async (req, res) => {
})
router.post('/callback', async (req, res) => {
    
    if (!req.body.state) return res.json({ code: 400, msgCode: 'a-u-100' });

    const findLoginState: any = await prisma.login_states?.findFirst({
        where: {
            state: req.body.state
        }
    });
    if (!findLoginState || ((findLoginState?.create_at + ms('5m')) < Date.now()) || (findLoginState.status == 'finished')) return res.json({ code: 400, msgCode: 'a-u-101' });
    switch (findLoginState.next_step) {
        case 'auth':
            if (!req.body.identify || !req.body.password) return res.json({ code: 400, msgCode: 'a-u-100' }); // this means no login info was provided

            let user : any;
            const findUserById: any = await prisma.users?.findFirst({
                where: {
                    id: req.body.identify
                }
            });
            if (findUserById) user = findUserById;
            const findUserByUsername: any = await prisma.users?.findFirst({
                where: {
                    username: req.body.identify
                }
            });
            if (findUserByUsername) user = findUserByUsername;
            const findUserByEmail: any = await prisma.users?.findFirst({
                where: {
                    email: req.body.identify
                }
            });
            if (findUserByEmail) user = findUserByEmail;
            if (!user) return res.json({ code: 400, msgCode: 'a-u-404' });

            bcrypt.compare(req.body.password, user.hashed_password, async function (err, isTrue) {
                if (isTrue) {
                    await prisma.login_states?.update({
                        where: {
                            state: req.body.state
                        },
                        data: {
                            user_id: user.id
                        }
                    });
                    if (user.flags.includes('2fa')) {
                        await prisma.login_states?.update({
                            where: {
                                state: req.body.state
                            },
                            data: {
                                next_step: '2fa'
                            }
                        });
                        return res.json({ code: 201, msgCode: 'a-u-105' }); // need an additional step
                    } else {
                        
                        return createLoginSession({ state: findLoginState.state, user });
                    }
                } else {
                    return res.json({ code: 400, msgCode: 'a-u-103' }); // invalid login info
                }
            })


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
        return res.json({
            code: 200,
            msgCode: 'a-u-200',
            access_token,
            refresh_token
        });
    }
});
router.post('/register', async (req, res) => {
    if (!req.body.email) return res.json({ code: 400, msgCode: 'a-u-400', detail: 'email' });
    if (!req.body.username) return res.json({ code: 400, msgCode: 'a-u-400', detail: 'username' });
    if (!req.body.password) return res.json({ code: 400, msgCode: 'a-u-400', detail: 'password' });
    const findUserByUsername = await prisma.users?.findFirst({
        where: {
            username: req.body.username
        }
    });
    if (findUserByUsername) return res.json({ code: 400, msgCode: 'a-u-410', detail: 'username' }); //username esixt
    const findUserByEmail = await prisma.users?.findFirst({
        where: {
            email: req.body.email
        }
    });
    if (findUserByEmail) return res.json({ code: 400, msgCode: 'a-u-410', detail: 'email' }); //username esixt

    bcrypt.hash(req.body.password, 10, async function (err, hash) {
        await prisma.users.create({
            data: {
                id: functions.system.createSnowflakeId().toString(),
                username: req.body.username,
                hashed_password: hash,
                create_at: Date.now().toString(),
                email: req.body.email,
                flags: "['member']"
            }
        });
        return res.json({
            code: 200,
            msgCode: 'a-u-200'
        })
    });
});
export default router