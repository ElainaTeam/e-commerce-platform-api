"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./static/config");
const index_1 = __importDefault(require("./express/routers/index"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use('/', index_1.default);
app.listen(`${config_1.Config.server.port}` || `${process.env.PORT}`, () => {
    console.log(`[SYSTEM] System started at port ${config_1.Config.server.port || process.env.PORT}`);
});
// async function main() {
//     const users = await prisma.user.findMany();
//     console.log(users);
// }
// main()
//     .catch(e => {
//         throw e;
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });
//# sourceMappingURL=index.js.map