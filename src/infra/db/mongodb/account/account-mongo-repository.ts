import { InsertOneResult, ObjectId } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository {
  async add(accountData: AddAccountModel): Promise<InsertOneResult<Document>> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return new Promise((resolve) => {
      resolve(result)
    })
  }
  async load(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = (await accountCollection.findOne({ email })) as any as AccountModel
    return new Promise((resolve) => {
      resolve(account)
    })
  }
  async update(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { token } })
  }
}
