import express from "express";
import prisma from "../../../../utils/databases/prisma";
const router = express.Router();

router.get("/", async (req, res) => {
	let perPage = req.query.limit;
	let currentPage = req.query.page;

	const topics = await prisma.forums_topics.findMany({
		take: perPage ? Number(perPage) : 5,
		skip: currentPage ? (Number(currentPage) - 1) * Number(perPage) : 1,
	});

	return res.json({ code: 200, msgCode: "a-a-u-200", topics });
});

export default router;
