import Link from "next/link";
import { cookies, headers } from "next/headers";

import { defaultLocale, locales } from "@/locales/config";

type Locale = (typeof locales)[number];

function normalizeLocale(locale?: string | null): Locale | undefined {
  if (!locale) return undefined;
  const value = locale.toLowerCase();
  if (value === "pt-br") return "pt-br";
  if (value === "en-us") return "en-us";
  if (value === "pt") return "pt-br";
  if (value === "en") return "en-us";
  return undefined;
}

async function getNotFoundMessages(locale: Locale) {
  if (locale === "pt-br") {
    const mod = await import("@/locales/messages/pt-br");
    return mod.default.notFound;
  }
  const mod = await import("@/locales/messages/en-us");
  return mod.default.notFound;
}

export default async function NotFound() {
  const hdrs = await headers();
  const cookieStore = await cookies();

  const localeFromHeader = normalizeLocale(hdrs.get("x-next-locale"));
  const localeFromCookie =
    normalizeLocale(cookieStore.get("Next-Locale")?.value) ??
    normalizeLocale(cookieStore.get("meta-locale")?.value);

  const locale: Locale = localeFromHeader ?? localeFromCookie ?? "en-us";
  const t = await getNotFoundMessages(locale);
  const homeHref = `/${locale ?? defaultLocale}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full space-y-6">
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 shadow-lg shadow-amber-500/10"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/50 bg-amber-400/15 text-lg font-semibold text-amber-100">
            !
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-200">
              {t.alertTitle}
            </span>
            <p className="text-sm text-amber-50/90">{t.alertMessage}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/[0.04] p-10 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-200">
            <span className="font-semibold">404</span>
            <span className="h-1 w-1 rounded-full bg-emerald-400/80" />
            <span>{t.title}</span>
          </div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            {t.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={homeHref}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
            >
              {t.backHome}
            </Link>
            <form>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
              >
                {t.tryAgain}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
