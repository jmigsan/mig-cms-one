import { Box, Button, Center, HStack, Image } from '@chakra-ui/react';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

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
  const router = useRouter();

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
                      signIn(provider.id, {
                        callbackUrl: router.query.callbackUrl as string,
                      })
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
