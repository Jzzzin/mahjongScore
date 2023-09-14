"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRankList = exports.findRankCount = exports.findGameMemberMapListForRank = exports.updateGameMemberMap = exports.sortGameNumber = exports.updateGame = exports.createGameMemberMap = exports.deleteGameMemberMap = exports.createGame = exports.findGameNumber = exports.findGameWithMember = exports.findGameMemberMapList = exports.findGameList = exports.findGameCount = exports.updateMeetWinMember = exports.getMeetWinMember = exports.updateMeet = exports.updateMeetMemberMap = exports.createMeetMemberMap = exports.createMeet = exports.findMeetForValidate = exports.findMeetWithMember = exports.findMeetMemberMapList = exports.findMeetList = exports.findMeetCount = exports.findLocationList = exports.deleteMeetMemberMapByMember = exports.updateMember = exports.createMeetMemberMapByMember = exports.createMember = exports.findMemberForValidate = exports.findMember = exports.findMemberList = exports.findMemberCount = void 0;
const database_1 = require("../database");
const util_1 = require("./util");
async function findMemberCount(filter) {
    const search = (0, util_1.getSearchQuery)(filter);
    const sql = `
    SELECT count(*)
    FROM member
    WHERE use_yn = '1'
    ${search && `AND ${search}`}
  `;
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findMemberCount = findMemberCount;
async function findMemberList(filter) {
    if (!filter.order_by && !filter.is_desc)
        filter.is_desc = 'N';
    const search = (0, util_1.getSearchQuery)(filter);
    const sql = `
    SELECT member_no                                                                            AS memberNo,
           member_name                                                                          AS memberName,
           (SELECT COUNT(meet_no) FROM meet WHERE meet.win_member_no = member.member_no)        AS meetWinCnt,
           (SELECT COUNT(game_no) FROM game WHERE game.yakuman_member_no = member.member_no)    AS yakumanCnt,
           use_yn                                                                               AS useYn,
           CAST(created_date AS CHAR)                                                           AS createdDate
    FROM member
    WHERE use_yn = '1'
    ${search && `AND ${search}`}
    ORDER BY meetWinCnt DESC, yakumanCnt DESC
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findMemberList = findMemberList;
async function findMember(memberNo) {
    const sql = `
    SELECT member_no                                                                            AS memberNo,
           member_name                                                                          AS memberName,
           (SELECT COUNT(meet_no) FROM meet WHERE meet.win_member_no = member.member_no)        AS meetWinCnt,
           (SELECT COUNT(game_no) FROM game WHERE game.yakuman_member_no = member.member_no)    AS yakumanCnt,
           use_yn                                                                               AS useYn,
           CAST(created_date AS CHAR)                                                           AS createdDate
    FROM member
    WHERE member_no = '${memberNo}'
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    const result = data;
    return result[0];
}
exports.findMember = findMember;
async function findMemberForValidate(memberName) {
    var _a, _b;
    const sql = `
    SELECT member_no AS memberNo
    FROM member
    WHERE member_name = '${memberName}'
    LIMIT 1
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    const result = data;
    return (_b = (_a = result.pop()) === null || _a === void 0 ? void 0 : _a.memberNo) !== null && _b !== void 0 ? _b : 0;
}
exports.findMemberForValidate = findMemberForValidate;
async function createMember(param) {
    const sql = `
    INSERT INTO member (member_name, created_date, modified_date)
    VALUES (?, now(), now())
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql, Object.values(param));
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.createMember = createMember;
async function createMeetMemberMapByMember(memberNo) {
    const sql = `
    INSERT INTO meet_member_map (meet_no, member_no, created_date, modified_date)
    SELECT meet_no, '${memberNo}', now(), now() FROM meet WHERE end_yn = '0'
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.createMeetMemberMapByMember = createMeetMemberMapByMember;
async function updateMember(param) {
    const sql = `
    UPDATE member
    SET member_name = '${param.memberName}',
        use_yn = '${param.useYn}',
        modified_date = now()
    WHERE member_no = '${param.memberNo}'
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.updateMember = updateMember;
async function deleteMeetMemberMapByMember(memberNo) {
    const sql = `
    DELETE FROM meet_member_map
    WHERE member_no = '${memberNo}'
      AND meet_no IN (SELECT meet_no FROM meet WHERE end_yn = '0')
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.deleteMeetMemberMapByMember = deleteMeetMemberMapByMember;
async function findLocationList() {
    const sql = `
    SELECT location_no      AS locationNo,
           location_name    AS locationName
    FROM location
    WHERE use_yn = '1'
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findLocationList = findLocationList;
function getSearchMeetParam(filter, search) {
    const searchEndYn = !(0, util_1.isEmpty)(filter.endYn) ? `meet.end_yn = '${filter.endYn}'` : '';
    let result = '';
    for (const value of [searchEndYn, search]) {
        if (!(0, util_1.isEmpty)(result) && !(0, util_1.isEmpty)(value))
            result += ' AND ';
        result += value;
    }
    return result;
}
async function findMeetCount(filter) {
    const search = (0, util_1.getSearchQuery)(filter);
    const searchParam = getSearchMeetParam(filter, search);
    const sql = `
    SELECT count(*)
    FROM meet
        LEFT JOIN location ON meet.location_no = location.location_no
    ${searchParam && `WHERE ${searchParam}`}
  `;
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findMeetCount = findMeetCount;
async function findMeetList(filter) {
    if (!filter.order_by && !filter.is_desc)
        filter.is_desc = 'Y';
    const search = (0, util_1.getSearchQuery)(filter);
    const searchParam = getSearchMeetParam(filter, search);
    const sort = (0, util_1.getSortQuery)(filter, 'meet.meet_day');
    const sql = `
    SELECT meet.meet_no                     AS meetNo,
           CAST(meet.meet_day AS CHAR)      AS meetDay,
           CAST(meet.meet_time AS CHAR)     AS meetTime,
           meet.location_no                 AS locationNo,
           location.location_name           AS locationName,
           meet.win_member_no               AS winMemberNo,
           member.member_name               AS winMemberName,
           meet.end_yn                      AS endYn
    FROM meet
        LEFT JOIN location ON meet.location_no = location.location_no
        LEFT JOIN member ON meet.win_member_no = member.member_no
    ${searchParam && `WHERE ${searchParam}`}
    ${sort}
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findMeetList = findMeetList;
async function findMeetMemberMapList() {
    const sql = `
    SELECT map.meet_no                  AS meetNo,
           map.member_no                AS memberNo,
           member.member_name           AS memberName,
           map.attend_yn                AS attendYn
    FROM meet_member_map map
        LEFT JOIN member ON map.member_no = member.member_no
    WHERE map.attend_yn = '1'
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findMeetMemberMapList = findMeetMemberMapList;
async function findMeetWithMember(meetNo) {
    const sql = `
    SELECT meet.meet_no                     AS meetNo,
           CAST(meet.meet_day AS CHAR)      AS meetDay,
           CAST(meet.meet_time AS CHAR)     AS meetTime,
           meet.location_no                 AS locationNo,
           location.location_name           AS locationName,
           meet.win_member_no               AS winMemberNo,
           member.member_name               AS winMemberName,
           meet.end_yn                      AS endYn,
           map.member_no                    AS memberNo,
           mapMember.member_name            AS memberName,
           map.attend_yn                    AS attendYn
    FROM meet
        LEFT JOIN location ON meet.location_no = location.location_no
        LEFT JOIN member ON meet.win_member_no = member.member_no
        LEFT JOIN meet_member_map map ON meet.meet_no = map.meet_no
        LEFT JOIN member mapMember ON map.member_no = mapMember.member_no
    WHERE meet.meet_no = '${meetNo}'
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findMeetWithMember = findMeetWithMember;
async function findMeetForValidate(meetDay) {
    var _a, _b;
    const sql = `
    SELECT meet_no AS meetNo
    FROM meet
    WHERE meet_day = '${meetDay}'
    LIMIT 1
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    const result = data;
    return (_b = (_a = result.pop()) === null || _a === void 0 ? void 0 : _a.meetNo) !== null && _b !== void 0 ? _b : 0;
}
exports.findMeetForValidate = findMeetForValidate;
async function createMeet(param) {
    const sql = `
    INSERT INTO meet (meet_day, meet_time, location_no, created_date, modified_date)
    VALUES (?, ?, ?, now(), now())
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql, Object.values(param));
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.createMeet = createMeet;
async function createMeetMemberMap(meetNo) {
    const sql = `
    INSERT INTO meet_member_map (meet_no, member_no, created_date, modified_date)
    SELECT '${meetNo}', member_no, now(), now() FROM member WHERE use_yn = '1'
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.createMeetMemberMap = createMeetMemberMap;
async function updateMeetMemberMap(param) {
    var _a;
    const searchParam = (_a = param.memberNoList.map(i => `'${i}'`).join(',')) !== null && _a !== void 0 ? _a : '0';
    const sql = `
    UPDATE meet_member_map
    SET attend_yn = 0,
        modified_date = now()
    WHERE meet_no = '${param.meetNo}';
    UPDATE meet_member_map
    SET attend_yn = 1,
        modified_date = now()
    WHERE meet_no = '${param.meetNo}'
      AND member_no IN ( ${searchParam} );
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.updateMeetMemberMap = updateMeetMemberMap;
async function updateMeet(param) {
    const sql = `
    UPDATE meet
    SET meet_day = '${param.meetDay}',
        meet_time = '${param.meetTime}',
        location_no = '${param.locationNo}',
        end_yn = '${param.endYn}',
        modified_date = now()
    WHERE meet_no = '${param.meetNo}'
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.updateMeet = updateMeet;
async function getMeetWinMember(meetNo) {
    var _a, _b;
    const sql = `
    SELECT meet.meet_no         AS meetNo,
           member.member_no     AS memberNo,
           SUM(map.point)       AS point
    FROM game_member_map map
        LEFT JOIN game ON game.game_no = map.game_no
        LEFT JOIN meet ON meet.meet_no = game.meet_no
        LEFT JOIN member ON member.member_no = map.member_no
    WHERE game.end_yn = '1'
      AND meet.meet_no = '${meetNo}'
    GROUP BY map.member_no
    ORDER BY point DESC
    LIMIT 1
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    const result = data;
    return (_b = (_a = result.pop()) === null || _a === void 0 ? void 0 : _a.memberNo) !== null && _b !== void 0 ? _b : 0;
}
exports.getMeetWinMember = getMeetWinMember;
async function updateMeetWinMember(param) {
    const sql = `
    UPDATE meet
    SET win_member_no = '${param.winMemberNo}',
        modified_date = now()
    WHERE meet_no = '${param.meetNo}'
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.updateMeetWinMember = updateMeetWinMember;
async function findGameCount(filter) {
    const search = (0, util_1.getSearchQuery)(filter);
    const sql = `
    SELECT count(*)
    FROM game
        LEFT JOIN meet ON game.meet_no = meet.meet_no
    ${search && `WHERE ${search}`}
  `;
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findGameCount = findGameCount;
async function findGameList(filter) {
    if (!filter.order_by && !filter.is_desc)
        filter.is_desc = 'Y';
    const search = (0, util_1.getSearchQuery)(filter);
    const sort = (0, util_1.getSortQuery)(filter, 'game.game_number');
    const sql = `
    SELECT game.game_no                     AS gameNo,
           game.meet_no                     AS meetNo,
           CAST(meet.meet_day AS CHAR)      AS meetDay,
           CAST(game.game_number AS CHAR)   AS gameNumber,
           game.game_member_count           AS gameMemberCount,
           game.game_type                   AS gameType,
           game.start_score                 AS startScore,
           game.return_score                AS returnScore,
           game.oka_point                   AS okaPoint,
           game.uma_point                   AS umaPoint,
           game.yakuman_member_no           AS yakumanMemberNo,
           member.member_name               AS yakumanMemberName,
           game.comment                     AS comment,
           game.end_yn                      AS endYn
    FROM game
        LEFT JOIN meet ON game.meet_no = meet.meet_no
        LEFT JOIN member ON game.yakuman_member_no = member.member_no
    ${search && `WHERE ${search}`}
    ${sort}
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findGameList = findGameList;
async function findGameMemberMapList() {
    const sql = `
    SELECT map.game_no                  AS gameNo,
           map.member_no                AS memberNo,
           member.member_name           AS memberName,
           map.position                 AS position,
           map.score                    AS score,
           map.rank                     AS 'rank',
           map.point                    AS point
    FROM game_member_map map
        LEFT JOIN member ON map.member_no = member.member_no
    ORDER BY map.game_no, map.score DESC
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findGameMemberMapList = findGameMemberMapList;
async function findGameWithMember(gameNo) {
    const sql = `
    SELECT game.game_no                     AS gameNo,
           game.meet_no                     AS meetNo,
           CAST(meet.meet_day AS CHAR)      AS meetDay,
           CAST(game.game_number AS CHAR)   AS gameNumber,
           game.game_member_count           AS gameMemberCount,
           game.game_type                   AS gameType,
           game.start_score                 AS startScore,
           game.return_score                AS returnScore,
           game.oka_point                   AS okaPoint,
           game.uma_point                   AS umaPoint,
           game.yakuman_member_no           AS yakumanMemberNo,
           gameMember.member_name           AS yakumanMemberName,
           game.comment                     AS comment,
           game.end_yn                      AS endYn,
           meetMap.member_no                AS memberNo,
           member.member_name               AS memberName,
           IFNULL(gameMap.member_no, 0)     AS gameMemberNo,
           IFNULL(gameMap.score, 0)         AS gameMemberScore
    FROM game
        LEFT JOIN meet ON game.meet_no = meet.meet_no
        LEFT JOIN member gameMember ON game.yakuman_member_no = gameMember.member_no
        LEFT JOIN meet_member_map meetMap ON game.meet_no = meetMap.meet_no AND meetMap.attend_yn = '1'
        LEFT JOIN game_member_map gameMap ON game.game_no = gameMap.game_no AND meetMap.member_no = gameMap.member_no
        LEFT JOIN member ON meetMap.member_no = member.member_no
    WHERE game.game_no = '${gameNo}'
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findGameWithMember = findGameWithMember;
async function findGameNumber(meetNo) {
    const sql = `
    SELECT CAST(COALESCE(MAX(game.game_number), '') AS CHAR)    AS maxGameNumber,
           CAST(meet.meet_day AS CHAR)                          AS meetDay
    FROM meet
        LEFT JOIN game ON game.meet_no = meet.meet_no
    WHERE meet.meet_no = '${meetNo}'
    GROUP BY meet.meet_no
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    const result = data;
    return result[0];
}
exports.findGameNumber = findGameNumber;
async function createGame(param) {
    const sql = `
    INSERT INTO game (meet_no, game_number, game_member_count, game_type, start_score, return_score, oka_point, uma_point, yakuman_member_no, comment, end_yn, created_date, modified_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now())
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql, Object.values(param));
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.createGame = createGame;
async function deleteGameMemberMap(gameNo) {
    const sql = `
    DELETE FROM game_member_map
    WHERE game_no = '${gameNo}'
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.deleteGameMemberMap = deleteGameMemberMap;
async function createGameMemberMap(params) {
    const sql = `
    INSERT INTO game_member_map (game_no, member_no, score, rank, point, created_date, modified_date)
    VALUES ?
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql, [params]);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.createGameMemberMap = createGameMemberMap;
async function updateGame(param) {
    const sql = `
    UPDATE game
    SET meet_no = '${param.meetNo}',
        game_number = '${param.gameNumber}',
        game_member_count = '${param.gameMemberCount}',
        game_type = '${param.gameType}',
        start_score = '${param.startScore}',
        return_score = '${param.returnScore}',
        oka_point = (${param.returnScore} - ${param.startScore}) * ${param.gameMemberCount} / 1000,
        uma_point = '${param.umaPoint}',
        yakuman_member_no = '${param.yakumanMemberNo}',
        comment = '${param.comment}',
        end_yn = '${param.endYn}',
        modified_date = now()
    WHERE game_no = '${param.gameNo}'
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.updateGame = updateGame;
async function sortGameNumber(param) {
    const sql = `
    UPDATE game
    SET game_number = CAST((CAST(game_number AS unsigned) - 1) AS CHAR)
    WHERE meet_no = ${param.meetNo}
      AND game_number > ${param.gameNumber}
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.sortGameNumber = sortGameNumber;
async function updateGameMemberMap(param) {
    const sql = `
    UPDATE game_member_map map
        LEFT JOIN game ON map.game_no = game.game_no
    SET map.position = '${param.position}',
        map.score = '${param.score}',
        map.rank = '${param.rank}',
        map.point = '${param.point}',
        map.modified_date = now(),
        game.end_yn = '1',
        game.modified_date = now()
    WHERE map.game_no = '${param.gameNo}'
      AND map.member_no = '${param.memberNo}'
  `;
    console.log(sql);
    try {
        const [rows] = await database_1.DB_MAHJONG_SCORE.query(sql);
        return rows;
    }
    catch (e) {
        console.log(e);
    }
}
exports.updateGameMemberMap = updateGameMemberMap;
async function findGameMemberMapListForRank(gameNo) {
    const sql = `
    SELECT game.game_no             AS gameNo,
           map.member_no            AS memberNo,
           map.position             AS position,
           map.score                AS score,
           game.game_member_count   AS gameMemberCount,
           game.return_score        AS returnScore,
           game.oka_point           AS okaPoint,
           game.uma_point           AS umaPoint
    FROM game
        LEFT JOIN game_member_map map ON game.game_no = map.game_no
    WHERE game.game_no = '${gameNo}'
    ORDER BY game.game_no, map.score DESC
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findGameMemberMapListForRank = findGameMemberMapListForRank;
function getSearchRankParam(filter, search) {
    const searchMeetNo = !(0, util_1.isEmpty)(filter.meetNo) ? `meet.meet_no = '${filter.meetNo}'` : '';
    let result = '';
    for (const value of [searchMeetNo, search]) {
        if (!(0, util_1.isEmpty)(result) && !(0, util_1.isEmpty)(value))
            result += ' AND ';
        result += value;
    }
    return result;
}
async function findRankCount(filter) {
    const search = (0, util_1.getSearchQuery)(filter);
    const searchParam = getSearchRankParam(filter, search);
    const sql = `
    SELECT count(*)
    FROM ( SELECT member.member_name                                                                    AS memberName,
                  (SELECT COUNT(meet_no) FROM meet WHERE meet.win_member_no = member.member_no)         AS meetWinCnt,
                  (SELECT COUNT(game_no) FROM game WHERE game.yakuman_member_no = member.member_no)     AS yakumanCnt,
                  SUM(map.point)                                                                        AS totalPoint,
                  COUNT(IF(map.rank=1, true, null))                                                     AS winCnt,
                  COUNT(IF(map.rank=2, true, null))                                                     AS secondCnt,
                  COUNT(IF(map.rank=3, true, null))                                                     AS thirdCnt,
                  COUNT(IF(map.rank=4, true, null))                                                     AS forthCnt,
                  COUNT(map.game_no)                                                                    AS totalGameCnt
           FROM game_member_map map
               LEFT JOIN game game ON game.game_no = map.game_no
               LEFT JOIN meet meet ON meet.meet_no = game.meet_no
               LEFT JOIN member member ON member.member_no = map.member_no
           WHERE game.end_yn = '1'
           ${searchParam && `AND ${searchParam}`}
           GROUP BY map.member_no
         ) stat
  `;
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findRankCount = findRankCount;
async function findRankList(filter) {
    if (!filter.order_by && !filter.is_desc)
        filter.is_desc = 'Y';
    const search = (0, util_1.getSearchQuery)(filter);
    const searchParam = getSearchRankParam(filter, search);
    const sort = (0, util_1.getSortQuery)(filter, 'avgPoint');
    const sql = `
    SELECT member.member_name                                                                   AS memberName,
           (SELECT COUNT(meet_no) FROM meet WHERE meet.win_member_no = member.member_no)        AS meetWinCnt,
           (SELECT COUNT(game_no) FROM game WHERE game.yakuman_member_no = member.member_no)    AS yakumanCnt,
           SUM(map.point)                                                                       AS totalPoint,
           ROUND(SUM(map.point) / COUNT(map.game_no), 2)                                        AS avgPoint,
           COUNT(IF(map.rank=1, true, null))                                                    AS winCnt,
           COUNT(IF(map.rank=2, true, null))                                                    AS secondCnt,
           COUNT(IF(map.rank=3, true, null))                                                    AS thirdCnt,
           COUNT(IF(map.rank=4, true, null))                                                    AS forthCnt,
           COUNT(map.game_no)                                                                   AS totalGameCnt
    FROM game_member_map map
        LEFT JOIN game ON game.game_no = map.game_no
        LEFT JOIN meet ON meet.meet_no = game.meet_no
        LEFT JOIN member ON member.member_no = map.member_no
    WHERE game.end_yn = '1'
    ${searchParam && `AND ${searchParam}`}
    GROUP BY map.member_no
    ${sort}
  `;
    console.log(sql);
    const [data] = await database_1.DB_MAHJONG_SCORE.query(sql);
    return data;
}
exports.findRankList = findRankList;
