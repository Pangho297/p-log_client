"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { DeleteDialog } from "@/features/DeleteDialog";
import { Button, ROUTE, useDeletePost, useOwnerStore } from "@/shared";

interface Props {
  slug: string;
}

export function PostOwnerActions({ slug }: Props) {
  const { isOwner } = useOwnerStore();
  const { mutate: deletePost } = useDeletePost();

  if (!isOwner) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {/* Modify 수행 */}
      <Link href={`${ROUTE.EDITOR}?slug=${slug}`}>
        <Button variant="ghost" className="size-10 p-1">
          <Pencil className="stroke-muted-foreground size-5" />
        </Button>
      </Link>
      {/* Delete 수행 */}
      <DeleteDialog
        trigger={
          <Button variant="ghost" className="size-10 p-1">
            <Trash2 className="stroke-muted-foreground size-5" />
          </Button>
        }
        onAction={() => deletePost(slug)}
      />
    </div>
  );
}
