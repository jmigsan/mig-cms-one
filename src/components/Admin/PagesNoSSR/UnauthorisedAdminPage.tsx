import { Box, Center, Link as ChakraLink, Stack, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

const UnauthorisedAdminPage = () => {
  return (
    <>
      <Head>
        <title>MigMS Admin Dashboard</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>
        <Stack pt={6}>
          <Center>
            <Text>Unauthorised.</Text>
          </Center>
          <Center>
            <Text>
              Please
              <Text color={'blue'} as={'span'}>
                <Link href={'/admin'}>sign in</Link>
              </Text>
              as an administrator to access this page.
            </Text>
          </Center>
        </Stack>
      </Box>
    </>
  );
};

export default UnauthorisedAdminPage;
