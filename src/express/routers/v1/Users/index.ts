import express from "express";
const router = express.Router();
import prisma from "../../../../utils/databases/prisma";
router.get("/@me", (req, res) => {
	function exclude(user : any, keys : any) {
		return Object.fromEntries(
		  Object.entries(user).filter(([key]) => !keys.includes(key))
		);
	}
	return res.json({
		code: 200,
		msgCode: "a-u-200",
		user: exclude(req.user, ['hashed_password', 'access_token']),
	});
});

router.get("/:id", async (req, res) => {
	const user = await prisma.users?.findFirst({
		where: {
			id: req.params.id,
		},
		omit: {
			hashed_password: true
		}
	});
	if (!user)
		return res.status(404).json({
			code: 404,
			msgCode: "a-u-404",
		});
	return res.json({
		code: 200,
		msg: "a-u-200",
		user: user
	});
});

export default router;
