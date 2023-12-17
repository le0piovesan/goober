import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import type { UserNotifications } from "~/types/notification";
import { useLoading } from "./useLoading";

interface UseUserNotificationsReturn {
  notifications: UserNotifications;
  loading: boolean;
}

const useUserNotifications = (): UseUserNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotifications>([]);
  const { loading, startLoading, stopLoading } = useLoading();

  if (!user) return { notifications: null, loading: false };

  const { data } =
    user.type === "Driver"
      ? api.notification.getDriverNotifications.useQuery({ id: user.id })
      : api.notification.getRiderNotifications.useQuery({ id: user.id });

  useEffect(() => {
    startLoading();
    if (data) {
      setNotifications(data);
      stopLoading();
    }
  }, [data]);

  const result = useMemo(
    () => ({ notifications, loading }),
    [notifications, loading],
  );

  return result;
};

export default useUserNotifications;
