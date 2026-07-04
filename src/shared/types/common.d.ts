export interface SVGIconProps {
  className?: string;
}

export interface ErrorType {
  error: Error & { digest?: string }; // digest는 Next.js에서 에러를 식별하기위해 부여하는 고유한 식별자
  reset: () => void;
}

export interface ResponseSuccessDto {
  /** 요청에 대한 성공 여부 */
  success: boolean;
}

export interface PaginationResponseDto {
  /** 현재 설정된 최대 표출 개수 (페이지 사이즈) */
  limit: number;

  /** 다음 페이지 존재 여부, nextCursor도 함께 확인 필요 */
  hasNext: boolean;

  /** 다음 페이지 Cursor Key */
  nextCursor: string;
}
