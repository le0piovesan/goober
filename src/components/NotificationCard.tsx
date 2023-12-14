import {
  Text,
  Badge,
  HStack,
  useToast,
  Card,
  Icon,
  CardBody,
  Skeleton,
} from "@chakra-ui/react";
import type { NotificationWithRide } from "~/types/notification";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "~/context/AuthContext";
import ButtonComponent from "./ButtonComponent";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useLoading } from "~/hooks/useLoading";
import { formatDateTime } from "~/utils/dateFormatter";
import { type Location } from "@prisma/client";
import { tagStatus } from "~/utils/tagStatusFormatter";
import ConfirmationPopover from "./ConfirmationPopover";

type NotificationCardProps = {
  notification: NotificationWithRide;
  loading: boolean;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  loading,
}) => {
  const { user } = useAuth();
  const driverAccept = api.driver.acceptRide.useMutation();
  const driverDecline = api.driver.declineRide.useMutation();
  const toast = useToast();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

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

      await router.replace("/rides/feed");
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
      if (
        error instanceof Error &&
        error.message !== "No drivers found, try again later."
      ) {
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

  return (
    <Card
      bgColor={"light"}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      mb={2}
    >
      <CardBody>
        <HStack>
          <Icon
            as={FiCheckCircle as React.ElementType}
            color={tagStatus(notification.message).color}
          />
          <Badge colorScheme={tagStatus(notification.message).color}>
            {loading ? (
              <Skeleton height="20px" width="80px" />
            ) : (
              tagStatus(notification.message).tag
            )}
          </Badge>
        </HStack>
        <Text>
          {loading ? (
            <Skeleton height="20px" width="200px" />
          ) : (
            `In ${notification.ride?.originName}`
          )}
        </Text>
        <Text fontSize="sm">
          {loading ? (
            <Skeleton height="20px" width="250px" />
          ) : (
            <>
              The trip fee is:{" "}
              <Text as="span" fontWeight={"bold"} color={"green"}>
                $ {notification.ride?.tripFee}
              </Text>
            </>
          )}
        </Text>
        {user?.type === "Driver" &&
          notification.ride?.status.current === "REQUESTED" && (
            <HStack>
              <ButtonComponent
                onClick={() =>
                  acceptRide(notification.rideId!, notification.driverId!)
                }
              >
                {loading ? <Skeleton height="20px" width="80px" /> : "Accept"}
              </ButtonComponent>
              <ConfirmationPopover
                onConfirm={() =>
                  notification.ride &&
                  declineRide(
                    notification.rideId!,
                    notification.driverId!,
                    notification.ride.pickupLocation,
                  )
                }
              />
            </HStack>
          )}
        <Text fontSize="xs">
          {loading ? (
            <Skeleton height="20px" width="150px" />
          ) : (
            formatDateTime(notification.createdAt)
          )}
        </Text>
      </CardBody>
    </Card>
  );
};

export default NotificationCard;
