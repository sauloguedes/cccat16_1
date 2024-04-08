import { Request, Response, NextFunction } from "express";
import pgp from "pg-promise";

import { CreateAccountUseCase } from "../usecases/accounts";
import { PostgresAdapter } from "../infra/databases";
import { PostgresAccountRepository } from "../infra/repositories/accounts/adapters/postgres-account-repository";

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
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    try {
      const [acc] = await connection.query(
        "select * from cccat16.account where email = $1",
        [req.body.email]
      );

      if (!acc) return res.status(404);

      return res.json(acc);
    } catch (error) {
      res.status(400).json(error);
    } finally {
      await connection.$pool.end();
    }
  }
}
