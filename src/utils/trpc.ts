import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { SuperJSON } from "superjson";
import type { AppRouter } from "~/server/api/root";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
  transformer: SuperJSON,
});
