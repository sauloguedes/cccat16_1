import { Request, Router, Response } from "express";
import AccountController from "../controllers/account.controller";

const accountRouter = Router();
const accountController = new AccountController();

accountRouter.post("/signup", accountController.signup);
accountRouter.get("/:id", accountController.getAccount);

export { accountRouter };
