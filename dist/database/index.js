"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_MAHJONG_SCORE = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const config_1 = require("../config");
const helper_1 = require("./helper");
const mahjongScoreConfig = {
    host: config_1.DB.MAHJONG_SCORE.HOST,
    user: config_1.DB.MAHJONG_SCORE.USER,
    password: config_1.DB.MAHJONG_SCORE.PASSWORD,
    database: config_1.DB.MAHJONG_SCORE.DATABASE,
    multipleStatements: config_1.DB.MAHJONG_SCORE.multipleStatements
};
exports.DB_MAHJONG_SCORE = mysql2_1.default
    .createPool(mahjongScoreConfig)
    .on('connection', async () => await (0, helper_1.setNamesUtf8)())
    .promise();
