import Link from "next/link";

import { GoBackBtn } from "@/features";
import { Button, ROUTE } from "@/shared";

export default function notFound() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 not-xl:p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-primary text-center text-5xl font-bold not-xl:text-6xl">
          요청하신 페이지를 찾을 수 없습니다.
        </h1>
        <div className="flex flex-row gap-4">
          <Link href={ROUTE.HOME}>
            <Button>홈 화면으로 돌아가기</Button>
          </Link>
          <GoBackBtn />
        </div>
      </div>
    </main>
  );
}
