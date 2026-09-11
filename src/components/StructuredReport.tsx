import React from 'react';
import { IncidentReport } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { VerificationStatus } from './VerificationStatus';
import { EvidenceAnalysis } from './EvidenceAnalysis';
import {
  CheckCircle2,
  HelpCircle,
  AlertOctagon,
  Flame,
  Users,
  Building2,
  PhoneForwarded,
  Shield,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
  ClipboardList
} from 'lucide-react';

interface StructuredReportProps {
  report: IncidentReport;
}

export const StructuredReport: React.FC<StructuredReportProps> = ({ report }) => {
  const formattedTime = new Date(report.metadata.analyzedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Calculate Verification Status Counts
  const verificationCounts = {
    confirmed: report.knownInformation?.length || 0,
    needsCheck: (report.uncertainInformation?.length || 0) + (report.verificationNeeded?.length || 0),
    missing: report.missingInformation?.length || 0,
  };
  const totalClaims = (report.evidence?.length || 0) + verificationCounts.confirmed + verificationCounts.needsCheck + verificationCounts.missing;

  // Immediate top critical safety directive
  const topCriticalAction = report.recommendedImmediateActions?.[0] || null;

  return (
    <div id="structured-incident-report" className="space-y-6">
      {/* 1. SEVERITY & INCIDENT CLASSIFICATION HEADER */}
      <div id="incident-header-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Synthesis Timestamp: {formattedTime}</span>
              {report.metadata.hasImageAttachment && (
                <span className="text-slate-300">• Visual Evidence Processed</span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {report.incidentType}
            </h1>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
            <SeverityBadge severity={report.severity} size="lg" />
            <span className="text-[11px] text-slate-400 font-medium">
              Verified Triage Level
            </span>
          </div>
        </div>

        {/* Severity Assessment Rationale & Escalation Profile */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-slate-900 block mb-0.5">Severity Justification:</strong>
              <span>{report.severityReasoning}</span>
            </div>
          </div>

          {report.escalationReason && (
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 block mb-0.5">Escalation Vector:</strong>
                <span className="text-slate-700">{report.escalationReason}</span>
              </div>
            </div>
          )}
        </div>

        {/* Executive Summary */}
        <div className="mt-5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Executive Incident Briefing
          </h2>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal bg-slate-50/40 p-4 rounded-xl border border-slate-100">
            {report.summary}
          </p>
        </div>
      </div>

      {/* 2. IMMEDIATE CRITICAL SAFETY ACTION DIRECTIVE */}
      {topCriticalAction && (
        <div
          id="immediate-critical-safety-action"
          className="rounded-2xl border-2 border-red-500/80 bg-red-50/40 p-5 sm:p-6 shadow-xs relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-200/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-600 text-white shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-600">
                  Immediate Life-Safety Directive
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {topCriticalAction.action}
                </h3>
              </div>
            </div>

            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-xs">
              {topCriticalAction.priority} PRIORITY
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
            <div className="md:col-span-6 bg-white/80 p-3 rounded-xl border border-red-100">
              <strong className="text-slate-900 block mb-1">Why This Action Is Crucial:</strong>
              <p className="text-slate-700 leading-relaxed">{topCriticalAction.why}</p>
            </div>
            <div className="md:col-span-6 bg-white/80 p-3 rounded-xl border border-red-100">
              <strong className="text-slate-900 block mb-1">Grounding Evidence:</strong>
              <p className="text-slate-700 leading-relaxed">{topCriticalAction.evidence}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. VERIFICATION STATUS */}
      <VerificationStatus counts={verificationCounts} totalClaims={totalClaims} />

      {/* 4. EVIDENCE & CLAIM ANALYSIS LAYER */}
      <EvidenceAnalysis evidence={report.evidence} />

      {/* 5. FACTUAL RIGOR MATRIX (KNOWN / UNCERTAIN / MISSING / VERIFICATION NEEDED) */}
      <div id="factual-rigor-matrix" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>Factual Rigor Matrix (Observations vs Assumptions)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Never present an assumption as confirmed fact. Clear division of verified observations from unknowns.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            Ground Truth Discipline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Confirmed Known Information */}
          <div
            id="card-known-information"
            className="bg-white rounded-xl border border-emerald-200/90 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-emerald-100">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Known Information
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-medium">✓ Confirmed observations</span>
                </div>
              </div>

              <ul className="space-y-2.5">
                {report.knownInformation.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-2.5 border-t border-emerald-50 text-[10px] font-mono text-emerald-700 flex items-center justify-between">
              <span>Verified ground truth</span>
              <span className="font-bold">{report.knownInformation.length} items</span>
            </div>
          </div>

          {/* 2. Uncertain Information */}
          <div
            id="card-uncertain-information"
            className="bg-white rounded-xl border border-amber-200/90 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-amber-100">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Uncertain Information
                  </h3>
                  <span className="text-[11px] text-amber-700 font-medium">⚠ Needs verification</span>
                </div>
              </div>

              <ul className="space-y-2.5">
                {report.uncertainInformation.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-2.5 border-t border-amber-50 text-[10px] font-mono text-amber-700 flex items-center justify-between">
              <span>Unverified hypotheses</span>
              <span className="font-bold">{report.uncertainInformation.length} items</span>
            </div>
          </div>

          {/* 3. Missing Information */}
          <div
            id="card-missing-information"
            className="bg-white rounded-xl border border-sky-200/90 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-sky-100">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900">
                    Missing Information
                  </h3>
                  <span className="text-[11px] text-sky-700 font-medium">? Critical unknowns</span>
                </div>
              </div>

              <ul className="space-y-2.5">
                {report.missingInformation.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-2.5 border-t border-sky-50 text-[10px] font-mono text-sky-700 flex items-center justify-between">
              <span>Immediate triage gaps</span>
              <span className="font-bold">{report.missingInformation.length} items</span>
            </div>
          </div>
        </div>

        {/* Verification Needed Checklist */}
        {report.verificationNeeded && report.verificationNeeded.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              <ClipboardList className="w-4 h-4 text-amber-600" />
              <span>Responder Field Verification Tasks (To Confirm Uncertainties):</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-700">
              {report.verificationNeeded.map((task, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. HAZARDS & PEOPLE/PROPERTY AFFECTED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hazards & Cascade Risks */}
        <div id="card-potential-hazards" className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Potential Hazards & Cascade Risks
              </h2>
              <p className="text-xs text-slate-500">Secondary threats to health, life, and infrastructure</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {report.potentialHazards.map((hazard, index) => (
              <li
                key={index}
                className="p-3 rounded-xl bg-red-50/40 border border-red-100 text-xs text-slate-800 font-medium leading-relaxed flex items-start gap-2.5"
              >
                <span className="text-red-600 font-bold font-mono">0{index + 1}.</span>
                <span>{hazard}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* People & Property Affected */}
        <div id="card-people-property-affected" className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/70">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                People & Property Affected
              </h2>
              <p className="text-xs text-slate-500">Occupants, transit corridors, and municipal assets</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {report.peoplePropertyAffected.map((item, index) => (
              <li
                key={index}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-800 font-medium leading-relaxed flex items-start gap-2.5"
              >
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. RELEVANT AUTHORITY & DISPATCH ROUTING */}
      <div id="card-relevant-authority" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
              <PhoneForwarded className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Relevant Authority & Inter-Agency Coordination
              </h2>
              <p className="text-xs text-slate-500">Recommended jurisdiction routing and dispatch profile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Primary Lead Agency
            </span>
            <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{report.relevantAuthorityCategory.primary}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Secondary / Mutual Aid
            </span>
            <div className="text-xs text-slate-700 font-semibold space-y-1">
              {report.relevantAuthorityCategory.secondary && report.relevantAuthorityCategory.secondary.length > 0 ? (
                report.relevantAuthorityCategory.secondary.map((sec, i) => (
                  <div key={i} className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span className="truncate">{sec}</span>
                  </div>
                ))
              ) : (
                <span>Standard municipal support</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Dispatch Protocol Profile
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {report.relevantAuthorityCategory.dispatchProtocol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
