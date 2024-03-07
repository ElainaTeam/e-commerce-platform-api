"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./static/config");
const index_1 = __importDefault(require("./express/routers/index"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
class App {
    Express = app;
    Config = config_1.Config;
    Prisma = prisma;
    constructor() {
    }
    execute() {
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json());
        app.use(express_1.default.raw());
        app.use(express_useragent_1.default.express());
        app.use((0, cookie_parser_1.default)());
        app.use('/', index_1.default);
        app.listen(`${config_1.Config.server.port}` || `${process.env.PORT}`, () => {
            console.log(`[SYSTEM] System started at port ${config_1.Config.server.port || process.env.PORT}`);
        });
    }
}
exports.default = App;
const app2 = new App();
app2.execute();
//# sourceMappingURL=index.js.map