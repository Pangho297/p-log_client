import { PaginationResponseDto } from "./common";

export interface PostDto {
  /** 게시글 Id (PK) */
  id: string;

  /** 작성자 Id (FK) */
  userId: string;

  /** 게시글 URL 식별자 */
  slug: string;

  /** 게시글 제목 */
  title: string;

  /** 게시글 내용 */
  content: string;

  /** 게시글 썸네일 */
  thumbnail: string;

  /** 식별 태그 목록 */
  tags: string[];

  /** 게시글 생성일 */
  createdAt: string;

  /** 게시글 수정일 */
  updatedAt: string;

  /** 게시글 삭제일 */
  deletedAt: string;
}

export interface PostItemDto {
  /** 게시글 URL 식별자 */
  slug: string;

  /** 게시글 제목 */
  title: string;

  /** 게시글 요약 */
  shortContent: string;

  /** 썸네일 이미지 URL */
  thumbnail: string;

  /** 게시글 작성일 */
  createdAt: string;
}

export interface CreatePostRequestDto {
  /** 글 제목 */
  title: string;

  /** 글 내용 */
  content: string;

  /** 카테고리 목록 */
  tags: string[];
}

export interface GetPostListRequestDto {
  /** 최대 표출 개수 (페이지 사이즈) */
  limit?: number;

  /** 페이지 좌표 (Cursor Meta) */
  cursor?: string;

  /** 최신 게시글 목록 */
  showRecent?: boolean;

  /** 인기 게시글 목록 (계획 중) */
  showBest?: boolean;
}

export interface GetPostListResponseDto {
  /** 데이터 목록 */
  items: PostDto[];

  /** Cursor Meta 페이지 네이트 */
  meta: PaginationResponseDto;
}

export interface UpdatePostRequestDto extends Partial<CreatePostRequestDto> {
  /** 게시글 식별자 */
  slug: string;
}
