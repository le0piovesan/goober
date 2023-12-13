import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import type { UserNotifications } from "~/types/notification";

interface UseUserNotificationsReturn {
  notifications: UserNotifications;
  isLoading: boolean;
}

const useUserNotifications = (): UseUserNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotifications>([]);

  if (!user) return { notifications: null, isLoading: false };

  const { isLoading, data } =
    user.type === "Driver"
      ? api.notification.getDriverNotifications.useQuery({ id: user.id })
      : api.notification.getRiderNotifications.useQuery({ id: user.id });

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  const result = useMemo(
    () => ({ notifications, isLoading }),
    [notifications, isLoading],
  );

  return result;
};

export default useUserNotifications;
