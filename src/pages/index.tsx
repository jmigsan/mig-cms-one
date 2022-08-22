import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

import { Box, Text } from '@chakra-ui/react';
import NavBar from '../components/All/NavBar';
import Link from 'next/link';

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery([
    'example.hello',
    { text: 'from tRPC' },
  ]);

  return (
    <>
      <Head>
        <title>MigMS</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <NavBar />
        <Text fontSize={'5xl'} px={7} py={3}>
          <Link href={'/store'}>Store</Link>
        </Text>
        <Text fontSize={'5xl'} px={7} py={3}>
          <Link href={'/blog'}>Blog</Link>
        </Text>
      </Box>
    </>
  );
};

export default Home;
