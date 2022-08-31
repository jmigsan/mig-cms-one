import {
  useDisclosure,
  Button,
  Input,
  Box,
  Stack,
  FormLabel,
  Text,
  Switch,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Container,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const AddProductDrawer = () => {
  const name = trpc.useQuery(['user.getName'], {
    refetchOnWindowFocus: false,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fullscreen, setFullscreen] = useState(false);

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

    if (content === '<p><br></p>') {
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

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // uploading to s3
  const getSignedPost = trpc.useMutation(['b2.createPresignedPost']);

  const [file, setFile] = useState<any>();

  const uploadFile = async () => {
    const signedPost = await getSignedPost.mutateAsync();
    console.log(signedPost);

    try {
      const formData = new FormData();
      formData.append('Content-Type', file.type);
      Object.entries(signedPost!.presignedurl.fields).forEach(([k, v]) => {
        formData.append(k, v);
      });
      formData.append('file', file); // must be the last one

      await fetch(signedPost!.presignedurl.url, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button colorScheme='teal' onClick={onOpen}>
        Add Product
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size={fullscreen ? 'full' : 'xl'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <Button
            maxW={'fit-content'}
            alignSelf={'end'}
            marginEnd={'3'}
            onClick={() => toggleFullscreen()}
            position={'absolute'}
            mt={3}
          >
            Toggle Fullscreen
          </Button>
          <DrawerHeader>Add Product</DrawerHeader>

          <DrawerBody>
            <Container maxW={'2xl'}>
              <Stack spacing={2}>
                <FormLabel>Title</FormLabel>
                <Input onChange={(e) => setTitle(e.target.value)} />
                <FormLabel>Publish</FormLabel>
                <Switch
                  isChecked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                />
                {publish && <div>yo</div>}
                <FormLabel>Image</FormLabel>
                <Input
                  type={'file'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  variant={'unstyled'}
                />
                <Button onClick={() => uploadFile()}>yo</Button>

                <FormLabel>Content</FormLabel>
                <ReactQuill
                  theme='snow'
                  value={content}
                  onChange={setContent}
                />
                <div>{content}</div>
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
            </Container>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost' onClick={() => saveProduct()}>
              Save Product
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddProductDrawer;
