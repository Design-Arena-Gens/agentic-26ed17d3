'use client';

import { useMemo } from "react";

import { TagInput } from "@/components/tag-input";
import {
  CampaignInputs,
  COMPANY_SIZES,
  INDUSTRIES,
  OUTREACH_CHANNELS,
  URGENCY_OPTIONS,
} from "@/lib/types";

interface CampaignFormProps {
  value: CampaignInputs;
  onChange: (updates: Partial<CampaignInputs>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const CampaignForm = ({ value, onChange, onSubmit, isLoading }: CampaignFormProps) => {
  const hasSelectedIndustry = value.targetIndustries.length > 0;

  const summary = useMemo(() => {
    const industries = value.targetIndustries.join(", ") || "General";
    const regions = value.locations.length ? value.locations.join(", ") : "All regions";
    const titles = value.decisionMakerTitles.length ? value.decisionMakerTitles.join(", ") : "Key stakeholders";
    return `${industries} · ${regions} · Targeting ${titles}`;
  }, [value]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-lg shadow-slate-200/40 backdrop-blur">
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Campaign Blueprint</h2>
          <span className="rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Lead Gen Agent
          </span>
        </div>
        <p className="text-sm text-slate-600">
          Configure how the agent should search, score, and prioritize accounts. Once launched, the agent will
          synthesize GTM signals, craft positioning, and surface prioritized leads.
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">{summary}</p>
      </header>

      <form
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Campaign name</span>
            <input
              type="text"
              value={value.campaignName}
              onChange={(event) => onChange({ campaignName: event.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              placeholder="AI Enablement for Series B SaaS"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Value proposition</span>
            <textarea
              value={value.valueProposition}
              onChange={(event) => onChange({ valueProposition: event.target.value })}
              className="min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              placeholder="Explain how you solve the problem, the core proof points, and immediate impact you deliver."
              required
            />
            <span className="text-xs text-slate-500">
              The agent uses this to craft narrative arcs and call-to-action recommendations.
            </span>
          </label>

          <fieldset className="flex flex-col gap-3">
            <span className="text-sm font-medium text-slate-700">Industries</span>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {INDUSTRIES.map((industry) => {
                const checked = value.targetIndustries.includes(industry);
                return (
                  <label
                    key={industry}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      checked
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...value.targetIndustries, industry]
                          : value.targetIndustries.filter((item) => item !== industry);
                        onChange({ targetIndustries: next });
                      }}
                      className="hidden"
                    />
                    {industry}
                  </label>
                );
              })}
            </div>
            {!hasSelectedIndustry && (
              <span className="text-xs text-rose-500">Select at least one industry to anchor the search.</span>
            )}
          </fieldset>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">Min company size</span>
              <select
                value={value.minEmployeeRange ?? ""}
                onChange={(event) =>
                  onChange({ minEmployeeRange: (event.target.value || undefined) as CampaignInputs["minEmployeeRange"] })
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">No minimum</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">Max company size</span>
              <select
                value={value.maxEmployeeRange ?? ""}
                onChange={(event) =>
                  onChange({ maxEmployeeRange: (event.target.value || undefined) as CampaignInputs["maxEmployeeRange"] })
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">No maximum</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <TagInput
            label="Priority locations"
            placeholder="Add city, region, or country and press enter"
            values={value.locations}
            onChange={(locations) => onChange({ locations })}
            helperText="Use wherever your GTM motion can actively operate."
          />

          <TagInput
            label="Hero keywords & triggers"
            placeholder="pipeline velocity, compliance, integrations"
            values={value.keywords}
            onChange={(keywords) => onChange({ keywords })}
            helperText="Keywords help the agent find relevant initiatives and filter noise."
          />

          <TagInput
            label="Tech stack alignment"
            placeholder="Salesforce, HubSpot, Snowflake..."
            values={value.technologyStack}
            onChange={(technologyStack) => onChange({ technologyStack })}
            helperText="Mention key systems to identify fast-track implementation accounts."
          />

          <TagInput
            label="Decision maker titles"
            placeholder="Head of RevOps, VP Sales..."
            values={value.decisionMakerTitles}
            onChange={(decisionMakerTitles) => onChange({ decisionMakerTitles })}
            helperText="Include executives and operators you can win over quickly."
          />

          <TagInput
            label="Intent signals to watch"
            placeholder="hiring SDRs, expanding to EU, upgrading CRM..."
            values={value.intentSignals}
            onChange={(intentSignals) => onChange({ intentSignals })}
            helperText="Signals help the agent prioritize accounts ready to engage."
          />

          <fieldset className="flex flex-col gap-3">
            <span className="text-sm font-medium text-slate-700">Primary outreach channels</span>
            <div className="flex flex-wrap gap-2">
              {OUTREACH_CHANNELS.map((channel) => {
                const checked = value.outreachChannels.includes(channel);
                return (
                  <label
                    key={channel}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      checked
                        ? "border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...value.outreachChannels, channel]
                          : value.outreachChannels.filter((item) => item !== channel);
                        onChange({ outreachChannels: next });
                      }}
                    />
                    {channel}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Campaign urgency</span>
            <div className="flex gap-2">
              {URGENCY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange({ urgency: option })}
                  className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    value.urgency === option
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading || !hasSelectedIndustry}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                Crunching signals…
              </>
            ) : (
              <>Run lead generation agent</>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

