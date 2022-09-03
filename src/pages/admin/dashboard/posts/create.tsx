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
import UnauthorisedAdminPage from '../../../../components/Admin/PagesNoSSR/UnauthorisedAdminPage';
import Head from 'next/head';

const AddPosts = () => {
  const name = trpc.useQuery(['user.getName'], {
    refetchOnWindowFocus: false,
  });

  // store post data
  const [title, setTitle] = useState('');
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  // upload to postgres
  const createPostMutation = trpc.useMutation(['post.uploadPost']);
  const router = useRouter();
  const toast = useToast();

  const savePost = async () => {
    try {
      const datePublishDate = new Date(publishDate);

      let screenedContent = '';

      if (content === '<p></p>') {
        screenedContent = '';
      } else {
        screenedContent = content;
      }

      createPostMutation.mutate({
        title,
        published: publish,
        content: screenedContent,
        publishDate: datePublishDate,
        author,
      });

      router.push('/admin/dashboard/posts');

      toast({
        title: 'Post created',
        description: 'Successfully created a post',
        status: 'success',
        duration: 7500,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: 'Post failed',
        status: 'error',
        duration: 7500,
        isClosable: true,
      });
    }
  };

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
        <Center p={6}>
          <Text fontSize={'2xl'}>Add Post</Text>
        </Center>

        <Container maxW={'3xl'}>
          <FormControl>
            <Stack spacing={2}>
              <FormLabel>Title</FormLabel>
              <Input onChange={(e) => setTitle(e.target.value)} />
              <FormLabel>Publish</FormLabel>
              <HStack>
                <Switch
                  isChecked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                />
                <Text>{publish ? 'Publish' : 'Draft'}</Text>
              </HStack>

              <FormLabel>Content</FormLabel>

              <TipTap setContent={setContent} />

              <FormLabel>Date</FormLabel>
              <Input
                type={'date'}
                onChange={(e) => setPublishDate(e.target.value)}
              />
              <Text>{publishDate}</Text>
              <FormLabel>Author</FormLabel>
              <Input
                onChange={(e) => setAuthor(e.target.value)}
                defaultValue={name.data || ''}
              />
            </Stack>
          </FormControl>
        </Container>
        <Center p={5}>
          <HStack>
            <Link href={'/admin/dashboard/products'}>
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

export default dynamic(() => Promise.resolve(AddPosts), {
  ssr: false,
});
