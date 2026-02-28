export interface SVGIconProps {
  className?: string;
}

export interface ErrorType {
  error: Error & { digest?: string }; // digest는 Next.js에서 에러를 식별하기위해 부여하는 고유한 식별자
  reset: () => void;
}
