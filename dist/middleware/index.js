"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_compose_1 = __importDefault(require("koa-compose"));
const cors_1 = __importDefault(require("./cors"));
const logger_1 = __importDefault(require("./logger"));
const parser_1 = __importDefault(require("./parser"));
const router_1 = __importDefault(require("./router"));
const static_1 = __importDefault(require("./static"));
exports.default = (0, koa_compose_1.default)([
    (0, cors_1.default)(),
    (0, logger_1.default)(),
    (0, parser_1.default)(),
    (0, static_1.default)(),
    // jwtMiddleware,
    router_1.default.routes(),
    router_1.default.allowedMethods()
]);
