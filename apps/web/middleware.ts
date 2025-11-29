import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales } from "@/locales/config";
import {
  localeCookieKey,
  storageKey,
} from "@/modules/shared/config/storage-key";

const i18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
});

const localeAliases: Record<string, (typeof locales)[number]> = {
  en: "en-us",
  "en-us": "en-us",
  pt: "pt-br",
  "pt-br": "pt-br",
};

function normalizeLocale(locale?: string | null) {
  if (!locale) return undefined;
  return localeAliases[locale.toLowerCase()];
}

function buildRedirectUrl(
  request: NextRequest,
  locale: (typeof locales)[number],
  segments: string[],
) {
  const pathname = segments.length ? `/${segments.join("/")}` : "";
  return new URL(`/${locale}${pathname}`, request.url);
}

function persistLocale(response: NextResponse, locale: string) {
  response.cookies.set("Next-Locale", locale, {
    sameSite: "strict",
    path: "/",
  });
  response.cookies.set(localeCookieKey, locale, {
    sameSite: "strict",
    path: "/",
  });
  response.headers.set("X-Next-Locale", locale);
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/.well-known")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  if (!normalizeLocale(segments[0])) {
    const cookieLocale = normalizeLocale(
      request.cookies.get(localeCookieKey)?.value ??
        request.cookies.get("Next-Locale")?.value,
    );
    const targetLocale = cookieLocale ?? defaultLocale;
    return NextResponse.redirect(
      buildRedirectUrl(request, targetLocale, segments),
    );
  }

  const pathLocale = normalizeLocale(segments[0]);
  const cookieLocale = normalizeLocale(
    request.cookies.get(localeCookieKey)?.value ??
      request.cookies.get("Next-Locale")?.value,
  );

  if (!pathLocale) {
    const targetLocale = cookieLocale ?? defaultLocale;
    return NextResponse.redirect(
      buildRedirectUrl(request, targetLocale, segments),
    );
  }

  if (pathLocale !== segments[0]) {
    segments[0] = pathLocale;
    return NextResponse.redirect(
      buildRedirectUrl(request, pathLocale, segments),
    );
  }

  const pathWithoutLocale = "/" + segments.slice(1).join("/");
  if (pathWithoutLocale.startsWith("/app")) {
    const token = request.cookies.get(`${storageKey}session`);
    if (!token) {
      const redirectUrl = new URL(`/${pathLocale}/auth`, request.url);
      const originalUrl = request.nextUrl.pathname + request.nextUrl.search;

      if (originalUrl !== `/${pathLocale}/app`) {
        redirectUrl.searchParams.set("callbackUrl", originalUrl);
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  const response = i18nMiddleware(request);
  return persistLocale(response, pathLocale);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
