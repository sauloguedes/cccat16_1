import { Account } from "../../../domain/entities";

export interface AccountRepository {
  findByEmail(email: string): Promise<Account | undefined>;
  save(account: Account): Promise<void>;
}
