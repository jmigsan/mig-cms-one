import dynamic from 'next/dynamic';

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
import AdminNavBar from '../../components/Admin/AdminNavBar';

const Dashboard = () => {
  const img = trpc.useQuery([
    'b2.getSignedGet',
    { fileKey: 'bvycw2zdjqv08n.jpeg' },
  ]);

  // page auth begin
  const { data: session } = useSession();
  const role = session?.user?.role;

  if (!session) {
    return <UnauthorisedAdminPage />;
  }

  if (!role) {
    return (
      <Center pt={6}>
        <Spinner />
      </Center>
    );
  }

  if (role !== 'ADMIN') {
    return <UnauthorisedAdminPage />;
  }
  // page auth end

  return (
    <>
      <Head>
        <title>MigMS Admin Dashboard</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <AdminNavBar />
        <Box p={3}>
          <Text>Admin Dashboard</Text>
          <Box>
            {/* <img src={img.data?.uploadUrl} alt={'oi'} /> */}
            {/* <button onClick={() => console.log(img.data)}>yo</button> */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default dynamic(() => Promise.resolve(Dashboard), {
  ssr: false,
});
