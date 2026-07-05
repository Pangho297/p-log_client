import { PostItemDto } from "@/shared";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface Props {
  post: PostItemDto;
}

export function HorizontalPostItem({ post }: Props) {
  return (
    <Link href={`/${post.slug}`} className="group">
      <div className="flex h-40 w-full overflow-hidden rounded-md border">
        {/* 썸네일 */}
        <div className="relative h-full w-96 shrink-0">
          <Image
            src={post.thumbnail}
            alt="post_thumbnail"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full max-w-203.5 bg-white p-5">
          <div className="flex flex-col gap-1">
            <p className="text-example text-gray-400">
              {format(post.createdAt, "yyyy.MM.dd")}
            </p>
            <h3 className="text-h3b group-hover:text-primary overflow-hidden text-ellipsis whitespace-nowrap transition-colors">
              {post.title}
            </h3>
          </div>
          <p className="text-b4 line-clamp-2 overflow-hidden text-ellipsis text-gray-500 italic">
            {post.shortContent}
          </p>
        </div>
      </div>
    </Link>
  );
}
