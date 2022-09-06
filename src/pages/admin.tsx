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
import { useEffect, useState } from 'react';

const Admin: NextPage = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;

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
                {role && <Text>Role: {role}</Text>}
                {session && !role && <Text>Loading...</Text>}
                {role === 'ADMIN' && (
                  <Link href='/admin/dashboard'>
                    <Button>Continue to admin panel</Button>
                  </Link>
                )}
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
