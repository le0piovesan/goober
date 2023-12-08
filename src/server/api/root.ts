import { riderRouter } from "~/server/api/routers/rider";
import { driverRouter } from "~/server/api/routers/driver";
import { rideRouter } from "~/server/api/routers/ride";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  rider: riderRouter,
  driver: driverRouter,
  ride: rideRouter,
});

export type AppRouter = typeof appRouter;
