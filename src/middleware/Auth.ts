import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/databases/prisma";
export default class Auth {
	public static getUser(req: Request, res: Response, next: NextFunction) {
		req.user = null;
		const authHeader : any = req.headers["authorization"] || req.headers["Authorization"] || req.cookies?.jwt || req.cookies?.access_token || req.cookies?.accessToken;
		const token = authHeader && authHeader.split(" ")[1];

		if (!authHeader || !token) return next();

		try {
			jwt.verify(token, String(process.env.JWT_ACCESS_SECRET), async (err: any, userToken: any) => {
				if (err || !userToken) return next(err);
				const user : any = await prisma.users.findFirst({
					where: {
						id: String(userToken.id)
					},
					omit: {
						hashed_password: true,
					}
				});
				if (!user) return next(err);
				const userSession : any = await prisma.user_sessions?.findFirst({
					where: {
						user_id: userToken.id,
						access_token: token
					}
				});
				if (!userSession || (userSession.expire_at < Date.now())) return next(err);
				req.user = user;
				// req.user.access_token = token
				next();
			});
		} catch (error) {
			next(error);
		}
	}
}