import { PropsWithChildren } from "react";

export function Blockquote({ children }: PropsWithChildren) {
  return (
    <blockquote className="border-l-4 border-black bg-[#fafafa] p-4">
      <em>{children}</em>
    </blockquote>
  );
}
