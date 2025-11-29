import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, locales } from "@/locales/config";

type Locale = (typeof locales)[number];

function normalizeLocale(value?: string | null): Locale | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (v === "pt-br" || v === "pt") return "pt-br";
  if (v === "en-us" || v === "en") return "en-us";
  return undefined;
}

const PUBLIC_PATHS = [
  "/_next",
  "/api",
  "/favicon.ico",
  "/icon-logo.png",
  "/site.webmanifest",
  "/assets",
  "/images",
  "/banners",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const isSupportedLocale = locales.includes(maybeLocale as Locale);
  if (isSupportedLocale) {
    return NextResponse.next();
  }

  const cookieLocale =
    request.cookies.get("Next-Locale")?.value ??
    request.cookies.get("meta-locale")?.value;
  const locale = normalizeLocale(cookieLocale) ?? defaultLocale;

  const remainder = segments.slice(0).join("/");
  const newPath = `/${locale}/${remainder}`.replace(/\/+$/, "/");

  const url = new URL(newPath, request.url);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/((?!_next|.*\\..*).*)",
};
