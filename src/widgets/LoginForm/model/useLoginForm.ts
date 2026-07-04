import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getSafeRedirectPath, useLogin } from "@/shared";

import { loginSchema } from "./schema";
import { LoginForm } from "./types";

export function useLoginForm() {
  const router = useRouter();
  const { mutateAsync: login } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data);
      const redirectPath =
        typeof window === "undefined"
          ? null
          : new URLSearchParams(window.location.search).get("redirect");

      router.replace(getSafeRedirectPath(redirectPath));
    } catch {
      toast.error("로그인에 실패했습니다.");
    }
  });

  return { control, errors, isSubmitting, onSubmit };
}
