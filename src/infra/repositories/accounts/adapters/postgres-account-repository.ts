import { Account } from "../../../../domain/entities";
import DatabaseConnection from "../../../databases/database-connection";
import { AccountRepository } from "../account-repository";

export class PostgresAccountRepository implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async findById(id: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from cccat16.account where account_id = $1",
      [id]
    );

    return account;
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from cccat16.account where email = $1",
      [email]
    );

    return account;
  }

  async save(account: Account): Promise<void> {
    const result = await this.connection.query(
      "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.account_id,
        account.name,
        account.email,
        account.cpf,
        account.car_plate,
        !!account.is_passenger,
        !!account.is_driver,
      ]
    );

    return result;
  }
}
