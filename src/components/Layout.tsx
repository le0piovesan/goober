import { Flex, useBreakpointValue, VStack } from "@chakra-ui/react";
import MenuContent from "~/components/MenuContent";
import MenuDrawer from "~/components/MenuDrawer";
import TitleComponent from "./TitleComponent";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const webScreen = useBreakpointValue({ base: false, lg: true });

  return (
    <Flex direction={webScreen ? "row" : "column"} minH="100vh" p={4}>
      <VStack fontSize="3xl" fontWeight="bold">
        <TitleComponent />
        {webScreen && <MenuContent />}
      </VStack>
      {!webScreen && <MenuDrawer />}
      {children}
    </Flex>
  );
};

export default Layout;
