import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const listRouter = createTRPCRouter({
    all: protectedProcedure
        .query(async ({ ctx }) => {
            const allLists = await prisma.list.findMany({
                where: {
                    creatorId: ctx.session.user.id
                }
            })
            console.log(allLists)
            if (allLists.length === 0) {
                console.log("creating a default list for the user")
                await prisma.list.create({
                    data: {
                        name: `${ctx.session.user.name || "user"}'s list`,
                        creatorId: ctx.session.user.id
                    }
                })
            } else {
                return allLists
            }
            return await prisma.list.findMany({
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
        }),

    deleteList: protectedProcedure
        .input(
            z.object({
                id: z.string()
            }).required()
        )
        .mutation(async ({ input }) => {
            await prisma.todo.deleteMany({
                where: {
                    listId: input.id
                }
            })
            return prisma.list.delete({
                where: {
                    id: input.id
                }
            })
        })
})
