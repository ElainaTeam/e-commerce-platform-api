import prisma from "@/utils/databases/prisma";
import functions from "@/utils/functions";
import express from "express";
const router = express.Router();
import Post from "./post";
import Topics from "./topic";

router.use("/post", Post);
router.use("/topics", Topics);

export default router;