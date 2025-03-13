"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const membersRouter_1 = require("./membersRouter");
const tasksRouter_1 = require("./tasksRouter");
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.use(tasksRouter_1.tasksRouter);
server.use(membersRouter_1.membersRouter);
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
