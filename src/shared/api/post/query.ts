import { GetPostListRequestDto } from "@/shared/types/post";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { postQueries } from "./query-options";

export function useGetPostList(params?: GetPostListRequestDto) {
  return useInfiniteQuery(postQueries.list(params));
}

export function useGetRecentPostList(params?: GetPostListRequestDto) {
  return useQuery(postQueries.recentList(params));
}

export function useGetPost(slug: string) {
  return useQuery(postQueries.detail(slug));
}
