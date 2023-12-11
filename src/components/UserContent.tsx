import { Flex, Box } from "@chakra-ui/react";
import { useAuth } from "~/context/AuthContext";
import Layout from "./Layout";

const UserContent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <Flex direction="row" align="start" className="container mx-auto">
      <Box flexGrow={1} minHeight="100vh">
        {user && user.isLoggedIn ? <Layout>{children}</Layout> : children}
      </Box>
    </Flex>
  );
};

export default UserContent;
