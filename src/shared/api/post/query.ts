import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { GetPostListRequestDto } from "@/shared/types/post";

import { postQueries } from "./query-options";

export function useGetPostList(params?: GetPostListRequestDto) {
  return useInfiniteQuery(postQueries.list(params));
}

export function useGetRecentPostList(params?: GetPostListRequestDto) {
  return useQuery(postQueries.recentList(params));
}

export function useGetPost(params: { slug: string; enabled?: boolean }) {
  return useQuery(postQueries.detail(params));
}
