import type { NextPage } from 'next';
import Head from 'next/head';

import { Box, Text } from '@chakra-ui/react';
import Link from 'next/link';

const Admin: NextPage = () => {
  return (
    <>
      <Head>
        <title>MigMS Admin</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>admin</Box>
    </>
  );
};

export default Admin;
