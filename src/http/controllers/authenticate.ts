import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/useCases/authenticate";
import { InvalidCredentialsError } from "@/useCases/errors/invalid-credentials.error";
import { makeAuthUseCase } from "@/useCases/factories/make-auth-use-case";

export async function authController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodyScheme = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = registerBodyScheme.parse(request.body);

  try {
    const authenticateUseCase = makeAuthUseCase();

    await authenticateUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}
