import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales } from "@/locales/config";
import { storageKey } from "@/modules/shared/config/storage-key";

const I18nMiddleware = createI18nMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = await I18nMiddleware(request);

  const pathSegments = pathname.split("/").filter(Boolean);
  const possibleLocale = pathSegments[0];

  if (locales.includes(possibleLocale as (typeof locales)[number])) {
    pathSegments.shift();
  }

  const normalizedPath = "/" + pathSegments.join("/");

  if (normalizedPath.startsWith("/app")) {
    const token = request.cookies.get(`${storageKey}session`);
    if (!token) {
      const redirectUrl = new URL("/auth", request.url);
      const originalUrl = request.nextUrl.pathname + request.nextUrl.search;

      if (originalUrl !== "/app") {
        redirectUrl.searchParams.set("callbackUrl", originalUrl);
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
