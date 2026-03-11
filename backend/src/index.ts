import "tsconfig-paths/register";

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import env from "@/utils/env";

import authRouter from "@/routes/auth";
import userRouter from "@/routes/users"
import subjectRouter from "@/routes/subjects";
import quizRouter from "@/routes/quiz";

import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(env.sessionSecret));

app.use(authMiddleware);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/subjects', subjectRouter);
app.use('/quiz', quizRouter);

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`)
})