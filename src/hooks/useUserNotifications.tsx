import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import type { UserNotifications } from "~/types/notification";
import { useLoading } from "./useLoading";
import supabase from "~/utils/supabaseClient";
import { useRouter } from "next/navigation";

interface UseUserNotificationsReturn {
  notifications: UserNotifications;
  loading: boolean;
}

const useUserNotifications = (): UseUserNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotifications>(null);
  const { loading, startLoading, stopLoading } = useLoading();
  const router = useRouter();

  if (!user) return { notifications: null, loading: false };

  const filter = `${user.type === "Driver" ? "driverId" : "riderId"}=eq.${
    user.id
  }`;

  const { data } =
    user.type === "Driver"
      ? api.notification.getDriverNotifications.useQuery({ id: user.id })
      : api.notification.getRiderNotifications.useQuery({ id: user.id });

  useEffect(() => {
    startLoading();

    const channel = supabase
      .channel("user notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Notification",
          filter,
        },
        (payload) => {
          if (payload.new) router.refresh();
        },
      )
      .subscribe();

    if (data) {
      setNotifications(data);
      stopLoading();
    }

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [data, supabase, router]);

  const result = useMemo(
    () => ({ notifications, loading }),
    [notifications, loading],
  );

  return result;
};

export default useUserNotifications;
