import { type NextPage } from "next";
import useUserNotifications from "~/hooks/useUserNotifications";
import Loading from "~/components/Loading";
import EmptyState from "~/components/EmptyState";

const NotificationList: NextPage = () => {
  const { notifications, isLoading } = useUserNotifications();

  if (isLoading) return <Loading />;
  return (
    <>
      {notifications && notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <p>{notification.message}</p>
            </li>
          ))}
        </ul>
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
