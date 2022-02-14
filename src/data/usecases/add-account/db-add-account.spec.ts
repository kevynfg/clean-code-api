import {
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
  };
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

describe("DbAddAccount Usecase", () => {
  test("Should call Hasher with correct password", async () => {
    const { hasherStub, sut } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    const accountData = makeFakeAccountData();
    await sut.add(accountData);
    expect(hasherSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Should throw if Hasher throws", async () => {
    const { hasherStub, sut } = makeSut();
    jest.spyOn(hasherStub, "hash").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );
    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should call addAccountRepository with correct values", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = makeFakeAccountData();
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const accountData = makeFakeAccountData();
    const account = await sut.add(accountData);
    expect(account).toEqual(makeFakeAccount());
  });
});
