"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared";

export function GoBackBtn() {
  const router = useRouter();

  return <Button onClick={() => router.back()}>이전 페이지로 돌아가기</Button>;
}
