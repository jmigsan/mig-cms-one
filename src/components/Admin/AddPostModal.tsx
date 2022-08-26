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
import { createReactEditorJS } from 'react-editor-js';
import EditorJS from '@editorjs/editorjs';

const AddPostModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  let CustomEditor;

  // const DynamicEditorJS = dynamic(() => import('./EditorJSComponent'), {
  //   suspense: true,
  //   ssr: false,
  // });

  CustomEditor = dynamic(() => import('./EditorJSComponent'), {
    suspense: true,
    ssr: false,
  });

  // const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  //   ssr: false,
  //   suspense: true,
  // });

  // const editor = new EditorJS();

  // const ReactEditorJS = createReactEditorJS();

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
            <Suspense fallback={'Loading...'}>
              {/* <DynamicEditorJS /> */}
              {/* <QuillNoSSRWrapper /> */}
              {CustomEditor && <CustomEditor />}
            </Suspense>
            {/* <ReactEditorJS /> */}
            {/* <div id='editorjs' /> */}
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
