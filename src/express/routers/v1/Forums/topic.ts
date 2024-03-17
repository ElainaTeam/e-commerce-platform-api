import express from "express";
import prisma from "../../../../utils/databases/prisma";
import functions from "./../../../../utils/functions";

const router = express.Router();

router.get("/", async (req, res) => {
	let perPage = req.query.limit;
	let currentPage = req.query.page;

	const topics = await prisma.forum_topic.findMany({
		take: perPage ? Number(perPage) : 5,
		skip: currentPage ? (Number(currentPage) - 1) * Number(perPage) : 1,
	});

	return res.json({ code: 200, msgCode: "a-a-u-200", topics });
});

// router.post("/", async (req, res) => {
// 	if (!req.body.title) return res.json({ code: 400, msgCode: "a-t-400" });
// 	const topic_id = functions.system.createSnowflakeId();
// 	const topic = await prisma.forum_topic.create({
// 		data: {
// 			id: topic_id,
// 			title: req.body.title,
// 			description: req.body.description,
// 		},
// 	});

// 	return res.json({ code: 200, msgCode: "a-t-200", topic });
// });

export default router;
