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
  Text,
  Switch,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddProductModal = () => {
  const name = trpc.useQuery(['user.getName'], {
    refetchOnWindowFocus: false,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState('');
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  const [file, setFile] = useState<any>();

  const createPostMutation = trpc.useMutation(['product.uploadProduct']);

  const saveProduct = async () => {
    const datePublishDate = new Date(publishDate);

    console.log(datePublishDate);
    console.log('yo');

    createPostMutation.mutate({
      title,
      published: publish,
      content,
      publishDate: datePublishDate,
      author,
    });
  };

  return (
    <>
      <Button onClick={onOpen}>Add Product</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
              <ReactQuill theme='snow' value={content} onChange={setContent} />
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
              <Input
                type={'file'}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost' onClick={() => saveProduct()}>
              Save Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddProductModal;
