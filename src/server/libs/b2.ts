import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

const ep = new AWS.Endpoint('s3.us-west-004.backblazeb2.com');

export const b2 = new S3({
  accessKeyId: process.env.BB_ACCESS_KEY,
  secretAccessKey: process.env.BB_SECRET_KEY,
  endpoint: ep,
});
