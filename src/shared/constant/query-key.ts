import { GetPostListRequestDto } from "../types/post";

export const ROOT_KEY = {
  user: "user",
  post: "post",
} as const;

export const QUERY_KEY = {
  user: {
    getUserSelf: () => [ROOT_KEY.user, "getUserSelf"],
  },
  post: {
    getPostList: (params?: GetPostListRequestDto) => [
      ROOT_KEY.post,
      "getPostList",
      params,
    ],
    getRecentPostList: (params?: GetPostListRequestDto) => [
      ROOT_KEY.post,
      "getRecentPostList",
      params,
    ],
    getPost: (slug: string) => [ROOT_KEY, "getPost", slug],
  },
};
