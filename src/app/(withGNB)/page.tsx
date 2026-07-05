import { PostList, RecentPostList } from "@/widgets";

export default function Home() {
  return (
    <section className="flex flex-col gap-10 not-lg:p-5">
      <RecentPostList />
      <PostList />
    </section>
  );
}
