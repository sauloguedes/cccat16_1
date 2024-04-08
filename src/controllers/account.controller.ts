import { Request, Response, NextFunction } from "express";

import { CreateAccountUseCase } from "../usecases/accounts";
import { PostgresAdapter } from "../infra/databases";
import { PostgresAccountRepository } from "../infra/repositories/accounts/adapters/postgres-account-repository";
import { GetAccountUseCase } from "../usecases/accounts/get-account.usecase";

export default class AccountController {
  constructor() {}

  async signup(req: Request, res: Response, next: NextFunction) {
    const { name, email, cpf, carPlate, isPassenger, isDriver } = req.body;
    const connection = new PostgresAdapter();
    const account = new PostgresAccountRepository(connection);
    const userCase = new CreateAccountUseCase(account);

    userCase
      .execute({
        name,
        email,
        cpf,
        carPlate,
        isPassenger,
        isDriver,
      })
      .then((result) => res.status(201).json(result))
      .catch(next)
      .finally(() => connection.close());
  }

  async getAccount(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const connection = new PostgresAdapter();
    const account = new PostgresAccountRepository(connection);
    const userCase = new GetAccountUseCase(account);

    userCase
      .execute(id)
      .then((result) => res.status(200).json(result))
      .catch(next)
      .finally(() => connection.close());
  }
}
