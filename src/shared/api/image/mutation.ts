import { GetDirectUploadUrlRequestDto } from "@/shared/types/image";
import { useMutation } from "@tanstack/react-query";

import * as ImageAPI from ".";

export function useGetDirectUploadUrl() {
  return useMutation({
    mutationFn: async (body: GetDirectUploadUrlRequestDto) => {
      const res = await ImageAPI.getDirectUploadUrl(body);
      return res.data;
    },
  });
}
