import { Center, Spinner } from '@chakra-ui/react';
import Head from 'next/head';
import NavBar from '../NavBar';

const LoadingPage = () => {
  return (
    <>
      <Head>
        <title>MigMS</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <NavBar />
        <Center pt={6}>
          <Spinner />
        </Center>
      </div>
    </>
  );
};

export default LoadingPage;
