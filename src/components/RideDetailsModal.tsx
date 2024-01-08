import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Skeleton,
  Box,
  Flex,
  Card,
  HStack,
} from "@chakra-ui/react";
import type { RideStatusLocation } from "~/types/ride";
import { useState } from "react";
import ButtonComponent from "~/components/ButtonComponent";
import supabase from "~/utils/supabaseClient";
import Image from "next/image";

const RideDetailsModal: React.FC<{
  ride: RideStatusLocation;
  avatarUrl: string;
}> = ({ ride, avatarUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getVehicleImage = (path: string) => {
    const imageUrl = supabase.storage.from("photos").getPublicUrl(path);
    return imageUrl.data.publicUrl;
  };

  return (
    <>
      <ButtonComponent outline onClick={onOpen}>
        Driver Details
      </ButtonComponent>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="70vw">
          <ModalHeader color={"primary"} textAlign={"center"}>
            Driver Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box my={4}>
              <HStack justifyContent={"space-between"}>
                <Box flex={1}>
                  <Skeleton isLoaded={isLoaded}>
                    <Box
                      borderWidth="4px"
                      borderColor="primary"
                      rounded="md"
                      overflow="hidden"
                      display="inline-block"
                      mb={2}
                    >
                      <Image
                        src={avatarUrl}
                        width={120}
                        height={80}
                        alt="Driver Photo"
                        onLoad={() => setIsLoaded(true)}
                        objectFit="cover"
                      />
                    </Box>
                  </Skeleton>

                  <Text fontSize="sm">
                    Full Name:{" "}
                    <Text as="span" fontWeight={"semibold"} color={"primary"}>
                      {ride.driver?.fullName}
                    </Text>
                  </Text>
                  <Text fontSize="sm">
                    Vehicle:{" "}
                    <Text as="span" fontWeight={"semibold"} color={"primary"}>
                      {ride.driver?.vehicle?.type}
                    </Text>
                  </Text>
                  <Text fontSize="sm">
                    License Plate:{" "}
                    <Text as="span" fontWeight={"semibold"} color={"primary"}>
                      {ride.driver?.vehicle?.licensePlate}
                    </Text>
                  </Text>
                  <Text fontSize="sm">
                    Features:{" "}
                    <Text as="span" fontWeight={"semibold"} color={"primary"}>
                      {ride.driver?.vehicle?.features.join(", ")}
                    </Text>
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm">
                    Experience:{" "}
                    <Text as="span" fontWeight={"semibold"}>
                      {ride.driver?.drivingHistory?.experience}
                    </Text>
                  </Text>
                </Box>
              </HStack>
            </Box>

            <Flex wrap={"wrap"} gap={4} justifyContent={"center"} my={4}>
              {ride.driver?.vehicle?.photos?.map((photo, idx) => (
                <Skeleton isLoaded={isLoaded} key={idx}>
                  <Card
                    boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
                    className="transform transition-transform duration-300 ease-in-out hover:scale-125"
                  >
                    <Image
                      src={getVehicleImage(photo)}
                      width={200}
                      height={200}
                      alt="Vehicle Photo"
                      onLoad={() => setIsLoaded(true)}
                      objectFit="contain"
                      className="rounded-md"
                    />
                  </Card>
                </Skeleton>
              ))}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <ButtonComponent textOnly onClick={onClose}>
              Close
            </ButtonComponent>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RideDetailsModal;
