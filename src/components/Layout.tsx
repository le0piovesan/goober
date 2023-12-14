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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const webScreen = useBreakpointValue({ base: false, lg: true });

  if (webScreen)
    return (
      <Flex direction={"row"} p={4} justifyContent="space-evenly">
        <VStack fontSize="3xl">
          <TitleComponent />
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
          <TitleComponent />
        </HStack>
        {children}
      </Flex>
    );
};

export default Layout;
