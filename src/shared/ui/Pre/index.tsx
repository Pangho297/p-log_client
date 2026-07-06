"use client";

import { Copy } from "lucide-react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

import { Button } from "../Button";

export function Pre({ children }: PropsWithChildren) {
  const [text, setText] = useState("");
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setText(preRef.current?.textContent ?? "");
  }, [children]);

  const handleCopy = () => {
    if (!text) {
      // TODO: 복사할 텍스트 없음 토스트 메시지 출력
      return;
    }

    navigator.clipboard.writeText(text);
    // TODO: 복사 완료 토스트 메시지 출력
  };

  return (
    <div className="relative">
      <Button
        className="absolute top-1 right-1 z-10 size-10 bg-[#fafafa] p-1"
        variant="ghost"
        type="button"
        onClick={handleCopy}
      >
        <Copy className="stroke-muted-foreground" />
      </Button>
      <pre
        ref={preRef}
        className="relative w-full overflow-auto rounded-md bg-[#fafafa] p-5 leading-[1.3] [&>code]:bg-transparent [&>code]:p-0 [&>code]:leading-0"
      >
        {children}
      </pre>
    </div>
  );
}
