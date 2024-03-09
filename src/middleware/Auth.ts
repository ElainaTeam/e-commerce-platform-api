import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/databases/prisma";
export default class Auth {
	public static getUser(req: Request, res: Response, next: NextFunction) {
		req.user = null;
		const authHeader : any = req.headers["authorization"] || req.headers["Authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!authHeader || !token) return next();

		jwt.verify(token, String(process.env.JWT_ACCESS_SECRET), async (err: any, userToken: any) => {
			if (err || !userToken) return next(err);
			const user : any = await prisma.users?.findFirst({
				where: {
					id: userToken.id
				}
			});
			req.user = user;
			const flags = JSON.parse("[" + user.flags.replace('[', '').replace(']', '').replaceAll(`'`, `"`).replaceAll('`', `"`) + "]");
			req.user.flags = flags;
			req.user.access_token = token
			next();
		});
	}
}