import { Box, Button } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

const products = () => {
  return (
    <>
      <Head>
        <title>MigMS Admin</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <Link href={'/admin/dashboard/products/create'}>
          <Button>Create product</Button>
        </Link>
      </Box>
    </>
  );
};
export default products;
