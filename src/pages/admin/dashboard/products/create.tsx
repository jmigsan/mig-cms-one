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
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { trpc } from '../../../../utils/trpc';
import TipTap from '../../../../components/Admin/TipTap';
import axios from 'axios';
import Link from 'next/link';

const AddProductDrawer = () => {
  const name = trpc.useQuery(['user.getName'], {
    refetchOnWindowFocus: false,
  });

  // store post data
  const [title, setTitle] = useState('');
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  // uploading to postgres
  const createPostMutation = trpc.useMutation(['product.uploadProduct']);

  const saveProduct = async () => {
    const datePublishDate = new Date(publishDate);

    console.log(datePublishDate);
    console.log('yo');

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
  };

  // uploading to s3
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

  return (
    <>
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

          <Button variant='ghost' onClick={() => saveProduct()}>
            Save Product
          </Button>
        </HStack>
      </Center>
    </>
  );
};

export default AddProductDrawer;
