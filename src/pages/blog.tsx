import { Box, Stack, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { NextPage } from 'next';

import NavBar from '../components/All/NavBar';
import { trpc } from '../utils/trpc';
import Link from 'next/link';
import LoadingPage from '../components/All/Pages/LoadingPage';

const Blog: NextPage = () => {
  const allPosts = trpc.useQuery(['public.getPosts']);

  if (allPosts.isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>MigMS Blog</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <NavBar />
        <Box p={3}>
          <Text>Blog</Text>
          <Stack>
            {allPosts.data?.map((post) => (
              <Link href={`/post/${post.postId}`} key={post.postId}>
                <Box bg={'gray.200'} p={3} rounded={'lg'}>
                  <>
                    <Text fontSize={'2xl'}>{post.title}</Text>
                    {post.publishDate?.toDateString}
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
export default Blog;
