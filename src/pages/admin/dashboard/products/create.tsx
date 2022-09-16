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
  Image,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { trpc } from '../../../../utils/trpc';
import TipTap from '../../../../components/Admin/TipTap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import UnauthorisedAdminPage from '../../../../components/Admin/Pages/UnauthorisedAdminPage';
import Head from 'next/head';
import AdminNavBar from '../../../../components/Admin/AdminNavBar';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';
import B2UploadGalleryModal from '../../../../components/Admin/B2UploadGalleryModal';

const AddProduct = () => {
  // store product data
  const [title, setTitle] = useState('');
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');
  const [imageArr, setImageArr] = useState<string[]>([]);

  // get name
  const name = trpc.useQuery(['user.getName'], {
    refetchOnWindowFocus: false,
  });

  // upload to postgres
  const toast = useToast();
  const utils = trpc.useContext();
  const router = useRouter();
  const uploadProductMutation = trpc.useMutation(['product.uploadProduct'], {
    onMutate: () => {
      toast({
        title: 'Product uploading',
        description: 'Please wait',
        status: 'loading',
        duration: 100000,
      });
    },
    onError: () => {
      toast.closeAll();
      toast({
        title: 'Product failed',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    },
    onSettled: () => {
      utils.invalidateQueries(['product.getProducts']);
      toast.closeAll();
      toast({
        title: 'Product uploaded',
        description: 'Successfully uploaded a product',
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    },
  });

  const saveProduct = async () => {
    const datePublishDate = new Date(publishDate);

    const sanitisedContent = DOMPurify.sanitize(content);

    let screenedContent = '';

    if (sanitisedContent === '<p></p>') {
      screenedContent = '';
    } else {
      screenedContent = content;
    }

    uploadProductMutation.mutate({
      title,
      published: publish,
      content: screenedContent,
      publishDate: datePublishDate,
      author,
    });

    router.push('/admin/dashboard/products');
    utils.invalidateQueries(['product.getProducts']);
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
          <Text fontSize={'2xl'}>Add Product</Text>
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

              <FormLabel>Image</FormLabel>
              <B2UploadGalleryModal
                setImageArr={setImageArr}
                imageArr={imageArr}
              />
              {imageArr.length === 0 && <div>oi</div>}
              {imageArr.length > 0 &&
                imageArr.map((image) => (
                  <Box rounded={'lg'} key={image}>
                    <Image src={image} />
                  </Box>
                ))}

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
