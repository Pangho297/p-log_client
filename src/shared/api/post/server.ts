import {
  GetPostListRequestDto,
  GetPostListResponseDto,
  PostDto,
} from "@/shared/types/post";

function createUrl(path: string, params?: Record<string, any>) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

export async function fetchPostList(params: GetPostListRequestDto) {
  const res = await fetch(createUrl("/post", params), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("게시글 목록 조회에 실패했습니다.");
  }

  return res.json() as Promise<GetPostListResponseDto>;
}

export async function fetchPost(slug: string) {
  const res = await fetch(createUrl(`/post/${slug}`), {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<PostDto>;
}
