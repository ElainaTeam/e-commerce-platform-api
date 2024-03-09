import prisma from '../../../utils/databases/prisma'
export = {
    // This stuff will ensure that logged in to a valid credential
    ensureAuthenticated: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 401, msgCode: 'a-401'});
        return next(req);
    },
    ensureUserIsGlobalAdministrator: async function(req: any, res: any, next: any) {
        if (!req.user || !req.user.flags.includes('admin')) return res.json({code: 403, msgCode: 'a-403'});
        return next(req);
    },
    ensureUserIsGlobalModerator: async function(req: any, res: any, next: any) {
        if (!req.user || (!req.user.flags.includes('mod') && !req.user.flags.includes('admin'))) return res.json({code: 403, msgCode: 'a-403'});
        return next(req);
    },
    ensureUserIsShopOwner: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const findShop : any = await prisma.shops.findFirst({
            where: {
                id: req.params.shop_id
            }
        });
        if (!findShop) return res.json({code: 404, msgCode: 'a-s-404'});
        const userShopPermit : any = await prisma.shop_permissions.findFirst({
            where: {
                user_id: req.user.id,
                shop_id: req.params.shop_id
            }
        });
		const flags = JSON.parse("[" + userShopPermit?.flags.replace('[', '').replace(']', '').replaceAll(`'`, `"`).replaceAll('`', `"`) + "]");
        if (!req.user.flags.includes('admin') && !flags.includes('owner')) return res.json({code: 403, msgCode: 'a-403'});
        return next(req);
    },
    ensureUserIsShopAdministrator: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const findShop : any = await prisma.shops.findFirst({
            where: {
                id: req.params.shop_id
            }
        });
        if (!findShop) return res.json({code: 404, msgCode: 'a-s-404'});
        const userShopPermit : any = await prisma.shop_permissions.findFirst({
            where: {
                user_id: req.user.id,
                shop_id: req.params.shop_id
            }
        });
		const flags = JSON.parse("[" + userShopPermit?.flags.replace('[', '').replace(']', '').replaceAll(`'`, `"`).replaceAll('`', `"`) + "]");
        if (!req.user.flags.includes('admin') && !flags.includes('owner') && !flags.includes('admin')) return res.json({code: 403, msgCode: 'a-403'});
        return next(req);
    },
    ensureUserIsShopModerator: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const findShop : any = await prisma.shops.findFirst({
            where: {
                id: req.params.shop_id
            }
        });
        if (!findShop) return res.json({code: 404, msgCode: 'a-s-404'});
        const userShopPermit : any = await prisma.shop_permissions.findFirst({
            where: {
                user_id: req.user.id,
                shop_id: req.params.shop_id
            }
        });
		const flags = JSON.parse("[" + userShopPermit?.flags.replace('[', '').replace(']', '').replaceAll(`'`, `"`).replaceAll('`', `"`) + "]");
        if (!req.user.flags.includes('admin') && !flags.includes('owner') && !flags.includes('admin') && !flags.includes('mod')) return res.json({code: 403, msgCode: 'a-403'});
        return next(req);
    },
    forwardAuthenticated: async function() {
        
    },
}