import { QUERY_KEY } from "@/shared/constant/query-key";
import {
  GetPostListRequestDto,
  GetPostListResponseDto,
} from "@/shared/types/post";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import * as PostAPI from ".";

export function useGetPostList(params?: GetPostListRequestDto) {
  return useInfiniteQuery<GetPostListResponseDto>({
    queryKey: QUERY_KEY.post.getPostList(params),
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      const res = await PostAPI.getPostList({
        ...params,
        limit: 20,
        cursor: String(pageParam),
      });

      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
  });
}

export function useGetRecentPostList(params?: GetPostListRequestDto) {
  return useQuery({
    queryKey: QUERY_KEY.post.getResentPostList(params),
    queryFn: async () => {
      const res = await PostAPI.getPostList({
        ...params,
        showRecent: true,
      });

      return res.data;
    },
  });
}
