import { ROUTE } from "@/shared/constant/route";

type LoginRedirectOptions = {
  preserveCurrentPath?: boolean;
};

function getCurrentPath() {
  if (typeof window === "undefined") return null;

  return `${window.location.pathname}${window.location.search}`;
}

export function getLoginUrl({
  preserveCurrentPath = true,
}: LoginRedirectOptions = {}) {
  if (typeof window === "undefined" || !preserveCurrentPath) {
    return ROUTE.LOGIN;
  }

  const currentPath = getCurrentPath();

  if (!currentPath || window.location.pathname === ROUTE.LOGIN) {
    return ROUTE.LOGIN;
  }

  const params = new URLSearchParams({ redirect: currentPath });

  return `${ROUTE.LOGIN}?${params.toString()}`;
}

export function redirectToLogin(options?: LoginRedirectOptions) {
  if (typeof window === "undefined") return;

  const loginUrl = getLoginUrl(options);

  if (window.location.pathname === ROUTE.LOGIN) return;

  window.location.replace(loginUrl);
}

export function getSafeRedirectPath(redirectPath: string | null) {
  if (!redirectPath) return ROUTE.HOME;

  if (!redirectPath.startsWith("/") || redirectPath.startsWith("//")) {
    return ROUTE.HOME;
  }

  if (redirectPath.startsWith(ROUTE.LOGIN)) {
    return ROUTE.HOME;
  }

  return redirectPath;
}
