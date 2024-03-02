import express from 'express';
import { Config } from './static/config';
import routers from './express/routers/index'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const app = express();




export default class App {
    Express = app;
    Config = Config;
    Prisma = prisma;
    constructor() {
        
    }
    execute() {
        app.use('/', routers);


        app.listen(`${Config.server.port}` || `${process.env.PORT}`, () => {
            console.log(`[SYSTEM] System started at port ${Config.server.port || process.env.PORT}`)
        });
    }
}
const app2 = new App();
app2.execute();