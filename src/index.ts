import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import * as routes from './http/routes/index.js';

const app = fastify();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

//Routes
Object.values(routes).forEach(route => {
  app.register(route);
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });

