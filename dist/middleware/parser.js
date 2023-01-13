"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
function parser() {
    return (0, koa_bodyparser_1.default)({
        enableTypes: ['json']
    });
}
exports.default = parser;
