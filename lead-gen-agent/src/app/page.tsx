import { LeadAgentPage } from "@/components/lead-agent-page";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 lg:px-10">
      <header className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-white/80 p-10 shadow-xl shadow-indigo-200/40">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-indigo-100 via-transparent to-transparent lg:block" />
        <div className="relative flex flex-col gap-6 lg:max-w-3xl">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Agentic workspace
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            AI lead generation agent that finds buying signals before your competition.
          </h1>
          <p className="text-lg text-slate-600">
            Deploy a research co-pilot that scans GTM signals, prioritizes high-intent accounts, briefs reps with
            context, and orchestrates multi-channel outreach ready to ship to your CRM or sales engagement platform.
          </p>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Signals monitored</dt>
              <dd className="text-2xl font-semibold text-slate-900">150+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Time to qualified list</dt>
              <dd className="text-2xl font-semibold text-slate-900">4 min</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Conversion lift</dt>
              <dd className="text-2xl font-semibold text-slate-900">+34%</dd>
            </div>
          </dl>
        </div>
      </header>

      <LeadAgentPage />
    </main>
  );
}
