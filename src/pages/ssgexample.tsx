// import dynamic from 'next/dynamic';

// const AdminDashboard = () => {
//   const DashboardNoSSR = dynamic(
//     () => import('../../components/Admin/PagesNoSSR/Dashboard'),
//     {
//       ssr: false,
//     }
//   );

//   return <DashboardNoSSR />;
// };
// export default AdminDashboard;

import {
  Box,
  Button,
  Center,
  HStack,
  Link as ChakraLink,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { useEffect } from 'react';
import UnauthorisedAdminPage from '../components/Admin/PagesNoSSR/UnauthorisedAdminPage';
import Link from 'next/link';

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';

import { Session } from 'next-auth';

const Dashboard = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const role = trpc.useQuery(['user.getRole']);
  const img = trpc.useQuery([
    'b2.getSignedGet',
    { fileKey: 'bvycw2zdjqv08n.jpeg' },
  ]);
  const posts = trpc.useQuery(['example.hello']);

  // console.log(posts.data);

  const { data: session } = useSession();

  console.log(session);

  if (!session) {
    // return <UnauthorisedAdminPage />;
    console.log(props.session);
    return <div>no ses</div>;
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
                <Link href={'/admin/dashboard/posts'}>
                  <Button>Posts</Button>
                </Link>
                <Link href={'/admin/dashboard/products'}>
                  <Button>Products</Button>
                </Link>
              </HStack>
              {/* <img src={img.data?.uploadUrl} alt={'oi'} /> */}
              {/* <button onClick={() => console.log(img.data)}>yo</button> */}
              <Text>{posts.data?.greeting}</Text>
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

import { appRouter } from '../server/router';
import superjson from 'superjson';
import { createContextInner } from '../server/router/context';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions as nextAuthOptions } from './api/auth/[...nextauth]';

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  type CreateContextOptions = {
    session: Session | null;
  };

  const session: CreateContextOptions = await unstable_getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContextInner(session),
    transformer: superjson,
  });

  await ssg.prefetchQuery('question.getSecretMessage');

  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      session,
    },
  };
}
