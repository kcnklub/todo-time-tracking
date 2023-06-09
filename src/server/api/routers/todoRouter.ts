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
                listId: z.string(),
            }).required()
        )
        .mutation(async ({ input, ctx }) => {
            return await prisma.todo.create({
                data: {
                    title: input.title,
                    authorId: ctx.session.user.id,
                    listId: input.listId
                }
            });
        }),

    all: protectedProcedure
        .input(
            z.object({
                listId: z.string()
            }).required()
        )
        .query(({ input, ctx }) => {
            return prisma.todo.findMany({
                where: {
                    listId: input.listId,
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

    editTodo: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                data: z.object({
                    completed: z.boolean().optional(),
                    title: z.string().optional()
                })
            })
        )
        .mutation(({ input }) => {
            const { id, data } = input;
            return prisma.todo.update({
                where: { id },
                data,
            })
        })
}); 
