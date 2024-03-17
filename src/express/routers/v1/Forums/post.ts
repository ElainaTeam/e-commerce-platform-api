import prisma from "./../../../../utils/databases/prisma";
import functions from "./../../../../utils/functions";
import express from "express";
import ms from "ms";
const router = express.Router();
router.get("/newfeed", async (req, res) => {
	const allPost = await prisma.forum_post.findMany({
		where: {
			flag: "approved",
		},
		include: {
			user: {
				select: {
					id: true,
					username: true,
					icon_name: true,
					banner_name: true,
					create_at: true,
				},
			},
			comments: true,
			reactions: true,
			forum_topics: true,
		},
	});
	if (allPost.length <= 0) return res.json({ code: 404, msgCode: "a-f-404" });
	const latestPosts = allPost.filter((x) => Date.now() - parseInt(String(x.create_at)) < ms("24h"));
	const mostCommentPosts = allPost.filter((x) => x.comments.length > 5 || x.comments.length > 10);
	const mostCommentReactions = allPost.filter((x) => x.reactions.length > 5 || x.reactions.length > 10);
	const posts = [...latestPosts, ...mostCommentPosts, ...mostCommentReactions];
	if (posts.length < 10) {
		allPost.forEach(async (post) => {
			if (posts.length > 10) return;
			if (posts.includes(post)) return;
			return posts.push(post);
		});
	}
	return res.json({ code: 200, msgCode: "a-f-200", posts });
});
router.get("/", async (req, res) => {
	let perPage = req.query.limit;
	let currentPage = req.query.page;

	const allPost = await prisma.forum_post.findMany({
		take: perPage ? Number(perPage) : 5,
		skip: currentPage ? (Number(currentPage) - 1) * Number(perPage) : 1,
		where: {
			flag: "approved",
		},
		include: {
			user: {
				select: {
					id: true,
					username: true,
					icon_name: true,
					banner_name: true,
					create_at: true,
				},
			},
			comments: true,
			forum_topics: true,
		},
	});

	return res.json({
		code: 200,
		msg: "a-f-200",
		posts: allPost,
	});
});
router.delete("/:post_id", async (req, res) => {
	const userPost = await prisma.forum_post.findFirst({
		where: {
			id: req.params.post_id,
		},
	});
	if (!userPost) return res.json({ code: 404, msgCode: "a-f-404" });
	if (userPost.user_id !== req.user.id) return res.json({ code: 403, msgCode: "a-f-403" });
	await prisma.forum_post.update({
		where: {
			id: req.params.post_id,
		},
		data: {
			flag: "hidden",
		},
	});
	return res.json({ code: 200, msgCode: "a-f-200" });
});
router.patch("/:post_id", async (req, res) => {
	const userPost = await prisma.forum_post.findFirst({
		where: {
			id: req.params.post_id,
		},
	});
	if (!userPost) return res.json({ code: 404, msgCode: "a-f-404" });
	if (userPost.user_id !== req.user.id) return res.json({ code: 403, msgCode: "a-f-403" });
	const objKeys: any = Object.keys(req.body);
	if (objKeys.some((r: any) => ["id", "create_at", "user_id", "flag"].includes(r))) return res.json({ code: 400, msgCode: "a-f-403" });
	req.body.update_at = Date.now();
	await prisma.forum_post.update({
		where: {
			id: req.params.post_id,
		},
		data: req.body,
	});
	return res.json({ code: 200, msgCode: "a-f-200" });
});

router.post("/", async (req, res) => {
	if (!req.body.title || !req.body.content || !req.body?.forum_topics?.[0]) return res.json({ code: 400, msgCode: "a-f-400" });
	const post_id = functions.system.createSnowflakeId();
	const topics = req.body.forum_topics.map((id: String) => ({ id }));

	const dataPost = await prisma.forum_post.create({
		data: {
			id: post_id,
			title: req.body.title,
			image: req.body.image || undefined,
			content: req.body.content,
			forum_topics: {
				connect: topics,
			},
			user_id: req.user.id,
			create_at: Date.now().toString(),
			update_at: Date.now().toString(),
			flag: "approved",
		},
	});
	return res.json({ code: 200, msgCode: "a-f-200", post_id, dataPost });
});

export default router;
