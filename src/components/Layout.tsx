import { Flex, useBreakpointValue, VStack, HStack } from "@chakra-ui/react";
import MenuContent from "~/components/MenuContent";
import MenuDrawer from "~/components/MenuDrawer";
import TitleComponent from "./TitleComponent";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const webScreen = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();

  if (webScreen)
    return (
      <Flex direction="row" height="100vh" p={4}>
        <VStack fontSize="3xl">
          <TitleComponent
            pointer
            onClick={() => router.replace("/rides/feed")}
          />
          {webScreen && <MenuContent />}
        </VStack>{" "}
        <Flex overflowY="auto" flex="1" justifyContent="center">
          {children}
        </Flex>
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
