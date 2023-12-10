import { publicProcedure, router } from "./trpc";

// router is a TRPC router that contains all the procedures
// anyApiRoute is a procedure that can be called by anyone (Public)
export const appRouter = router({
  anyApiRoute: publicProcedure.query(() => {
    return "hello";
  }),
});

export type AppRouter = typeof appRouter;
