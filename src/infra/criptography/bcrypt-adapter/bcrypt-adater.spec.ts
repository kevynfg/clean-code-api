import bcrypt from "bcrypt";
import { BcryptAdater } from "./bcrypt-adater";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdater => {
  return new BcryptAdater(salt);
};

describe("Bcrypt Adapter", () => {
  test("Should call hash with correct value", async () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return a valid hash on success", async () => {
    const sut = makeSut();

    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash");
  });

  test("Should call compare with correct value", async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });

  test("Should return true when compare succeeds", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(true);
  });
});
