import {
  ListIcon,
  ListItem,
  Box,
  VStack,
  Text,
  Badge,
  HStack,
  useToast,
} from "@chakra-ui/react";
import type { NotificationWithRide } from "~/types/notification";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "~/context/AuthContext";
import ButtonComponent from "./ButtonComponent";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useLoading } from "~/hooks/useLoading";
import Loading from "./Loading";
import { formatDateTime } from "~/utils/dateFormatter";
import { type Location } from "@prisma/client";

const NotificationCard: React.FC<{ notification: NotificationWithRide }> = ({
  notification,
}) => {
  const { user } = useAuth();
  const driverAccept = api.driver.acceptRide.useMutation();
  const driverDecline = api.driver.declineRide.useMutation();
  const toast = useToast();
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoading();

  const acceptRide = async (rideId: number, driverId: number) => {
    try {
      startLoading();
      await driverAccept.mutateAsync({ rideId, driverId });

      toast({
        title: "Success",
        description: "Your ride has been accepted!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      await router.push("/rides/feed");
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

  const declineRide = async (
    rideId: number,
    driverId: number,
    pickupLocation: Location,
  ) => {
    try {
      startLoading();
      await driverDecline.mutateAsync({ rideId, driverId, pickupLocation });

      toast({
        title: "Success",
        description: "You declined the ride",
        status: "info",
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

  const colorStatus = (message: string) => {
    switch (message) {
      case "You have a new ride request":
        return "yellow";
      case "You have accepted the ride":
        return "green";
      case "You have declined this ride":
        return "blue";
      case "The rider has canceled the ride":
        return "red";
      case "You have canceled the ride":
        return "orange";
      case "Ride completed! 🚀":
        return "primary";
      default:
        return "gray";
    }
  };
  if (loading) return <Loading />;

  return (
    <ListItem marginBottom="2">
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        {user?.type === "Driver" && (
          <VStack padding="2" align="start">
            <HStack>
              <ListIcon
                as={FiCheckCircle as React.ElementType}
                color={colorStatus(notification.message)}
              />
              <Badge colorScheme={colorStatus(notification.message)}>
                {notification.message}
              </Badge>
            </HStack>
            <Text>In {notification.ride?.originName}</Text>
            <Text fontSize="sm">
              The trip fee is:{" "}
              <Text as="span" fontWeight={"bold"} color={"green"}>
                $ {notification.ride?.tripFee}
              </Text>
            </Text>
            {notification.ride?.status.current === "REQUESTED" && (
              <HStack>
                <ButtonComponent
                  onClick={() =>
                    acceptRide(notification.rideId!, notification.driverId!)
                  }
                >
                  Accept
                </ButtonComponent>
                <ButtonComponent
                  decline
                  onClick={() =>
                    notification.ride &&
                    declineRide(
                      notification.rideId!,
                      notification.driverId!,
                      notification.ride.pickupLocation,
                    )
                  }
                >
                  Decline
                </ButtonComponent>
              </HStack>
            )}
            <Text fontSize="xs">{formatDateTime(notification.createdAt)}</Text>
          </VStack>
        )}
      </Box>
    </ListItem>
  );
};

export default NotificationCard;
