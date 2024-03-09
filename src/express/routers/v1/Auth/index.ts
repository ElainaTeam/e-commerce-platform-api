import express from 'express'
import bcrypt from 'bcrypt'
import prisma from '../../../../utils/databases/prisma'
import jwt from 'jsonwebtoken'
import { Config } from '../../../../static/config'
import functions from '../../../../utils/functions/index'
const router = express.Router();
router.get('/state', async (req, res) => {

});
/**
 *  payload JWT TEST {
    "username": "Peter Tuan Anh",
    "email": "petertuananh@hotmail.com",
    "iat": 1516239022
    }
 */
router.get('/callback', async (req, res) => {
    // oauth2 login
});
router.post('/revoke', async (req, res) => {
})
router.post('/callback', async (req, res) => {
    if (!req.body.state) return res.json({ code: 400, msgCode: 'a-u-100' });
    const findLoginState: any = await prisma.login_states?.findMany({
        where: {
            state: req.body.state
        }
    });
    if (!findLoginState) return res.json({ code: 400, msgCode: 'a-u-101' });
    switch (findLoginState.next_step) {
        case 'auth':
            if (!req.body.identify || !req.body.password) return res.json({ code: 400, msgCode: 'a-u-100' }); // this means no login info was provided
            const findUserByEmail: any = await prisma.users?.findMany({
                where: {
                    email: req.body.identify
                }
            });
            bcrypt.compare(req.body.password, findUserByEmail.hashed_password, async function (err, isTrue) {
                if (isTrue) {
                    await prisma.login_states?.update({
                        where: {
                            state: req.body.state
                        },
                        data: {
                            user_id: findUserByEmail.id
                        }
                    });
                    if (findUserByEmail.flags.includes('2fa')) {
                        await prisma.login_states?.update({
                            where: {
                                state: req.body.state
                            },
                            data: {
                                next_step: '2fa'
                            }
                        });
                        return res.json({ code: 201, msgCode: 'a-u-105' }); // need an additional step
                    } else {
                        return createLoginSession({ state: findLoginState.state, user: findUserByEmail });
                    }
                } else {
                    return res.json({ code: 400, msgCode: 'a-u-103' }); // invalid login info
                }
            })


            break;
        case '2fa':
            break;
        default:
            break;
    }
    async function createLoginSession(data: any) {
        await prisma.login_states?.update({
            where: {
                state: req.body.state
            },
            data: {
                status: 'finished',
                next_step: ''
            }
        });
        const token = jwt.sign(data.user.id, `${process.env.JWT_SECRET}` ,{ expiresIn: process.env.JWT_TIME_LIVE})
        return res.json({ code: 200, msgCode: 'a-u-200', token });
    }
});
router.post('/register', async (req, res) => {
    if (!req.body.username || !req.body.password) return res.json({ code: 400, msgCode: 'a-u-400' });
    const findUserByUsername = await prisma.users?.findMany({
        where: {
            username: req.body.username
        }
    });
    if (findUserByUsername) return res.json({ code: 400, msgCode: 'a-u-410' }); //username esixt
    
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
        await prisma.users.update({
            where: {
                id: functions.system.createSnowflakeId().toString()
            },
            data: {
                username: req.body.username,
                hashed_password: hash,
                created_at: Date.now().toString()
            }
        });
        return res.json({
            code: 200,
            msgCode: 'a-u-200'
        })
    });
});
export default router