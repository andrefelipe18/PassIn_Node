import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../utils/PrismaClient.js";

export async function registerInEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees", //Rota
    {
      //Schema de validação
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const attendeeExists = await prisma.attendee.findFirst({
        where: {
          email,
          eventId,
        },
      });

      if (attendeeExists !== null) {
        return reply.status(400).send({
          message: "Attendee already registered",
        });
      }

      const [event, amountOfAttendees] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),

        prisma.attendee.count({
          where: {
            eventId,
          },
        }),
      ]);

      if (!event) {
        return reply.status(400).send({
          message: "Event not found",
        });
      }

      if (
        event.maximumAttendees &&
        amountOfAttendees >= event.maximumAttendees
      ) {
        return reply.status(400).send({
          message: "Event is full",
        });
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return reply.status(201).send({ attendeeId: attendee.id });
    }
  );
}

