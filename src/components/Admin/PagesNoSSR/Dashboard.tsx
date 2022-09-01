import {
  Box,
  Center,
  HStack,
  Link as ChakraLink,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../../../utils/trpc';
import { useEffect } from 'react';
import UnauthorisedAdminPage from './UnauthorisedAdminPage';
import AddPostDrawer from '../AddPostDrawer';
import AddProductDrawer from '../AddProductDrawer';

const Dashboard = () => {
  const utils = trpc.useContext();
  const role = trpc.useQuery(['user.getRole']);

  const { data: session } = useSession();

  useEffect(() => {
    utils.invalidateQueries(['user.getRole']);
  }, [session]);

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
                <AddPostDrawer />
                <AddProductDrawer />
              </HStack>
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
