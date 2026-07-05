"use client";

import { useMutation } from "@tanstack/react-query";
import * as PostAPI from ".";
import { CreatePostRequestDto } from "@/shared/types/post";
import { useRouter } from "next/navigation";
import { useInvalidateCache } from "@/shared/hooks/useInvalidateCache";
import { ROOT_KEY } from "@/shared/constant/query-key";
import { ROUTE } from "@/shared/constant/route";
import { toast } from "sonner";

export function useCreatePost() {
  const route = useRouter();
  const { cleanAll } = useInvalidateCache();

  return useMutation({
    mutationFn: async (body: CreatePostRequestDto) => {
      await PostAPI.createPost(body);
    },
    onSuccess: () => {
      cleanAll(ROOT_KEY.post);
      toast("게시글이 작성되었습니다! 🚀");
      route.push(ROUTE.HOME);
    },
  });
}
