import express from 'express'
import prisma from '../../../../utils/databases/prisma'
const router = express.Router()


router.get('/', async (req, res) => {
    const users = await prisma.users.findMany();
    return res.json({code: 200, msgCode: 'a-a-u-200', users});
});
router.get('/:user_id', async (req, res) => {
    const user = await prisma.users.findMany({
        where: {
            id: req.params.user_id
        }
    });
    if (!user) return res.json({code: 404, msgCode: 'a-a-u-404'});
    return res.json({code: 200, msgCode: 'a-a-u-200', user});
});

router.patch('/:user_id', async (req, res) => {
    const user = await prisma.users.findMany({
        where: {
            id: req.params.user_id
        }
    });
    if (!user) return res.json({code: 404, msgCode: 'a-a-u-404'});
    const objKeys: any = Object.keys(req.body);
    if (objKeys.some((r: any) => ['id', 'create_at'].includes(r))) return res.json({ code: 400, msgCode: 'a-a-u-403' });
    await prisma.users.update({
        where: {
            id: req.params.user_id
        },
        data: req.body
    });
    return res.json({code: 200, msgCode: 'a-a-u-200'});
});

export default router