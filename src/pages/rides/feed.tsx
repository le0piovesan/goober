import { Flex, VStack, useBreakpointValue } from "@chakra-ui/react";

import TitleComponent from "~/components/TitleComponent";
import MenuContent from "~/components/MenuContent";
import MenuDrawer from "~/components/MenuDrawer";
import ContainerCard from "~/components/ContainerCard";

const Feed = () => {
  const webScreen = useBreakpointValue({ base: false, lg: true });

  return (
    <Flex direction={webScreen ? "row" : "column"} minH="100vh" p={4}>
      <VStack fontSize="3xl" fontWeight="bold">
        <TitleComponent />
        {webScreen && <MenuContent />}
      </VStack>
      {!webScreen && <MenuDrawer />}
      <ContainerCard />
    </Flex>
  );
};

export default Feed;
