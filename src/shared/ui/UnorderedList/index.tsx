import { PropsWithChildren } from "react";

export function UnorderedList({ children }: PropsWithChildren) {
  return <ul className="list-inside list-disc">{children}</ul>;
}
