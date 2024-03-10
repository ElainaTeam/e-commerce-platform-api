import prisma from "@/utils/databases/prisma";
import functions from "@/utils/functions";
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
	const allPost = await prisma.forums.findMany({
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
		msg: "a-u-200",
		posts: allPost,
	});
});

router.post("/new", async (req, res) => {
	const forumId = functions.system.createSnowflakeId();

	await prisma.forums.create({
		data: {
			id: forumId,
			title: req.body.title,
			image: req.body.image,
			content: req.body.content,
			topics: req.body.topics,
			user: req.user.id,
		},
	});
});

export default router;
