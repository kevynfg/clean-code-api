import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdater } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adater";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { SignUpController } from "../../../presentation/controllers/signup/singup-controller";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorator/log-controller-decorator";
import { makeSignUpValidation } from "./signup-validation-factory";

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
