"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("../api/jwt"));
const CONST = __importStar(require("../api/const"));
const jwtMiddleware = async (ctx, next) => {
    var _a;
    if (ctx.state.jwtOriginalError) {
        console.log(`*** Jwt Verification Error [${String(ctx.state.jwtOriginalError.name)}] ***`);
        ctx.status = 401;
    }
    else {
        console.log('*** Jwt Middleware Start ***');
        const token = (_a = ctx.request.header.authorization) === null || _a === void 0 ? void 0 : _a.substring(7);
        let authYn = false;
        if (!token) {
            const method = ctx.method;
            const pathname = ctx.URL.pathname;
            if (pathname.includes(CONST.PATHNAME.Login)) {
                console.log(`*** Pass Auth Check: Path[${pathname}]***`);
                authYn = true;
            }
            else {
                if (method !== 'GET') {
                    console.log(`*** Token Required: Method[${method}] Path[${pathname}]***`);
                }
                else {
                    authYn = true;
                }
            }
        }
        else {
            try {
                const decodedToken = await jwt.decodeToken(token);
                if (decodedToken) {
                    authYn = true;
                    if (Number(decodedToken.exp) - Date.now() / 1000 < 1800) {
                        console.log('*** Token Refresh!!! ***');
                        const freshToken = await jwt.refreshToken(token);
                        ctx.request.header.authorization = 'Bearer ' + freshToken;
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        if (authYn)
            return next();
        else {
            ctx.status = 403;
        }
    }
};
exports.default = jwtMiddleware;
