import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import { useEffect } from 'react';

const AdminPanel = () => {
  const utils = trpc.useContext();
  const role = trpc.useQuery(['user.getRole']);

  const { data: session } = useSession();

  useEffect(() => {
    utils.invalidateQueries(['user.getRole']);
  }, [session]);

  if (role.data === 'ADMIN' && session) {
    return (
      <>
        <Head>
          <title>MigMS Admin Panel</title>
          <meta name='description' content="Mig's CMS" />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Box>admin panel</Box>
      </>
    );
  }
};
export default AdminPanel;
