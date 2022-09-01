import { createProtectedRouter } from './protected-router';
import { z } from 'zod';

import { nanoid } from '../libs/nanoid';
import { b2 } from '../libs/b2';
import AWS from 'aws-sdk';

export const b2Router = createProtectedRouter()
  .mutation('createPresignedPost', {
    async resolve({ ctx }) {
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

      const signedUrl = b2.getSignedUrl('putObject', {
        Bucket: process.env.BB_BUCKET_NAME,
        Key: fileId,
        Expires: 300,
        ContentType: 'image/jpeg',
      });

      // const signedUrl = b2.createPresignedPost({
      //   Bucket: 'mig-cms-one',
      //   Fields: {
      //     key: fileId,
      //   },
      //   Conditions: [
      //     ['content-length-range', 0, 67108864], // content length restrictions: 0-64MB
      //     ['starts-with', '$Content-Type', 'image/'], // content type restriction
      //     // ['eq', '$x-amz-meta-userid', ctx.session.user.id], // tag with userid <- the user can see this!
      //   ],
      // });

      // // signedUrl.fields['x-amz-meta-userid'] = ctx.session.user.id; // Don't forget to add this field too

      console.log(fileId, signedUrl);

      return { fileName: fileId, preSignedUrl: signedUrl };
    },
  })
  .mutation('uploadToB2', {
    async resolve({ ctx }) {},
  })
  .mutation('b2Test', {
    input: z.object({
      file: z.record(z.any()),
    }),
    async resolve({ ctx, input }) {
      var upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: process.env.BB_BUCKET_NAME!,
          Key: nanoid(),
          Body: input.file,
        },
      });
      return upload;
    },
  });
