import Image from "next/image";

import Office from "@/shared/assets/images/office.jpg";
import { LoginForm } from "@/widgets/LoginForm";
import Link from "next/link";
import { ICON, ROUTE } from "@/shared";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-row">
      <div className="flex w-1/2 flex-col justify-between p-8 not-xl:w-full">
        <Link href={ROUTE.HOME} className="w-fit">
          <ICON.LetterLogo className="text-primary h-8 w-auto" />
        </Link>
        <LoginForm />
        <div />
      </div>
      <Image
        src={Office}
        alt="login-image"
        className="max-h-dvh w-1/2 object-cover not-xl:hidden"
      />
    </div>
  );
}
