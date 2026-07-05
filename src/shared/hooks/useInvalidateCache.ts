import { QueryKey, useQueryClient } from "@tanstack/react-query";

export function useInvalidateCache() {
  const client = useQueryClient();

  const cleanAll = (rootKey: string) => {
    return client.invalidateQueries({
      queryKey: [rootKey],
      refetchType: "all",
    });
  };

  const cleanExact = (queryKey: QueryKey) => {
    return client.invalidateQueries({
      queryKey,
      exact: true,
    });
  };

  const cleanMatched = (queryKey: QueryKey) => {
    return client.invalidateQueries({
      queryKey,
    });
  };

  const removeMatched = (queryKey: QueryKey) => {
    client.removeQueries({
      queryKey,
    });
  };

  return { cleanAll, cleanExact, cleanMatched, removeMatched };
}
