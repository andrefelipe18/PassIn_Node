import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import generateSlug from "../../utils/generate-slug.js";
import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/PrismaClient.js";

export async function createEvent(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .post("/events", //Rota
    { //Schema de validação
      schema: { 
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            event: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => { //Handler
      const { title, details, maximumAttendees } = request.body;

      const slug = generateSlug(title);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      });

      if (eventWithSameSlug !== null) {
        return reply.status(400).send({
          message: "An event with the same title already exists",
        });
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      });

      return reply
        .status(201)
        .send({ message: "Event created successfully", event: event.id });
    }
  );
}

