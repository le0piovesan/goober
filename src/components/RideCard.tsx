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
} from "@chakra-ui/react";

import type { RideStatusLocation } from "~/types/ride";
import { formatDateTime } from "~/utils/dateFormatter";
import { useLoading } from "~/hooks/useLoading";
import Loading from "./Loading";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import ConfirmationPopover from "./ConfirmationPopover";
import { getStaticMapImage } from "~/utils/getStaticMapImage";
import { tagStatus } from "~/utils/tagStatusFormatter";

interface RideCardProps {
  ride: RideStatusLocation;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const { loading, startLoading, stopLoading } = useLoading();
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
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `${error.message} 😢`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } finally {
      stopLoading();
    }
  };

  if (loading) return <Loading />;
  else
    return (
      <Card
        bgColor={"light"}
        mb={2}
        boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      >
        <CardBody>
          <Badge colorScheme={tagStatus(ride.status.current).color}>
            {ride.status.current}
          </Badge>
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
                  onConfirm={() =>
                    user && ride && cancelRide(ride.id, user.type)
                  }
                />
              )}
            </Stack>
            <HStack justifyContent={"space-between"}>
              <Box>
                <Text fontSize="xs">
                  From:{" "}
                  <Text
                    as="span"
                    fontSize="sm"
                    color={"primary"}
                    fontWeight={"bold"}
                  >
                    {ride.originName}
                  </Text>
                </Text>
                <Text fontSize="xs">
                  To:{" "}
                  <Text
                    as="span"
                    fontSize="sm"
                    color={"secondary"}
                    fontWeight={"bold"}
                  >
                    {ride.destinationName}
                  </Text>
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="xs">
                  Distance:{" "}
                  <Text as="span" fontSize="sm" fontWeight={"bold"}>
                    {ride.distance}
                  </Text>
                </Text>
                <Text fontSize="xs">
                  Value:{" "}
                  <Text
                    as="span"
                    fontSize="sm"
                    color="green.600"
                    fontWeight={"bold"}
                  >
                    $ {ride.tripFee}
                  </Text>
                </Text>
              </Box>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    );
};
export default RideCard;
