import { Box, Stack, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { NextPage } from 'next';

import NavBar from '../components/All/NavBar';
import { trpc } from '../utils/trpc';
import Link from 'next/link';

const Store: NextPage = () => {
  const allProducts = trpc.useQuery(['public.getProducts']);

  if (allProducts.isLoading) {
    return <div>Loading... (Fix this later)</div>;
  }

  return (
    <>
      <Head>
        <title>MigMS Blog</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <NavBar />
        <Box p={3}>
          <Text>Store</Text>
          <Stack>
            {allProducts.data?.map((product) => (
              <Link
                href={`/product/${product.productId}`}
                key={product.productId}
              >
                <Box bg={'gray.200'} p={3} rounded={'lg'}>
                  <>
                    <Text fontSize={'2xl'}>{product.title}</Text>
                    {product.publishDate?.toDateString}
                    {product.author}
                  </>
                </Box>
              </Link>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
};
export default Store;
