import { axiosInstance } from "@/shared/lib/axios";
import {
  CreatePostRequestDto,
  GetPostListRequestDto,
  GetPostListResponseDto,
  PostDto,
  UpdatePostRequestDto,
} from "@/shared/types/post";

/** 게시글 생성 */
export async function createPost(body: CreatePostRequestDto) {
  return await axiosInstance.post<PostDto>("/post", body);
}

/** 게시글 목록 조회 */
export async function getPostList(params: GetPostListRequestDto) {
  return await axiosInstance.get<GetPostListResponseDto>("/post", { params });
}

/** 게시글 상세 조회 */
export async function getPost(slug: string) {
  return await axiosInstance.get<PostDto>(`/post/${slug}`);
}

/** 게시글 수정 */
export async function updatePost({ slug, ...body }: UpdatePostRequestDto) {
  return await axiosInstance.patch(`/post/${slug}`, body);
}

/** 게시글 삭제 */
export async function deletePost(slug: string) {
  return await axiosInstance.delete(`/post/${slug}`);
}
