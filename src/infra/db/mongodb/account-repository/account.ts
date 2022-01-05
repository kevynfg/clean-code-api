import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
export class AccountMongoRepository implements AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel> {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
}
