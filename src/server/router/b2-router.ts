import { createProtectedRouter } from './protected-router';

import S3 from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk';
import { z } from 'zod';

const ep = new AWS.Endpoint('s3.us-west-004.backblazeb2.com');

const b2 = new S3({
  // region: 'us-west-004', <- not sure if needed
  accessKeyId: process.env.BB_ACCESS_KEY,
  secretAccessKey: process.env.BB_SECRET_KEY,
  endpoint: ep,
});

// Example router with queries that can only be hit if the user requesting is signed in
export const b2Router = createProtectedRouter().query('uploadImage', {
  input: z.object({
    key: z.string(),
  }),
  async resolve({ ctx, input }) {
    if (ctx.session.user.id) {
      const userRole = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { role: true },
      });

      if (userRole?.role === 'ADMIN') {
        const signedUrl = b2.getSignedUrl('getObject', {
          Key: input.key,
          Bucket: 'mig-cms-one',
          Expires: 900, // S3 default is 900 seconds (15 minutes)
        });

        return signedUrl;
      }
    }
  },
});
