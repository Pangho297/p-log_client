import { useMutation, useQueryClient } from "@tanstack/react-query";

import { redirectToLogin } from "@/shared/lib/auth";
import { LoginRequestDto } from "@/shared/types/auth";

import * as AuthAPI from ".";

export function useLogin() {
  return useMutation({
    mutationFn: async (body: LoginRequestDto) => {
      return await AuthAPI.login(body);
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      return await AuthAPI.refreshToken();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await AuthAPI.logout();
    },
    onSettled: () => {
      // 성공 실패와 관계없이 쿼리 클라이언트 초기화 및 로그인 페이지 이동
      queryClient.clear();
      redirectToLogin({ preserveCurrentPath: false });
    },
  });
}
