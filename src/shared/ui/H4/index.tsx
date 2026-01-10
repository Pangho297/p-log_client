import { PropsWithChildren } from "react";

export function H4({ children, ...props }: PropsWithChildren) {
  return (
    <h4 className="text-h4 text-primary mt-2" {...props}>
      {children}
    </h4>
  );
}
