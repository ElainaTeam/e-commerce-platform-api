import express from 'express';
import { Config } from './static/config';
import v1 from './express/routers/index'

const app = express();

app.use('/', v1);


app.listen(`${Config.server.port}` || `${process.env.PORT}`, () => {
    console.log(`[SYSTEM] System started at port ${Config.server.port || process.env.PORT}`)
})