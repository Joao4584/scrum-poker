import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFoundLandingFallback() {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-lg space-y-6">
        <div className="animate-fade-in-up" style={{ animationDelay: "0s" }}>
          <p className="text-sm font-semibold text-sky-500">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Pagina nao encontrada
          </h1>
        </div>

        <p
          className="animate-fade-in-up text-base leading-7 text-gray-600 dark:text-gray-300"
          style={{ animationDelay: "0.12s" }}
        >
          Desculpe, a pagina que voce procura saiu do ar ou nunca existiu. Volte para o app e continue a jornada.
        </p>

        <div
          className="animate-fade-in-up flex items-center justify-center gap-4 flex-wrap"
          style={{ animationDelay: "0.2s" }}
        >
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir para o Dashboard
          </Link>
          <Link
            href="https://github.com/joao4584"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400"
          >
            <BookOpen className="h-4 w-4" />
            Ver documentacao
          </Link>
        </div>
      </div>
    </main>
  );
}
