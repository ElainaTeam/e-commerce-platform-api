import prisma from "@/utils/databases/prisma";
import functions from "@/utils/functions";
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
	const allPost = await prisma.forum_posts.findMany({
		where: {
			isPublished: true,
		},
		include: {
			user: true,
			comments: true,
			topics: true,
		},
	});

	return res.json({
		code: 200,
		msg: "a-f-200",
		posts: allPost,
	});
});

router.put("/", async (req, res) => {
    if (!req.body.title || !req.body.content || !req.body?.topics?.[0]) return res.json({code: 400, msgCode: 'a-f-400'});
	const post_id = functions.system.createSnowflakeId();
	await prisma.forum_posts.create({
		data: {
			id: post_id,
			title: req.body.title,
			image: req.body.image || undefined,
			content: req.body.content,
			topics: req.body.topics,
			user: req.user.id,
		},
	});
});
export default router;
