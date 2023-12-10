import express from "express";

import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

/**
 * Starts the server and initializes the payload client.
 * @returns {Promise<void>} A promise that resolves when the server is started.
 */
const start = async () => {
  // Initialize the payload client
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`ADMIN URL ${cms.getAdminURL()}`);
      },
    },
  });

  // Add trpc middleware
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      // All the trpc options
      router: appRouter,
      // Add additional context providers here
      createContext,
    })
  );

  // Add next.js middleware
  app.use((req, res) => nextHandler(req, res));

  // Prepare next.js app
  nextApp.prepare().then(() => {
    payload.logger.info("Next.js app prepared, starting server...");

    app.listen(PORT, () => {
      payload.logger.info(
        `Next.js app URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
