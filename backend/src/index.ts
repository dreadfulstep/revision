import "tsconfig-paths/register";

import express from "express";
import bodyParser from "body-parser";

import env from "@/utils/env";

import authRouter from "@/routes/auth";

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRouter);

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`)
})