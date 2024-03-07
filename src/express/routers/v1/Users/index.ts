import express from 'express'
const router = express.Router()
import prisma from '../../../../utils/databases/prisma'

router.get("/", (req, res) => {
    return res.json({ status: "Success" })
})

router.get('/:id', async(req,res) => {
    const user = await prisma.users?.findFirst({
        where: {
            id: req.params.id
        },
    })

    if(!user) return res.status(404).json({ error: "User not found" })
    return res.json(user)
})

export default router