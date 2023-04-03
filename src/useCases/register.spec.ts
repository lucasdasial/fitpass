import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";
import { describe, expect, test, it } from "vitest";
import { UserAlreadyExistError } from "./errors/user-already-exist-error";
import { RegisterUseCase } from "./register";

describe("Register Use Case", () => {
  it("should be able create user ", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "fulano",
      email: "fulano@test.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "fulano",
      email: "fulano@test.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not to be possible to register with the same email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      name: "fulano",
      email: "fulano@test.com",
      password: "123456",
    });

    expect(() =>
      registerUseCase.execute({
        name: "fulano",
        email: "fulano@test.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
