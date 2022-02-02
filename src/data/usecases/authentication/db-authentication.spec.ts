import { AccountModel } from "../../../domain/models/account";
import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  email: "any_email@email.com",
  name: "any_name",
  password: "any_password",
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@email.com",
  password: "any_password",
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount();
      return Promise.resolve(account);
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return {
    loadAccountByEmailRepositoryStub,
    sut,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
