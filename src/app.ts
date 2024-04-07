import express from "express";

import { accountRouter } from "./routes";

const app = express();
app.use(express.json());

app.use("/accounts", accountRouter);

export default app;
