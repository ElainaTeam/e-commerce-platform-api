"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1_1 = require("./v1");
const router = express_1.default.Router();
//Router Use Handle
router.get('/', async (req, res) => {
    return res.status(200).json({ code: 200, state: '🟢 Online' });
});
router.use('/user', v1_1.User);
router.use('/product', v1_1.Product);
router.use('/newsfeed', v1_1.NewsFeed);
router.use('/admin', v1_1.Admin);
router.use('/payment', v1_1.Payment);
router.use('/oauth2', v1_1.Oauth2);
router.use('/auth', v1_1.Auth);
exports.default = router;
//# sourceMappingURL=index.js.map