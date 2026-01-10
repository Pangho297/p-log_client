import { z } from "zod";

export const editorSchema = z.object({
  title: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "제목을 입력해 주세요"
        : "올바른 제목을 입력해 주세요",
  }),
  content: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "내용을 입력해 주세요"
        : "올바른 내용을 입력해 주세요",
  }),
  hashtagList: z
    .array(z.string())
    .min(1, { message: "해시태그 최소 1개 이상 입력해주세요." })
    .max(100, { message: "해시태그는 최대 100개까지 입력할 수 있습니다." }),
});
