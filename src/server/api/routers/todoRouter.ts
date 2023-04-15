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
        .mutation(async ({ input }) => {
            await prisma.todo.create({
                data: {
                    title: input.title
                }
            });
        }),

    getTodos: protectedProcedure.query(async () => {
        return await prisma.todo.findMany();
    }),
});
