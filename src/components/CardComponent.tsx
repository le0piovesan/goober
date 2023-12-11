import { Box } from "@chakra-ui/react";

const CardComponent = ({ children }: { children: React.ReactNode }) => (
  <Box bg="white" p={4} rounded="md" shadow="md">
    {children}
  </Box>
);

export default CardComponent;
