"use client";

import { cn } from "@/shared";

import { useTOC } from "../model/useTOC";

interface Props {
  content: string;
}

export function TOC({ content }: Props) {
  const { activeId, headings, goToHeading } = useTOC({ content });

  return (
    <div className="ml-8 w-48 not-xl:hidden">
      {headings.length > 0 && (
        <nav className={"fixed top-47 border-l-4 p-4"}>
          <ul className="space-y-2 text-sm">
            {headings.map((heading, index) => (
              <li
                key={index}
                onClick={() => goToHeading(heading)}
                className={cn(
                  "hover:text-primary cursor-pointer text-base text-gray-400 transition-colors hover:font-bold",
                  heading.level === 1 || heading.level === 2
                    ? "pl-0"
                    : heading.level === 3
                      ? "pl-4"
                      : "pl-8",
                  // activeId와 일치하면 볼드 처리
                  activeId === heading.id && "text-primary font-bold"
                )}
              >
                {heading.text}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
