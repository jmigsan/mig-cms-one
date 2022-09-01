import { createProtectedRouter } from './protected-router';
import { z } from 'zod';

import { nanoid } from '../libs/nanoid';
import { b2 } from '../libs/b2';

export const b2Router = createProtectedRouter()
  .mutation('getSignedPut', {
    input: z.object({
      fileType: z.string(),
    }),
    async resolve({ ctx, input }) {
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

      const fileId = nanoid();
      const fileExtension = input.fileType.split('%2F')[1];
      const key = `${fileId}.${fileExtension}`;

      const b2Params = {
        Bucket: process.env.BB_BUCKET_NAME,
        Key: key,
        Expires: 60,
        ContentType: `image/${fileExtension}`,
      };

      const uploadUrl = await b2.getSignedUrl('putObject', b2Params);

      return { key, uploadUrl };
    },
  })
  .mutation('b2Tom', {
    input: z.object({
      fileType: z.string(),
    }),
    async resolve({ ctx, input }) {
      const fileExtension = input.fileType.split('%2F')[1];

      const fileId = nanoid();
      const key = `${fileId}.${fileExtension}`;

      const b2Params = {
        Bucket: process.env.BB_BUCKET_NAME,
        Key: key,
        Expires: 60,
        ContentType: `image/${fileExtension}`,
      };

      const uploadUrl = await b2.getSignedUrl('putObject', b2Params);

      return { key, uploadUrl };
    },
  });
