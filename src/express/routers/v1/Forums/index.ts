import prisma from "@/utils/databases/prisma";
import functions from "@/utils/functions";
import express from "express";
const router = express.Router();
import Post from "./post";
router.use("/post", Post);

export default router;