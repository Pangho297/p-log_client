import type { MetadataRoute } from "next";

import { fetchPostList } from "@/shared/api/post/server";
import { SITE_URL } from "@/shared/constant/site";
import type { PostDto } from "@/shared/types/post";

const SITEMAP_PAGE_SIZE = 100;

async function fetchAllPosts() {
  const posts: PostDto[] = [];
  let cursor: string | undefined;

  do {
    const response = await fetchPostList({
      limit: SITEMAP_PAGE_SIZE,
      cursor,
    });

    posts.push(...response.items);
    cursor = response.meta.hasNext ? response.meta.nextCursor : undefined;
  } while (cursor);

  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/${encodeURIComponent(post.slug)}`,
      lastModified: new Date(post.updatedAt ?? post.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
