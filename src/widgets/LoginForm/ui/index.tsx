"use client";

import { Controller } from "react-hook-form";

import { Button, Input } from "@/shared";

import { useLoginForm } from "../model/useLoginForm";

export function LoginForm() {
  const { control, errors, isSubmitting, onSubmit } = useLoginForm();

  return (
    <form
      className="flex w-full items-center justify-center p-4"
      onSubmit={onSubmit}
    >
      <div className="flex w-120 flex-col gap-4 max-md:w-full">
        <p className="text-2xl font-thin">당신만의 이야기를 시작해보세요</p>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              variant="underline"
              placeholder="이메일을 입력해 주세요"
              inputMode="email"
              autoComplete="off"
              error={errors.email?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              variant="underline"
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="off"
              inputMode="text"
              error={errors.password?.message}
              {...field}
            />
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          로그인
        </Button>
      </div>
    </form>
  );
}
