export interface SignupRequestDto {
  /** 사용자 계정 이메일 아이디 */
  email: string;

  /** 사용자에게 받는 해싱되지 않은 비밀번호, 반드시 해싱하여 저장할 것 */
  password: string;
}

export interface SignupResponseDto {
  /** 사용자 Id (PK) */
  id: string;

  /** 사용자 Email */
  email: string;
}
