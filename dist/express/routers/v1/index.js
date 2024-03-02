"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./User"));
const Product_1 = __importDefault(require("./Product"));
const NewsFeed_1 = __importDefault(require("./NewsFeed"));
const Admin_1 = __importDefault(require("./Admin"));
const Payment_1 = __importDefault(require("./Payment"));
const Oauth2_1 = __importDefault(require("./Oauth2"));
const Auth_1 = __importDefault(require("./Auth"));
const router = express_1.default.Router();
//Router Use Handle
router.get('/', async (req, res) => {
    return res.status(200).json({ code: 200, state: '🟢 Online' });
});
router.use('/user', User_1.default);
router.use('/product', Product_1.default);
router.use('/newsfeed', NewsFeed_1.default);
router.use('/admin', Admin_1.default);
router.use('/payment', Payment_1.default);
router.use('/oauth2', Oauth2_1.default);
router.use('/auth', Auth_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map