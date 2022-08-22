import type { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { trpc } from '../utils/trpc';

import {
  Box,
  Button,
  Center,
  Stack,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const Admin: NextPage = () => {
  const role = trpc.useQuery(['user.getRole']);

  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>MigMS Admin</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <Center>
          <Box p={5}>
            <Box p={5} rounded={'lg'} bg={'green.200'}>
              <Stack>
                <Text>Welcome to the Admin Panel</Text>
                {!session && <Button onClick={() => signIn()}>Sign in</Button>}
                {session && <Button onClick={() => signOut()}>Sign out</Button>}
              </Stack>
            </Box>
            <Link href='/'>
              <ChakraLink>
                <ArrowBackIcon />
                Back to home page
              </ChakraLink>
            </Link>
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default Admin;
