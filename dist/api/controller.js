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
exports.login = exports.findRankList = exports.updateGameMemberMap = exports.updateGame = exports.findMeetForGameList = exports.createGame = exports.findGame = exports.findGameList = exports.updateMeet = exports.createMeet = exports.findMeet = exports.findLocationList = exports.findMeetList = exports.updateMember = exports.createMember = exports.findMember = exports.findMemberList = void 0;
const service = __importStar(require("./service"));
const findMemberList = async (ctx) => {
    ctx.log.info('*** Find Member List Controller Start ***');
    const query = ctx.query;
    ctx.body = await service.findMemberList(ctx, query);
};
exports.findMemberList = findMemberList;
const findMember = async (ctx) => {
    ctx.log.info('*** Find Member Controller Start ***');
    const { memberNo } = ctx.params;
    ctx.body = await service.findMember(ctx, memberNo);
};
exports.findMember = findMember;
const createMember = async (ctx) => {
    ctx.log.info('*** Create Member Controller Start ***');
    const param = ctx.request.body;
    try {
        const result = await service.createMember(ctx, param);
        if (result > 0) {
            ctx.status = 200;
            ctx.body = result;
        }
        else {
            ctx.status = 204;
            ctx.body = 'Duplicated Member Name';
        }
    }
    catch (e) {
        ctx.log.error(String(e));
        ctx.status = 500;
        ctx.body = 'Create Failed';
    }
};
exports.createMember = createMember;
const updateMember = async (ctx) => {
    ctx.log.info('*** Update Member Controller Start ***');
    const param = ctx.request.body;
    try {
        const result = await service.updateMember(ctx, param);
        if (result > 0) {
            ctx.status = 200;
            ctx.body = 'Update Success';
        }
        else {
            ctx.status = 204;
            ctx.body = 'Duplicated Member Name';
        }
    }
    catch (e) {
        ctx.log.error(String(e));
        ctx.status = 500;
        ctx.body = 'Update Failed';
    }
};
exports.updateMember = updateMember;
const findMeetList = async (ctx) => {
    ctx.log.info('*** Find Meet List Controller Start ***');
    const query = ctx.query;
    const data = await service.findMeetList(ctx, query);
    if (data) {
        ctx.status = 200;
        ctx.body = data;
    }
    else {
        ctx.status = 204;
    }
};
exports.findMeetList = findMeetList;
const findLocationList = async (ctx) => {
    ctx.log.info('*** Find Location List Controller Start ***');
    const data = await service.findLocationList(ctx);
    if (data) {
        ctx.status = 200;
        ctx.body = data;
    }
    else {
        ctx.status = 204;
    }
};
exports.findLocationList = findLocationList;
const findMeet = async (ctx) => {
    ctx.log.info('*** Find Meet Controller Start ***');
    const { meetNo } = ctx.params;
    ctx.body = await service.findMeet(ctx, meetNo);
};
exports.findMeet = findMeet;
const createMeet = async (ctx) => {
    ctx.log.info('*** Create Meet Controller Start ***');
    const param = ctx.request.body;
    try {
        const result = await service.createMeet(ctx, param);
        if (result > 0) {
            ctx.status = 200;
            ctx.body = result;
        }
        else {
            ctx.status = 204;
            ctx.body = 'Create Failed';
        }
    }
    catch (e) {
        ctx.log.error(String(e));
        ctx.status = 500;
        ctx.body = 'Create Failed';
    }
};
exports.createMeet = createMeet;
const updateMeet = async (ctx) => {
    ctx.log.info('*** Update Meet Controller Start ***');
    const param = ctx.request.body;
    try {
        const result = await service.updateMeet(ctx, param);
        if (result > 0) {
            ctx.status = 200;
            ctx.body = 'Update Success';
        }
        else {
            ctx.status = 204;
            ctx.body = 'Update Failed';
        }
    }
    catch (e) {
        ctx.log.error(String(e));
        ctx.status = 500;
        ctx.body = 'Update Failed';
    }
};
exports.updateMeet = updateMeet;
const findGameList = async (ctx) => {
    ctx.log.info('*** Find Game List Controller Start ***');
    const query = ctx.query;
    const data = await service.findGameList(ctx, query);
    if (data) {
        ctx.status = 200;
        ctx.body = data;
    }
    else {
        ctx.status = 204;
    }
};
exports.findGameList = findGameList;
const findGame = async (ctx) => {
    ctx.log.info('*** Find Game Controller Start ***');
    const { gameNo } = ctx.params;
    ctx.body = await service.findGame(ctx, gameNo);
};
exports.findGame = findGame;
const createGame = async (ctx) => {
    ctx.log.info('*** Create Game Controller Start ***');
    const param = ctx.request.body;
    try {
        const result = await service.createGame(ctx, param);
        if (result > 0) {
            ctx.status = 200;
            ctx.body = result;
        }
        else {
            ctx.status = 204;
            ctx.body = 'Create Failed';
        }
    }
    catch (e) {
        ctx.log.error(String(e));
        ctx.status = 500;
        ctx.body = 'Create Failed';
    }
};
exports.createGame = createGame;
const findMeetForGameList = async (ctx) => {
    ctx.log.info('*** Find Meet For Game List  Controller Start ***');
    const query = ctx.query;
    query.endYn = '0';
    const data = await service.findMeetList(ctx, query);
    if (data) {
        ctx.status = 200;
        ctx.body = data;
    }
    else {
        ctx.status = 204;
    }
};
exports.findMeetForGameList = findMeetForGameList;
const updateGame = async (ctx) => {
    ctx.log.info('*** Update Game Controller Start ***');
    const param = ctx.request.body;
    try {
        const result = await service.updateGame(ctx, param);
        if (result > 0) {
            ctx.status = 200;
            ctx.body = 'Update Success';
        }
        else {
            ctx.status = 204;
            ctx.body = 'Update Failed';
        }
    }
    catch (e) {
        ctx.log.error(String(e));
        ctx.status = 500;
        ctx.body = 'Update Failed';
    }
};
exports.updateGame = updateGame;
const updateGameMemberMap = async (ctx) => {
    ctx.log.info('*** Update Game Member Map Controller Start ***');
    const param = ctx.request.body;
    try {
        const result = await service.updateGameMemberMap(ctx, param);
        if (result > 0) {
            ctx.status = 200;
            ctx.body = result;
        }
        else {
            ctx.status = 204;
            ctx.body = 'Create Failed';
        }
    }
    catch (e) {
        ctx.log.error(String(e));
        ctx.status = 500;
        ctx.body = 'Create Failed';
    }
};
exports.updateGameMemberMap = updateGameMemberMap;
const findRankList = async (ctx) => {
    ctx.log.info('*** Find Rank List Controller Start ***');
    const query = ctx.query;
    const data = await service.findRankList(ctx, query);
    if (data) {
        ctx.status = 200;
        ctx.body = data;
    }
    else {
        ctx.status = 204;
    }
};
exports.findRankList = findRankList;
const login = async (ctx) => {
    ctx.log.info('*** Login Controller Start ***');
    const param = ctx.request.body;
    ctx.body = await service.login(ctx, param);
};
exports.login = login;
