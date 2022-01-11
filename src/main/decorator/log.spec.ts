import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    controllerStub,
    sut,
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
});
