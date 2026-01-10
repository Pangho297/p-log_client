import { PropsWithChildren } from "react";

export function H2({ children, ...props }: PropsWithChildren) {
  return (
    <h2 className="text-h2 text-primary mt-4" {...props}>
      {children}
    </h2>
  );
}
