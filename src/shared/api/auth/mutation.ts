import { useMutation, useQueryClient } from "@tanstack/react-query";

import { redirectToLogin } from "@/shared/lib/auth";
import { LoginRequestDto } from "@/shared/types/auth";

import * as AuthAPI from ".";
import { OWNER_USER_ID } from "@/shared/constant/common";
import { useOwnerStore } from "@/shared/store/owner";

export function useLogin() {
  const { setIsOwner } = useOwnerStore();

  return useMutation({
    mutationFn: async (body: LoginRequestDto) => {
      return await AuthAPI.login(body);
    },
    onSuccess: ({ data }) => {
      if (data.id === OWNER_USER_ID) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
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
  const { setIsOwner } = useOwnerStore();

  return useMutation({
    mutationFn: async () => {
      return await AuthAPI.logout();
    },
    onSettled: () => {
      // 성공 실패와 관계없이 쿼리 클라이언트 초기화 및 로그인 페이지 이동
      queryClient.clear();
      setIsOwner(false);
      redirectToLogin({ preserveCurrentPath: false });
    },
  });
}
