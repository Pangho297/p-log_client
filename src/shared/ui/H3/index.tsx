import { PropsWithChildren } from "react";

export function H3({ children, ...props }: PropsWithChildren) {
  return (
    <h3 className="text-h3b text-primary mt-3" {...props}>
      {children}
    </h3>
  );
}
