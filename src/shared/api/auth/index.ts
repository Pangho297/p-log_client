import { ResponseSuccessDto } from "@/shared/types/common";
import { axiosInstance } from "@/shared/lib/axios";
import { LoginRequestDto } from "@/shared/types/auth";
import { UserDto } from "@/shared/types/user";

/** 로그인 */
export async function login(body: LoginRequestDto) {
  return await axiosInstance.post<UserDto>("/auth/login", body);
}

/** 토큰 재발급 */
export async function refreshToken() {
  return await axiosInstance.post<ResponseSuccessDto>("/auth/refresh");
}

/** 로그아웃 */
export async function logout() {
  return await axiosInstance.post<ResponseSuccessDto>("/auth/logout");
}
