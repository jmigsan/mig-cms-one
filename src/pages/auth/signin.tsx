import { Box, Button, Center, HStack, Image } from '@chakra-ui/react';
import { getProviders, signIn } from 'next-auth/react';
import { useEffect } from 'react';

const SignIn: React.FC<{ providers: any }> = ({ providers }) => {
  let redirectUrl = 'http://localhost:3000';

  useEffect(() => {
    const url = new URL(location.href);
    redirectUrl =
      url.searchParams.get('callbackUrl') !== null
        ? redirectUrl
        : 'http://localhost:3000';
  });

  return (
    <>
      <Box>
        <HStack>
          <Box>
            <Center>
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
            </Center>
          </Box>
          <Box>
            <Image src='https://source.unsplash.com/random' />
          </Box>
        </HStack>
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
