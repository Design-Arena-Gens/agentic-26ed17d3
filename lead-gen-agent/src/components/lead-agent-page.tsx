'use client';

import { useCallback, useEffect, useState } from "react";

import { CampaignForm } from "@/components/campaign-form";
import { LeadResults } from "@/components/lead-results";
import type { CampaignInputs, CampaignRecommendation, PrioritizedLead } from "@/lib/types";

const defaultCampaign: CampaignInputs = {
  campaignName: "AI pipeline accelerators for Series B SaaS",
  valueProposition:
    "We automate outbound prospecting with AI playbooks that surface high-conversion accounts, arm sellers with contextual proof points, and deliver repeatable pipeline within 30 days.",
  targetIndustries: ["SaaS", "Fintech"],
  locations: ["United States", "Canada"],
  minEmployeeRange: "51-200",
  maxEmployeeRange: "1000+",
  keywords: ["pipeline velocity", "revops", "predictive analytics"],
  technologyStack: ["Salesforce", "HubSpot"],
  intentSignals: ["hiring SDRs", "ABM data", "AI enablement"],
  decisionMakerTitles: ["vp sales", "head of revops", "chief revenue officer"],
  urgency: "High",
  outreachChannels: ["Email", "LinkedIn", "Events"],
};

export const LeadAgentPage = () => {
  const [campaign, setCampaign] = useState<CampaignInputs>(defaultCampaign);
  const [leads, setLeads] = useState<PrioritizedLead[]>([]);
  const [recommendation, setRecommendation] = useState<CampaignRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAgent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/lead-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to run agent");
      }

      const payload = (await response.json()) as { leads: PrioritizedLead[]; recommendation: CampaignRecommendation };
      setLeads(payload.leads);
      setRecommendation(payload.recommendation);
      setLastRunAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setLeads([]);
      setRecommendation(null);
    } finally {
      setIsLoading(false);
    }
  }, [campaign]);

  useEffect(() => {
    runAgent();
  }, [runAgent]);

  const handleCampaignChange = (updates: Partial<CampaignInputs>) => {
    setCampaign((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col gap-8">
      <CampaignForm value={campaign} onChange={handleCampaignChange} onSubmit={runAgent} isLoading={isLoading} />
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700">
          <p className="font-semibold">We hit a snag.</p>
          <p className="mt-1 text-xs text-rose-600">{error}</p>
        </div>
      ) : null}
      <LeadResults leads={leads} recommendation={recommendation} isLoading={isLoading} lastRunAt={lastRunAt} />
    </div>
  );
};

