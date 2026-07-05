"use client";

import { useMutation } from "@tanstack/react-query";
import * as PostAPI from ".";
import {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from "@/shared/types/post";
import { useRouter } from "next/navigation";
import { useInvalidateCache } from "@/shared/hooks/useInvalidateCache";
import { QUERY_KEY, ROOT_KEY } from "@/shared/constant/query-key";
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

export function useUpdatePost() {
  const route = useRouter();
  const { cleanExact } = useInvalidateCache();

  return useMutation({
    mutationFn: async (body: UpdatePostRequestDto) => {
      await PostAPI.updatePost(body);
    },
    onSuccess: (_, body) => {
      cleanExact(QUERY_KEY.post.getPost(body.slug));
      toast("게시글이 수정되었습니다! 📝");
      route.push(ROUTE.POST.replace(":slug", body.slug));
    },
  });
}

export function useDeletePost() {
  const route = useRouter();
  const { cleanAll } = useInvalidateCache();

  return useMutation({
    mutationFn: async (slug: string) => {
      await PostAPI.deletePost(slug);
    },
    onSuccess: () => {
      cleanAll(ROOT_KEY.post);
      toast("게시글이 삭제되었습니다 🗑️");
      route.push(ROUTE.HOME);
    },
  });
}
