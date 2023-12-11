import { ExpressContext } from "@/server";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<ExpressContext>().create();
export const router = t.router;
//  Public procedure is a procedure that can be called by anyone (Public)
export const publicProcedure = t.procedure;
