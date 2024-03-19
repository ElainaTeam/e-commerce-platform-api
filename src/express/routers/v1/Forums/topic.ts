import express from "express";
import prisma from "../../../../utils/databases/prisma";
import functions from "./../../../../utils/functions";

const router = express.Router();

router.get("/", async (req, res) => {
	let perPage = Number(req.query.limit);
	let currentPage = (Number(req.query.page) - 1) * perPage;

	const topics = await prisma.forum_topic.findMany({
		take: perPage ||  5,
		skip: currentPage || 0,
	});

	return res.json({ code: 200, msgCode: "a-a-u-200", topics });
});

router.post("/", functions.express.auth.ensureUserIsGlobalAdministrator, async (req, res) => {
	if (!req.body.title) return res.json({ code: 400, msgCode: "a-t-400" });
	if (!req.body.icon) return res.json({ code: 400, msgCode: "a-t-400" });
	const topic_id = functions.system.createSnowflakeId();
	const topic = await prisma.forum_topic.create({
		data: {
			id: topic_id,
			title: req.body.title,
			description: req.body.description,
			created_at: Date.now().toString(),
			icon: req.body.icon,
			updated_at: ""
		},
	});

	return res.json({ code: 200, msgCode: "a-t-200", topic });
});

router.patch("/:topic_id", functions.express.auth.ensureUserIsGlobalAdministrator, async (req, res) => {
	const topic = await prisma.forum_topic.findFirst({
		where: {
			id: req.params.topic_id,
		},
	});

	if (!topic) return res.json({ code: 404, msgCode: "a-t-404" });
	await prisma.forum_topic.update({
		where: {
			id: req.params.topic_id
		},
		data: {
			updated_at: Date.now().toString(),
			...req.body
		}
	});

	return res.json({ code: 200, msgCode: "a-t-200", topic });
});

router.delete("/:topic_id", functions.express.auth.ensureUserIsGlobalAdministrator, async (req, res) => {
	const topic = await prisma.forum_topic.findFirst({
		where: {
			id: req.params.topic_id,
		},
	});

	if (!topic) return res.json({ code: 404, msgCode: "a-t-404" });
	await prisma.forum_topic.delete({
		where: {
			id: req.params.topic_id,
		},
	});
	return res.json({ code: 200, msgCode: "a-t-200" });
})

export default router;
