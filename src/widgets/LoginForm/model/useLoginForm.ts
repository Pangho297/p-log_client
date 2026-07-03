import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { login } from "@/shared/api";
import { ROUTE } from "@/shared/constant/route";

import { loginSchema } from "./schema";
import { LoginForm } from "./types";

export function useLoginForm() {
  const router = useRouter();
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
      router.replace(ROUTE.HOME);
    } catch {
      toast.error("로그인에 실패했습니다.");
    }
  });

  return { control, errors, isSubmitting, onSubmit };
}
