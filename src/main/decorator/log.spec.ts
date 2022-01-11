import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return {
    controllerStub,
    sut,
    logErrorRepositoryStub,
  };
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {
          name: "Kevyn",
        },
      } as HttpResponse;
      return Promise.resolve(httpResponse);
    }
  }
  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new LogErrorRepositoryStub();
};

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        email: "valid_email@email.com",
        name: "valid_name",
        password: "valid_password",
        passwordConfirmation: "valid_passwordConfirmation",
      },
    } as HttpRequest;
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "valid_email@email.com",
        name: "valid_name",
        password: "valid_password",
        passwordConfirmation: "valid_passwordConfirmation",
      },
    } as HttpRequest;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: "Kevyn",
      },
    });
  });

  test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const error = serverError(fakeError);
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(Promise.resolve(error));

    const logSpy = spyOn(logErrorRepositoryStub, "log");
    const httpRequest = {
      body: {
        email: "valid_email@email.com",
        name: "valid_name",
        password: "valid_password",
        passwordConfirmation: "valid_passwordConfirmation",
      },
    } as HttpRequest;
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenLastCalledWith("any_stack");
  });
});
