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
import meRouter from "@/routes/users";
import leaderboardRouter from "@/routes/leaderboard";

import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(env.sessionSecret));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(authMiddleware);

app.use('/auth', authRouter);
app.use("/subjects", subjectRouter);
app.use("/quiz", quizRouter);
app.use("/me", meRouter);
app.use("/leaderboard", leaderboardRouter);

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`)
})