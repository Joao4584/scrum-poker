import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { localeCookieKey } from "@/modules/shared/config/storage-key";

function normalizeLocale(value?: string | null): "pt-br" | "en-us" {
  if (!value) return "en-us";
  const v = value.toLowerCase();
  if (v === "pt-br" || v === "pt") return "pt-br";
  if (v === "en-us" || v === "en") return "en-us";
  return "en-us";
}

export default async function RootRedirect() {
  const cookieStore = await cookies();
  const cookieLocale =
    normalizeLocale(cookieStore.get("Next-Locale")?.value) ??
    normalizeLocale(cookieStore.get(localeCookieKey)?.value);

  const locale = cookieLocale ?? "en-us";
  redirect(`/${locale}`);
}
