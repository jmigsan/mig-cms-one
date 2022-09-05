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
import { useRef, useState } from 'react';
import { trpc } from '../../../../utils/trpc';
import TipTap from '../../../../components/Admin/TipTap';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UnauthorisedAdminPage from '../../../../components/Admin/PagesNoSSR/UnauthorisedAdminPage';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import AdminNavBar from '../../../../components/Admin/AdminNavBar';

const AddProduct = () => {
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
  const createProductMutation = trpc.useMutation(['product.uploadProduct']);
  const router = useRouter();
  const toast = useToast();

  const saveProduct = async () => {
    try {
      const datePublishDate = new Date(publishDate);

      let screenedContent = '';

      if (content === '<p></p>') {
        screenedContent = '';
      } else {
        screenedContent = content;
      }

      createProductMutation.mutate({
        title,
        published: publish,
        content: screenedContent,
        publishDate: datePublishDate,
        author,
      });

      router.push('/admin/dashboard/products');

      toast({
        title: 'Product created',
        description: 'Successfully created a product',
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: 'Product creation failed',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    }
  };

  // upload to s3
  const getSignedPut = trpc.useMutation(['b2.getSignedPut']);

  const [file, setFile] = useState<File>();

  const uploadFile = async () => {
    if (!file) {
      return null;
    }

    const fileType = encodeURIComponent(file.type);
    console.log(fileType);

    const signedUrl = await getSignedPut.mutateAsync({ fileType: fileType });
    console.log(signedUrl);

    await axios.put(signedUrl.uploadUrl, file);

    return signedUrl.key;
  };

  // reset file
  const inputRef = useRef<HTMLInputElement>(null);

  const resetFile = () => {
    if (inputRef.current !== null) {
      setFile(undefined);
      inputRef.current.value = '';
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
        <AdminNavBar />
        <Center p={6}>
          <Text fontSize={'2xl'}>Add Product</Text>
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
              <FormLabel>Image</FormLabel>
              <Input
                type={'file'}
                accept={'image/jpeg, image/png'}
                ref={inputRef}
                onChange={(e) => setFile(e.target.files?.[0] || undefined)}
                variant={'unstyled'}
              />
              <HStack>
                <Button onClick={() => uploadFile()}>Upload File</Button>
                <Button onClick={() => resetFile()}>Reset File</Button>
              </HStack>

              <FormLabel>Content</FormLabel>

              <TipTap setContent={setContent} content='' />

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

            <Button variant='ghost' onClick={() => saveProduct()}>
              Save Product
            </Button>
          </HStack>
        </Center>
      </Box>
    </>
  );
};

export default dynamic(() => Promise.resolve(AddProduct), {
  ssr: false,
});
