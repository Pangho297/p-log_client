import { axiosInstance } from "@/shared/lib/axios";
import {
  GetDirectUploadUrlRequestDto,
  GetDirectUploadUrlResponseDto,
} from "@/shared/types/image";

/** Cloudflare 이미지 업로드 URL 요청 */
export async function getDirectUploadUrl(body: GetDirectUploadUrlRequestDto) {
  return await axiosInstance.post<GetDirectUploadUrlResponseDto>(
    "/images/direct-upload-url",
    body
  );
}
