import { Flex, Heading, VStack } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useEffect } from "react";
import ButtonComponent from "~/components/ButtonComponent";
import TitleComponent from "~/components/TitleComponent";
import { useAuth } from "~/context/AuthContext";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.isLoggedIn) void router.replace("/rides/feed");
  }, []);

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <VStack align="start" p={4} fontSize="5xl" fontWeight="bold">
        <Heading>Welcome to</Heading>
        <TitleComponent />
      </VStack>

      <Flex p={4} direction="row" gap={4}>
        <ButtonComponent href="users/login">Log In</ButtonComponent>
        <ButtonComponent href="users/signup" outline>
          Sign Up
        </ButtonComponent>
      </Flex>
    </Flex>
  );
};

export default Home;
