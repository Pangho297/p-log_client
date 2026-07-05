export const ROOT_KEY = {
  user: "user",
  post: "post",
} as const;

export const QUERY_KEY = {
  user: {
    getUserSelf: () => [ROOT_KEY.user, "getUserSelf"],
  },
};
