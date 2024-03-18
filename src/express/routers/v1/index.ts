import express, { Router } from "express";
import Users from "./Users";
import Shops from "./Shops";
import Products from "./Products";
import Chats from "./Chats";
import Admin from "./Admin";
import Payment from "./Payment";
import Homepage from "./Homepage";
import Oauth2 from "./Oauth2";
import Auth from "./Auth/index";
import Forums from "./Forums/index";
import functions from "../../../utils/functions/index";

const router = express.Router();

//Router Use Handle
router.get("/", async (req, res) => {
	return res.status(200).json({ code: 200, state: "🟢 Online" });
});
router.use("/Users", functions.express.auth.ensureAuthenticated, Users);
router.use("/shops", Shops);
router.use("/chats", functions.express.auth.ensureAuthenticated, Chats);
router.use("/products", Products);
router.use("/homepage", Homepage);
router.use("/forums", functions.express.auth.ensureAuthenticated, Forums);
router.use("/admin", functions.express.auth.ensureAuthenticated, functions.express.auth.ensureUserIsGlobalAdministrator, Admin);
router.use("/payment", functions.express.auth.ensureAuthenticated, Payment);
router.use("/oauth2", functions.express.auth.ensureAuthenticated, Oauth2);
router.use("/auth", Auth);

export default router;
