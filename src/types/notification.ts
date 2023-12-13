import type { Notification, Status } from "@prisma/client";

type NotificationWithRide = Notification & {
  ride: {
    status: {
      id: number;
      current: Status;
      acceptedAt: Date | null;
      finishedAt: Date | null;
    };
    tripFee: number;
    originName: string;
    updatedAt: Date;
  } | null;
};

type UserNotifications = NotificationWithRide[] | null;

export type { NotificationWithRide, UserNotifications };
