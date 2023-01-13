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
exports.getSundayFromWeekNum = exports.getWeekdayKor = exports.getWeekday = exports.uuid = exports.concatStr = exports.getJapaneseDateString = exports.getLocaleTimeString = exports.getLocaleDateString = exports.getMysqlDatetime = exports.getDateBetween = exports.getDate = exports.delay = exports.getDateRange = exports.fillZero = exports.isEmpty = exports.getRanStr = exports.getSearchQuery = exports.getSortQuery = exports.getLimitQuery = void 0;
const uuid_1 = require("uuid");
const CONST = __importStar(require("./const"));
function getLimitQuery({ limit, offset }, defaultLimit = 50) {
    return `
    limit ${limit !== null && limit !== void 0 ? limit : defaultLimit}
    offset ${offset !== null && offset !== void 0 ? offset : 0}
  `;
}
exports.getLimitQuery = getLimitQuery;
function getSortQuery({ order_by, is_desc }, defaultColumn) {
    const column = order_by !== null && order_by !== void 0 ? order_by : defaultColumn;
    if (column)
        return `order by ${column}${is_desc === 'Y' ? ' desc' : ''}`;
    else
        return '';
}
exports.getSortQuery = getSortQuery;
function getSearchQuery({ search_type, search_keyword }) {
    if (!search_type || !search_keyword)
        return '';
    else
        return `${search_type} like "%${search_keyword}%"`;
}
exports.getSearchQuery = getSearchQuery;
function getRanStr(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    if (!length)
        length = 6;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.getRanStr = getRanStr;
function isEmpty(value) {
    return value === '' || value === null || value === undefined || (typeof value === 'string' && value.toUpperCase() === 'NULL') || (Array.isArray(value) && !value.length) || (typeof value === 'object' && !Object.keys(value).length);
}
exports.isEmpty = isEmpty;
function fillZero(width, str) {
    return str.length >= width ? str : (new Array(width - str.toString().length + 1).join('0')).toString() + str;
}
exports.fillZero = fillZero;
function getDateRange(startDate, endDate) {
    const parseStartDate = `${startDate.substr(0, 4)}-${startDate.substr(4, 2)}-${startDate.substr(6, 2)}`;
    const parseEndDate = `${endDate.substr(0, 4)}-${endDate.substr(4, 2)}-${endDate.substr(6, 2)}`;
    const dateList = [];
    const dateMove = new Date(parseStartDate);
    let strDate = parseStartDate;
    if (startDate === endDate)
        dateList.push(parseStartDate);
    else {
        while (strDate < parseEndDate) {
            strDate = dateMove.toISOString().slice(0, 10);
            dateList.push(strDate);
            dateMove.setDate(dateMove.getDate() + 1);
        }
    }
    return dateList;
}
exports.getDateRange = getDateRange;
async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
function getDate(dateString) {
    const year = dateString.substr(0, 4);
    const month = dateString.substr(4, 2);
    const day = dateString.substr(6, 2);
    if (dateString.length === 8) {
        return new Date(Number(year), Number(month) - 1, Number(day));
    }
    else if (dateString.length === 12) {
        const hour = dateString.substr(8, 2);
        const minute = dateString.substr(10, 2);
        return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    }
    else if (dateString.length === 14) {
        const hour = dateString.substr(8, 2);
        const minute = dateString.substr(10, 2);
        const second = dateString.substr(12, 2);
        return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
    }
    else {
        return new Date();
    }
}
exports.getDate = getDate;
function getDateBetween(startDateStr, endDateStr) {
    const startDate = getDate(startDateStr).getTime();
    const endDate = getDate(endDateStr).getTime();
    return (endDate - startDate) / (1000 * 60 * 60 * 24);
}
exports.getDateBetween = getDateBetween;
function getMysqlDatetime(timestamp) {
    const time = timestamp ? new Date(timestamp) : new Date();
    const isoTime = new Date((new Date(time)).toISOString());
    const fixedTime = new Date(isoTime.getTime() - (time.getTimezoneOffset() * 60000));
    return fixedTime.toISOString().slice(0, 19).replace('T', ' ');
}
exports.getMysqlDatetime = getMysqlDatetime;
function getLocaleDateString(date) {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/[^0-9]/g, '');
}
exports.getLocaleDateString = getLocaleDateString;
function getLocaleTimeString(date, length) {
    if (length === 4)
        return date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(/[^0-9]/g, '');
    else
        return date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/[^0-9]/g, '');
}
exports.getLocaleTimeString = getLocaleTimeString;
function getJapaneseDateString(dateString) {
    const dateNumber = Number(dateString);
    const year = Number(dateString.substr(0, 4));
    const month = Number(dateString.substr(4, 2));
    const day = Number(dateString.substr(6, 2));
    if (dateString.length === 8) {
        let label;
        let localYear;
        // 明治５年以降のみ
        if (year < 1873) {
            label = '';
            localYear = year;
        }
        else if (dateNumber >= 20190501) {
            label = '令和';
            localYear = year - 2019 + 1;
        }
        else if (dateNumber >= 19890108) {
            label = '平成';
            localYear = year - 1988;
        }
        else if (dateNumber >= 19261225) {
            label = '昭和';
            localYear = year - 1925;
        }
        else if (dateNumber >= 19120730) {
            label = '大正';
            localYear = year - 1911;
        }
        else {
            label = '明治';
            localYear = year - 1868;
        }
        // 1年は元年
        const wareki = (localYear === 1) ? label + '元年' : label + String(localYear) + '年';
        return wareki + String(month) + '月' + String(day) + '日';
    }
    else {
        return 'Invalid dateString';
    }
}
exports.getJapaneseDateString = getJapaneseDateString;
function concatStr(orgStr, addStr) {
    return isEmpty(orgStr)
        ? addStr
        : orgStr.concat('\\n', addStr);
}
exports.concatStr = concatStr;
function uuid() {
    const tokens = (0, uuid_1.v4)().split('-');
    return tokens[2].concat(tokens[1], tokens[0], tokens[3], tokens[4]);
}
exports.uuid = uuid;
function getWeekday(str) {
    let result;
    switch (str) {
        case CONST.WEEKDAY.MON:
            result = '0';
            break;
        case CONST.WEEKDAY.TUE:
            result = '1';
            break;
        case CONST.WEEKDAY.WED:
            result = '2';
            break;
        case CONST.WEEKDAY.THU:
            result = '3';
            break;
        case CONST.WEEKDAY.FRI:
            result = '4';
            break;
        case CONST.WEEKDAY.SAT:
            result = '5';
            break;
        case CONST.WEEKDAY.SUN:
            result = '6';
            break;
    }
    return result;
}
exports.getWeekday = getWeekday;
function getWeekdayKor(day) {
    const weekDay = ['일', '월', '화', '수', '목', '금', '토', '일'];
    return weekDay[day];
}
exports.getWeekdayKor = getWeekdayKor;
function getSundayFromWeekNum(year, weekNum) {
    const sunday = new Date(year, 0, (1 + weekNum * 7));
    while (sunday.getDay() !== 0) {
        sunday.setDate(sunday.getDate() - 1);
    }
    const dateString = getLocaleDateString(sunday);
    return dateString.substr(0, 4) + '-' + dateString.substr(4, 2) + '-' + dateString.substr(6, 2) + '(일)~';
}
exports.getSundayFromWeekNum = getSundayFromWeekNum;
