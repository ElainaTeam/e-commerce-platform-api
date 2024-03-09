import express from 'express'
const router = express.Router()
import prisma from '../../../../utils/databases/prisma'

router.get("/@me", (req, res) => {
    return res.json({
        code: 200,
        msgCode: 'a-u-200',
        user: req.user
    })
})

router.get('/:id', async(req,res) => {
    const user = await prisma.users?.findFirst({
        where: {
            id: req.params.id
        },
    })
    if(!user) return res.status(404).json({
        code: 404,
        msgCode: 'a-u-404'
    });
    return res.json({
        code: 200,
        msg: 'a-u-200',
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            create_at: user.created_at
        }
    })
})

export default router