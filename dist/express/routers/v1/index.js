"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = exports.Oauth2 = exports.Payment = exports.Admin = exports.NewsFeed = exports.Product = exports.User = void 0;
const User_1 = __importDefault(require("./ecommerce/User"));
exports.User = User_1.default;
const Product_1 = __importDefault(require("./ecommerce/Product"));
exports.Product = Product_1.default;
const NewsFeed_1 = __importDefault(require("./ecommerce/NewsFeed"));
exports.NewsFeed = NewsFeed_1.default;
const Payment_1 = __importDefault(require("./ecommerce/Payment"));
exports.Payment = Payment_1.default;
const Admin_1 = __importDefault(require("./ecommerce/Admin"));
exports.Admin = Admin_1.default;
const Oauth2_1 = __importDefault(require("./ecommerce/Oauth2"));
exports.Oauth2 = Oauth2_1.default;
const Auth_1 = __importDefault(require("./ecommerce/Auth"));
exports.Auth = Auth_1.default;
//# sourceMappingURL=index.js.map