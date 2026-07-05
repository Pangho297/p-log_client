import { postQueries } from "@/shared";
import { PostList, RecentPostList } from "@/widgets";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(postQueries.recentList({ limit: 6 })),
    queryClient.prefetchInfiniteQuery(postQueries.list()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="flex flex-col gap-10 not-lg:p-5 lg:my-8">
        <RecentPostList />
        <PostList />
      </section>
    </HydrationBoundary>
  );
}
