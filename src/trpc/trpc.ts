import { ExpressContext } from "@/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { User } from "payload/dist/auth";
import { PayloadRequest } from "payload/types";

// Initializes a tRPC server instance with ExpressContext as the context type and assigns it to the constant t.
const t = initTRPC.context<ExpressContext>().create();
// Creates a reference to the middleware function of the tRPC server instance.
const middleware = t.middleware;

// Defines an asynchronous middleware function named isAuth. This function will be used to check if a user is authenticated.
const isAuth = middleware(async ({ ctx, next }) => {
  // Extracts the req object from the context and typecasts it to PayloadRequest.
  const req = ctx.req as PayloadRequest;

  const { user } = req as { user: User | null };

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // the middleware function calls the next function with a new context that includes the user object.
  return next({
    ctx: {
      user,
    },
  });
});

// Exports the router of the tRPC server instance.
export const router = t.router;
// Exports the procedure function of the tRPC server instance. This can be used to define public procedures that can be called by anyone.
export const publicProcedure = t.procedure;
// Uses the isAuth middleware function to create a new procedure function that can only be called by authenticated users, and exports it.
export const privateProcedure = t.procedure.use(isAuth);
