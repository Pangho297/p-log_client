import { Preview, TOC } from "@/entities";
import { PostOwnerActions } from "@/features";
import { Hashtag, Loading, PostDto } from "@/shared";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  post: PostDto;
}

export function Post({ post }: Props) {
  if (!post.content) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative mt-16 mb-16 flex w-full justify-center not-xl:mt-4">
        <article className="flex w-full flex-col gap-5 xl:max-w-5xl">
          <div className="flex w-full flex-col gap-4 not-xl:p-4 xl:max-w-5xl">
            <h1 className="text-primary text-5xl leading-relaxed font-bold not-xl:text-3xl">
              {post.title}
            </h1>
            {/* 작성자 */}
            <div className="flex items-center gap-2">
              {/* 작성일 */}
              <p className="text-gray-400">
                {format(post.createdAt, "yyyy년 MM월 dd일")}
              </p>
            </div>
            {/* 해시태그 */}
            <div className="flex items-center justify-between gap-x-4">
              <div className="scrollbar-hide flex-1 overflow-auto">
                <div className="flex flex-nowrap gap-x-4 gap-y-2">
                  {/* @ts-ignore */}
                  {post.tags?.map((hashtag, index) => (
                    <Hashtag key={`${hashtag}_${index}`} hashtag={hashtag} />
                  ))}
                </div>
              </div>
              {/* 수정, 삭제 (작성자 본인만 표시) */}
              <PostOwnerActions postId={post.id} />
            </div>
            <div className="relative flex">
              <Preview doc={post.content} />
            </div>
          </div>
        </article>
        <TOC content={post.content} />
      </div>
    </Suspense>
  );
}
