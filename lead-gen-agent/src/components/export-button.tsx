'use client';

import { saveAs } from "file-saver";

import type { PrioritizedLead } from "@/lib/types";

interface ExportButtonProps {
  leads: PrioritizedLead[];
}

const sanitize = (value: string | number | undefined) => {
  if (value === undefined) return "";
  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
};

const buildCsv = (leads: PrioritizedLead[]) => {
  const header = [
    "Company",
    "Industry",
    "Location",
    "Employee Range",
    "Website",
    "Decision Makers",
    "Technologies",
    "Intent Signals",
    "Highlights",
    "Fit Score",
    "Intent Score",
    "Closing Score",
    "Total Score",
    "Suggested Channel",
  ];

  const rows = leads.map(({ lead, fitScore, intentScore, closingScore, totalScore, suggestedChannel }) => {
    const decisionMakers = lead.decisionMakers
      .map((contact) => `${contact.name} (${contact.title}) - ${contact.email}`)
      .join("; ");
    return [
      sanitize(lead.companyName),
      sanitize(lead.industry),
      sanitize(lead.location),
      sanitize(lead.employeeRange),
      sanitize(lead.website),
      sanitize(decisionMakers),
      sanitize(lead.technologies.join(", ")),
      sanitize(lead.intents.join(", ")),
      sanitize(lead.highlights.join(", ")),
      sanitize(fitScore),
      sanitize(intentScore),
      sanitize(closingScore),
      sanitize(totalScore),
      sanitize(suggestedChannel),
    ].join(",");
  });

  return [header.join(","), ...rows].join("\n");
};

export const ExportButton = ({ leads }: ExportButtonProps) => {
  const handleExport = () => {
    if (!leads.length) return;
    const csv = buildCsv(leads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `lead-gen-agent-${Date.now()}.csv`);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={!leads.length}
      className="inline-flex items-center gap-2 rounded-full border border-indigo-600 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
    >
      Export prioritized leads
    </button>
  );
};

