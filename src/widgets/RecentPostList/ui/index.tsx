"use client";

import { VerticalPostItem } from "@/entities";
import { postListFormatter, useGetRecentPostList } from "@/shared";
import { useMemo } from "react";

export function RecentPostList() {
  const { data: postList } = useGetRecentPostList({
    limit: 6,
  });
  const items = useMemo(
    () => postListFormatter(postList?.items || []),
    [postList]
  );
  return (
    <article className="flex flex-col gap-5">
      <h2 className="text-h2b text-primary">최근 게시글 목록</h2>
      <article className="flex flex-wrap gap-5 not-lg:flex-col">
        {items.map((post) => (
          <VerticalPostItem key={post.slug} post={post} />
        ))}
      </article>
    </article>
  );
}
