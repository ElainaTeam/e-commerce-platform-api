import prisma from "./../../../../utils/databases/prisma";
import functions from "./../../../../utils/functions";
import express from "express";
import ms from "ms";
const router = express.Router();
router.get("/newfeed", async (req, res) => {
    const allPost = await prisma.forum_posts.findMany({
		where: {
			flag: 'approved',
		},
		include: {
			user: true,
			comments: true,
			reactions: true,
			topics: true,
		},
	});
    const latestPosts = allPost.filter(x => (Date.now() - parseInt(String(x.create_at))) < ms('24h'));
    const mostCommentPosts = allPost.filter(x => x.comments.length > 5 || x.comments.length > 10);
    const mostCommentReactions = allPost.filter(x => x.reactions.length > 5 || x.reactions.length > 10);
    const posts = [...latestPosts, ...mostCommentPosts, ...mostCommentReactions];
    if (posts.length < 10) {
        for (let i = 0; i < (10 - allPost.length); i++) {
            if (posts.includes(allPost[i])) return;
            return posts.push(allPost[i]);
        }
    };
    return res.json({code: 200, msgCode: 'a-f-200', posts});
})
router.get("/", async (req, res) => {
	const allPost = await prisma.forum_posts.findMany({
		where: {
			flag: 'approved',
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
router.delete("/:post_id", async (req, res) => {
    const userPost = await prisma.forum_posts.findFirst({
        where: {
            id: req.params.post_id,
        }
    });
    if (!userPost) return res.json({code: 404, msgCode: 'a-f-404'});
    if (userPost.user_id !== req.user.id) return res.json({code: 403, msgCode: 'a-f-403'});
    await prisma.forum_posts.update({
        where: {
            id: req.params.post_id,
        },
        data: {
            flag: 'hidden'
        }
    });
    return res.json({code: 200, msgCode: 'a-f-200'});
});
router.patch("/:post_id", async (req, res) => {
    const userPost = await prisma.forum_posts.findFirst({
        where: {
            id: req.params.post_id,
        }
    });
    if (!userPost) return res.json({code: 404, msgCode: 'a-f-404'});
    if (userPost.user_id !== req.user.id) return res.json({code: 403, msgCode: 'a-f-403'});
    const objKeys: any = Object.keys(req.body);
    if (objKeys.some((r: any) => ['id', 'create_at', 'user_id', 'flag'].includes(r))) return res.json({ code: 400, msgCode: 'a-f-403' });
    req.body.update_at = Date.now();
    await prisma.forum_posts.update({
        where: {
            id: req.params.post_id,
        },
        data: req.body
    });
    return res.json({code: 200, msgCode: 'a-f-200'});
});

router.post("/", async (req, res) => {
    if (!req.body.title || !req.body.content || !req.body?.topics_id?.[0]) return res.json({code: 400, msgCode: 'a-f-400'});
	const post_id = functions.system.createSnowflakeId();
	await prisma.forum_posts.create({
		data: {
			id: post_id,
			title: req.body.title,
			image: req.body.image || undefined,
			content: req.body.content,
			topics_id: req.body.topics_id,
			user_id: req.user.id,
            create_at: Date.now().toString(),
            update_at: Date.now().toString(),
            flag: ''
		},
	});
    return res.json({code: 200, msgCode: 'a-f-200'});
});
export default router;
