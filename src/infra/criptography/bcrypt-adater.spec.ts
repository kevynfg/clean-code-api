import bcrypt from "bcrypt";
import { BcryptAdater } from "./bcrypt-adater";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdater => {
  return new BcryptAdater(salt);
};

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return a hash on success", async () => {
    const sut = makeSut();

    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash");
  });
});
