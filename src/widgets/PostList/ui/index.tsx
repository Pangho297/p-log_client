"use client";

import { useMemo } from "react";

import { HorizontalPostItem, VerticalPostItem } from "@/entities";
import { postFormatter, useGetPostList, useResponsive } from "@/shared";

export function PostList() {
  const { isMobile } = useResponsive();
  const { data: postList } = useGetPostList();

  const items = useMemo(
    () => postFormatter(postList?.pages.flatMap((post) => post.items) || []),
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
