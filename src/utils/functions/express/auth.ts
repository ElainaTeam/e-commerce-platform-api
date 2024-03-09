
export = {
    // This stuff will ensure that logged in to a valid credential
    ensureAuthenticated: async function(req: any, res: any, next: any) {
        if (!req.user) return res.json({code: 401, msgCode: 'a-401'})
        return next();
    }, 
    forwardAuthenticated: async function() {
        
    },
}