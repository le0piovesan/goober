import {
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";

import MenuContent from "./MenuContent";

import { FiMenu } from "react-icons/fi";

import { useRef } from "react";

const MenuDrawer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <Flex justify="space-between" align="center" mb={4}>
        <IconButton
          ref={btnRef}
          color="light"
          bgColor="background"
          onClick={onOpen}
          _hover={{ bgColor: "primary" }}
          aria-label="Open Menu"
          icon={<FiMenu />}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton>✖️</DrawerCloseButton>
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody overflow={"hidden"}>
            <MenuContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default MenuDrawer;
