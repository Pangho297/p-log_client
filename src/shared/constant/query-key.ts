const ROOT_KEY = {
  user: "user",
};

export const QUERY_KEY = {
  user: {
    getUserSelf: () => [ROOT_KEY.user, "getUserSelf"],
  },
};
