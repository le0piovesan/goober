import { Box, VStack } from "@chakra-ui/react";

type TitleComponentProps = {
  onClick?: () => void;
  pointer?: boolean;
};

const TitleComponent: React.FC<TitleComponentProps> = ({
  onClick,
  pointer,
}) => {
  return (
    <VStack
      align="center"
      onClick={onClick}
      _hover={{ cursor: pointer && "pointer" }}
    >
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
    </VStack>
  );
};

export default TitleComponent;
