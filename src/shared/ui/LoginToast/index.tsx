import { ROUTE } from "@/shared/constant/route";
import Link from "next/link";
import { Button } from "../Button";

export function LoginToast() {
  return (
    <div className="flex items-center justify-between gap-5">
      <p className="w-full text-xs">비회원은 게시글을 작성할 수 없습니다 🥲</p>
      <Link href={ROUTE.LOGIN}>
        <Button className="h-7">
          <p className="text-xs">로그인</p>
        </Button>
      </Link>
    </div>
  );
}
