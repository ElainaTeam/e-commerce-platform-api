import express from 'express';
import { Config } from './static/config';

const app = express();

app.use('/', require('./express/routers'));


app.listen(`${Config.server.port}` || `${process.env.PORT}`, () => {
    console.log(`[SYSTEM] System started at port ${Config.server.port || process.env.PORT}`)
})