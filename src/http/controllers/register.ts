import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcryptjs";
import { registerUseCase } from "@/useCases/register";

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodyScheme = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodyScheme.parse(request.body);

  try {
    await registerUseCase({
      name,
      email,
      password,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
