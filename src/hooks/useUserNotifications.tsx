import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useEffect, useMemo } from "react";
import type { UserNotifications } from "~/types/notification";
import { useLoading } from "./useLoading";
import supabase from "~/utils/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { type QueryKey } from "react-query";

interface UseUserNotificationsReturn {
  notifications: UserNotifications | null | undefined;
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const useUserNotifications = (): UseUserNotificationsReturn => {
  const { user } = useAuth();
  const { loading, startLoading, stopLoading } = useLoading();
  const queryClient = useQueryClient();

  if (!user)
    return { notifications: null, loading: false, startLoading, stopLoading };

  const filter = `${user.type === "Driver" ? "driverId" : "riderId"}=eq.${
    user.id
  }`;

  const queryKey: QueryKey =
    user.type === "Driver"
      ? getQueryKey(
          api.notification.getDriverNotifications,
          { id: user.id },
          "query",
        )
      : getQueryKey(
          api.notification.getRiderNotifications,
          { id: user.id },
          "query",
        );

  const { data: notifications } =
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
        () => {
          void queryClient.invalidateQueries(queryKey);
        },
      )
      .subscribe();

    if (notifications) stopLoading();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, queryKey, notifications, startLoading, stopLoading]);

  const result = useMemo(
    () => ({ notifications, loading, startLoading, stopLoading }),
    [notifications, loading, startLoading, stopLoading],
  );

  return result;
};

export default useUserNotifications;
