"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = exports.SERVER = void 0;
var server_1 = require("./server");
Object.defineProperty(exports, "SERVER", { enumerable: true, get: function () { return __importDefault(server_1).default; } });
var database_1 = require("./database");
Object.defineProperty(exports, "DB", { enumerable: true, get: function () { return __importDefault(database_1).default; } });
