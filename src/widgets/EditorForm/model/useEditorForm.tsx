"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EditorForm } from "./type";
import { editorSchema } from "./schema";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getErrorMessage,
  LoginToast,
  useCreatePost,
  useOwnerStore,
  useResponsive,
} from "@/shared";
import { toast } from "sonner";

export function useEditorForm() {
  const [uploadImages, setUploadImages] = useState<string[]>([]);
  const [hashtag, setHashtag] = useState("");
  const [isHashtagInputFocused, setIsHashtagInputFocused] = useState(false);

  const { mutate: createPost } = useCreatePost();

  const {
    control,
    setValue,
    getValues,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditorForm>({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
    mode: "onSubmit",
    resolver: zodResolver(editorSchema),
  });

  const isComposition = useRef(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const isModify = Boolean(postId);

  const { isMobile } = useResponsive();
  const { isOwner } = useOwnerStore();

  useEffect(() => {
    // TODO: 수정 진입 시 필드 초기화
    if (isModify) {
    }
  }, [postId]);

  const handleCompositionChange = (value: boolean) => {
    isComposition.current = value;
  };

  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtag(e.target.value);
  };

  /** 해시태그 입력 키보드 함수 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.code;

    if (isComposition.current) return;

    const tags = getValues("tags");

    if (
      (key === "Space" || key === "Enter" || key === "Comma") &&
      hashtag.trim()
    ) {
      e.preventDefault();

      if (tags.length > 9) {
        setHashtag("");
        return;
      }

      setValue("tags", [...tags, hashtag.trim()]);
      setHashtag("");
    }

    if (key === "Backspace" && tags.length > 0 && hashtag.length === 0) {
      handleHashtagDelete(tags.length - 1);
    }
  };

  /** 해시태그 삭제 함수 */
  const handleHashtagDelete = (index: number) => {
    const tags = getValues("tags");
    setValue(
      "tags",
      tags.filter((_, i) => i !== index)
    );
  };

  const onSubmit = handleSubmit(
    (data) => {
      if (!isOwner) {
        toast(<LoginToast />);
        return;
      }

      if (isModify && postId) {
        // TODO: 수정 API 요청
        return;
      }

      createPost(data);
    },
    (errors) => {
      const message = getErrorMessage(errors);

      if (message) {
        toast.error(message);
      }
    }
  );

  return {
    control,
    errors,
    isSubmitting,
    watch,
    hashtag,
    isHashtagInputFocused,
    setIsHashtagInputFocused,
    router,
    isMobile,
    onSubmit,
    handleHashtagDelete,
    handleHashtagChange,
    handleKeyDown,
    handleCompositionChange,
  };
}
