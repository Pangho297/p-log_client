import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { redirectToLogin } from "@/shared/lib/auth";
import { toast } from "sonner";
import { getErrorMessage } from "./getErrorMessage";

const AUTH_REFRESH_URL = "/auth/refresh";
const AUTH_EXCLUDED_URLS = ["/auth/login", AUTH_REFRESH_URL, "/auth/logout"];

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type UnauthorizedHandler = () => void;

let responseInterceptorId: number | null = null;
let refreshPromise: Promise<void> | null = null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

function isAuthExcludedUrl(url?: string) {
  if (!url) return false;

  return AUTH_EXCLUDED_URLS.some((excludedUrl) => url.includes(excludedUrl));
}

function refreshAuthToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post(AUTH_REFRESH_URL)
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function handleUnauthorized() {
  unauthorizedHandler?.();
  redirectToLogin();
}

async function errorInterceptor(error: AxiosError) {
  const originalRequest = error.config as RetriableRequestConfig | undefined;

  if (
    error.response?.status !== 401 ||
    !originalRequest ||
    originalRequest._retry ||
    isAuthExcludedUrl(originalRequest.url)
  ) {
    const message = getErrorMessage(error);
    toast.error(message);

    return Promise.reject(error);
  }

  originalRequest._retry = true;

  try {
    await refreshAuthToken();
    return axiosInstance(originalRequest);
  } catch (refreshError) {
    toast.error("회원 정보를 조회할 수 없습니다. 다시 로그인 해주세요");
    handleUnauthorized();
    return Promise.reject(refreshError);
  }
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

export function attachAuthInterceptor() {
  // 인스턴스 중복 등록 방지
  if (responseInterceptorId !== null) {
    axiosInstance.interceptors.response.eject(responseInterceptorId);
  }

  responseInterceptorId = axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    errorInterceptor
  );
}

attachAuthInterceptor();
