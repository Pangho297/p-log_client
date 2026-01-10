import Image from "next/image";

import Office from "@/shared/assets/images/office.jpg";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-row">
      <div className="flex w-1/2 flex-col justify-between p-8"></div>
      <Image
        src={Office}
        alt="login-image"
        className="max-h-dvh w-1/2 object-cover"
      />
    </div>
  );
}
