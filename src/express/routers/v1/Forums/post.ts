import prisma from "./../../../../utils/databases/prisma";
import functions from "./../../../../utils/functions";
import express from "express";
import ms from "ms";
const router = express.Router();

router.get("/newfeed", async (req, res) => {
	const allPost = await prisma.forum_post.findMany({
		where: {
			flags: {
				array_contains: ['approved']
			},
		},
		include: {
			user: {
				select: {
					id: true,
					username: true,
					icon_name: true,
					banner_name: true,
					create_at: true,
					flags: true
				},
			},
			_count: {
				select: {
					comments: true,
					reactions: true
				}
			},
			forum_topics: true,
		},
	});
	if (allPost.length <= 0) return res.json({ code: 404, msgCode: "a-f-404" });
	const latestPosts = allPost.filter((x) => Date.now() - parseInt(String(x.create_at)) < ms("24h"));
	const mostCommentPosts = allPost.filter((x) => x._count.comments > 5 || x._count.comments > 10);
	const mostCommentReactions = allPost.filter((x) => x._count.reactions > 5 || x._count.reactions > 10);
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
	let perPage = Number(req.query.limit);
	let currentPage = (Number(req.query.page) - 1) * perPage;

	const allPost = await prisma.forum_post.findMany({
		take: perPage || 5,
		skip: currentPage || 0,
		where: {
			flags: {
				array_contains: ['approved']
			},
			title: {
				search: req.query.q?.toString().split(" ").join(" & ")
			},
		},
		include: {
			user: {
				select: {
					id: true,
					username: true,
					icon_name: true,
					banner_name: true,
					create_at: true,
					flags: true
				},
			},
			_count: {
				select: {
					comments: true,
					reactions: true
				}
			},
			forum_topics: true,
		},
	});

	return res.json({
		code: 200,
		msg: "a-f-200",
		posts: allPost,
	});
});

router.get("/:post_id", async (req, res) => {
	const post = await prisma.forum_post.findUnique({
		where: {
			flags: {
				array_contains: ['approved']
			},
			id: req.params.post_id
		},
		include: {
			forum_topics: true,
			user: {
				select: {
					id: true,
					username: true,
					icon_name: true,
					banner_name: true,
					create_at: true,
					flags: true
				},
			},
			_count: {
				select: {
					reactions: true,
					comments: true,
				}
			}
		},
	})

	if(!post) return res.json({ code: 404, msgCode: "a-f-404"})

	return res.json({ code: 200, msgCode: "a-f-200", post })
})

router.get("/:post_id/comments", async (req, res) => {
	let perPage = Number(req.query.limit);
	let currentPage = (Number(req.query.page) - 1) * perPage;

	const postComments = await prisma.forum_post.findUnique({
		where: {
			flags: {
				array_contains: ['approved']
			},
			id: req.params.post_id
		},
		select: {
			comments: {
				take: perPage || 5,
				skip: currentPage || 0,
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
				}
			},
		}
	})

	if(!postComments) return res.json({ code: 404, msgCode: "a-f-404"})

	return res.json({ code: 200, msgCode: "a-f-200", postComments })
})

router.post("/:post_id/comments", async (req, res) => {
	if (!req.body.content) return res.json({ code: 400, msgCode: "a-f-400" });

	const comment_id = functions.system.createSnowflakeId();

	const post = await prisma.forum_post.findUnique({
		where: {
			id: req.params.post_id
		}
	})
	if(!post) return res.json({ code: 404, msgCode: "a-f-404"})

	const newComments = await prisma.forum_post_comment.create({
		data: {
			content: req.body.content,
			id: comment_id, 
			created_at: Date.now().toString(),
			updated_at: Date.now().toString(),
			userId: req.user.id,
			post_id: req.params.post_id
		}
	})
	
	return res.json({ code: 200, msgCode: "a-f-200", newComments })
})

router.delete("/comment/:comment_id", async (req, res) => {
	const comment = await prisma.forum_post_comment.findUnique({
		where: {
			id: req.params.comment_id
		}
	})
	if(!comment) return res.json({ code: 404, msgCode: "a-f-404" })
	if (comment.userId !== req.user.id || !req.user.flags.includes("admin" || "mod")) return res.json({ code: 403, msgCode: "a-f-403" });

	await prisma.forum_post_comment.delete({
		where: {
			id: req.params.comment_id
		}
	})

	return res.json({ code: 200, msgCode: "a-f-200"})
})

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
			flags: ['hidden'],
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
			flags: ["hidden"],
		},
	});
	return res.json({ code: 200, msgCode: "a-f-200", post_id, dataPost });
});

export default router;
