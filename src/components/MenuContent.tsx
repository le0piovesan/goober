import { Flex } from "@chakra-ui/react";
import { FiMap, FiMapPin, FiBell, FiLogOut } from "react-icons/fi";
import ButtonComponent from "./ButtonComponent";

const MenuContent = () => (
  <Flex
    h="100vh"
    align={"flex-start"}
    direction={"column"}
    pr={4}
    overflow="hidden"
  >
    <ButtonComponent outline leftIcon={<FiMap size={24} />}>
      Home
    </ButtonComponent>
    <ButtonComponent outline leftIcon={<FiMapPin size={24} />}>
      Find Goober Driver
    </ButtonComponent>
    <ButtonComponent outline leftIcon={<FiBell size={24} />}>
      Notifications
    </ButtonComponent>
    <ButtonComponent outline leftIcon={<FiLogOut size={24} />}>
      Log Out
    </ButtonComponent>
  </Flex>
);

export default MenuContent;
