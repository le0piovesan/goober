import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";

const useUserNotifications = () => {
  const { user } = useAuth();

  if (!user) return { notifications: null, isLoading: false };

  const { data: notifications, isLoading } =
    user.type === "Driver"
      ? api.notification.getDriverNotifications.useQuery({ id: user.id })
      : api.notification.getRiderNotifications.useQuery({ id: user.id });

  return { notifications, isLoading };
};

export default useUserNotifications;
