import {
  Box,
  Center,
  Link as ChakraLink,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../../../utils/trpc';
import { useEffect } from 'react';
import UnauthorisedAdminPage from '../UnauthorisedAdminPage';
import AddPostModal from '../AddPostModal';

const Dashboard = () => {
  const utils = trpc.useContext();
  const role = trpc.useQuery(['user.getRole'], {
    refetchOnWindowFocus: false,
  });

  const { data: session } = useSession();

  useEffect(() => {
    utils.invalidateQueries(['user.getRole']);
  }, [session]);

  if (!role.data) {
    return (
      <Center pt={6}>
        <Spinner />
      </Center>
    );
  }

  if (role.data === 'ADMIN' && session) {
    return (
      <>
        <Head>
          <title>MigMS Admin Dashboard</title>
          <meta name='description' content="Mig's CMS" />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Box>
          <Text>Admin Dashboard</Text>
          <Box>
            <AddPostModal />
          </Box>
        </Box>
      </>
    );
  } else {
    return <UnauthorisedAdminPage />;
  }
};

export default Dashboard;
