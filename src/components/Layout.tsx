import {
  Flex,
  useBreakpointValue,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import MenuContent from "~/components/MenuContent";
import MenuDrawer from "~/components/MenuDrawer";
import TitleComponent from "./TitleComponent";
import { useAuth } from "~/context/AuthContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const webScreen = useBreakpointValue({ base: false, lg: true });
  const { user } = useAuth();

  if (webScreen)
    return (
      <Flex direction={"row"} p={4}>
        <VStack fontSize="3xl">
          <TitleComponent />
          <Text fontSize="2xl">
            Hello, {user?.type === "Driver" ? "Driver" : "Rider"}
          </Text>
          {webScreen && <MenuContent />}
        </VStack>
        {children}
      </Flex>
    );
  else
    return (
      <Flex direction={"column"} p={4}>
        <HStack fontSize={"3xl"} justifyContent="space-between" align="center">
          {!webScreen && <MenuDrawer />}
          <Text fontSize={"2xl"}>
            Hello, {user?.type === "Driver" ? "Driver" : "Rider"}
          </Text>
          <TitleComponent />
        </HStack>
        {children}
      </Flex>
    );
};

export default Layout;
