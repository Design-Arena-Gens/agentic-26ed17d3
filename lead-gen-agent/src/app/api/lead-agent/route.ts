import { NextResponse } from "next/server";
import { z } from "zod";

import { LEADS } from "@/data/leads";
import { prioritizeLeads } from "@/lib/scoring";
import {
  CampaignInputs,
  CampaignRecommendation,
  PrioritizedLead,
} from "@/lib/types";

export const dynamic = "force-dynamic";

const companySizes = ["1-50", "51-200", "201-500", "501-1000", "1000+"] as const;

const industries = [
  "SaaS",
  "E-commerce",
  "Healthcare",
  "Fintech",
  "Manufacturing",
  "Education",
  "Marketing",
  "Logistics",
  "Energy",
  "Hospitality",
] as const;

const campaignSchema = z.object({
  campaignName: z.string().trim().min(2),
  valueProposition: z.string().trim().min(10),
  targetIndustries: z.array(z.enum(industries)).min(1),
  locations: z.array(z.string()).default([]),
  minEmployeeRange: z.enum(companySizes).optional(),
  maxEmployeeRange: z.enum(companySizes).optional(),
  keywords: z.array(z.string()).default([]),
  technologyStack: z.array(z.string()).default([]),
  intentSignals: z.array(z.string()).default([]),
  decisionMakerTitles: z.array(z.string()).default([]),
  urgency: z.enum(["Low", "Medium", "High"]),
  outreachChannels: z.array(z.enum(["Email", "LinkedIn", "Phone", "Events"])).min(1),
});

const normalize = (value: string) => value.trim().toLowerCase();

const filterLeads = (leads: typeof LEADS, inputs: CampaignInputs) => {
  return leads.filter((lead) => {
    const industryMatch =
      !inputs.targetIndustries.length || inputs.targetIndustries.includes(lead.industry);

    const locationMatch =
      !inputs.locations.length ||
      inputs.locations.some((location) => lead.location.toLowerCase().includes(location.toLowerCase()));

    const keywordMatch =
      !inputs.keywords.length ||
      inputs.keywords.some((keyword) => {
        const normalizedKeyword = normalize(keyword);
        return (
          lead.companyName.toLowerCase().includes(normalizedKeyword) ||
          lead.description.toLowerCase().includes(normalizedKeyword) ||
          lead.recentInitiatives.some((initiative) =>
            initiative.toLowerCase().includes(normalizedKeyword),
          ) ||
          lead.highlights.some((highlight) => highlight.toLowerCase().includes(normalizedKeyword))
        );
      });

    const technologyMatch =
      !inputs.technologyStack.length ||
      inputs.technologyStack.some((tech) =>
        lead.technologies.map((item) => item.toLowerCase()).includes(tech.toLowerCase()),
      );

    return industryMatch && locationMatch && keywordMatch && technologyMatch;
  });
};

const buildRecommendation = (
  inputs: CampaignInputs,
  prioritized: PrioritizedLead[],
): CampaignRecommendation => {
  const focusIndustry = inputs.targetIndustries[0];
  const sampleLead = prioritized[0];
  const differentiators: string[] = [];

  if (inputs.valueProposition.toLowerCase().includes("ai")) {
    differentiators.push("Highlight AI-driven components with clear outcomes and proof points.");
  }

  if (inputs.technologyStack.some((tech) => tech.toLowerCase().includes("salesforce"))) {
    differentiators.push("Mention native alignment with Salesforce processes to reduce switching costs.");
  }

  if (inputs.intentSignals.length) {
    differentiators.push(
      `Use real-time signals like ${inputs.intentSignals.slice(0, 2).join(", ")} to prioritize outreach.`,
    );
  }

  if (!differentiators.length) {
    differentiators.push("Lead with quantified impact, then back it up with social proof and customer wins.");
  }

  const messagingHooks = [
    `Lead with a ${inputs.urgency.toLowerCase()} urgency hook that quantifies the upside for ${focusIndustry} teams.`,
    "Reference a recent initiative from the account to show tailored research.",
    "Close with a clear next step offering a tailored audit or playbook download.",
  ];

  const callToAction =
    inputs.outreachChannels.includes("Events") && sampleLead?.lead.recentInitiatives.length
      ? "Invite them to a micro-workshop sharing best practices with peers tackling the same initiative."
      : "Suggest a 20-minute working session to map their current process and identify immediate wins.";

  const followUps = [
    "Follow up in 2 days with a one-slide ROI snapshot aligned to their primary KPI.",
    "Share a concise case study highlighting a customer with similar scale and tech stack.",
    "Offer to collaborate on a co-branded session if they drive community initiatives.",
  ];

  const successMetrics = [
    "Meetings booked with tier-1 accounts",
    "Pipeline generated within the first 30 days",
    "Conversion rate from initial outreach to discovery call",
    "Engagement rate with the personalized assets you deliver",
  ];

  return {
    summary: `Focus on ${focusIndustry} accounts discomfort around ${inputs.valueProposition
      .split(".")[0]
      .toLowerCase()}. Anchor messaging around fast wins and social proof.`,
    messagingHooks,
    callToAction,
    followUps,
    successMetrics,
  };
};

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = campaignSchema.parse(json) as CampaignInputs;
    const filtered = filterLeads(LEADS, payload);
    const prioritized = prioritizeLeads(filtered.length ? filtered : LEADS, payload);
    const recommendation = buildRecommendation(payload, prioritized);

    return NextResponse.json(
      {
        leads: prioritized,
        recommendation,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[lead-agent] error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
