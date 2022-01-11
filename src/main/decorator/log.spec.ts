import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
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
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const sut = new LogControllerDecorator(controllerStub);
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
