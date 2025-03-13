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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksRouter = void 0;
const express_1 = require("express");
const tasksFunctions_1 = require("./tasksFunctions");
const express_validator_1 = require("express-validator");
const tasksFunctions_2 = require("./tasksFunctions");
const tasksFunctions_3 = require("./tasksFunctions");
const tasksFunctions_4 = require("./tasksFunctions");
const tasksFunctions_5 = require("./tasksFunctions");
exports.tasksRouter = (0, express_1.Router)();
const taskValidation = [
    (0, express_validator_1.body)("username").isString(),
    (0, express_validator_1.body)("role").isString(),
    (0, express_validator_1.body)("description").isString(),
    (0, express_validator_1.body)("dueDate").isString(),
    (0, express_validator_1.body)("id").isNumeric(),
    (0, express_validator_1.body)("isComplete").isBoolean(),
    (0, express_validator_1.body)("timeStamp").isString(),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return true;
    }
    return false;
};
// läser alla tasks
exports.tasksRouter.get("/tasks/:username", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const tasks = yield (0, tasksFunctions_1.readTasks)();
        const filteredTasks = tasks.tasks.filter((task) => task.username === username || task.username === 'not assigned');
        res.json(filteredTasks);
    }
    catch (error) {
        console.error("Error reading tasks:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.tasksRouter.get("/tasks", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, tasksFunctions_1.readTasks)();
        res.json(tasks.tasks);
    }
    catch (error) {
        console.error("Error reading tasks:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
// postar en ny task
exports.tasksRouter.post("/new-task", taskValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (handleValidationErrors(req, res, next))
        return;
    try {
        const task = req.body;
        yield (0, tasksFunctions_2.writeTask)(task);
        res.json(`new task added, ${task}`);
    }
    catch (error) {
        console.error("Error writing task:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
// uppdaterar isComplete
exports.tasksRouter.patch("/tasks/:taskID", taskValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (handleValidationErrors(req, res, next))
        return;
    try {
        const { taskID } = req.params;
        const { isComplete } = req.body;
        const taskIDAsNumber = parseInt(taskID, 10);
        if (isNaN(taskIDAsNumber)) {
            return res.status(400).json({ message: "Invalid taskID" });
        }
        yield (0, tasksFunctions_3.updateIsCompleted)(taskIDAsNumber, isComplete);
        // console.log(`Task ID ${taskIDAsNumber} updated with status: ${isComplete}`);
        return res.json({
            message: `Task is now ${isComplete ? "complete" : "incomplete"}`,
        });
    }
    catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.tasksRouter.delete('/tasks/:taskID', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskID } = req.params;
        const taskIDAsNumber = parseInt(taskID, 10);
        if (isNaN(taskIDAsNumber)) {
            return res.status(400).json({ message: 'Invalid taskID' });
        }
        yield (0, tasksFunctions_4.deleteTask)(taskIDAsNumber);
        return res.json({ message: `Task with ID ${taskIDAsNumber} deleted` });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.tasksRouter.patch('/assign-task/:taskID', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskID } = req.params;
        const { username } = req.body;
        const taskIDAsNumber = parseInt(taskID, 10);
        if (isNaN(taskIDAsNumber)) {
            return res.status(400).json({ message: 'Invalid taskID' });
        }
        yield (0, tasksFunctions_5.updateAssignedUser)(taskIDAsNumber, username);
        return res.json({ message: `Task with ID ${taskIDAsNumber} assigned to ${username}` });
    }
    catch (error) {
        console.error('Error assigning user to task:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.tasksRouter.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});
