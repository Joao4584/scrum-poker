import Link from "next/link";
import { notFound } from "next/navigation";

import { getI18n } from "@/locales/server";
import { locales } from "@/locales/config";

type Locale = (typeof locales)[number];

export default async function Landing({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) {
    notFound();
  }
  const t = await getI18n({ locale });
  const homeHref = `/${locale}`;
  const statusHref = `/${locale}/playground`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_50%_75%,rgba(234,179,8,0.12),transparent_25%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl space-y-8 rounded-3xl border border-white/5 bg-white/[0.04] p-10 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-emerald-50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span className="font-semibold">{t("landing.badge")}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {t("landing.title")}
            </h1>
            <p className="text-base leading-relaxed text-slate-300">
              {t("landing.description")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={homeHref}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
            >
              {t("landing.primaryCta")}
            </Link>
            <Link
              href={statusHref}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
            >
              {t("landing.secondaryCta")}
            </Link>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                ETA
              </p>
              <p className="text-sm text-slate-100">
                {locale === "pt-br" ? "Retorno previsto ainda hoje." : "Back later today."}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Status
              </p>
              <p className="text-sm text-emerald-200">
                {locale === "pt-br" ? "Estabilidade ok, aplicando updates." : "Stable, shipping updates."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
