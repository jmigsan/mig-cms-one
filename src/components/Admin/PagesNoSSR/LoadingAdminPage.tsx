import { Center, Spinner } from '@chakra-ui/react';
import Head from 'next/head';
import AdminNavBar from '../AdminNavBar';

const UnauthorisedAdminPage = () => {
  return (
    <>
      <Head>
        <title>MigMS Admin</title>
        <meta name='description' content="Mig's CMS" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <AdminNavBar />
        <Center pt={6}>
          <Spinner />
        </Center>
      </div>
    </>
  );
};

export default UnauthorisedAdminPage;
