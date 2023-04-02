import { app } from "./app";

app
  .listen({
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 3333,
  })
  .then(() => {
    console.log("🚀 Server is running on http://localhost:3333");
  });
