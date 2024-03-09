import prisma from '../../../../utils/databases/prisma';
import express from 'express'
const router = express.Router()

router.put('/', async (req, res) => {
    if (!req.body.name) return res.json({code: 400, msgCode: 'a-s-400', target: 'name'});
    prisma
})

export default router