import { Box, Button, Center, HStack, Image } from '@chakra-ui/react';
import { getProviders, signIn } from 'next-auth/react';
import { useEffect } from 'react';

const SignIn: React.FC<{
  providers: {
    provider: {
      id: string;
      name: string;
      type: string;
      callbackUrl: string;
      signinUrl: string;
    };
  };
}> = ({ providers }) => {
  let redirectUrl = 'http://localhost:3000';

  useEffect(() => {
    const url = new URL(location.href);
    redirectUrl =
      url.searchParams.get('callbackUrl') !== null
        ? redirectUrl
        : 'http://localhost:3000';
  });

  if (providers === undefined) {
    return null;
  }

  return (
    <>
      <Box>
        <Center>
          <HStack>
            <Box>
              {Object.values(providers).map((provider: any) => (
                <Box key={provider.name}>
                  <Button
                    onClick={() =>
                      signIn(provider.id, { callbackUrl: redirectUrl })
                    }
                  >
                    Sign in with {provider.name}
                  </Button>
                </Box>
              ))}
            </Box>
            <Box w='lg'>
              <Image src='https://source.unsplash.com/random/?nature,water' />
            </Box>
          </HStack>
        </Center>
      </Box>
    </>
  );
};

export default SignIn;

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};
