"use client";

import { Controller } from "react-hook-form";
import { useEditorForm } from "../model/useEditorForm";
import { Button, cn, Hashtag, Input } from "@/shared";
import { Editor } from "@/features";
import { Preview } from "@/entities";

export function EditorForm() {
  const {
    control,
    watch,
    hashtag,
    isHashtagInputFocused,
    setIsHashtagInputFocused,
    router,
    onSubmit,
    isMobile,
    handleHashtagDelete,
    handleHashtagChange,
    handleKeyDown,
    handleCompositionChange,
  } = useEditorForm();

  return (
    <form onSubmit={onSubmit} className="flex min-h-dvh">
      <article className="flex w-1/2 flex-col not-xl:w-full xl:min-w-240">
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              variant="underline"
              placeholder="지금 생각하고있는 이야기를 써보세요..."
              className="text-primary sticky top-0 z-10 h-22 bg-white px-5 pt-4 pb-2 text-[2.5rem] font-bold not-xl:h-12 not-xl:px-3 not-xl:text-xl placeholder:text-gray-500 placeholder:opacity-20"
              {...field}
            />
          )}
        />
        <div
          className={cn(
            "sticky top-21.25 z-10 flex min-h-14 items-center gap-2 bg-white not-xl:top-12 not-xl:min-h-10",
            watch("hashtagList").length > 0 && "pl-5 not-xl:pl-3"
          )}
        >
          <ul className="flex gap-2">
            {watch("hashtagList").map((hashtag, index) => (
              <li key={index}>
                <Hashtag
                  hashtag={hashtag}
                  onClick={() => handleHashtagDelete(index)}
                />
              </li>
            ))}
          </ul>
          {watch("hashtagList").length < 15 && (
            <Input
              variant="borderless"
              value={hashtag}
              onChange={handleHashtagChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsHashtagInputFocused(true)}
              onBlur={() => setIsHashtagInputFocused(false)}
              onCompositionStart={() => handleCompositionChange(true)}
              onCompositionEnd={() => handleCompositionChange(false)}
              placeholder="태그를 입력하세요"
              className={cn(
                "flex-1 text-lg not-xl:text-sm placeholder:text-gray-500 placeholder:opacity-50",
                watch("hashtagList").length === 0
                  ? "px-5 not-xl:px-3"
                  : "px-2 not-xl:px-1"
              )}
            />
          )}
        </div>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <Editor
              initialDoc={field.value}
              onChange={field.onChange}
              isHashtagInputFocused={isHashtagInputFocused}
              // setUploadImages={setUploadImages}
            />
          )}
        />
        <div className="sticky bottom-0 flex justify-between border-t border-gray-200 bg-white px-5 py-3 not-xl:px-3 not-xl:py-2">
          <Button
            type="button"
            variant="link"
            className="p-0 text-xl text-gray-500 not-xl:text-sm"
            onClick={() => router.back()}
          >
            ← 나가기
          </Button>
          <div className="flex gap-2">
            {/* <Button variant="outline" type="button">
              임시저장
            </Button> */}
            <Button type="submit">게시하기</Button>
          </div>
        </div>
      </article>
      {!isMobile && (
        <article className="flex w-1/2 min-w-235 flex-col border-l border-gray-200 p-5">
          <h1 className="text-primary mt-7 mb-16 text-[40px] font-bold">
            {watch("title")}
          </h1>
          <Preview doc={watch("content")} />
        </article>
      )}
    </form>
  );
}
