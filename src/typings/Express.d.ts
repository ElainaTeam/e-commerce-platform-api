import { SafeUser } from "./UserData";

declare global {
	namespace Express {
		interface Request {
			user: UserTyping | null;
			id: UserTyping | null;
		}
	}
}
