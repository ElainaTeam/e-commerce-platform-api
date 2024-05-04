import express from "express";
import useragent from "express-useragent";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthMiddleware from "./middleware/Auth";
import { Config } from "./static/config";
import routers from "./express/routers/index";
import prisma from "./utils/databases/prisma";
import functions from "./utils/functions";
import { config } from 'dotenv'
// import swagger from 'swagger-node-express'
const app = express();
import {swaggerDocument} from './static/swagger';
// var options = {
// 	explorer: true
// };
// swagger.setAppHandler(app);
export default class App {
	Express = app;
	Config = Config;
	Prisma = prisma;
	Functions = functions;
	constructor() {
		config()
	}
	execute() {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use(express.raw());
		app.use(useragent.express());
		app.use(cookieParser());
		// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
		// app.get('/api-docs', swaggerUi.setup(swaggerDocument));
		// app.use(async function (req: any, res, next) {
		// 	res.header("Access-Control-Allow-Origin", "*");
        // 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		// 	return next()
		// })
		
		app.use(cors({
			methods: 'GET, POST, PUT, PATCH, DELETE, OPTION',
			allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
			origin: ['http://localhost:3000/'],
			credentials: true,
			preflightContinue: true
		}))
		app.use("/*", AuthMiddleware.getUser);
		app.use("/", routers);
		app.use(function (err : any, req : any, res : any, next : any) {
			if (err) {
				res.status(err.status || 500).json({ code: 500, msg: err.msg })
			}
		});
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
process.on('unhandledRejection', err => {
	return console.log(err);
});
process.on('warning', (warning) => {
	return console.log(warning.stack);
});