import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc";

const handler = (req: Request) => {
  fetchRequestHandler({
    endpoint: "api/trpc",
    req,
    // appRouter is a TRPC router that contains all the procedures (BACKEND)
    router: appRouter,
    // @ts-expect-error context already passed from express middleware
    createContext: () => ({}),
  });
};

// This is a workaround for
export { handler as GET, handler as POST };
