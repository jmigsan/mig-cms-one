import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { NextPage } from 'next';

import NavBar from '../components/All/NavBar';

const Blog: NextPage = () => {
  return (
    <>
      <Head>
        <title>MigMS Blog</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <NavBar />
        blog
      </Box>
    </>
  );
};
export default Blog;
