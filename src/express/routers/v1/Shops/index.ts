import prisma from '../../../../utils/databases/prisma';
import functions from '../../../../utils/functions/index'

import express from 'express'
const router = express.Router()



router.put('/', async (req, res) => {
    if (!req.body.username) return res.json({code: 400, msgCode: 'a-s-400', target: 'username'});
    if (!req.body.name) return res.json({code: 400, msgCode: 'a-s-400', target: 'name'});
    const findShopByUsername = await prisma.shops.findFirst({
        where: {
            username: req.body.username
        }
    });
    if (findShopByUsername) return res.json({code: 400, msgCode: 'a-s-400', target: 'username'});
    const shop_id = functions.system.createSnowflakeId();
    await prisma.shops.create({
        data: {
            id: shop_id,
            username: req.body.username,
            name: req.body.name,
            create_at: String(Date.now()),
            create_by: req.user.id,
            icon_name: '',
            banner_name: '',
            short_description: '',
            long_description: ''
        }
    });
    await prisma.shop_permissions.create({
        data: {
            id: functions.system.createSnowflakeId(),
            user_id: req.user.id,
            shop_id,
            flags: '["owner"]'
        }
    });
    return res.json({code: 200, msgCode: 'a-s-200'});
})

export default router