import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createEvent } from "./http/routes/create-event.js";
import { registerInEvent } from "./http/routes/register-in-event.js";

const app = fastify();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

//Routes
app.register(createEvent);
app.register(registerInEvent);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });

