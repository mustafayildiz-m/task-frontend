import { Heading, useColorMode, VStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const PageContainer = ({ children, title }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <VStack
      pt="100px"
      h="100vh"
      bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
      transition="background 100ms linear"
    >
      <Heading as="h1" size="2xl" mb={6} textAlign="center">
        {title}
      </Heading>
      <Button variant={"solid"} colorScheme={"green"} onClick={() => router.push("/")}>Home</Button>
      {children}
    </VStack>
  );
};

export default PageContainer;
