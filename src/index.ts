import express from 'express';
import { Config } from './static/config';
import v1 from './express/routers/index'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const app = express();

app.use('/', v1);


app.listen(`${Config.server.port}` || `${process.env.PORT}`, () => {
    console.log(`[SYSTEM] System started at port ${Config.server.port || process.env.PORT}`)
});





// async function main() {
//     const users = await prisma.user.findMany();
//     console.log(users);
// }

// main()
//     .catch(e => {
//         throw e;
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });
