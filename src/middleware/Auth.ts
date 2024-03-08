import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default class Auth {
	public static getUser(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!authHeader || !token) return next();

		jwt.verify(token, String(process.env.JWT_SECRET), (err: any, user: any) => {
			if (err) return next(err);

			req.user = user;
			next();
		});
	}
}
