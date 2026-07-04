"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";

import { setUnauthorizedHandler, useOwnerStore } from "@/shared";

function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.clear();
      useOwnerStore.getState().setIsOwner(false);
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [queryClient]);

  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: false,
            networkMode: "offlineFirst",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
