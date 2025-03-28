
// Här sätts alla "endpoints" för tasks upp.
// 1. tasksRouter: definierar en router för tasks och deras relaterade endpoints.
// 2. taskValidation: definierar valideringsregler för tasks indata.
// 3. handleValidationErrors: en funktion för att hantera valideringsfel och skicka tillbaka ett svar med felmeddelanden.


import { Router, NextFunction, Request, Response } from "express";
import { readTasks } from "./tasksFunctions";
import { validationResult, body } from "express-validator";
import { writeTask } from "./tasksFunctions";
import { updateIsCompleted } from "./tasksFunctions";
import { deleteTask } from "./tasksFunctions";
import { updateAssignedUser } from "./tasksFunctions";


export const tasksRouter = Router();

const taskValidation = [
    body("username").isString(),
    body("role").isString(),
    body("description").isString(),
    body("dueDate").isString(),
    body("id").isNumeric(),
    body("isComplete").isBoolean(),
    body("timeStamp").isString(),

];

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): boolean => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return true;
    }
    return false;
};

// läser alla tasks

tasksRouter.get(
    "/tasks/:username",
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { username } = req.params;
            const tasks = await readTasks();
            const filteredTasks = tasks.tasks.filter(
                (task: any) => task.username === username || task.username === 'not assigned'
            );
            res.json(filteredTasks);
        } catch (error) {
            console.error("Error reading tasks:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

tasksRouter.get("/tasks", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const tasks = await readTasks();
        res.json(tasks.tasks);
    } catch (error) {
        console.error("Error reading tasks:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

// postar en ny task

tasksRouter.post(
    "/new-task",
    taskValidation,
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(handleValidationErrors(req, res, next)) return;
        try {
            const task = req.body;
            await writeTask(task);
            res.json(`new task added, ${task}`);
        } catch (error) {
            console.error("Error writing task:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

// uppdaterar isComplete

tasksRouter.patch(
    "/tasks/:taskID",
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { taskID } = req.params;
            const { isComplete } = req.body;
            const taskIDAsNumber = parseInt(taskID, 10);

            if (isNaN(taskIDAsNumber)) {
                return res.status(400).json({ message: "Invalid taskID" });
            }

            await updateIsCompleted(taskIDAsNumber, isComplete);
            // console.log(`Task ID ${taskIDAsNumber} updated with status: ${isComplete}`);
            return res.json({
                message: `Task is now ${isComplete ? "complete" : "incomplete"}`,
            });
        } catch (error) {
            console.error("Error updating task:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

tasksRouter.delete('/tasks/:taskID', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { taskID } = req.params;
        const taskIDAsNumber = parseInt(taskID, 10);

        if (isNaN(taskIDAsNumber)) {
            return res.status(400).json({ message: 'Invalid taskID' });
        }

        await deleteTask(taskIDAsNumber);
        return res.json({ message: `Task with ID ${taskIDAsNumber} deleted` });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

tasksRouter.patch('/assign-task/:taskID', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { taskID } = req.params;
        const { username } = req.body;
        const taskIDAsNumber = parseInt(taskID, 10);

        if (isNaN(taskIDAsNumber)) {
            return res.status(400).json({ message: 'Invalid taskID' });
        }

        await updateAssignedUser(taskIDAsNumber, username);
        return res.json({ message: `Task with ID ${taskIDAsNumber} assigned to ${username}` });
    } catch (error) {
        console.error('Error assigning user to task:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

tasksRouter.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});
