import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { SignUpController } from "../../presentation/controllers/signup/singup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { BcryptAdater } from "../../infra/criptography/bcrypt-adater";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { Controller } from "../../presentation/protocols";
import { LogControllerDecorator } from "../decorator/log";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdater(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    addAccount
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
