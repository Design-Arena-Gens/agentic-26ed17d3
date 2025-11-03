'use client';

import { useMemo, useState } from "react";

import { ExportButton } from "@/components/export-button";
import type { CampaignRecommendation, PrioritizedLead } from "@/lib/types";

interface LeadResultsProps {
  leads: PrioritizedLead[];
  recommendation: CampaignRecommendation | null;
  isLoading: boolean;
  lastRunAt?: number | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const formatTime = (timestamp?: number | null) => {
  if (!timestamp) return "Not yet run";
  return new Date(timestamp).toLocaleString();
};

export const LeadResults = ({ leads, recommendation, isLoading, lastRunAt }: LeadResultsProps) => {
  const [focusedLeadId, setFocusedLeadId] = useState<string | null>(null);

  const highlightLead = useMemo(() => leads.find((item) => item.lead.id === focusedLeadId) ?? leads[0], [leads, focusedLeadId]);

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-lg shadow-slate-200/40 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="text-sm font-medium text-slate-600">
            Running signal analysis and prioritizing accounts…
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl bg-slate-100/80 p-4">
              <div className="h-3 w-1/3 rounded-full bg-slate-200" />
              <div className="mt-3 h-6 w-2/3 rounded-full bg-slate-300" />
              <div className="mt-4 h-3 w-full rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!leads.length || !recommendation || !highlightLead) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-center shadow-inner">
        <p className="text-sm font-medium text-slate-500">Configure the campaign and run the agent to discover leads.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Prioritized leads</h2>
          <p className="text-sm text-slate-500">Last synced {formatTime(lastRunAt)}</p>
        </div>
        <ExportButton leads={leads} />
      </header>

      <article className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-indigo-600 px-5 py-4 text-white shadow-lg shadow-indigo-200">
          <p className="text-xs uppercase tracking-wide text-indigo-100">Top opportunity</p>
          <p className="mt-2 text-lg font-semibold">{highlightLead.lead.companyName}</p>
          <p className="mt-1 text-sm text-indigo-100">
            {highlightLead.lead.industry} · {highlightLead.lead.location}
          </p>
          <p className="mt-4 text-sm font-medium"><span className="font-semibold">Total score:</span> {highlightLead.totalScore}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Momentum signals</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {highlightLead.rationale.map((reason, index) => (
              <li key={index} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agent guidance</p>
          <p className="mt-2 text-sm text-slate-600">{recommendation.summary}</p>
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Signals</th>
                <th className="px-4 py-3">Scores</th>
                <th className="px-4 py-3">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
              {leads.map((item) => (
                <tr
                  key={item.lead.id}
                  className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                    highlightLead.lead.id === item.lead.id ? "bg-indigo-50/60" : ""
                  }`}
                  onClick={() => setFocusedLeadId(item.lead.id)}
                >
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">{item.lead.companyName}</div>
                    <div className="text-xs text-slate-500">
                      {item.lead.industry} · {item.lead.employeeRange} · {item.lead.location}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1 text-xs text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-900">Tech:</span> {item.lead.technologies.join(", ")}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Intent:</span> {item.lead.intents.slice(0, 2).join("; ")}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-semibold text-slate-900">Fit {item.fitScore}</span>
                      <span className="font-semibold text-slate-900">Intent {item.intentScore}</span>
                      <span className="font-semibold text-slate-900">Closing {item.closingScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-semibold text-indigo-600">{item.suggestedChannel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Conversation-ready briefing
          </h3>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">{highlightLead.lead.companyName}</p>
            <p className="mt-1">{highlightLead.lead.description}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">Key initiatives</p>
            <ul className="mt-2 space-y-1">
              {highlightLead.lead.recentInitiatives.slice(0, 3).map((initiative, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                  <span>{initiative}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">Primary stakeholders</p>
            <ul className="mt-2 space-y-1">
              {highlightLead.lead.decisionMakers.slice(0, 3).map((contact) => (
                <li key={contact.email} className="text-sm text-slate-700">
                  <span className="font-semibold">{contact.name}</span> · {contact.title}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">Revenue context</p>
            <p className="text-sm text-slate-700">{formatCurrency(highlightLead.lead.annualRevenue)} ARR</p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next steps</h4>
            <ol className="space-y-2 text-sm text-slate-600">
              <li>1. Trigger outreach via {highlightLead.suggestedChannel} with angle: {recommendation.messagingHooks[0]}</li>
              <li>2. Share tailored proof point referencing “{highlightLead.lead.highlights[0]}”.</li>
              <li>3. Follow-up using CTA: {recommendation.callToAction}</li>
            </ol>
          </div>
        </aside>
      </div>

      <footer className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Messaging hooks</h4>
            <ul className="mt-2 space-y-2">
              {recommendation.messagingHooks.map((hook, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                  <span>{hook}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Follow-up plan</h4>
            <ul className="mt-2 space-y-2">
              {recommendation.followUps.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">Success metrics</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              {recommendation.successMetrics.map((metric) => (
                <span key={metric} className="rounded-full bg-white px-3 py-1 shadow-sm shadow-slate-200">
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};
