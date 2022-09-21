import { createProtectedRouter } from './protected-router';
import { z } from 'zod';

// Example router with queries that can only be hit if the user requesting is signed in
export const productRouter = createProtectedRouter()
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
  .query('getProducts', {
    async resolve({ ctx }) {
      return await ctx.prisma.product.findMany();
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
  .mutation('uploadProduct', {
    input: z
      .object({
        title: z.string(),
        published: z.boolean(),
        content: z.string(),
        publishDate: z.date().nullish(),
        author: z.string().nullish(),
        coverImages: z.string().array().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      // authorisation begin
      if (!ctx.session.user.id) {
        throw new Error('please sign in');
      }

      if (ctx.session.user.role !== 'ADMIN') {
        throw new Error('you are not authorised');
      }
      // authorisation end

      return await ctx.prisma.product.create({
        data: {
          title: input?.title || 'no title',
          published: input?.published || false,
          content: input?.content || '<p>no content</p>',
          publishDate: input?.publishDate,
          author: input?.author || 'Anonymous',
          coverImages: input?.coverImages || [],
        },
      });
    },
  })
  .mutation('updateProduct', {
    input: z
      .object({
        productId: z.string(),
        title: z.string(),
        published: z.boolean(),
        content: z.string(),
        publishDate: z.date().nullish(),
        author: z.string().nullish(),
        coverImages: z.string().array().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      // authorisation begin
      if (!ctx.session.user.id) {
        throw new Error('please sign in');
      }

      if (ctx.session.user.role !== 'ADMIN') {
        throw new Error('you are not authorised');
      }
      // authorisation end

      return await ctx.prisma.product.update({
        where: {
          productId: input?.productId,
        },
        data: {
          title: input?.title || 'no title',
          published: input?.published || false,
          content: input?.content || '<p>no content</p>',
          publishDate: input?.publishDate,
          author: input?.author || 'Anonymous',
          coverImages: input?.coverImages || [],
        },
      });
    },
  });
