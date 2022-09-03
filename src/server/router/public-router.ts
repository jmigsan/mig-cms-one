import { createRouter } from './context';
import { z } from 'zod';

export const publicRouter = createRouter().query('getPost', {
  input: z.object({
    postId: z.string(),
  }),
  async resolve({ ctx, input }) {
    return await ctx.prisma.post.findFirst({
      where: { postId: input.postId },
    });
  },
});
