import { useForm } from "react-hook-form";
import { LoginForm } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";

export function useLoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return { control, errors, onSubmit };
}
