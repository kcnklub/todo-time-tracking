import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const todoRouter = createTRPCRouter({
    addTodo: protectedProcedure
        .input(
            z.object({
                title: z.string(),
            }).required()
        )
        .mutation(async ({ input, ctx }) => {
            return await prisma.todo.create({
                data: {
                    title: input.title,
                    authorId: ctx.session.user.id,
                }
            });
        }),

    all: protectedProcedure
        .query(({ ctx }) => {
            return prisma.todo.findMany({
                where: {
                    authorId: ctx.session.user.id,
                }
            });
        }),

    deleteTodo: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }).required()
        )
        .mutation(async ({ input }) => {
            await prisma.todo.delete({
                where: {
                    id: input.id,
                }
            });
        }),
}); 
