import { ComponentPropsWithoutRef } from "react";

export function Code({ children, className, ...props }: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      {...props}
      className={`rounded-md bg-[#e9ecef] px-1.5 py-0.5 font-mono ${className ?? ""}`}
    >
      {children}
    </code>
  );
}
