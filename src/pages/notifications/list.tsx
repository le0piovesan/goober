import { type NextPage } from "next";
import { Heading } from "@chakra-ui/react";
import useUserNotifications from "~/hooks/useUserNotifications";
import ContainerContent from "~/components/ContainerContent";
import Loading from "~/components/Loading";

const NotificationList: NextPage = () => {
  const { notifications, isLoading } = useUserNotifications();

  if (isLoading) return <Loading />;
  return (
    <ContainerContent>
      <Heading>My latest notifications: </Heading>
      {notifications && notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <p>{notification.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no notifications</p>
      )}
    </ContainerContent>
  );
};

export default NotificationList;
