'use client';

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFoundLandingFallback() {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-lg space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-indigo-600">404</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Pagina nao encontrada
          </h1>
          <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
            Desculpe, a pagina que voce procura saiu do ar ou nunca existiu. Volte para o app e continue a jornada.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir para o Dashboard
          </Link>
          <Link
            href="https://lucide.dev"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <BookOpen className="h-4 w-4" />
            Ver documentacao
          </Link>
        </div>
      </div>
    </main>
  );
}
