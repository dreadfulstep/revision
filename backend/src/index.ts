import "tsconfig-paths/register";

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import env from "@/utils/env";

import authRouter from "@/routes/auth";
import userRouter from "@/routes/users"
import subjectRouter from "@/routes/subjects";
import quizRouter from "@/routes/quiz";

import { authMiddleware } from "./middleware/auth";
import { generateQuiz } from "./services/quiz.service";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(env.sessionSecret));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(authMiddleware);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/subjects', subjectRouter);
app.use('/quiz', quizRouter);

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`)
})