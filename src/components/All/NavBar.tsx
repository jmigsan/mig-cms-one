import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const NavBar = () => {
  const { data: session } = useSession();

  return (
    <Box bg={'black'}>
      <HStack>
        <Text color={'white'} fontSize={'lg'} fontWeight={'black'} p={3}>
          MigMS
        </Text>
        <Link href={'/'}>
          <Button>Home</Button>
        </Link>
        <Link href={'/store'}>
          <Button>Store</Button>
        </Link>
        <Link href={'/blog'}>
          <Button>Blog</Button>
        </Link>
        {!session && <Button onClick={() => signIn()}>Sign in</Button>}
        {session && <Button onClick={() => signOut()}>Sign out</Button>}
      </HStack>
    </Box>
  );
};
export default NavBar;
