import {
  Box,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  HStack,
  Icon,
} from "@chakra-ui/react";
import ButtonComponent from "./ButtonComponent";
import { FiInfo } from "react-icons/fi";

const ConfirmationModal: React.FC<{
  onConfirm: () => void;
}> = ({ onConfirm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack justifyContent={"space-between"}>
        <ButtonComponent declineCancel onClick={onOpen}>
          Decline
        </ButtonComponent>
        <Icon as={FiInfo as React.ElementType} color={"primary"} />
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color="white" bg="background" borderColor="background">
          <ModalHeader>Confirmation!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to pass on this ride?</ModalBody>
          <ModalFooter
            border="0"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            pb={4}
          >
            <Box fontSize="sm">We will notify everyone</Box>
            <ButtonGroup size="sm">
              <ButtonComponent onClick={onClose}>Back</ButtonComponent>
              <ButtonComponent
                declineCancel
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Confirm
              </ButtonComponent>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
