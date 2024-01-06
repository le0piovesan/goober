import {
  Box,
  Card,
  CardBody,
  Stack,
  Image,
  Text,
  useToast,
  HStack,
  Badge,
  Icon,
} from "@chakra-ui/react";

import type { RideStatusLocation } from "~/types/ride";
import { formatDateTime } from "~/utils/dateFormatter";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import ConfirmationPopover from "./ConfirmationPopover";
import { getStaticMapImage } from "~/utils/getStaticMapImage";
import { tagStatus } from "~/utils/tagStatusFormatter";
import { FiMap } from "react-icons/fi";

interface RideCardProps {
  ride: RideStatusLocation;
  startLoading: () => void;
  stopLoading: () => void;
}

const RideCard: React.FC<RideCardProps> = ({
  ride,
  startLoading,
  stopLoading,
}) => {
  const toast = useToast();
  const { user } = useAuth();
  const cancel = api.ride.cancelRide.useMutation();

  const cancelRide = async (rideId: number, userType: string) => {
    try {
      startLoading();
      await cancel.mutateAsync({ id: rideId, userType });

      toast({
        title: "Success",
        description: "The ride was canceled successfully",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `${error.message} 😢`,
          status: "error",
          position: "top",
          duration: 4000,
          isClosable: true,
        });
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <Card
      bgColor={"light"}
      my={2}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      className="transform transition-transform duration-300 ease-in-out hover:scale-105"
    >
      <CardBody>
        <HStack justifyContent={"space-between"}>
          <Badge colorScheme={tagStatus(ride.status.current).color}>
            {ride.status.current}
          </Badge>
          <Icon as={FiMap as React.ElementType} color={"primary"} />
        </HStack>

        <HStack justifyContent={"space-between"}>
          <Text fontSize={"xs"}>
            Requested at: {formatDateTime(ride.createdAt)}
          </Text>

          <Text fontSize={"xs"}>
            Updated at: {formatDateTime(ride.updatedAt)}
          </Text>
        </HStack>

        <Image
          src={getStaticMapImage(ride.pickupLocation, ride.dropoffLocation)}
          alt="Map Route"
          borderRadius="md"
          maxW="100%"
          h="200px"
        />

        <Stack mt="2" spacing="1">
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 2, md: 4 }}
            justifyContent="space-between"
          >
            {ride.status.current === "ONGOING" && (
              <ConfirmationPopover
                onConfirm={() => user && ride && cancelRide(ride.id, user.type)}
              />
            )}
          </Stack>
          <HStack justifyContent={"space-between"}>
            <Box>
              <Text fontSize="sm" fontWeight={"semibold"} color={"primary"}>
                From: {ride.originName}
              </Text>

              <Text fontSize="sm" fontWeight={"semibold"} color={"secondary"}>
                To: {ride.destinationName}
              </Text>
            </Box>
            <Box textAlign="right">
              <Text fontSize="sm" fontWeight={"semibold"}>
                Distance: {ride.distance}
              </Text>

              <Text fontSize="sm" fontWeight={"semibold"} color={"green"}>
                Value: ${ride.tripFee}
              </Text>
            </Box>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default RideCard;
