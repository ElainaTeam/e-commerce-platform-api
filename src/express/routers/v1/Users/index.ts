import express from "express";
const router = express.Router();
import prisma from "../../../../utils/databases/prisma";
router.get("/@me", (req, res) => {
	// function exclude(user : any, keys : any) {
	// 	return Object.fromEntries(
	// 	  Object.entries(user).filter(([key]) => !keys.includes(key))
	// 	);
	// }
	return res.json({
		code: 200,
		msgCode: "a-u-200",
		// user: exclude(req.user, ['access_token']),
		user: req.user
	});
});

router.get("/@me/posts", async (req, res) => {
	const getPost = await prisma.forum_post.findMany({ 
		where: {
			user_id: req.user.id
		}
	})

	return res.json({
		code: 200,
		msgCode: "a-u-200",
		posts: getPost
	})
})

router.get("/@me/reactions", async (req, res) => {
	const getPostReaction = await prisma.forum_post_reaction.findMany({
		where: {
			user_id: req.user.id
		},
		include: {
			post: true,
		}
	})

	return res.json({
		code: 200,
		msgCode: "a-u-200",
		reactions: getPostReaction
	})
})

router.get("/@me/reactions/comment", async (req, res) => {
	const getCommentReaction = await prisma.forum_post_comment_reaction.findMany({
		where: {
			user_id: req.user.id
		},
		include: {
			comment: true,
		}
	})

	return res.json({
		code: 200,
		msgCode: "a-u-200",
		reactions: getCommentReaction
	})
})

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
