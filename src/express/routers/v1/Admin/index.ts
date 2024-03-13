import express from 'express'
const router = express.Router()
import Users from "./users";



router.use("/Users", Users);

export default router