import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type React from "react";

import LogoSvg from "@public/meta-rtc-logo.png";
import { getI18n } from "@/locales/server";
import { storageKey } from "@/modules/shared/config/storage-key";

export default async function DefaultLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const session = cookies().get(`${storageKey}session`);
  if (session?.value) {
    redirect(`/${params.locale}/app`);
  }
  const t = await getI18n();
  return (
    <section className="bg-cover bg-no-repeat bg-center bg-[url('/banners/auth.gif')] dark:bg-[url('/banners/auth-dark.gif')] w-full h-full ">
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 backdrop-blur-md overflow-x-hidden w-full h-full bg-slate-400 dark:bg-slate-800 dark:bg-opacity-50 bg-opacity-20">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium text-white"
          >
            <div className="flex h-8 w-28 items-center justify-center rounded-md ">
              <Image src={LogoSvg} width={160} height={100} alt="Logo" />
            </div>
          </a>
          {children}
          <div className="text-balance text-center text-xs text-secondary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-gray-200  ">
            {t("recommended.github.messageFollowUp")}{" "}
            <a target="_blank" href="https://github.com/Joao4584/">
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </section>
  );
}
