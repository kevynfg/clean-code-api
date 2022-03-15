import { InsertOneResult } from "mongodb";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";
export class AccountMongoRepository {
  async add(accountData: AddAccountModel): Promise<InsertOneResult<Document>> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    return new Promise((resolve) => {
      resolve(result);
    });
  }
}
