import { axiosInstance } from "@/shared/lib/axios";
import { SignupRequestDto, SignupResponseDto } from "@/shared/types/user";

/** 회원가입 */
export async function signUp(body: SignupRequestDto) {
  return await axiosInstance.post<SignupResponseDto>("/user", body);
}
