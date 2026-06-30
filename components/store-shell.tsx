import Link from "next/link";

import { AnteModeSwitch } from "@/components/ante-mode-switch";

type StoreShellProps = {
  configured: boolean;
  children: React.ReactNode;
};

export function StoreShell({ configured, children }: StoreShellProps) {
  return (
    <div className="min-h-screen bg-[var(--store-bg)]">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-10 border-b border-stone-200/80 pb-8 sm:mb-12 sm:pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                  A
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Ante open demo
                </p>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Split Shop
              </h1>
              <p className="mt-3 text-base leading-relaxed text-stone-600">
                Shop physical goods and book stays in one cart — then open Ante&apos;s hosted group
                checkout to split payment with friends.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="https://splitante.com/docs"
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
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
                <div className="rounded-xl border border-stone-200/80 bg-white px-4 py-3 shadow-sm">
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

        <footer className="mt-16 border-t border-stone-200/80 pt-8 text-xs leading-relaxed text-stone-400">
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
