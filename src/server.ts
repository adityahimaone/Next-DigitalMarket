import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import { IncomingMessage } from "http";
import bodyParser from "body-parser";
import { stripeWebhookHandler } from "./app/webhooks";
import nextBuild from "next/dist/build";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

/**
 * Starts the server and initializes the payload client.
 * @returns {Promise<void>} A promise that resolves when the server is started.
 */
const start = async () => {
  // middleware for webhook
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  // Initialize the payload client
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`ADMIN URL ${cms.getAdminURL()}`);
      },
    },
  });

  app.post("/api/webhook/stripe", webhookMiddleware, stripeWebhookHandler);

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Server started: Next.js for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

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
