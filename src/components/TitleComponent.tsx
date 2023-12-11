import { Flex, Box } from "@chakra-ui/react";

const TitleComponent = () => (
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
);

export default TitleComponent;
