import { riderRouter } from "~/server/api/routers/rider";
import { driverRouter } from "~/server/api/routers/driver";
import { rideRouter } from "~/server/api/routers/ride";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { notificationRouter } from "./routers/notification";
import { quizRouter } from "./routers/quiz";
import { onboardingRouter } from "./routers/onboarding";

export const appRouter = createTRPCRouter({
  rider: riderRouter,
  driver: driverRouter,
  ride: rideRouter,
  auth: authRouter,
  notification: notificationRouter,
  quiz: quizRouter,
  onboarding: onboardingRouter,
});

export type AppRouter = typeof appRouter;
