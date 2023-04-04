import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { describe, expect, it, beforeEach } from "vitest";
import { UserAlreadyExistError } from "./errors/user-already-exist-error";
import { RegisterUseCase } from "./register";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able create user ", async () => {
    const { user } = await sut.execute({
      name: "fulano",
      email: "fulano@test.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "fulano",
      email: "fulano@test.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not to be possible to register with the same email", async () => {
    await sut.execute({
      name: "fulano",
      email: "fulano@test.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "fulano",
        email: "fulano@test.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
