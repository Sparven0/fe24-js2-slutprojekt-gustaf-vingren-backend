
// Denna filen innehåller funktioner som hanterar ändringar av tasks.json filen.

// 1. readTasks: läser tasks.json filen och returnerar dess innehåll som ett objekt. Om filen är tom returneras en tom array.
// 2. writeTask: skriver en ny task till tasks.json filen. Om filen inte finns skapas den.
// 3. updateIsCompleted: uppdaterar en tasks isComplete status i tasks.json filen.
// 4. deleteTask: tar bort en task från tasks.json filen baserat på dess ID.
// 5. updateAssignedUser: uppdaterar den tilldelade användaren för en task i tasks.json filen.
// 6. handleFileError: hanterar fel som uppstår vid läsning eller skrivning av tasks.json filen.


import fs from 'fs/promises';
const path = './src/tasksDB.json';

type Task = {
    username: string;
    description: string;
    dueDate: string;
    isComplete: boolean;
    id: number;
    timeStamp: string;
}

const handleFileError = (e: any, operation: string): void => {
    console.log(`Error ${operation} task file`, e);
    throw e;
};

export async function readTasks(): Promise<any> {
    try {
        const rawData = await fs.readFile(path, 'utf-8');
        return rawData ? JSON.parse(rawData) : { tasks: [] };
    } catch (e) {
        handleFileError(e, 'reading');
    }
}

export async function writeTask(task: Task): Promise<any> {
    try {
        const data = await readTasks();
        const tasks = data.tasks || [];
        tasks.push(task);
        await fs.writeFile(path, JSON.stringify({ tasks }, null, 2));
    } catch (e) {
        handleFileError(e, 'writing');
    }
}

export async function updateIsCompleted(id: number, isComplete: boolean): Promise<any> {
    try {
        const data = await readTasks();
        const tasks = data.tasks || [];
        const updatedTasks = tasks.map((task: Task) => {
            if (task.id === id) {
                task.isComplete = isComplete;
            }
            return task;
        });
        await fs.writeFile(path, JSON.stringify({ tasks: updatedTasks }, null, 2));
        console.log(`Task with ID ${id} is now ${isComplete ? 'complete' : 'incomplete'}`);
    } catch (e) {
        handleFileError(e, 'updating');
    }
}

export async function deleteTask(id: number): Promise<any> {
    try {
        const data = await readTasks();
        const tasks = data.tasks || [];
        const updatedTasks = tasks.filter((task: Task) => task.id !== id);
        await fs.writeFile(path, JSON.stringify({ tasks: updatedTasks }, null, 2));
        console.log(`Task with ID ${id} has been deleted`);
    } catch (e) {
        handleFileError(e, 'deleting');
    }
}

export async function updateAssignedUser(id: number, username: string): Promise<any> {
    try {
        const data = await readTasks();
        const tasks = data.tasks || [];
        const updatedTasks = tasks.map((task: Task) => {
            if (task.id === id) {
                task.username = username;
            }
            return task;
        });
        await fs.writeFile(path, JSON.stringify({ tasks: updatedTasks }, null, 2));
        console.log(`Username of task with ID ${id} has been updated to ${username}`);
    } catch (e) {
        handleFileError(e, 'updating assigned user');
    }
}
