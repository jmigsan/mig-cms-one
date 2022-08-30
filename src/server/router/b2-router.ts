import { createProtectedRouter } from './protected-router';

import S3 from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk';

const ep = new AWS.Endpoint('s3.us-west-004.backblazeb2.com');

const b2 = new S3({
  // region: 'us-west-004', <- not sure if needed
  accessKeyId: process.env.BB_ACCESS_KEY,
  secretAccessKey: process.env.BB_SECRET_KEY,
  endpoint: ep,
});

// Example router with queries that can only be hit if the user requesting is signed in
export const b2Router = createProtectedRouter().query('uploadImage', {
  async resolve({ ctx }) {
    const signedUrl = s3.getSignedUrl('getObject', {
      Key: key,
      Bucket: bucket,
      Expires: expires || 900, // S3 default is 900 seconds (15 minutes)
    });

    return signedUrl;
  },
});
