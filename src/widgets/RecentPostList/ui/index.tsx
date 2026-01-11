import { RecentPostItem } from "@/entities/RecentPostItem/ui";
import { postListMock } from "../model/mock";

export function RecentPostList() {
  return (
    <article className="flex flex-col gap-5">
      <h2 className="text-h2b text-primary">최근 게시글 목록</h2>
      <article className="flex flex-wrap justify-between gap-5">
        {postListMock.map((post) => (
          <RecentPostItem key={post.postId} post={post} />
        ))}
      </article>
    </article>
  );
}
