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
  HStack,
  useToast,
} from "@chakra-ui/react";

import type { RideWithStatus } from "~/types/ride";
import { formatDateTime } from "~/utils/dateFormatter";
import { colorStatus } from "~/utils/colorFormatter";
import ButtonComponent from "./ButtonComponent";
import { useLoading } from "~/hooks/useLoading";
import Loading from "./Loading";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";

interface RideCardProps {
  ride: RideWithStatus;
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
            src="https://placekitten.com/1000/300"
            alt="Green double couch with wooden legs"
            borderRadius="lg"
          />
          <Stack mt="2" spacing="1">
            <HStack justifyContent="space-between">
              <Heading size="md" color={colorStatus(ride.status.current)}>
                {ride.status.current}
              </Heading>
              {ride.status.current === "ONGOING" && (
                <ButtonComponent
                  declineCancel
                  onClick={() => user && ride && cancelRide(ride.id, user.type)}
                >
                  Cancel
                </ButtonComponent>
              )}
            </HStack>
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
            <Text fontSize="sm">
              Requested at: {formatDateTime(ride.createdAt)}
            </Text>
            <Text fontSize="xs">
              Updated at: {formatDateTime(ride.updatedAt)}
            </Text>
          </Box>
        </CardFooter>
      </Card>
    );
};
export default RideCard;
