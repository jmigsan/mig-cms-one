import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

const ep = new AWS.Endpoint(process.env.BB_ENDPOINT!);

export const b2 = new S3({
  accessKeyId: process.env.BB_ACCESS_KEY,
  secretAccessKey: process.env.BB_SECRET_KEY,
  endpoint: ep,
  signatureVersion: 'v4',
});
