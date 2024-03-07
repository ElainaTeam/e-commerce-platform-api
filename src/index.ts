import express from 'express';
import useragent from 'express-useragent'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { Config } from './static/config';
import routers from './express/routers/index'
import prisma from './utils/databases/prisma'
const app = express();


export default class App {
    Express = app;
    Config = Config;
    Prisma = prisma;
    constructor() {

    }
    execute() {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(express.raw());
        app.use(useragent.express());
        app.use(cookieParser());
        app.use(async function (req, res, next) {
            req.app = app;
            app.use(cors({ origin: '*' }));
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            // @ts-ignore
            req.realIp = req.headers?.['cf-connecting-ip'];
            const token =
                req.headers['Authorization']?.replace('Bearer ', '') ||
                req.headers['Auth']?.replace('Bearer ', '') ||
                req.body.token ||
                req.body.auth ||
                req.query.token ||
                req.query.auth;
            const findToken = prisma.user_sessions.findFirst({
                where: {
                    access_token: token
                }
            })
            const findUser = prisma.users.findFirst({
                where: {
                    access_token: token
                }
            })
            if (findUser) {
                req.user = findToken
                return next()
            } else {
                req.user = null
                return next()
            }
            
        })
        app.use('/', routers);
        app.listen(`${Config.server.port}` || `${process.env.PORT}`, () => {
            console.log(`[SYSTEM] System started at port ${Config.server.port || process.env.PORT}`)
        });
    }
}
const app2 = new App();
app2.execute();