import { createSSGHelpers } from '@trpc/react/ssg';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createContextInner } from '../../../../server/router/context';
import { prisma } from '../../../../server/db/client';
import { appRouter } from '../../../../server/router';
import { trpc } from '../../../../utils/trpc';
import superjson from 'superjson';
import { authOptions as nextAuthOptions } from '../../../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const session: any = await unstable_getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: await createContextInner(session),
    transformer: superjson,
  });
  const id = context.params?.id as string;

  /*
   * Prefetching the `post.byId` query here.
   * `prefetchQuery` does not return the result - if you need that, use `fetchQuery` instead.
   */
  await ssg.prefetchQuery('public.getPost', {
    postId: id,
  });
  const yo = await ssg.fetchQuery('public.getPost', {
    postId: id,
  });

  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
      yo: JSON.parse(JSON.stringify(yo)),
    },
  };
}

export default function PostViewPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const id = props.id;
  const yo = props.yo;

  // This query will be immediately available as it's prefetched.
  const postQuery = trpc.useQuery(['public.getPost', { postId: id }]);

  const { data } = postQuery;

  return (
    <>
      <h1>{data?.title}</h1>
      {/* <em>Created {data.createdAt.toLocaleDateString()}</em> */}

      <p>{data?.content}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>

      <p>yo</p>
      <p>{yo?.author}</p>
      <p>{yo?.content}</p>
    </>
  );
}
