import { type NextPage } from "next";
import useUserNotifications from "~/hooks/useUserNotifications";
import Loading from "~/components/Loading";
import EmptyState from "~/components/EmptyState";
import { List } from "@chakra-ui/react";
import NotificationCard from "~/components/NotificationCard";

const NotificationList: NextPage = () => {
  const { notifications, isLoading } = useUserNotifications();
  console.log(notifications);
  if (isLoading) return <Loading />;
  else
    return (
      <>
        {notifications && notifications.length > 0 ? (
          <List>
            {notifications
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
          </List>
        ) : (
          <EmptyState
            title="You don't have any notifications"
            subtext="We will keep you updated! 😉"
          />
        )}
      </>
    );
};

export default NotificationList;
