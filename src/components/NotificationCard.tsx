import {
  Text,
  Badge,
  HStack,
  useToast,
  Card,
  Icon,
  CardBody,
  Skeleton,
  Divider,
} from "@chakra-ui/react";
import type { NotificationWithRide } from "~/types/notification";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "~/context/AuthContext";
import ButtonComponent from "./ButtonComponent";
import { api } from "~/utils/api";
import { useLoading } from "~/hooks/useLoading";
import { formatDateTime } from "~/utils/dateFormatter";
import { type Location } from "@prisma/client";
import { tagStatus } from "~/utils/tagStatusFormatter";
import ConfirmationPopover from "./ConfirmationPopover";

type NotificationCardProps = {
  notification: NotificationWithRide;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const { user } = useAuth();
  const driverAccept = api.driver.acceptRide.useMutation();
  const driverDecline = api.driver.declineRide.useMutation();
  const toast = useToast();
  const { loading, startLoading, stopLoading } = useLoading();

  const acceptRide = async (rideId: number, driverId: number) => {
    startLoading();
    try {
      await driverAccept.mutateAsync({ rideId, driverId });

      toast({
        title: "Success",
        description: "Your ride has been accepted!",
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

  const declineRide = async (
    rideId: number,
    driverId: number,
    pickupLocation: Location,
    type: "Regular" | "Luxury",
  ) => {
    startLoading();
    try {
      await driverDecline.mutateAsync({
        rideId,
        driverId,
        pickupLocation,
        type,
      });

      toast({
        title: "Success",
        description: "You declined the ride",
        status: "info",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !== "No drivers found, try again later."
      ) {
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
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      mb={2}
    >
      <CardBody>
        {loading ? (
          <Skeleton height="20px" width="80px" />
        ) : (
          <HStack>
            <Icon
              as={FiCheckCircle as React.ElementType}
              color={tagStatus(notification.message).color}
            />
            <Badge colorScheme={tagStatus(notification.message).color}>
              {tagStatus(notification.message).tag}
            </Badge>
          </HStack>
        )}
        {loading ? (
          <Skeleton height="20px" width="200px" />
        ) : (
          <Text fontSize={"md"} color={"primary"}>
            {notification.message}
          </Text>
        )}
        <Divider />
        {loading ? (
          <Skeleton height="20px" width="200px" />
        ) : (
          <Text fontSize={"sm"}>In {notification.ride?.originName}</Text>
        )}
        <Text fontSize="sm">
          {loading ? (
            <Skeleton height="20px" width="250px" />
          ) : (
            <>
              The trip fee is:{" "}
              <Text as="span" fontWeight={"bold"} color={"green"}>
                ${notification.ride?.tripFee}
              </Text>
            </>
          )}
        </Text>
        {loading ? (
          <Skeleton height="20px" width="250px" />
        ) : (
          user?.type === "Driver" &&
          notification.ride?.status.current === "REQUESTED" && (
            <HStack>
              <ButtonComponent
                onClick={() =>
                  acceptRide(notification.rideId!, notification.driverId!)
                }
              >
                Accept
              </ButtonComponent>
              <ConfirmationPopover
                onConfirm={() =>
                  notification.ride &&
                  declineRide(
                    notification.rideId!,
                    notification.driverId!,
                    notification.ride.pickupLocation,
                    notification.ride.type as "Regular" | "Luxury",
                  )
                }
              />
            </HStack>
          )
        )}

        <Divider />
        {loading ? (
          <Skeleton height="20px" width="150px" />
        ) : (
          <Text fontSize="xs">{formatDateTime(notification.createdAt)}</Text>
        )}
      </CardBody>
    </Card>
  );
};

export default NotificationCard;
