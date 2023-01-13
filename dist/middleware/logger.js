"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_pino_logger_1 = __importDefault(require("koa-pino-logger"));
function logger() {
    return (0, koa_pino_logger_1.default)({
        prettyPrint: {
            translateTime: 'SYS:standard',
            ignore: 'res,responseTime,req',
            messageFormat: (log) => {
                var _a, _b, _c;
                if (log.req)
                    return `${String((_a = log.responseTime) !== null && _a !== void 0 ? _a : '')}ms - ${String(log.msg)} - REQ[${String(log.req.method)}-${String(log.req.headers.host)}${String(log.req.url)}] ${String((_c = (_b = log.res) === null || _b === void 0 ? void 0 : _b.statusCode) !== null && _c !== void 0 ? _c : '')}`;
                return `${String(log.msg)}`;
            }
        }
    });
}
exports.default = logger;
