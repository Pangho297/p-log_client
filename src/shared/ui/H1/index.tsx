import { PropsWithChildren } from "react";

export function H1({ children, ...props }: PropsWithChildren) {
  return (
    <h1 className="text-h1b text-primary mt-5" {...props}>
      {children}
    </h1>
  );
}
