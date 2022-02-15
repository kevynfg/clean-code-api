import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdater } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adater";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account";
import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/log";
import { SignUpController } from "../../../presentation/controllers/signup/singup";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorator/log";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdater(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
