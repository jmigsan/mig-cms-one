import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { NextPage } from 'next';

import NavBar from '../components/All/NavBar';

const Store: NextPage = () => {
  return (
    <>
      <Head>
        <title>MigMS Store</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <NavBar />
        store
      </Box>
    </>
  );
};
export default Store;
