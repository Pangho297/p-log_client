export const OWNER_USER_ID = process.env.NEXT_PUBLIC_OWNER_USER_ID;

export const THUMBNAIL_MAP = {
  thumbnail_1: "/thumbnail_1.jpeg",
  thumbnail_2: "/thumbnail_2.jpeg",
  thumbnail_3: "/thumbnail_3.jpeg",
  thumbnail_4: "/thumbnail_4.jpeg",
  thumbnail_5: "/thumbnail_5.jpeg",
} as const;

export const DEFAULT_THUMBNAIL = THUMBNAIL_MAP.thumbnail_1;
