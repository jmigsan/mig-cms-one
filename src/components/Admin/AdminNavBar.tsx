import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link as ChakraLink,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { signOut, useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';

const Links = [
  { text: 'Dashboard', link: '/admin/dashboard' },
  { text: 'Posts', link: '/admin/dashboard/posts' },
  { text: 'Products', link: '/admin/dashboard/products' },
];

const NavLink = ({ text, link }: { text: string; link: string }) => (
  <Link href={link}>
    <ChakraLink
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.200',
      }}
    >
      {text}
    </ChakraLink>
  </Link>
);

export default function withAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const userPic = trpc.useQuery(['user.getImage']);

  return (
    <>
      <Box bg={'gray.300'} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>MigCMS Admin Dashboard</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink text={link.text} link={link.link} key={link.link} />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Link href={'/'}>
              <Button variant={'solid'} colorScheme={'blue'} size={'sm'} mr={4}>
                Go To Public Website
              </Button>
            </Link>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar size={'sm'} src={userPic.data || ''} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink text={link.text} link={link.link} key={link.link} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
