export function RoomLoading() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-md space-y-5">
        <div className="animate-fade-in-up" style={{ animationDelay: "0s" }}>
          <p className="text-sm font-semibold text-sky-400">Carregando</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Preparando sua sala
          </h1>
        </div>
        <p
          className="animate-fade-in-up text-base leading-7 text-slate-600 dark:text-slate-300"
          style={{ animationDelay: "0.12s" }}
        >
          Aguarde enquanto deixamos tudo pronto para voce entrar.
        </p>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
        </div>
      </div>
    </main>
  );
}
