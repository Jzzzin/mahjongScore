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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const controller = __importStar(require("../api/controller"));
const router = new koa_router_1.default();
router.get('/api/member', controller.findMemberList);
router.post('/api/member', controller.createMember);
router.get('/api/member/:memberNo', controller.findMember);
router.put('/api/member/:memberNo', controller.updateMember);
router.get('/api/location', controller.findLocationList);
router.get('/api/meet', controller.findMeetList);
router.post('/api/meet', controller.createMeet);
router.get('/api/meet/:meetNo', controller.findMeet);
router.put('/api/meet/:meetNo', controller.updateMeet);
router.get('/api/game', controller.findGameList);
router.post('/api/game', controller.createGame);
router.get('/api/meetForGame', controller.findMeetForGameList);
router.put('/api/game/result', controller.updateGameMemberMap);
router.get('/api/game/:gameNo', controller.findGame);
router.put('/api/game/:gameNo', controller.updateGame);
router.get('/api/rank', controller.findRankList);
router.get('/api/year', controller.findYearList);
router.get('/api/pointRank', controller.findPointRankList);
router.post('/api/login', controller.login);
exports.default = router;
