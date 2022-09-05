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
import UnauthorisedAdminPage from '../../../../components/Admin/PagesNoSSR/UnauthorisedAdminPage';
import Head from 'next/head';
import AdminNavBar from '../../../../components/Admin/AdminNavBar';
import axios from 'axios';

const EditProduct = () => {
  // get product data
  const router = useRouter();
  const productId = router.query.productId as string;
  const post = trpc.useQuery(['product.getProduct', { productId }]);

  // store product data
  const [title, setTitle] = useState('');
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  // set default product data
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
  const updateProductMutation = trpc.useMutation(['product.updateProduct'], {
    onMutate: () => {
      toast({
        title: 'Product updating',
        description: 'Please wait',
        status: 'loading',
        duration: 100000,
      });
    },
    onError: () => {
      toast({
        title: 'Product failed',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    },
    onSettled: () => {
      utils.invalidateQueries(['product.getProducts']);
      utils.fetchQuery(['product.getProduct', { productId }]);
      toast.closeAll();
      toast({
        title: 'Product updated',
        description: 'Successfully updated a product',
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    },
  });
  const toast = useToast();

  const saveProduct = async () => {
    const datePublishDate = new Date(publishDate);

    let screenedContent = '';

    if (content === '<p></p>') {
      screenedContent = '';
    } else {
      screenedContent = content;
    }

    updateProductMutation.mutate({
      productId,
      title,
      published: publish,
      content: screenedContent,
      publishDate: datePublishDate,
      author,
    });

    router.push('/admin/dashboard/products');
    utils.invalidateQueries(['product.getProducts']);
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
          <Text fontSize={'2xl'}>Add Product</Text>
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

export default dynamic(() => Promise.resolve(EditProduct), {
  ssr: false,
});