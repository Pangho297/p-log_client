import { PropsWithChildren } from "react";

export function Code({ children }: PropsWithChildren) {
  return (
    <code className="rounded-md bg-[#e9ecef] px-1.5 py-0.5 font-mono">
      {children}
    </code>
  );
}
