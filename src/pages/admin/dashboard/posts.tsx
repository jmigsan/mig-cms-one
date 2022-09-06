import dynamic from 'next/dynamic';

import { Box, Button, Center, Spinner, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import UnauthorisedAdminPage from '../../../components/Admin/Pages/UnauthorisedAdminPage';
import { trpc } from '../../../utils/trpc';
import { useSession } from 'next-auth/react';
import AdminNavBar from '../../../components/Admin/AdminNavBar';
import LoadingAdminPage from '../../../components/Admin/Pages/LoadingAdminPage';

const posts = () => {
  const allPosts = trpc.useQuery(['post.getPosts']);

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

  if (allPosts.isLoading) {
    return <LoadingAdminPage />;
  }

  return (
    <>
      <Head>
        <title>MigMS Admin</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <AdminNavBar />
        <Box p={3}>
          <Box pb={3}>
            <Link href={'/admin/dashboard/posts/create'}>
              <Button>Create post</Button>
            </Link>
          </Box>
          <Stack>
            {allPosts.data?.map((post) => (
              <Link
                href={`/admin/dashboard/posts/${post.postId}`}
                key={post.postId}
              >
                <Box bg={'gray.200'} p={3} rounded={'lg'}>
                  <>
                    {post.title}
                    {post.content}
                    {post.publishDate?.toDateString}
                    {post.published}
                    {post.author}
                  </>
                </Box>
              </Link>
            ))}
          </Stack>
        </Box>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(posts), {
  ssr: false,
});
