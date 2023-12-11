import { Flex, Box } from "@chakra-ui/react";

const UserContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex direction="row" align="start" className="container mx-auto">
      <Box flexGrow={1} minHeight="100vh">
        {children}
      </Box>
    </Flex>
  );
};

export default UserContent;
