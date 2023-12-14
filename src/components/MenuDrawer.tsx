import {
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  IconButton,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";

import MenuContent from "./MenuContent";

import { FiArrowLeft, FiMenu } from "react-icons/fi";
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
        <DrawerContent bgColor={"transparent"}>
          <DrawerCloseButton zIndex={1} mr={6} mt={2}>
            <Icon
              as={FiArrowLeft as React.ElementType}
              color={"primary"}
              boxSize={6}
            />
          </DrawerCloseButton>

          <DrawerBody overflow={"hidden"}>
            <MenuContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default MenuDrawer;
