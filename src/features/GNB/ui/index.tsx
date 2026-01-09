"use client";

import { ICON } from "@/shared";

export function GNB() {
  return (
    <nav className="flex h-16 justify-center border-b">
      <article className="w-container flex size-full items-center justify-between">
        <ICON.LetterLogo className="text-primary h-8 w-auto" />
      </article>
    </nav>
  );
}
