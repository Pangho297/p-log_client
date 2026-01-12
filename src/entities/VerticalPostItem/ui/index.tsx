import Link from "next/link";
import { format } from "date-fns";
import { PostMockDto } from "@/shared";

interface Props {
  // FIXME: Mock 데이터 타입임
  post: PostMockDto;
}

export function VerticalPostItem({ post }: Props) {
  return (
    <Link
      href={`/${post.postId}`}
      className="group max-w-1/3 shrink-0 not-lg:max-w-full"
    >
      <div className="relative flex h-80 w-full max-w-96 flex-col-reverse overflow-hidden rounded-md border">
        {/* 썸네일 */}
        <div className="absolute top-0 left-0 h-full w-full bg-gray-200 object-cover" />
        <div className="z-10 w-full border-t bg-white p-5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-example text-gray-400">
                {format(post.createdAt, "yyyy.MM.dd")}
              </p>
              <h3 className="text-h3b group-hover:text-primary w-full overflow-hidden text-ellipsis whitespace-nowrap transition-colors">
                {post.title}
              </h3>
            </div>
            <p className="text-b4 line-clamp-2 overflow-hidden text-ellipsis text-gray-500 italic">
              {post.shortContent}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
