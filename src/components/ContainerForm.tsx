import { Box } from "@chakra-ui/react";

const ContainerForm = ({
  children,
  transparent,
}: {
  children: React.ReactNode;
  transparent?: boolean;
}) => (
  <Box
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    p={4}
    bg={transparent ? "transparent" : "gray.100"}
  >
    {children}
  </Box>
);

export default ContainerForm;
