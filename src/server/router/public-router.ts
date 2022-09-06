import { createRouter } from './context';
import { z } from 'zod';

export const publicRouter = createRouter()
  .query('getPost', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.post.findFirst({
        where: { postId: input.postId },
      });
    },
  })
  .query('getPosts', {
    async resolve({ ctx }) {
      return await ctx.prisma.post.findMany({
        where: { published: true },
      });
    },
  })
  .query('getProduct', {
    input: z.object({
      productId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.product.findFirst({
        where: { productId: input.productId },
      });
    },
  })
  .query('getProducts', {
    async resolve({ ctx }) {
      return await ctx.prisma.product.findMany({
        where: { published: true },
      });
    },
  });
