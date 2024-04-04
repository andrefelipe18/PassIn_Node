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
        response: {},
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

      return reply.status(200).send({
        attendee,
      });
    }
  );
}

