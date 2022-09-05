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
  .query('getPosts', {
    async resolve({ ctx }) {
      return await ctx.prisma.post.findMany();
    },
  })
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
      // authorisation begin
      if (!ctx.session.user.id) {
        throw new Error('please sign in');
      }

      const userRole = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { role: true },
      });

      if (userRole?.role !== 'ADMIN') {
        throw new Error('you are not authorised');
      }
      // authorisation end

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
  })
  .mutation('updatePost', {
    input: z
      .object({
        postId: z.string(),
        title: z.string(),
        published: z.boolean(),
        content: z.string(),
        publishDate: z.date().nullish(),
        author: z.string().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      // authorisation begin
      if (!ctx.session.user.id) {
        throw new Error('please sign in');
      }

      const userRole = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { role: true },
      });

      if (userRole?.role !== 'ADMIN') {
        throw new Error('you are not authorised');
      }
      // authorisation end

      return await ctx.prisma.post.update({
        where: {
          postId: input?.postId,
        },
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
