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
exports.login = exports.findRankList = exports.updateGameMemberMap = exports.updateGame = exports.createGame = exports.findGame = exports.findGameList = exports.updateMeet = exports.createMeet = exports.findMeet = exports.findMeetList = exports.findLocationList = exports.updateMember = exports.createMember = exports.findMember = exports.findMemberList = void 0;
const access = __importStar(require("./access"));
const jwt = __importStar(require("./jwt"));
const util_1 = require("./util");
const CONST = __importStar(require("./const"));
async function findMemberList(ctx, filter) {
    ctx.log.info('*** Find Member List Service Start ***');
    let list = [];
    const countData = await access.findMemberCount(filter);
    if (countData.length > 0 && countData[0]['count(*)']) {
        list = await access.findMemberList(filter);
    }
    return list;
}
exports.findMemberList = findMemberList;
async function findMember(ctx, memberNo) {
    ctx.log.info('*** Find Member Service Start ***');
    return await access.findMember(memberNo);
}
exports.findMember = findMember;
async function createMember(ctx, param) {
    ctx.log.info('*** Create Member Service Start ***');
    let result = 0;
    const duplicated = await access.findMemberForValidate(param.memberName);
    console.log(`*** Member No [${duplicated.toString()}] For Member Name[${param.memberName}]`);
    if (duplicated === 0) {
        const createResult = await access.createMember({ memberName: param.memberName });
        result = createResult.insertId;
        if (result > 0)
            await access.createMeetMemberMapByMember(result);
    }
    return result;
}
exports.createMember = createMember;
async function updateMember(ctx, param) {
    ctx.log.info('*** Update Member Service Start ***');
    let result = 0;
    const duplicated = await access.findMemberForValidate(param.memberName);
    console.log(`*** Member No [${duplicated.toString()}] For Member Name[${param.memberName}]`);
    if (duplicated === 0 || duplicated === Number(param.memberNo)) {
        const orgMember = await access.findMember(param.memberNo);
        const updateResult = await access.updateMember(param);
        result = updateResult.affectedRows;
        if (result > 0 && param.useYn !== orgMember.useYn) {
            if (Number(param.useYn) === 1)
                await access.createMeetMemberMapByMember(param.memberNo);
            else if (Number(param.useYn) === 0)
                await access.deleteMeetMemberMapByMember(param.memberNo);
        }
    }
    return result;
}
exports.updateMember = updateMember;
async function findLocationList(ctx) {
    ctx.log.info('*** Find Location List Service Start ***');
    return access.findLocationList();
}
exports.findLocationList = findLocationList;
async function findMeetList(ctx, filter) {
    ctx.log.info('*** Find Meet List Service Start ***');
    let list = [];
    const countData = await access.findMeetCount(filter);
    if (countData.length > 0 && countData[0]['count(*)']) {
        const meetData = await access.findMeetList(filter);
        const meetMemberMapData = await access.findMeetMemberMapList();
        meetData.forEach(value => {
            const meetList = {
                ...value,
                memberList: meetMemberMapData.filter(map => map.meetNo === value.meetNo)
            };
            list.push(meetList);
        });
    }
    return list;
}
exports.findMeetList = findMeetList;
async function findMeet(ctx, meetNo) {
    ctx.log.info('*** Find Meet Service Start ***');
    const meetWithMember = await access.findMeetWithMember(meetNo);
    return {
        meetNo: meetWithMember[0].meetNo,
        meetDay: meetWithMember[0].meetDay,
        meetTime: meetWithMember[0].meetTime,
        locationNo: meetWithMember[0].locationNo,
        locationName: meetWithMember[0].locationName,
        winMemberNo: meetWithMember[0].winMemberNo,
        winMemberName: meetWithMember[0].winMemberName,
        endYn: meetWithMember[0].endYn,
        memberList: meetWithMember.map(value => { return { meetNo: value.meetNo, memberNo: value.memberNo, memberName: value.memberName, attendYn: value.attendYn }; })
    };
}
exports.findMeet = findMeet;
async function createMeet(ctx, param) {
    ctx.log.info('*** Create Meet Service Start ***');
    let result = 0;
    const duplicated = await access.findMeetForValidate(param.meetDay);
    console.log(`*** Meet No [${duplicated.toString()}] For Meet Day[${param.meetDay}]`);
    if (duplicated === 0) {
        const createResult = await access.createMeet({ meetDay: param.meetDay, meetTime: param.meetTime, locationNo: param.locationNo });
        result = createResult.insertId;
        if (result > 0) {
            const mapResult = await access.createMeetMemberMap(result);
            if (mapResult)
                await access.updateMeetMemberMap({ meetNo: result, memberNoList: param.memberNoList });
        }
    }
    return result;
}
exports.createMeet = createMeet;
async function updateMeet(ctx, param) {
    ctx.log.info('*** Update Meet Service Start ***');
    let result = 0;
    const duplicated = await access.findMeetForValidate(param.meetDay);
    console.log(`*** Meet No [${duplicated.toString()}] For Meet Day[${param.meetDay}]`);
    if (duplicated === 0 || duplicated === Number(param.meetNo)) {
        const updateResult = await access.updateMeet(param);
        if (updateResult)
            await access.updateMeetMemberMap({ meetNo: param.meetNo, memberNoList: param.memberNoList });
        if (String(param.endYn) === '1') {
            const winMemberNo = await access.getMeetWinMember(param.meetNo);
            await access.updateMeetWinMember({ meetNo: param.meetNo, winMemberNo: winMemberNo });
        }
        result = updateResult.affectedRows;
    }
    return result;
}
exports.updateMeet = updateMeet;
async function findGameList(ctx, filter) {
    ctx.log.info('*** Find Game List Service Start ***');
    let list = [];
    const countData = await access.findGameCount(filter);
    if (countData.length > 0 && countData[0]['count(*)']) {
        const gameData = await access.findGameList(filter);
        const gameMemberMapData = await access.findGameMemberMapList();
        gameData.forEach(value => {
            const gameList = {
                ...value,
                yakumanYn: value.yakumanMemberNo > 0,
                memberList: gameMemberMapData.filter(map => map.gameNo === value.gameNo)
            };
            list.push(gameList);
        });
    }
    return list;
}
exports.findGameList = findGameList;
async function findGame(ctx, gameNo) {
    ctx.log.info('*** Find Game Service Start ***');
    const gameWithMember = await access.findGameWithMember(gameNo);
    return {
        gameNo: gameWithMember[0].gameNo,
        meetNo: gameWithMember[0].meetNo,
        meetDay: gameWithMember[0].meetDay,
        gameNumber: gameWithMember[0].gameNumber,
        gameMemberCount: gameWithMember[0].gameMemberCount,
        gameType: gameWithMember[0].gameType,
        startScore: gameWithMember[0].startScore,
        returnScore: gameWithMember[0].returnScore,
        okaPoint: gameWithMember[0].okaPoint,
        umaPoint: gameWithMember[0].umaPoint,
        yakumanMemberNo: gameWithMember[0].yakumanMemberNo,
        yakumanMemberName: gameWithMember[0].yakumanMemberName,
        comment: gameWithMember[0].comment,
        endYn: gameWithMember[0].endYn,
        memberList: gameWithMember.map(value => { return { memberNo: value.memberNo, memberName: value.memberName, score: value.gameMemberScore, attendYn: value.gameMemberNo > 0 ? 1 : 0 }; })
    };
}
exports.findGame = findGame;
async function createGame(ctx, param) {
    ctx.log.info('*** Create Game Service Start ***');
    let result = 0;
    const gameNumber = await access.findGameNumber(param.meetNo);
    const meetDay = gameNumber.meetDay.replace(/[^0-9]/g, '');
    const newGameNumber = (gameNumber && gameNumber.maxGameNumber !== '') ? String(Number(gameNumber.maxGameNumber) + 1) : meetDay.concat('01');
    const endYn = param.memberList[0].score !== 0 ? 1 : 0;
    const createParam = {
        meetNo: param.meetNo,
        gameNumber: newGameNumber,
        gameMemberCount: param.gameMemberCount,
        gameType: param.gameType,
        startScore: CONST.START_SCORE[param.gameMemberCount],
        returnScore: CONST.RETURN_SCORE[param.gameMemberCount],
        okaPoint: (CONST.RETURN_SCORE[param.gameMemberCount] - CONST.START_SCORE[param.gameMemberCount]) * param.gameMemberCount / 1000,
        umaPoint: CONST.UMA_POINT[param.gameType],
        comment: param.comment,
        endYn: endYn
    };
    const createResult = await access.createGame(createParam);
    result = createResult.insertId;
    const now = (0, util_1.getMysqlDatetime)();
    if (result > 0)
        await access.createGameMemberMap(param.memberList.map(value => { return [result, value.memberNo, value.score, now, now]; }));
    return result;
}
exports.createGame = createGame;
async function updateGame(ctx, param) {
    ctx.log.info('*** Update Game Service Start ***');
    const gameNumber = await access.findGameNumber(param.meetNo);
    const meetDay = gameNumber.meetDay.replace(/[^0-9]/g, '');
    const newGameNumber = (gameNumber && gameNumber.maxGameNumber !== '') ? String(Number(gameNumber.maxGameNumber) + 1) : meetDay.concat('01');
    const startScore = CONST.START_SCORE[param.gameMemberCount];
    const returnScore = CONST.RETURN_SCORE[param.gameMemberCount];
    const umaPoint = CONST.UMA_POINT[param.gameType];
    param.endYn = param.memberList[0].score !== 0 ? 1 : 0;
    const result = await access.updateGame({ ...param, gameNumber: newGameNumber, startScore: startScore, returnScore: returnScore, umaPoint: umaPoint });
    if (result && result.affectedRows > 0) {
        await access.sortGameNumber({ gameNumber: param.orgGameNumber, meetNo: param.orgMeetNo });
        const deleteResult = await access.deleteGameMemberMap(param.gameNo);
        const now = (0, util_1.getMysqlDatetime)();
        if (deleteResult && param.memberList.length > 0)
            await access.createGameMemberMap(param.memberList.map(value => { return [param.gameNo, value.memberNo, value.score, now, now]; }));
    }
    return result.affectedRows;
}
exports.updateGame = updateGame;
async function updateGameMemberMap(ctx, param) {
    var _a, _b;
    ctx.log.info('*** Update Game Member Map Service Start ***');
    param.position = (_a = param.position) !== null && _a !== void 0 ? _a : '';
    const result = await access.updateGameMemberMap({ ...param, rank: 0, point: 0 });
    if (result) {
        const updateParams = [];
        const gameMemberMapData = await access.findGameMemberMapListForUpdate(param.gameNo);
        gameMemberMapData.forEach((map, idx) => {
            const rank = idx + 1;
            const okaPoint = rank === 1 ? map.okaPoint : 0;
            let umaPoint = 0;
            switch (idx) {
                case 0:
                    umaPoint = map.gameMemberCount === 4 ? map.umaPoint * 2 : map.umaPoint;
                    break;
                case 1:
                    umaPoint = map.gameMemberCount === 4 ? map.umaPoint : 0;
                    break;
                case 2:
                    umaPoint = map.gameMemberCount === 4 ? -map.umaPoint : -map.umaPoint;
                    break;
                case 3:
                    umaPoint = map.gameMemberCount === 4 ? -map.umaPoint * 2 : 0;
                    break;
            }
            const point = (map.score - map.returnScore) / 1000 + okaPoint + umaPoint;
            const updateParam = {
                gameNo: map.gameNo,
                memberNo: map.memberNo,
                position: map.position,
                score: map.score,
                rank: rank,
                point: point
            };
            updateParams.push(updateParam);
        });
        if (updateParams.length > 0)
            for (const param of updateParams)
                await access.updateGameMemberMap(param);
    }
    return (_b = result.affectedRows) !== null && _b !== void 0 ? _b : 0;
}
exports.updateGameMemberMap = updateGameMemberMap;
async function findRankList(ctx, filter) {
    ctx.log.info('*** Find Rank List Service Start ***');
    let list = [];
    const countData = await access.findRankCount(filter);
    if (countData.length > 0 && countData[0]['count(*)']) {
        const rankData = await access.findRankList(filter);
        rankData.forEach((value, idx) => {
            const rank = idx + 1;
            const rankRate = (value.winCnt + value.secondCnt * 2 + value.thirdCnt * 3 + value.forthCnt * 4) / value.totalGameCnt;
            const rankList = {
                ...value,
                rank: rank,
                winRate: Math.round(value.winCnt / value.totalGameCnt * 1000) / 10,
                upRate: Math.round((value.winCnt + value.secondCnt) / value.totalGameCnt * 1000) / 10,
                forthRate: Math.round(value.forthCnt / value.totalGameCnt * 1000) / 10,
                rankRate: Math.round(rankRate * 100) / 100
            };
            list.push(rankList);
        });
    }
    return list;
}
exports.findRankList = findRankList;
async function login(ctx, param) {
    ctx.log.info('*** Login Service Start ***');
    const result = {
        status: false,
        message: '',
        token: ''
    };
    if (param.userId === 'admin' && param.password === '601') {
        try {
            result.status = true;
            result.message = 'Login Success!!!';
            result.token = await jwt.createToken();
        }
        catch (e) {
            ctx.log.error(String(e));
            result.message = 'Login Failed!!!';
        }
    }
    else {
        result.message = '일치하는 정보가 없습니다.';
    }
    return result;
}
exports.login = login;
