import { type NextPage } from "next";
import useUserNotifications from "~/hooks/useUserNotifications";
import EmptyState from "~/components/EmptyState";
import { Flex, Text, VStack } from "@chakra-ui/react";
import NotificationCard from "~/components/NotificationCard";
import NotificationCardSkeleton from "~/components/skeletons/NotificationCardSkeleton";

const NotificationList: NextPage = () => {
  const { notifications, isLoading } = useUserNotifications();

  return (
    <VStack width="100%" mx={2}>
      <Text fontSize="2xl" fontWeight="bold" color={"primary"} m={1}>
        Notification List
      </Text>
      {isLoading ? (
        <>
          <NotificationCardSkeleton />
          <NotificationCardSkeleton />
          <NotificationCardSkeleton />
        </>
      ) : notifications && notifications.length > 0 ? (
        <Flex direction="column">
          {notifications
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
        </Flex>
      ) : (
        <EmptyState
          title="You don't have any notifications"
          subtext="We will keep you updated! 😉"
        />
      )}
    </VStack>
  );
};

export default NotificationList;
