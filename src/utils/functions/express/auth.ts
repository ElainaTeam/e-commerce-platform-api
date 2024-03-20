import prisma from '../../../utils/databases/prisma'
import functions from '..';
export = {
    // This stuff will ensure that logged in to a valid credential
    checkUserPermitOnGlobal: async function (data: any) {
        const user : any = await prisma.users.findFirst({
            where: {
                id: data.user_id,
            }
        });
        if (user.flags.includes(data.scope)) return {result: true};
        return {result: false};
    },
    checkUserPermitOnShop: async function (data: any) {
        const findShop : any = await prisma.shops.findFirst({
            where: {
                id: data.shop_id
            }
        });
        if (!findShop) return {result: false};
        const userShopPermit : any = await prisma.shop_permissions.findFirst({
            where: {
                user_id: data.user_id,
                shop_id: data.shop_id
            }
        });
		const flags = JSON.parse("[" + userShopPermit?.flags.replace('[', '').replace(']', '').replaceAll(`'`, `"`).replaceAll('`', `"`) + "]");
        if (flags.includes(data.scope)) return {result: true};
        return {result: false};
    },
    ensureAuthenticated: async function (req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 401, msgCode: 'a-401'});
        return next();
    },
    ensureUserIsGlobalAdministrator: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const checkIfUserHaveGlobalAdmin = await functions.express.auth.checkUserPermitOnGlobal({user_id: req.user.id, scope: 'admin'});
        if (!checkIfUserHaveGlobalAdmin.result) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    ensureUserIsGlobalModerator: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const checkIfUserHaveGlobalAdmin = await functions.express.auth.checkUserPermitOnGlobal({user_id: req.user.id, scope: 'admin'});
        const checkIfUserHaveGlobalMod = await functions.express.auth.checkUserPermitOnGlobal({user_id: req.user.id, scope: 'mod'});
        if (!checkIfUserHaveGlobalAdmin.result && !checkIfUserHaveGlobalMod.result) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    ensureUserIsShopOwner: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const checkIfUserHaveGlobalAdmin = await functions.express.auth.checkUserPermitOnGlobal({user_id: req.user.id, scope: 'admin'});
        const checkIfUserHaveShopOwner = await functions.express.auth.checkUserPermitOnShop({user_id: req.user.id, shop_id: req.params.shop_id, scope: 'owner'});
        if (!checkIfUserHaveGlobalAdmin.result && !checkIfUserHaveShopOwner.result) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    ensureUserIsShopAdministrator: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const checkIfUserHaveGlobalAdmin = await functions.express.auth.checkUserPermitOnGlobal({user_id: req.user.id, scope: 'admin'});
        const checkIfUserHaveShopOwner = await functions.express.auth.checkUserPermitOnShop({user_id: req.user.id, shop_id: req.params.shop_id, scope: 'owner'});
        const checkIfUserHaveShopAdmin = await functions.express.auth.checkUserPermitOnShop({user_id: req.user.id, shop_id: req.params.shop_id, scope: 'admin'});
        if (!checkIfUserHaveGlobalAdmin.result && !checkIfUserHaveShopOwner.result && !checkIfUserHaveShopAdmin.result) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    ensureUserIsShopModerator: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 403, msgCode: 'a-403'});
        const checkIfUserHaveGlobalAdmin = await functions.express.auth.checkUserPermitOnGlobal({user_id: req.user.id, scope: 'admin'});
        const checkIfUserHaveShopOwner = await functions.express.auth.checkUserPermitOnShop({user_id: req.user.id, shop_id: req.params.shop_id, scope: 'owner'});
        const checkIfUserHaveShopAdmin = await functions.express.auth.checkUserPermitOnShop({user_id: req.user.id, shop_id: req.params.shop_id, scope: 'admin'});
        const checkIfUserHaveShopMod = await functions.express.auth.checkUserPermitOnShop({user_id: req.user.id, shop_id: req.params.shop_id, scope: 'mod'});
        if (!checkIfUserHaveGlobalAdmin.result && !checkIfUserHaveShopOwner.result && !checkIfUserHaveShopAdmin.result && !checkIfUserHaveShopMod.result) return res.json({code: 403, msgCode: 'a-403'});
        return next();
    },
    forwardAuthenticated: async function() {
        
    },
}