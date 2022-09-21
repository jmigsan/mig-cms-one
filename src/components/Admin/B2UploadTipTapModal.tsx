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
  SimpleGrid,
  Image,
  useToast,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { MdImage } from 'react-icons/md';
import { trpc } from '../../utils/trpc';
import { Editor } from '@tiptap/react';

const B2ImageUpload = ({ editor }: { editor: Editor | null }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // upload to s3
  const toast = useToast();
  const utils = trpc.useContext();
  const getSignedPut = trpc.useMutation(['b2.getSignedPut']);
  const imageToDB = trpc.useMutation(['image.imageToDB'], {
    onMutate: () => {
      toast({
        title: 'Image uploading',
        description: 'Please wait',
        status: 'loading',
        duration: 100000,
      });
    },
    onError: () => {
      toast.closeAll();
      toast({
        title: 'Image failed',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    },
    onSettled: () => {
      utils.invalidateQueries(['image.getImages']);
      toast.closeAll();
      toast({
        title: 'Image uploaded',
        description: 'Successfully uploaded an image',
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    },
  });
  const [file, setFile] = useState<File>();

  const uploadFile = async () => {
    if (!file) {
      return null;
    }

    const fileType = encodeURIComponent(file.type);

    const signedUrl = await getSignedPut.mutateAsync({ fileType: fileType });

    await axios.put(signedUrl.uploadUrl, file);

    await imageToDB.mutate({ imageKey: signedUrl.key });

    resetFile();
  };

  // reset file
  const inputRef = useRef<HTMLInputElement>(null);

  const resetFile = () => {
    if (inputRef.current !== null) {
      setFile(undefined);
      inputRef.current.value = '';
    }
  };

  // get db images
  const dbImages = trpc.useQuery(['image.getImages']);

  const addImage = ({ imageKey }: { imageKey: string }) => {
    editor!
      .chain()
      .focus()
      .setImage({
        src: `https://f004.backblazeb2.com/file/mig-cms-one/${imageKey}`,
      })
      .run();
  };

  //del image from postgres DB
  const delImageFromDB = trpc.useMutation(['image.delImageFromDB']);
  const delImage = ({ imageKey }: { imageKey: string }) => {
    delImageFromDB.mutate({ imageKey });
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
              <SimpleGrid columns={4} spacing={2}>
                {dbImages.data?.map((image) => (
                  <Box key={image.imageKey}>
                    <Button
                      onClick={() => addImage({ imageKey: image.imageKey })}
                    >
                      <Image
                        src={`https://f004.backblazeb2.com/file/mig-cms-one/${image.imageKey}`}
                      />
                    </Button>
                    <Button
                      onClick={() => delImage({ imageKey: image.imageKey })}
                    >
                      Delete Image From Database
                    </Button>
                  </Box>
                ))}
              </SimpleGrid>
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
                {/* <Button onClick={() => resetFile()}>Reset File</Button> */}
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
