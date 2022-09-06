import { Box, Container, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from '../../components/All/NavBar';
import { createSSGHelpers } from '@trpc/react/ssg';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createContextInner } from '../../server/router/context';
import { appRouter } from '../../server/router';
import { trpc } from '../../utils/trpc';
import superjson from 'superjson';
import { authOptions as nextAuthOptions } from '../api/auth/[...nextauth]';
import DOMPurify from 'isomorphic-dompurify';

const Post = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { post } = router.query;
  const { data } = trpc.useQuery([
    'public.getPost',
    { postId: post as string },
  ]);

  return (
    <>
      <Head>
        <title>MigMS Blog - {data?.title}</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <NavBar />
        <Container p={3}>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {data?.title}
          </Text>
          <Box>
            <Box
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data?.content!),
              }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Post;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ post: string }>
) => {
  const ssg = await createSSGHelpers({
    router: appRouter,
    // @ts-ignore. it hurts a bit that i do this.
    ctx: null,
    transformer: superjson,
  });

  const id = context.params?.post as string;

  await ssg.prefetchQuery('public.getPost', {
    postId: id,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
