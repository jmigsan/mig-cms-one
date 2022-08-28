import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Box,
  Stack,
  FormLabel,
  Switch,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  Container,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddPostDrawer = () => {
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

  const createPostMutation = trpc.useMutation(['post.uploadPost']);

  const savePost = async () => {
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

  return (
    <>
      <Button colorScheme='teal' onClick={onOpen}>
        Add Post
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
          <DrawerHeader>Add Post</DrawerHeader>

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
            <Button variant='ghost' onClick={() => savePost()}>
              Save Post
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddPostDrawer;
