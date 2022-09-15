import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { MdImage } from 'react-icons/md';
import { trpc } from '../../utils/trpc';

const B2ImageUpload = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // upload to s3
  const getSignedPut = trpc.useMutation(['b2.getSignedPut']);
  // const imageKeyToDB = trpc.useMutation(['product.imageKeyToDB']);

  const [file, setFile] = useState<File>();

  const uploadFile = async () => {
    if (!file) {
      return null;
    }

    const fileType = encodeURIComponent(file.type);

    const signedUrl = await getSignedPut.mutateAsync({ fileType: fileType });

    await axios.put(signedUrl.uploadUrl, file);

    // await imageKeyToDB.mutate({ imageKey: signedUrl.key });
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
      <Button onClick={onOpen}>
        <MdImage />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text fontSize={'2xl'}>Uploaded Images</Text>
              <Text fontSize={'2xl'}>Upload an Image</Text>
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
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default B2ImageUpload;
