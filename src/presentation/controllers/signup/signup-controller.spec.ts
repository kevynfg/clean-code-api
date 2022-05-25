import { SignUpController } from "./singup-controller";
import { MissingParamError } from "../../errors/missing-param-error";
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Authentication,
  AuthenticationModel,
  HttpRequest,
  Validation,
} from "./signup-controller-protocols";
import { ServerError } from "../../errors/server-error";
import { ok, serverError } from "../../helpers/http/http-helper";

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return "valid_token";
    }
  }
  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthenticationStub();
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
});

describe("SignUp Controller", () => {
  test("should add account with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = makeFakeRequest();
    sut.handle(httpRequest);
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
  });

  test("should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test("should return 200 if valid data provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.body).toEqual(new MissingParamError("any_field"));
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@email.com",
      password: "valid_password",
    });
  });
});
