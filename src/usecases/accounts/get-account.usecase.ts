import { AccountRepository } from "../../infra/repositories/accounts/account-repository";

export class GetAccountUseCase {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(account_id: string): Promise<any> {
    const account = await this.accountRepository.findById(account_id);
    if (!account) throw new Error("Account does not exists");

    return account;
  }
}
