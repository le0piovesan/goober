import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "~/context/AuthContext";

const TitleComponent = () => {
  const { user } = useAuth();

  return (
    <VStack align="center">
      <Box>
        <Box
          as="span"
          bgGradient="linear(to-r, primary, secondary)"
          bgClip="text"
          color="transparent"
          className="bg-gradient-to-r
             from-primary to-secondary bg-clip-text text-transparent"
          fontWeight={"bold"}
        >
          Goober
        </Box>
        <Box as="span" role="img" aria-label="taxi">
          🚕
        </Box>
      </Box>
      {user && user.isLoggedIn && (
        <HStack>
          <Text fontSize="md" color={"gray"}>
            Hello, {user?.type === "Driver" ? "Driver" : "Rider"} {user?.name}
          </Text>
        </HStack>
      )}
    </VStack>
  );
};

export default TitleComponent;
