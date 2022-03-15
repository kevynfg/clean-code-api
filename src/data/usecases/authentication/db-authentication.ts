import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../protocols/db/account/update-access-token-repository";
import {
  Authentication,
  HashComparer,
  Encrypter,
  AuthenticationModel,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly encrypter: Encrypter;
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      const isValid = await this.hashComparer.compare(
        authentication.password,
        account.password
      );
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.update(account.id, accessToken);
        return accessToken;
      }
    }
    return null;
  }
}
