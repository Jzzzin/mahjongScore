"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./database/helper");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
async function exec() {
    await (0, helper_1.connectionTest)();
    app_1.default.listen(config_1.SERVER.PORT);
}
exec().then(() => console.log('SERVER running at', config_1.SERVER.PORT), (e) => console.error(e));
