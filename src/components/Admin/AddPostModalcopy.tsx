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
} from '@chakra-ui/react';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import QuillComponent from './QuillComponent';
// import SlateJS from './SlateJS';

const AddPostModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  const DynamicEditorJS = dynamic(() => import('./QuillComponent'), {
    suspense: true,
    ssr: false,
  });

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input onChange={(e) => setTitle(e.target.value)} />
            <Input onChange={(e) => setStatus(e.target.value)} />
            <Input onChange={(e) => setContent(e.target.value)} />
            <Input onChange={(e) => setPublishDate(e.target.value)} />
            <Input onChange={(e) => setAuthor(e.target.value)} />
            {/* <Suspense fallback={'Loading...'}>
              <DynamicEditorJS />
            </Suspense> */}
            <QuillComponent />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddPostModal;
