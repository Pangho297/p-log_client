import { PropsWithChildren } from "react";

export function Hyperlink({
  children,
  href,
}: PropsWithChildren<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline"
    >
      {children}
    </a>
  );
}
