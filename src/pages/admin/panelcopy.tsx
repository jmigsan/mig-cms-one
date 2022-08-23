import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { trpc } from '../../utils/trpc';
import { useEffect } from 'react';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

const AdminPanel = () => {
  const { data: session } = useSession();

  if (typeof window === 'undefined') return null;

  const utils = trpc.useContext();
  const role = trpc.useQuery(['user.getRole']);

  useEffect(() => {
    utils.invalidateQueries(['user.getRole']);
    console.log('yo');
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

export async function getServerSideProps(context: {
  req:
    | (IncomingMessage & { cookies: Partial<{ [key: string]: string }> })
    | NextApiRequest;
  res: ServerResponse | NextApiResponse<any>;
}) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}
