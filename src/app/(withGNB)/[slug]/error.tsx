"use client";

import Link from "next/link";

import { Button, Code, ErrorType, Pre, ROUTE } from "@/shared";

export default function PostDetailError({ error }: ErrorType) {
  const stack = error.stack;
  const message = error.message;

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 not-xl:p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-primary text-center text-9xl font-bold not-xl:text-6xl">
          {message}
        </h1>
        <p className="text-2xl font-thin not-xl:text-xl">
          서버와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요
        </p>
        <div className="flex flex-row gap-4">
          <Link href={ROUTE.HOME}>
            <Button>홈 화면으로 돌아가기</Button>
          </Link>
          <Button onClick={() => window.history.back()}>
            이전 페이지로 돌아가기
          </Button>
        </div>
      </div>
      {stack && (
        <div className="not-xl:w-full">
          <Pre>
            <Code>{stack}</Code>
          </Pre>
        </div>
      )}
    </main>
  );
}
