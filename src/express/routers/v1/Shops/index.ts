import prisma from '../../../../utils/databases/prisma';
import functions from '../../../../utils/functions/index'

import express from 'express'
const router = express.Router()
// router.get('/:shop_id/products/full', functions.express.auth.ensureAuthenticated, functions.express.auth.ensureUserIsShopModerator, async (req, res) => {
//     const products : any = await prisma.products.findMany({
//         where: {
//             shop_id: req.params.shop_id
//         }
//     });
//     return res.json({
//         code: 200,
//         msgCode: 'a-s-200',
//         products
//     });
// });
router.put('/:shop_id/products', async (req, res) => {

})
router.get('/:shop_id/products', async (req, res) => {
    const products : any = await prisma.products.findMany({
        select: {
            id: true,
            shop_id: true,
            name: true,
            price: true,
            create_at: true,
            flags: true,
            icon_name: true,
            banner_name: true,
            images: true,
            short_description: true,
            long_description: true
        },
        where: {
            shop_id: req.params.shop_id
        }
    });
    return res.json({
        code: 200,
        msgCode: 'a-s-200',
        products
    });
})
// router.get('/:shop_id/full', functions.express.auth.ensureAuthenticated, functions.express.auth.ensureUserIsShopModerator, async (req, res) => {
//     const shop : any = await prisma.shops.findFirst({
//         where: {
//             id: req.params.shop_id
//         }
//     });
//     return res.json({
//         code: 200,
//         msgCode: 'a-s-200',
//         shop
//     });
// });
router.get('/:shop_id', async (req, res) => {
    const shop : any = await prisma.shops.findFirst({
        where: {
            id: req.params.shop_id
        }
    });
    if (!shop) return res.json({ code: 404, msgCode: 'a-s-404' });
    return res.json({
        code: 200,
        msgCode: 'a-s-200',
        shop: {
            id: shop.id,
            username: shop.username,
            name: shop.name,
            icon_name: shop.icon_name,
            banner_name: shop.banner_name,
            long_description: shop.long_description,
            short_description: shop.short_description
        }
    });
});
router.patch('/:shop_id', functions.express.auth.ensureAuthenticated, functions.express.auth.ensureUserIsShopOwner, async (req, res) => {
    const objKeys: any = Object.keys(req.body);
    if (objKeys.some((r: any) => ['id', 'create_at', 'create_by'].includes(r))) return res.json({ code: 400, msgCode: 'a-s-403' });
    if (objKeys.includes('permission')) {
        if (req.body.permission.state == 'passOwner') {

        } else {
            if (!['admin', 'mod'].includes(req.body.permission.scope)) return res.json({ code: 400, msgCode: 'a-s-400' });
            switch (req.body.permission.state) {
                case 'add':
                    await prisma.shop_permissions.create({
                        data: {
                            id: functions.system.createSnowflakeId(),
                            user_id: req.body.permission.user_id,
                            shop_id: req.params.shop_id,
                            flags: `["${req.body.permission.scope}"]`
                        }
                    });
                    return res.json({code: 200, msgCode: 200});
                    break;
                case 'revoke':
                    await prisma.shop_permissions.delete({
                        where: {
                            user_id: req.body.permission.user_id,
                            shop_id: req.params.shop_id
                        }
                    });
                    return res.json({code: 200, msgCode: 200});
                    break;
                case 'change':
                    await prisma.shop_permissions.update({
                        where: {
                            user_id: req.body.permission.user_id,
                            shop_id: req.params.shop_id
                        },
                        data: {
                            flags: `["${req.body.permission.scope}"]`
                        }
                    });
                    return res.json({code: 200, msgCode: 200});
                    break;
            }
        }
    } else {
        await prisma.shops.update({
            where: {
                id: req.params.shop_id
            },
            data: req.body
        });
        return res.json({code: 200, msgCode: 200});
    }
})

router.put('/', functions.express.auth.ensureAuthenticated, async (req, res) => {
    if (!req.body.username) return res.json({ code: 400, msgCode: 'a-s-400', target: 'username' });
    if (!req.body.name) return res.json({ code: 400, msgCode: 'a-s-400', target: 'name' });
    const findShopByUsername = await prisma.shops.findFirst({
        where: {
            username: req.body.username
        }
    });
    if (findShopByUsername) return res.json({ code: 400, msgCode: 'a-s-400', target: 'username' });
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
    return res.json({ code: 200, msgCode: 'a-s-200', shop_id });
})

export default router