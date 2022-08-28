import { createProtectedRouter } from './protected-router';
import { z } from 'zod';

// Example router with queries that can only be hit if the user requesting is signed in
export const postRouter = createProtectedRouter()
  .query('getSession', {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query('getSecretMessage', {
    resolve({ ctx }) {
      return 'He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.';
    },
  })
  .mutation('uploadPost', {
    input: z
      .object({
        title: z.string(),
        published: z.boolean(),
        content: z.string(),
        publishDate: z.date().nullish(),
        author: z.string().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.post.create({
        data: {
          title: input?.title || 'no title',
          published: input?.published || false,
          content: input?.content || '<p>no content</p>',
          publishDate: input?.publishDate,
          author: input?.author || 'Anonymous',
        },
      });
    },
  });
