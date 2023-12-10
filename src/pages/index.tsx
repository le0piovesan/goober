import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import { type NextPage } from "next";
import ButtonLink from "~/components/ButtonLink";

const Home: NextPage = () => {
  return (
    <Flex direction="column" align="center" justify="space-around" h="100vh">
      <VStack align="start" p={4} fontSize="5xl" fontWeight="bold">
        <Heading>Welcome to</Heading>
        <Flex align="center">
          <Box
            as="span"
            bgGradient="linear(to-r, primary, secondary)"
            bgClip="text"
            color="transparent"
            className="bg-gradient-to-r
             from-primary to-secondary bg-clip-text text-transparent"
          >
            Goober
          </Box>
          <Box as="span" role="img" aria-label="taxi">
            🚕
          </Box>
        </Flex>
      </VStack>

      <Flex mb={4} direction="row" align="center" gap={4}>
        <ButtonLink href="users/login">Log In</ButtonLink>
        <ButtonLink href="users/signup" secondary>
          Sign Up
        </ButtonLink>
      </Flex>
    </Flex>
  );
};

export default Home;
