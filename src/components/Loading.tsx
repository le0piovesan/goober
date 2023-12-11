import { Box, keyframes } from "@chakra-ui/react";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loading = () => (
  <Box display="flex" alignItems="center" justifyContent="center">
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100px"
      width="100px"
      borderRadius="50%"
      border="6px solid white"
      borderTop="6px solid"
      animation={`${spin} 2s linear infinite`}
      className="text-primary"
    >
      <Box
        width="40px"
        height="40px"
        borderRadius="50%"
        border="6px solid white"
        borderTop="6px solid"
        animation={`${spin} 2s linear infinite`}
        className="text-primary"
      />
    </Box>
  </Box>
);

export default Loading;
