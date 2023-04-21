import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const listRouter = createTRPCRouter({
    all: protectedProcedure
        .query(({ ctx }) => {
            return prisma.list.findMany({
                where: {
                    creatorId: ctx.session.user.id
                }
            })
        }),

    addList: protectedProcedure
        .input(
            z.object({
                name: z.string()
            }).required()
        )
        .mutation(async ({ input, ctx }) => {
            return await prisma.list.create({
                data: {
                    name: input.name,
                    creatorId: ctx.session.user.id,
                }
            })
        })
})
