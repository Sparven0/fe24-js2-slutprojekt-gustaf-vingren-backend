"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTasks = readTasks;
exports.writeTask = writeTask;
exports.updateIsCompleted = updateIsCompleted;
exports.deleteTask = deleteTask;
exports.updateAssignedUser = updateAssignedUser;
const promises_1 = __importDefault(require("fs/promises"));
const path = './src/tasksDB.json';
const handleFileError = (e, operation) => {
    console.log(`Error ${operation} task file`, e);
    throw e;
};
function readTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rawData = yield promises_1.default.readFile(path, 'utf-8');
            return rawData ? JSON.parse(rawData) : { tasks: [] };
        }
        catch (e) {
            handleFileError(e, 'reading');
        }
    });
}
function writeTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield readTasks();
            const tasks = data.tasks || [];
            tasks.push(task);
            yield promises_1.default.writeFile(path, JSON.stringify({ tasks }, null, 2));
        }
        catch (e) {
            handleFileError(e, 'writing');
        }
    });
}
function updateIsCompleted(id, isComplete) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield readTasks();
            const tasks = data.tasks || [];
            const updatedTasks = tasks.map((task) => {
                if (task.id === id) {
                    task.isComplete = isComplete;
                }
                return task;
            });
            yield promises_1.default.writeFile(path, JSON.stringify({ tasks: updatedTasks }, null, 2));
            console.log(`Task with ID ${id} is now ${isComplete ? 'complete' : 'incomplete'}`);
        }
        catch (e) {
            handleFileError(e, 'updating');
        }
    });
}
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield readTasks();
            const tasks = data.tasks || [];
            const updatedTasks = tasks.filter((task) => task.id !== id);
            yield promises_1.default.writeFile(path, JSON.stringify({ tasks: updatedTasks }, null, 2));
            console.log(`Task with ID ${id} has been deleted`);
        }
        catch (e) {
            handleFileError(e, 'deleting');
        }
    });
}
function updateAssignedUser(id, username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield readTasks();
            const tasks = data.tasks || [];
            const updatedTasks = tasks.map((task) => {
                if (task.id === id) {
                    task.username = username;
                }
                return task;
            });
            yield promises_1.default.writeFile(path, JSON.stringify({ tasks: updatedTasks }, null, 2));
            console.log(`Username of task with ID ${id} has been updated to ${username}`);
        }
        catch (e) {
            handleFileError(e, 'updating assigned user');
        }
    });
}
