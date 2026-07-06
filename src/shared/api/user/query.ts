import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "@/shared/constant/query-key";

import * as UserApi from ".";

export function useUserSelf() {
  return useQuery({
    queryKey: QUERY_KEY.user.getUserSelf(),
    queryFn: async () => {
      const res = await UserApi.self();

      return res.data;
    },
  });
}
