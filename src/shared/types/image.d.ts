export interface GetDirectUploadUrlRequestDto {
  /** 게시글 Id (PK) */
  postId: string;
}

export interface GetDirectUploadUrlResponseDto {
  /** 업로드될 이미지의 id, 클라이언트 측에선 이미지가 업로드되면 반영될 이미지의 id */
  imageId: string;

  /** Cloudflare 업로드 URL, 클라이언트 측은 이 URL로 이미지를 직접 업로드해야 합니다 */
  uploadURL: string;

  /** 업로드될 이미지의 URL, 업로드가 완료되면 이미지를 표시할 수 있는 URL이 됩니다 */
  deliveryURL: string;
}
