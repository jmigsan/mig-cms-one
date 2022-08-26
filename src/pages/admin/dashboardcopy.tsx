import { Box, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import { useEffect } from 'react';
import AddPostModal from '../../components/Admin/AddPostModal';

const AdminDashboard = () => {
  const { data: session } = useSession();

  if (typeof window === 'undefined') return null;

  if (session) {
    console.log(session);

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
  }
};
export default AdminDashboard;
