import dynamic from 'next/dynamic';

import {
  Button,
  Input,
  Stack,
  FormLabel,
  Text,
  Switch,
  Container,
  FormControl,
  HStack,
  Center,
  useToast,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { trpc } from '../../../../utils/trpc';
import TipTap from '../../../../components/Admin/TipTap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import UnauthorisedAdminPage from '../../../../components/Admin/pages/UnauthorisedAdminPage';
import Head from 'next/head';
import AdminNavBar from '../../../../components/Admin/AdminNavBar';

const EditPost = () => {
  // get post data
  const router = useRouter();
  const postId = router.query.postId as string;
  const post = trpc.useQuery(['post.getPost', { postId }]);

  // store post data
  const [title, setTitle] = useState('');
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  // set default post data
  const titleContainer = useRef(null);

  useEffect(() => {
    if (titleContainer.current) {
      if (title === '') {
        setTitle(post.data?.title as string);
        setPublish(post.data?.published as boolean);
        setContent(post.data?.content as string);
        setPublishDate(
          post.data?.publishDate?.toISOString().substring(0, 10) as string
        );
        setAuthor(post.data?.author as string);
      }
    }
  }, [post]);

  // upload to postgres
  const utils = trpc.useContext();
  const updatePostMutation = trpc.useMutation(['post.updatePost'], {
    onMutate: () => {
      toast({
        title: 'Post updating',
        description: 'Please wait',
        status: 'loading',
        duration: 100000,
      });
    },
    onError: () => {
      toast({
        title: 'Post failed',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    },
    onSettled: () => {
      utils.invalidateQueries(['post.getPosts']);
      utils.fetchQuery(['post.getPost', { postId }]);
      toast.closeAll();
      toast({
        title: 'Post updated',
        description: 'Successfully updated a post',
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    },
  });
  const toast = useToast();

  const savePost = async () => {
    const datePublishDate = new Date(publishDate);

    let screenedContent = '';

    if (content === '<p></p>') {
      screenedContent = '';
    } else {
      screenedContent = content;
    }

    updatePostMutation.mutate({
      postId,
      title,
      published: publish,
      content: screenedContent,
      publishDate: datePublishDate,
      author,
    });

    router.push('/admin/dashboard/posts');
    utils.invalidateQueries(['post.getPosts']);
  };

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

  if (post.isLoading) {
    return (
      <Center pt={6}>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>MigMS Admin</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <AdminNavBar />

        <Center p={6}>
          <Text fontSize={'2xl'}>Add Post</Text>
        </Center>

        <Container maxW={'3xl'}>
          <FormControl>
            <Stack spacing={2}>
              <FormLabel>Title</FormLabel>
              <Input
                ref={titleContainer}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <FormLabel>Publish</FormLabel>
              <HStack>
                <Switch
                  isChecked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                />

                <Text>{publish ? 'Publish' : 'Draft'}</Text>
              </HStack>

              <FormLabel>Content</FormLabel>

              <TipTap
                setContent={setContent}
                content={content}
                editMode={true}
              />

              <FormLabel>Date</FormLabel>
              <Input
                type={'date'}
                onChange={(e) => setPublishDate(e.target.value)}
                value={publishDate}
              />

              <FormLabel>Author</FormLabel>
              <Input
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
              />
            </Stack>
          </FormControl>
        </Container>
        <Center p={5}>
          <HStack>
            <Link href={'/admin/dashboard/posts'}>
              <Button>Back</Button>
            </Link>

            <Button variant='ghost' onClick={() => savePost()}>
              Save Post
            </Button>
          </HStack>
        </Center>
      </Box>
    </>
  );
};

export default dynamic(() => Promise.resolve(EditPost), {
  ssr: false,
});
