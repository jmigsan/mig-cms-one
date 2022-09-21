import { z } from 'zod';
import { createProtectedRouter } from './protected-router';

// Example router with queries that can only be hit if the user requesting is signed in
export const imageRouter = createProtectedRouter()
  .mutation('imageToDB', {
    input: z.object({
      imageKey: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.image.create({
        data: {
          imageKey: input.imageKey,
        },
      });
    },
  })
  .query('getImages', {
    async resolve({ ctx }) {
      return await ctx.prisma.image.findMany({});
    },
  })
  .mutation('delImageFromDB', {
    input: z.object({
      imageKey: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.image.delete({
        where: {
          imageKey: input.imageKey,
        },
      });
    },
  });
