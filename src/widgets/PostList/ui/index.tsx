"use client";

import { HorizontalPostItem, VerticalPostItem } from "@/entities";
import { postListMock, useResponsive } from "@/shared";

export function PostList() {
  const { isMobile } = useResponsive();
  return (
    <article className="flex flex-col gap-5">
      <h2 className="text-h2b text-primary">게시글 목록</h2>
      <article className="flex flex-col gap-5">
        {postListMock.map((post) =>
          isMobile ? (
            <VerticalPostItem key={post.postId} post={post} />
          ) : (
            <HorizontalPostItem key={post.postId} post={post} />
          )
        )}
      </article>
    </article>
  );
}
