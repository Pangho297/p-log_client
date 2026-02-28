"use client";

import { Button } from "@/shared";
import { Pencil } from "lucide-react";

interface Props {
  postId: string;
}

export function PostOwnerActions({ postId }: Props) {
  // 실제로는 나밖에 안쓸 계획이라 post의 owner Id는 필요 없을 것으로 예측하며
  // 토큰 검증을 통해 로그인했는지만 검증하면 될 것으로 보임
  // 계정도 1개 밖에 없고 (내꺼) 따라서 로그인할 수 있는 사용자도 나 밖에 없으니까...
  const token = false;

  // TODO: 토큰 검증 수행 후 토큰이 없으면 렌더링하지 않음
  if (!token) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {/* Modify 수행 */}
      <Button variant="ghost" className="size-10 p-1">
        <Pencil className="stroke-muted-foreground size-5" />
      </Button>
      {/* Delete 수행 */}
      {/* <DeleteDialog
        trigger={
          <Button variant="ghost" className="size-10 p-1">
            <Trash2 className="stroke-muted-foreground size-5" />
          </Button>
        }
        onAction={}
      /> */}
    </div>
  );
}
