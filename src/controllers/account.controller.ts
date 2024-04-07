import { Request, Response, NextFunction } from "express";
import pgp from "pg-promise";
import crypto from "crypto";
import { validate } from "../validateCpf";

export default class AccountController {
  constructor() {}

  async signup(req: Request, res: Response, next: NextFunction) {
    let result;
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    try {
      const id = crypto.randomUUID();

      const [acc] = await connection.query(
        "select * from cccat16.account where email = $1",
        [req.body.email]
      );
      if (!acc) {
        if (req.body.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
          if (req.body.email.match(/^(.+)@(.+)$/)) {
            if (validate(req.body.cpf)) {
              if (req.body.isDriver) {
                if (req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
                  await connection.query(
                    "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
                    [
                      id,
                      req.body.name,
                      req.body.email,
                      req.body.cpf,
                      req.body.carPlate,
                      !!req.body.isPassenger,
                      !!req.body.isDriver,
                    ]
                  );

                  const obj = {
                    accountId: id,
                  };
                  result = obj;
                } else {
                  // invalid car plate
                  result = -5;
                }
              } else {
                await connection.query(
                  "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
                  [
                    id,
                    req.body.name,
                    req.body.email,
                    req.body.cpf,
                    req.body.carPlate,
                    !!req.body.isPassenger,
                    !!req.body.isDriver,
                  ]
                );

                const obj = {
                  accountId: id,
                };
                result = obj;
              }
            } else {
              // invalid cpf
              result = -1;
            }
          } else {
            // invalid email
            result = -2;
          }
        } else {
          // invalid name
          result = -3;
        }
      } else {
        // already exists
        result = -4;
      }
      if (typeof result === "number") {
        res.status(422).send(result + "");
      } else {
        res.json(result);
      }
    } finally {
      await connection.$pool.end();
    }
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
