"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.refreshToken = exports.updateToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
async function createToken() {
    console.log(`*** Create Token Start ***`);
    return await new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({
            MEMBER_NAME: 'ADMIN'
        }, config_1.SERVER.SEC_KEY, {
            expiresIn: '16200s',
            issuer: 'Mahjong_Score',
            subject: 'admin'
        }, (error, token) => {
            if (error)
                reject(error);
            resolve(token);
        });
    });
}
exports.createToken = createToken;
async function updateToken(token) {
    try {
        const decodedToken = await decodeToken(token); // 토큰을 디코딩 합니다
        console.log(`*** Update Token Start ***`);
        // 토큰을 재발급합니다
        return await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.sign({
                MEMBER_NAME: decodedToken.MEMBER_NAME
            }, config_1.SERVER.SEC_KEY, {
                expiresIn: '16200s',
                issuer: 'Mahjong_Score',
                subject: 'admin'
            }, (error, token) => {
                if (error)
                    reject(error);
                resolve(token);
            });
        });
    }
    catch (e) {
        console.log(e);
        return token;
    }
}
exports.updateToken = updateToken;
async function refreshToken(token) {
    try {
        const decodedToken = await decodeToken(token); // 토큰을 디코딩 합니다
        // 토큰을 재발급합니다
        return await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.sign({
                MEMBER_NAME: decodedToken.MEMBER_NAME
            }, config_1.SERVER.SEC_KEY, {
                expiresIn: '16200s',
                issuer: 'Mahjong_Score',
                subject: 'admin'
            }, (error, token) => {
                if (error)
                    reject(error);
                resolve(token);
            });
        });
    }
    catch (e) {
        console.log(e);
        return token;
    }
}
exports.refreshToken = refreshToken;
async function decodeToken(token) {
    return await new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, config_1.SERVER.SEC_KEY, (error, decoded) => {
            if (error)
                reject(error);
            resolve(decoded);
        });
    });
}
exports.decodeToken = decodeToken;
