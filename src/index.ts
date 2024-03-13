import express from "express";
import useragent from "express-useragent";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthMiddleware from "./middleware/Auth";
import { Config } from "./static/config";
import routers from "./express/routers/index";
import prisma from "./utils/databases/prisma";
import functions from "./utils/functions";
const app = express();

export default class App {
	Express = app;
	Config = Config;
	Prisma = prisma;
	Functions = functions;
	constructor() {}
	execute() {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use(express.raw());
		app.use(useragent.express());
		app.use(cookieParser());
		app.use(async function (req: any, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
        	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
			return next()
		})
		app.use("/*", AuthMiddleware.getUser);
		app.use("/", routers);
        app.use(async function (req, res, next) {
            return res.json({code: 404, msgCode: 'a-404'});
        })
		app.listen(`${Config.server.port}` || `${process.env.PORT}`, () => {
			console.log(`[SYSTEM] System started at port ${Config.server.port || process.env.PORT}`);
		});
	}
}
const app2 = new App();
app2.execute();
