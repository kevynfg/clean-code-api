import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  AddAccountModel,
  Validation,
  Authentication,
} from "./signup-controller-protocols";
import { MissingParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const requiredFields = ["name", "email", "password", "passwordConfirmation"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password,
      } as AddAccountModel);
      await this.authentication.auth({
        email,
        password,
      });
      return ok(account);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
