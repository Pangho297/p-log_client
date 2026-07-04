import { Suspense } from "react";

import { Loading } from "@/shared";
import { EditorForm } from "@/widgets";

export default function EditorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditorForm />
    </Suspense>
  );
}
