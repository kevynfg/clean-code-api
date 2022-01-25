import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  AddAccountModel,
  Validation,
} from "./signup-protocols";
import { badRequest, serverError, ok } from "../../helpers/http-helper";
import { MissingParamError } from "../../errors/";

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;
  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
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
      return ok(account);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
