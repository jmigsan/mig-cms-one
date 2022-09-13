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
import { useState } from 'react';
import { trpc } from '../../../../utils/trpc';
import TipTap from '../../../../components/Admin/TipTap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import UnauthorisedAdminPage from '../../../../components/Admin/Pages/UnauthorisedAdminPage';
import Head from 'next/head';
import AdminNavBar from '../../../../components/Admin/AdminNavBar';
import DOMPurify from 'isomorphic-dompurify';

const AddPost = () => {
  // store post data
  const [title, setTitle] = useState('');
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  // get name
  const name = trpc.useQuery(['user.getName'], {
    refetchOnWindowFocus: false,
  });

  // upload to postgres
  const utils = trpc.useContext();
  const router = useRouter();
  const uploadPostMutation = trpc.useMutation(['post.uploadPost'], {
    onMutate: () => {
      toast({
        title: 'Post uploading',
        description: 'Please wait',
        status: 'loading',
        duration: 100000,
      });
    },
    onError: () => {
      toast.closeAll();
      toast({
        title: 'Post failed',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    },
    onSettled: () => {
      utils.invalidateQueries(['post.getPosts']);
      toast.closeAll();
      toast({
        title: 'Post uploaded',
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

    const sanitisedContent = DOMPurify.sanitize(content);

    let screenedContent = '';

    if (sanitisedContent === '<p></p>') {
      screenedContent = '';
    } else {
      screenedContent = content;
    }

    uploadPostMutation.mutate({
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
              <Input onChange={(e) => setTitle(e.target.value)} value={title} />
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
                editMode={false}
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
                defaultValue={name.data as string}
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

export default dynamic(() => Promise.resolve(AddPost), {
  ssr: false,
});
