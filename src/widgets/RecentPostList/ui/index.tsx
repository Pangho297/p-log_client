import { VerticalPostItem } from "@/entities";
import { postListMock } from "@/shared";

export function RecentPostList() {
  return (
    <article className="flex flex-col gap-5">
      <h2 className="text-h2b text-primary">최근 게시글 목록</h2>
      <article className="flex flex-wrap justify-between gap-5 not-lg:flex-col">
        {postListMock.map((post) => (
          <VerticalPostItem key={post.postId} post={post} />
        ))}
      </article>
    </article>
  );
}
