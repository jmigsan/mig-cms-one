import {
  Box,
  Button,
  Center,
  HStack,
  Link as ChakraLink,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import UnauthorisedAdminPage from '../../components/Admin/PagesNoSSR/UnauthorisedAdminPage';
import Link from 'next/link';

const Dashboard = () => {
  const role = trpc.useQuery(['user.getRole']);
  const img = trpc.useQuery([
    'b2.getSignedGet',
    { fileKey: 'bvycw2zdjqv08n.jpeg' },
  ]);

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

  if (role.data === 'ADMIN') {
    return (
      <>
        <Head>
          <title>MigMS Admin Dashboard</title>
          <meta name='description' content="Mig's CMS" />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Box>
          <Box p={4}>
            <Text>Admin Dashboard</Text>
            <Box>
              <HStack>
                <Link href={'/admin/dashboard/posts'}>
                  <Button>Posts</Button>
                </Link>
                <Link href={'/admin/dashboard/products'}>
                  <Button>Products</Button>
                </Link>
              </HStack>
              {/* <img src={img.data?.uploadUrl} alt={'oi'} /> */}
              {/* <button onClick={() => console.log(img.data)}>yo</button> */}
            </Box>
          </Box>
        </Box>
      </>
    );
  } else {
    return <UnauthorisedAdminPage />;
  }
};

export default Dashboard;
