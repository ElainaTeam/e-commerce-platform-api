import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default class Auth {
	public static getUser(req: Request, res: Response, next: NextFunction) {
		req.user = null;
		const authHeader : any = req.headers["authorization"] || req.headers["Authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!authHeader || !token) return next();

		jwt.verify(token, String(process.env.JWT_SECRET), (err: any, user: any) => {
			if (err) return next(err);
			req.user = user;
			next();
		});
	}
}
