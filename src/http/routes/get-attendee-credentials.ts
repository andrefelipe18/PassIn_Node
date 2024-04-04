import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../utils/PrismaClient.js";

export async function getAttendeeCredentials(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendee/:attendeeId/credentials",
    {
      schema: {
        params: z.object({
          attendeeId: z.string().transform(Number),
        }),
        response: {
          200: z.object({
            credential: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInUrl: z.string().url(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: attendeeId,
        },
      });

      if (attendee === null) {
        return reply.status(404).send({
          message: "Attendee not found",
        });
      }
      const baseURL = `${request.protocol}://${request.hostname}`;

      const checkInUrl = new URL(`/attendees/R${attendeeId}/check-in`, baseURL);

      return reply.status(200).send({
        credential: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInUrl: checkInUrl.toString(),
        }
      });
    }
  );
}

