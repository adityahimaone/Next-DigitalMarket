"use client";

import { trpc } from "@/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState, PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
  // new QueryClient() is a react-query object that is used to cache data from the server
  const [queryClient] = useState(() => new QueryClient());
  // trpc.createClient is a function that creates a new trpc client object
  const [trpcClient] = useState(() =>
    trpc.createClient({
      // links is an array of links that are used to connect to the server
      links: [
        // httpBatchLink is a function that creates a new httpBatchLink object
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
          // fetch is a function that is used to send requests to the server
          fetch(url, options) {
            return fetch(url, {
              ...options,
              // credentials: "include" is used to send the cookies to the server
              credentials: "include",
            });
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
