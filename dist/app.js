"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const middleware_1 = __importDefault(require("./middleware"));
const app = new koa_1.default();
app.use(middleware_1.default);
exports.default = app;
