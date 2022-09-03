import dynamic from 'next/dynamic';

import { Box, Button, Center, Spinner } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import UnauthorisedAdminPage from '../../../components/Admin/PagesNoSSR/UnauthorisedAdminPage';
import { trpc } from '../../../utils/trpc';
import { useSession } from 'next-auth/react';

const posts = () => {
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
        <Link href={'/admin/dashboard/posts/create'}>
          <Button>Create post</Button>
        </Link>
      </Box>
    </>
  );
};

export default dynamic(() => Promise.resolve(posts), {
  ssr: false,
});
