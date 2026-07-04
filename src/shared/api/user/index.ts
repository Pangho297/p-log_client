import { axiosInstance } from "@/shared/lib/axios";
import {
  UserDto,
  SignupRequestDto,
  SignupResponseDto,
} from "@/shared/types/user";

/** 회원가입 */
export async function signUp(body: SignupRequestDto) {
  return await axiosInstance.post<SignupResponseDto>("/user", body);
}

/** 로그인 사용자 정보 조회 */
export async function self() {
  return await axiosInstance.get<UserDto>("/user");
}
