import { Box, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from '../../components/All/NavBar';

const Post = () => {
  const router = useRouter();
  const { post } = router.query;

  return (
    <>
      <Head>
        <title>MigMS Blog - {post}</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <NavBar />
        <Box p={3}>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {post}
          </Text>
          <Text>yo</Text>
        </Box>
      </Box>
    </>
  );
};

export default Post;
