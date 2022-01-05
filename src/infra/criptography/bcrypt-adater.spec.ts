import bcrypt from "bcrypt";
import { BcryptAdater } from "./bcrypt-adater";

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const salt = 12;
    const sut = new BcryptAdater(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
});
