import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { appRoutes } from "./http/routes";

export const app = fastify();

app.register(appRoutes);
app.register(appRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error ",
      issues: error.format(),
    });
  }

  if (env.NODE_ENV === "dev") {
    console.error(error);
  } else {
    // TODO: here we should send log to tools like rollbar/dataDog
  }

  return reply.status(500).send({ message: "Internal server error" });
});
