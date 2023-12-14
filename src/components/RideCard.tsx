import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";

import type { RideStatusLocation } from "~/types/ride";
import { formatDateTime } from "~/utils/dateFormatter";
import { colorStatus } from "~/utils/colorFormatter";
import { useLoading } from "~/hooks/useLoading";
import Loading from "./Loading";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import ConfirmationPopover from "./ConfirmationPopover";
import { getStaticMapImage } from "~/utils/getStaticMapImage";

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
      <Card>
        <CardBody>
          <Image
            src={getStaticMapImage(ride.pickupLocation, ride.dropoffLocation)}
            alt="Map Route"
            borderRadius="md"
            maxW="100%"
            h="auto"
          />
          <Stack mt="2" spacing="1">
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={{ base: 2, md: 4 }}
              justifyContent="space-between"
            >
              <Heading
                size="md"
                color={colorStatus(ride.status.current)}
                fontSize={{ base: "lg", md: "md" }}
              >
                {ride.status.current}
              </Heading>
              {ride.status.current === "ONGOING" && (
                <ConfirmationPopover
                  onConfirm={() =>
                    user && ride && cancelRide(ride.id, user.type)
                  }
                />
              )}
            </Stack>
            <Text>
              From:{" "}
              <Text as="span" fontSize="md" fontWeight={"bold"}>
                {ride.originName}
              </Text>
            </Text>
            <Text>
              To:{" "}
              <Text as="span" fontSize="md" fontWeight={"bold"}>
                {ride.destinationName}
              </Text>
            </Text>
            <Text>
              Distance:{" "}
              <Text as="span" fontSize="md" fontWeight={"bold"}>
                {ride.distance}
              </Text>
            </Text>
            <Text>
              Value:{" "}
              <Text
                as="span"
                color="green.600"
                fontSize="md"
                fontWeight={"bold"}
              >
                $ {ride.tripFee}
              </Text>
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Box>
            <Text fontSize={{ base: "sm", md: "md" }}>
              Requested at: {formatDateTime(ride.createdAt)}
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }}>
              Updated at: {formatDateTime(ride.updatedAt)}
            </Text>
          </Box>
        </CardFooter>
      </Card>
    );
};
export default RideCard;
