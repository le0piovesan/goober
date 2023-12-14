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
} from "@chakra-ui/react";
import ButtonComponent from "./ButtonComponent";

const ConfirmationModal: React.FC<{ onConfirm: () => void }> = ({
  onConfirm,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ButtonComponent declineCancel onClick={onOpen}>
        Cancel
      </ButtonComponent>

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
            <Box fontSize="sm">We will look for another driver</Box>
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
