import { Box, Button } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

const posts = () => {
  return (
    <>
      <Head>
        <title>MigMS Admin</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <Link href={'/admin/dashboard/posts/create'}>
          <Button>Create post</Button>
        </Link>
      </Box>
    </>
  );
};
export default posts;
