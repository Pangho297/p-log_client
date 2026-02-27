"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EditorForm } from "./type";
import { editorSchema } from "./schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useResponsive } from "@/shared";
import { toast } from "sonner";

export function useEditorForm() {
  const [uploadImages, setUploadImages] = useState<string[]>([]);
  const [hashtag, setHashtag] = useState("");
  const [isHashtagInputFocused, setIsHashtagInputFocused] = useState(false);

  const { control, setValue, getValues, reset, watch, handleSubmit } =
    useForm<EditorForm>({
      defaultValues: {
        title: "",
        content: "",
        hashtagList: [],
      },
      resolver: zodResolver(editorSchema),
    });

  const isComposition = useRef(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const isDemo = Boolean(searchParams.get("demo") === "true");
  const isModify = Boolean(postId);

  const { isMobile } = useResponsive();

  useEffect(() => {
    if (!isDemo) {
      // TODO: 비로그인, 데모 모드 아닐 시 로그인 화면으로 이동
    }
  }, [isDemo]);

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

    const hashtagList = getValues("hashtagList");

    if (
      (key === "Space" || key === "Enter" || key === "Comma") &&
      hashtag.trim()
    ) {
      e.preventDefault();

      if (hashtagList.length > 9) {
        setHashtag("");
        return;
      }

      setValue("hashtagList", [...hashtagList, hashtag.trim()]);
      setHashtag("");
    }

    if (key === "Backspace" && hashtagList.length > 0 && hashtag.length === 0) {
      handleHashtagDelete(hashtagList.length - 1);
    }
  };

  /** 해시태그 삭제 함수 */
  const handleHashtagDelete = (index: number) => {
    const hashtagList = getValues("hashtagList");
    setValue(
      "hashtagList",
      hashtagList.filter((_, i) => i !== index)
    );
  };

  const onSubmit = handleSubmit(
    (data) => {
      // TODO: 로그인 토큰도 조건문에 넣어야 함
      if (isDemo) {
        // TODO: 토스트 메시지 출력
        toast("체험하기에서는 게시글을 작성할 수 없습니다 🥲");
        return;
      }

      // TODO: 이미지 처리 로직 추가 필요
      // 이미지 처리는 일단 글 작성 시 등록한 모든 이미지를 Cloudflare에 업로드 한 뒤 링크들을 배열로 들고있음
      // 이곳에서 게시글 내용 중 실제 남아있는 이미지 링크만 정규식으로 걸러냄
      // 이후 게시글 작성/수정 API 요청 시 삭제할 이미지 목록을 별도로 서버에 전달
      // 서버는 받은 삭제할 이미지 목록을 바탕으로 Cloudflare에서 이미지 삭제 처리

      const extractImageUrls = (content: string) => {
        const imageUrls = content.match(/!\[.*?\]\((.*?)\)/g);
        return imageUrls
          ? imageUrls.map((url) => url.split("(")[1].split(")")[0])
          : [];
      };

      const deletedUrlList = uploadImages.filter(
        (url) => !extractImageUrls(data.content).includes(url)
      );

      if (isModify && postId) {
        // TODO: 수정 API 요청
        return;
      }

      // TODO: 작성 API 요청
    },
    (error) => {
      // TODO: 에러 발생 토스트 메시지 출력
    }
  );

  return {
    control,
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
