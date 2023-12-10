import { AuthCredentialsValidator } from "../lib/validators/account-credential-validator";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      // call the backend to create a user
      const payload = await getPayloadClient();

      //   Check if user exists
      const { docs: users } = await payload.find({
        // from the collection "users"
        collection: "users",
        // find the user with the same email where the email is equal to the email provided
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" });

      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      return { success: true, sentToEmail: email };
    }),
});
