import { prisma } from "@/lib/prisma";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { IUserRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistError } from "./errors/user-already-exist-error";

interface RegisterUserCase {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({ name, email, password }: RegisterUserCase) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistError();
    }

    await this.usersRepository.create({ name, email, password_hash });
  }
}
