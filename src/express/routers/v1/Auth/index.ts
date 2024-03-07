import express from 'express'
import bcrypt from 'bcrypt'
import prisma from '../../../../utils/databases/prisma'
import jwt from 'jsonwebtoken'

const router = express.Router();
router.get('/state', async (req,res) => {
    
});
/**
 *  payload JWT TEST {
    "username": "Peter Tuan Anh",
    "email": "petertuananh@hotmail.com",
    "iat": 1516239022
    }
 */
router.post('/callback', async (req ,res) => {
    if (!req.body.state) return res.json({code: 400, msgCode: 'a-u-100'}); // this means no state was provided
    const findLoginState: any = await prisma.login_states?.findMany({
        where: {
            state: req.body.state
        }
    });
    if (!findLoginState) return res.json({code: 400, msgCode: 'a-u-101'}); // this means provided state is not valid
    const findUserByState : any = await prisma.users?.findMany({
        where: {
            id: findLoginState.user_id
        }
    });
    if (!findUserByState) return res.json({code: 400, msgCode: 'a-u-102'}); // wait what, who are you? 
    // actually, this is the third time I tried to use TS, so i have no solution for this
    //I'll push some may call important code cus this is too chaos
    //I'm talking abt restarting server, the code is fine
    // okay
    // Restart your PC || PETER || 
    //wait for me push some code first cuh || agree
    // should I commit it? YES!!!
    
    //nvm no permission, huh
    //
    switch (findLoginState.platform) {
        case 'form':
            if (!req.body.username || !req.body.password) {
                return res.json({code: 400, msgCode: 'a-u-100'}); // this means no login info was provided
            } else if (req.body.username || req.body.password) {
                bcrypt.compare(req.body.password, findUserByState.hashed_password, function(err, isTrue) {
                    if (isTrue) {
                        return next({state: findLoginState.state, user_id: findUserByState.user_id});
                    } else {
                        return res.json({code: 400, msgCode: 'a-u-103'}); // invalid login info
                    }
                });
            } else if (req.body.code) {

            }
            break;
        default:
            return res.json({code: 400, msgCode: 'a-u-104'}); // method not allowed
    }
    async function next() {

    }
});
router.post('/register', async (req ,res) => {
    if (!req.body.username || !req.body.password) return res.json({code: 400, msgCode: 'a-u-400'});
    const findUserByUsername = await prisma.users?.findMany({
        where: {
            username: req.body.username
        }
    });
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        console.log(hash)
    });
});
export default router