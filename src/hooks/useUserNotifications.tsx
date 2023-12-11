import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";

const useUserNotifications = () => {
  const { user } = useAuth();

  if (!user) return { notifications: null, isLoading: false };

  const { data: notifications, isLoading } =
    api.notification.getNotifications.useQuery({ id: user.id });

  return { notifications, isLoading };
};

export default useUserNotifications;
