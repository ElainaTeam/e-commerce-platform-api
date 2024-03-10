import express, { Router } from "express";
import Users from "./Users";
import Shops from "./Shops";
import Products from "./Products";
import NewsFeed from "./NewsFeed";
import Admin from "./Admin";
import Payment from "./Payment";
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
router.use("/products", Products);
router.use("/newsfeed", NewsFeed);
router.use("/forums", Forums);
router.use("/admin", functions.express.auth.ensureAuthenticated, Admin);
router.use("/payment", functions.express.auth.ensureAuthenticated, Payment);
router.use("/oauth2", functions.express.auth.ensureAuthenticated, Oauth2);
router.use("/auth", Auth);

export default router;
