import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";

import { DEFAULT_THUMBNAIL, THUMBNAIL_MAP } from "../constant/common";
import { PostDto, PostItemDto } from "../types/post";

export function postFormatter(postList: PostDto[]): PostItemDto[] {
  const markdownToPlainText = (markdown: string) => {
    const tree = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .parse(markdown);

    return toString(tree, {
      includeImageAlt: false,
      includeHtml: false,
    })
      .replace(/\s+/g, " ")
      .trim();
  };

  const isImageDeliveryUrl = (value: string) => {
    try {
      const url = new URL(value);

      return url.protocol === "https:" && url.hostname === "imagedelivery.net";
    } catch {
      return false;
    }
  };

  const getThumbnailSrc = (thumbnail: string) => {
    if (isImageDeliveryUrl(thumbnail)) {
      return thumbnail;
    }

    if (thumbnail.startsWith("/")) {
      return thumbnail;
    }

    return (
      THUMBNAIL_MAP[thumbnail as keyof typeof THUMBNAIL_MAP] ??
      DEFAULT_THUMBNAIL
    );
  };

  return postList.map((item) => ({
    slug: item.slug,
    title: item.title,
    shortContent: markdownToPlainText(item.content).slice(0, 300),
    thumbnail: getThumbnailSrc(item.thumbnail),
    createdAt: item.createdAt,
  }));
}
