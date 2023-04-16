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
            console.log(input)

            await prisma.todo.create({
                data: {
                    title: input.title,
                    authorId: ctx.session.user.id,
                }
            });
        }),

    getTodos: protectedProcedure
        .query(async ({ ctx }) => {



            return await prisma.todo.findMany({
                where: {
                    authorId: ctx.session.user.id,
                }
            });
        }),
});
