"use client";

import { Button, ICON, ROUTE, useOwnerStore } from "@/shared";
import Link from "next/link";

export function GNB() {
  const { isOwner } = useOwnerStore();
  return (
    <nav className="flex h-16 justify-center border-b">
      <article className="w-container flex size-full items-center justify-between">
        <Link href={ROUTE.HOME}>
          <ICON.LetterLogo className="text-primary h-8 w-auto" />
        </Link>
        <Link href={`${ROUTE.EDITOR}${isOwner ? "" : "?demo=true"}`}>
          <Button className="cursor-pointer">글 쓰러가기</Button>
        </Link>
      </article>
    </nav>
  );
}
