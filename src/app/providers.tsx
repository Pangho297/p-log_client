"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";

import { OWNER_USER_ID, setUnauthorizedHandler, useOwnerStore } from "@/shared";
import { useUserSelf } from "@/shared/api/user/query";

function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const setIsOwner = useOwnerStore((state) => state.setIsOwner);
  const { data: self, isError } = useUserSelf();

  useEffect(
    function unauthorized() {
      setUnauthorizedHandler(() => {
        queryClient.clear();
        useOwnerStore.getState().setIsOwner(false);
      });

      return () => {
        setUnauthorizedHandler(null);
      };
    },
    [queryClient]
  );

  useEffect(
    function detectOwner() {
      if (self) {
        setIsOwner(self.id === OWNER_USER_ID);
        return;
      }

      if (isError) {
        setIsOwner(false);
      }
    },
    [self, isError, setIsOwner]
  );

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
