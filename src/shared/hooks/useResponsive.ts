"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false); // 모바일 검증 상태
  const mobile = useMediaQuery({ query: "(max-width: 1280px)" });

  // Next.js의 Prerender 특성 때문에 브라우저에서 첫 번째 렌더링과 실제 렌더링된 React 트리간의 차이를 감지하기 위한 Effect
  // 단점으론 window의 사이즈를 감지하지 못하는 단점이 존재한다
  useEffect(() => {
    if (mobile) setIsMobile(mobile);
  }, [mobile]);

  return { isMobile };
}
