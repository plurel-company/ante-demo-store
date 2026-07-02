import Link from "next/link";

import { AnteModeSwitch } from "@/components/ante-mode-switch";

type StoreShellProps = {
  configured: boolean;
  children: React.ReactNode;
};

export function StoreShell({ configured, children }: StoreShellProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="store-hero mb-10 sm:mb-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-md shadow-emerald-500/25">
                  A
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-800/80">
                  Ante open demo
                </p>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl lg:text-[2.5rem]">
                Split Shop
              </h1>
              <p className="mt-3 text-base leading-relaxed text-stone-600">
                Shop physical goods and book stays across USD, EUR, GBP, and JPY — then open
                Ante&apos;s hosted group checkout to split payment with friends.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="https://splitante.com/docs"
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-white/90 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm backdrop-blur-sm transition hover:border-orange-200 hover:bg-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ante docs
                  <span aria-hidden className="text-stone-400">
                    ↗
                  </span>
                </Link>
                {!configured ? (
                  <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
                    Configure env
                  </span>
                ) : null}
              </div>

              {configured ? (
                <div className="rounded-2xl border border-stone-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Checkout mode
                  </p>
                  <AnteModeSwitch />
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-stone-200/70 pt-8 text-xs leading-relaxed text-stone-400">
          Built with{" "}
          <a
            href="https://splitante.com/docs/sdk"
            className="font-medium text-stone-500 underline decoration-stone-300 underline-offset-2 hover:text-stone-700"
            target="_blank"
            rel="noreferrer"
          >
            @splitante/react-sdk
          </a>
          . Fulfill orders on <code className="text-stone-500">group.funded</code> webhooks.
        </footer>
      </main>
    </div>
  );
}
