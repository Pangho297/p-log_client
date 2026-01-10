import { PropsWithChildren } from "react";

export function OrderedList({ children }: PropsWithChildren) {
  return <ol className="list-inside list-decimal">{children}</ol>;
}
