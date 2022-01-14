import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import { EmailValidator, HttpRequest } from "../signup/signup-protocols";
import { LoginController } from "./login";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return "valid_token";
    }
  }
  return new AuthenticationStub();
};

interface sutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthenticationStub();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

const makeFakeLoginRequest = (): HttpRequest => ({
  body: {
    email: "any_email@email.com",
    password: "valid_password",
  },
});

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "valid_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should call email EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const emailSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = makeFakeLoginRequest();
    await sut.handle(httpRequest);
    expect(emailSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = makeFakeLoginRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeLoginRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(makeFakeLoginRequest());
    expect(authSpy).toHaveBeenCalledWith(
      "any_email@email.com",
      "valid_password"
    );
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.handle(makeFakeLoginRequest());
    expect(httpResponse).toEqual(unauthorized());
  });
});
