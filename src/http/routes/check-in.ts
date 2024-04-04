import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../utils/PrismaClient.js";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendee/:attendeeId/check-in",
    {
      schema: {
        params: z.object({
          attendeeId: z.string().transform(Number),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const checkIn = await prisma.checkIn.findFirst({
        where: {
          attendeeId: attendeeId,
        },
      });

      if (checkIn !== null) {
        return reply.status(400).send({
          message: "This attendee has already checked in",
        });
      }

      await prisma.checkIn.create({
        data: {
          attendeeId: attendeeId,
        },
      });

      return reply.status(201).send({
        message: "Check-in successful",
      });
    }
  );
}

