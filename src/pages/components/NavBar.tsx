import { Box, Button, HStack, Text } from '@chakra-ui/react';

const NavBar = () => {
  return (
    <Box bg={'black'}>
      <HStack>
        <Text color={'white'} fontSize={'lg'} fontWeight={'black'} p={3}>
          MigMS
        </Text>
        <Button>Home</Button>
        <Button>Store</Button>
        <Button>Blog</Button>
      </HStack>
    </Box>
  );
};
export default NavBar;
