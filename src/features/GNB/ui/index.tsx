"use client";

import Link from "next/link";

import { Button, ICON, ROUTE } from "@/shared";

export function GNB() {
  return (
    <nav className="fixed top-0 z-30 flex h-16 w-full justify-center border-b bg-white not-lg:p-5">
      <article className="w-container flex size-full items-center justify-between">
        <Link href={ROUTE.HOME}>
          <ICON.LetterLogo className="text-primary h-8 w-auto" />
        </Link>
        <Link href={ROUTE.EDITOR}>
          <Button className="cursor-pointer">글 쓰러가기</Button>
        </Link>
      </article>
    </nav>
  );
}
