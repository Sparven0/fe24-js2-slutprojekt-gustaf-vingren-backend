import express from "express";
import { membersRouter } from './membersRouter';
import { tasksRouter } from "./tasksRouter";
import cors from 'cors';
const server = express();
server.use(cors());

server.use(express.json());
server.use(tasksRouter)
server.use(membersRouter)


server.listen(3000, () => {
    console.log("Server is running on port 3000");
    });

