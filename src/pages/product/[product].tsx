import { Box, Container, Text, Image } from '@chakra-ui/react';
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
import { unstable_getServerSession } from 'next-auth/next';
import Carousel from '../../components/Product/Carousel';

const Post = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { product } = router.query;
  const { data } = trpc.useQuery([
    'public.getProduct',
    { productId: product as string },
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
            {data?.coverImages && data.coverImages.length > 0 && (
              <Carousel imageArr={data.coverImages} />
            )}
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
  context: GetServerSidePropsContext<{ product: string }>
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: session }),
    transformer: superjson,
  });

  const id = context.params?.product as string;

  await ssg.prefetchQuery('public.getProduct', {
    productId: id,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
