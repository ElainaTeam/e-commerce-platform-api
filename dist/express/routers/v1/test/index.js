"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.router = express_1.default.Router();
app.get('/', (req, res) => {
    res.send("Ok");
});
//# sourceMappingURL=index.js.map