
export = {
    // This stuff will ensure that logged in to a valid credential
    ensureAuthenticated: async function(req: any, res: any, next: any) {
        const token = 
            req.headers['Authorization']?.replace('Bearer ', '') ||
            req.headers['Auth']?.replace('Bearer ', '') ||
            req.body.token ||
            req.body.auth ||
            req.query.token ||
            req.query.auth;
        if (!token) return res.json({code: 403, msgCode: `a403`});

    }, 
    forwardAuthenticated: async function() {
        
    }
}