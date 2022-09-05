import dynamic from 'next/dynamic';

import { Box, Button, Center, Spinner, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import UnauthorisedAdminPage from '../../../components/Admin/PagesNoSSR/UnauthorisedAdminPage';
import { trpc } from '../../../utils/trpc';
import { useSession } from 'next-auth/react';
import AdminNavBar from '../../../components/Admin/AdminNavBar';

const products = () => {
  const allProducts = trpc.useQuery(['product.getProducts']);

  // page auth begin
  const role = trpc.useQuery(['user.getRole']);
  const { data: session } = useSession();

  if (!session) {
    return <UnauthorisedAdminPage />;
  }

  if (!role.data) {
    return (
      <Center pt={6}>
        <Spinner />
      </Center>
    );
  }

  if (role.data !== 'ADMIN') {
    return <UnauthorisedAdminPage />;
  }
  // page auth end

  return (
    <>
      <Head>
        <title>MigMS Admin</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <AdminNavBar />
        <Box p={3}>
          <Box pb={3}>
            <Link href={'/admin/dashboard/products/create'}>
              <Button>Create product</Button>
            </Link>
          </Box>
          <Stack>
            {allProducts.data?.map((product) => (
              <Link
                href={`/admin/dashboard/products/${product.productId}`}
                key={product.productId}
              >
                <Box bg={'gray.200'} p={3} rounded={'lg'}>
                  <>
                    {product.title}
                    {product.content}
                    {product.publishDate?.toDateString}
                    {product.published}
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

export default dynamic(() => Promise.resolve(products), {
  ssr: false,
});
