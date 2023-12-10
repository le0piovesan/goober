import { useAuth } from "~/context/AuthContext";
import SideBar from "~/components/SideBar";
import { Flex, Box } from "@chakra-ui/react";

const UserContent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <Flex direction="row" align="start" className="container mx-auto">
      {user && user.isLoggedIn && <SideBar />}
      <Box flexGrow={1} minHeight="100vh" borderX="1px">
        {children}
      </Box>
    </Flex>
  );
};

export default UserContent;
