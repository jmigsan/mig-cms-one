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
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Container,
  FormControl,
  HStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { trpc } from '../../utils/trpc';
import axios from 'axios';
import TipTap from './TipTap';

const AddProductDrawer = () => {
  const name = trpc.useQuery(['user.getName'], {
    refetchOnWindowFocus: false,
  });

  //if drawer open or not
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // fullscreen toggle
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
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
                    {publish ? <Text>Publish</Text> : <Text>Draft</Text>}
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
