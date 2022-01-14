import { MissingParamError, InvalidParamError } from "../../errors";
import {
  badRequest,
  unauthorized,
  serverError,
} from "../../helpers/http-helper";
import {
  Controller,
  EmailValidator,
  Authentication,
  HttpRequest,
  HttpResponse,
} from "./login-protocols";

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;
  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { password, email } = httpRequest.body;

      if (!email) {
        return badRequest(new MissingParamError("email"));
      }
      if (!password) {
        return badRequest(new MissingParamError("password"));
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
