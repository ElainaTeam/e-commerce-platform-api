import prisma from '../../../utils/databases/prisma'
export = {
    // This stuff will ensure that logged in to a valid credential
    ensureAuthenticated: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 401, msgCode: 'a-401'});
        return next();
    },
    ensureUserIsGlobalModerator: async function(req: any, res: any, next: any) {
        if (!req.user || (!req.user.flags.includes('mod') && !req.user.flags.includes('admin'))) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    ensureUserIsGlobalAdministrator: async function(req: any, res: any, next: any) {
        if (!req.user || !req.user.flags.includes('admin')) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    ensureUserIsShopOwner: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const userShopPermit = await prisma.shop_permissions.findFirst({
            where: {
                user_id: req.user.id,
                shop_id: req.params.shop_id
            }
        });
		const flags = JSON.parse("[" + userShopPermit?.flags.replace('[', '').replace(']', '') + "]");
        if (!req.user.includes('admin') && !flags.includes('owner')) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    ensureUserIsShopAdministrator: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const userShopPermit = await prisma.shop_permissions.findFirst({
            where: {
                user_id: req.user.id,
                shop_id: req.params.shop_id
            }
        });
		const flags = JSON.parse("[" + userShopPermit?.flags.replace('[', '').replace(']', '') + "]");
        if (!req.user.includes('admin') && !flags.includes('admin')) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    ensureUserIsShopModerator: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const userShopPermit = await prisma.shop_permissions.findFirst({
            where: {
                user_id: req.user.id,
                shop_id: req.params.shop_id
            }
        });
		const flags = JSON.parse("[" + userShopPermit?.flags.replace('[', '').replace(']', '') + "]");
        if (!req.user.includes('admin') && !flags.includes('mod')) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    forwardAuthenticated: async function() {
        
    },
}