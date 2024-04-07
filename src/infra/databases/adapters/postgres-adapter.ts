import pgp from "pg-promise";
import DatabaseConnection from "../database-connection";

export class PostgresAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  }

  query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<any> {
    return this.connection.$pool.end();
  }
}
