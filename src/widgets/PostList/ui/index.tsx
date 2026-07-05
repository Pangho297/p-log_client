"use client";

import { HorizontalPostItem, VerticalPostItem } from "@/entities";
import { useGetPostList, useResponsive, postListFormatter } from "@/shared";
import { useMemo } from "react";

export function PostList() {
  const { isMobile } = useResponsive();
  const { data: postList } = useGetPostList();
  const items = useMemo(
    () =>
      postListFormatter(postList?.pages.flatMap((post) => post.items) || []),
    [postList]
  );

  return (
    <article className="flex flex-col gap-5">
      <h2 className="text-h2b text-primary">게시글 목록</h2>
      <article className="flex flex-col gap-5">
        {items.map((post) =>
          isMobile ? (
            <VerticalPostItem key={post.slug} post={post} />
          ) : (
            <HorizontalPostItem key={post.slug} post={post} />
          )
        )}
      </article>
    </article>
  );
}
