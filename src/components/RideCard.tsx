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
  Skeleton,
  Icon,
} from "@chakra-ui/react";

import type { RideStatusLocation } from "~/types/ride";
import { formatDateTime } from "~/utils/dateFormatter";
import { useLoading } from "~/hooks/useLoading";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import ConfirmationPopover from "./ConfirmationPopover";
import { getStaticMapImage } from "~/utils/getStaticMapImage";
import { tagStatus } from "~/utils/tagStatusFormatter";
import { FiMap } from "react-icons/fi";
import { useRouter } from "next/router";

interface RideCardProps {
  ride: RideStatusLocation;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const { loading, startLoading, stopLoading } = useLoading();
  const toast = useToast();
  const { user } = useAuth();
  const cancel = api.ride.cancelRide.useMutation();
  const router = useRouter();

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
      router.reload();
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
        {loading ? (
          <Skeleton height="20px" width="100px" />
        ) : (
          <HStack justifyContent={"space-between"}>
            <Badge colorScheme={tagStatus(ride.status.current).color}>
              {ride.status.current}
            </Badge>
            <Icon as={FiMap as React.ElementType} color={"primary"} />
          </HStack>
        )}

        <HStack justifyContent={"space-between"}>
          {loading ? (
            <Skeleton height="20px" width="150px" />
          ) : (
            <Text fontSize={"xs"}>
              Requested at: {formatDateTime(ride.createdAt)}
            </Text>
          )}
          {loading ? (
            <Skeleton height="20px" width="150px" />
          ) : (
            <Text fontSize={"xs"}>
              Updated at: {formatDateTime(ride.updatedAt)}
            </Text>
          )}
        </HStack>
        {loading ? (
          <Skeleton height="200px" />
        ) : (
          <Image
            src={getStaticMapImage(ride.pickupLocation, ride.dropoffLocation)}
            alt="Map Route"
            borderRadius="md"
            maxW="100%"
            h="200px"
          />
        )}

        <Stack mt="2" spacing="1">
          {loading ? (
            <Skeleton height="200px" />
          ) : (
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={{ base: 2, md: 4 }}
              justifyContent="space-between"
            >
              {ride.status.current === "ONGOING" && (
                <ConfirmationPopover
                  onConfirm={() =>
                    user && ride && cancelRide(ride.id, user.type)
                  }
                />
              )}
            </Stack>
          )}
          <HStack justifyContent={"space-between"}>
            <Box>
              {loading ? (
                <Skeleton height="20px" width="100px" />
              ) : (
                <Text fontSize="sm" fontWeight={"semibold"} color={"primary"}>
                  From: {ride.originName}
                </Text>
              )}
              {loading ? (
                <Skeleton height="20px" width="100px" />
              ) : (
                <Text fontSize="sm" fontWeight={"semibold"} color={"secondary"}>
                  To: {ride.destinationName}
                </Text>
              )}
            </Box>
            <Box textAlign="right">
              {loading ? (
                <Skeleton height="20px" width="80px" />
              ) : (
                <Text fontSize="sm" fontWeight={"semibold"}>
                  Distance: {ride.distance}
                </Text>
              )}
              {loading ? (
                <Skeleton height="20px" width="80px" />
              ) : (
                <Text fontSize="sm" fontWeight={"semibold"} color={"green"}>
                  Value: ${ride.tripFee}
                </Text>
              )}
            </Box>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default RideCard;
