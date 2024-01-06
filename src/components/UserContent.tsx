import { Flex, Box } from "@chakra-ui/react";
import { useAuth } from "~/context/AuthContext";
import Layout from "./Layout";
import { useLoading } from "~/hooks/useLoading";

const UserContent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { loading } = useLoading();

  return (
    <Flex direction="row" align="start" className="container mx-auto">
      <Box flexGrow={1} minHeight="100vh">
        {!loading && user && user.isLoggedIn && user.profileCompleted ? (
          <Layout>{children}</Layout>
        ) : (
          children
        )}
      </Box>
    </Flex>
  );
};

export default UserContent;
