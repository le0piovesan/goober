import type { Notification, Status, Location } from "@prisma/client";

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
    pickupLocation: Location;
    updatedAt: Date;
  } | null;
};

type UserNotifications = NotificationWithRide[] | null;

export type { NotificationWithRide, UserNotifications };
