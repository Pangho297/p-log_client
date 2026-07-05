import { QUERY_KEY } from "@/shared/constant/query-key";
import {
  GetPostListRequestDto,
  GetPostListResponseDto,
} from "@/shared/types/post";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchPost, fetchPostList } from "./server";

export const postQueries = {
  list: (params?: GetPostListRequestDto) =>
    infiniteQueryOptions<GetPostListResponseDto>({
      queryKey: QUERY_KEY.post.getPostList(params),
      initialPageParam: "",
      queryFn: ({ pageParam }) =>
        fetchPostList({
          ...params,
          limit: 20,
          cursor: String(pageParam),
        }),
      getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
    }),

  recentList: (params?: GetPostListRequestDto) =>
    queryOptions({
      queryKey: QUERY_KEY.post.getRecentPostList(params),
      queryFn: () =>
        fetchPostList({
          ...params,
          showRecent: true,
        }),
    }),

  detail: (slug: string) =>
    queryOptions({
      queryKey: QUERY_KEY.post.getPost(slug),
      queryFn: async () => {
        const post = await fetchPost(slug);

        if (!post) {
          throw new Error("게시글을 찾을 수 없습니다");
        }

        return post;
      },
    }),
};
