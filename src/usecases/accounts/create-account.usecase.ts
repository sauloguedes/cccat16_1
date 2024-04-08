import { AccountRepository } from "../../infra/repositories/accounts/account-repository";
import { validateCpf } from "../../validateCpf";
import crypto from "crypto";

export class CreateAccountUseCase {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(input: any): Promise<any> {
    const existingAccount = await this.accountRepository.findByEmail(
      input.email
    );
    if (existingAccount) throw new Error("Account already exists");
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/))
      throw new Error("Invalid name");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
    if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
    if (input.is_driver && !input.car_plate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Invalid car plate");
    await this.accountRepository.save({
      ...input,
      account_id: crypto.randomUUID(),
    });

    return {
      accountId: input.account_Id,
    };
  }
}
