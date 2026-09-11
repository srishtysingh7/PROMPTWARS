import React, { useState } from 'react';
import { PrioritizedAction, IncidentReport, ActionPriority } from '../types';
import { ShieldCheck, UserCheck, AlertTriangle, ListChecks, Copy, Check, Printer, AlertOctagon, Info, Zap } from 'lucide-react';

interface RecommendedActionsProps {
  report: IncidentReport;
}

export const RecommendedActions: React.FC<RecommendedActionsProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'immediate' | 'bystander' | 'responder'>('all');

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const priorityBadge = (priority: ActionPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-600 text-white shadow-xs">
            <AlertOctagon className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
            <AlertTriangle className="w-3 h-3" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Zap className="w-3 h-3" />
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <Info className="w-3 h-3" />
            LOW
          </span>
        );
    }
  };

  // Compile full action lists
  const immediateActions = report.recommendedImmediateActions || [];
  const bystanderActions = report.bystanderActions || [];
  const responderActions = report.responderActions || [];

  const copyBriefing = () => {
    const formatted = `[CRISISBRIDGE ACTIONABLE RESPONSE PLAN]
=========================================
INCIDENT: ${report.incidentType}
TRIAGE SEVERITY: ${report.severity}
SEVERITY JUSTIFICATION: ${report.severityReasoning}
${report.escalationReason ? `ESCALATION VECTOR: ${report.escalationReason}\n` : ''}
PRIMARY DISPATCH AGENCY: ${report.relevantAuthorityCategory.primary}
PROTOCOL: ${report.relevantAuthorityCategory.dispatchProtocol}

EVALUATION SUMMARY:
${report.summary}

VERIFIED OBSERVATIONS (CONFIRMED):
${report.knownInformation.map((k) => `✓ ${k}`).join('\n')}

UNVERIFIED HYPOTHESES (NEEDS CHECK):
${report.uncertainInformation.map((u) => `⚠ ${u}`).join('\n')}

CRITICAL GAPS FOR ARRIVING UNITS (MISSING):
${report.missingInformation.map((m) => `? ${m}`).join('\n')}

PRIORITIZED ACTION PLAN:
--- IMMEDIATE TACTICAL ACTIONS ---
${immediateActions.map((a, i) => `[${a.priority}] ${i + 1}. ${a.action}\n   WHY: ${a.why}\n   EVIDENCE: ${a.evidence}`).join('\n\n')}

--- BYSTANDER SAFETY DIRECTIVES ---
${bystanderActions.map((b, i) => `[${b.priority}] ${i + 1}. ${b.action}\n   WHY: ${b.why}\n   EVIDENCE: ${b.evidence}`).join('\n\n')}

--- FIRST RESPONDER & DISPATCH DIRECTIVES ---
${responderActions.map((r, i) => `[${r.priority}] ${i + 1}. ${r.action}\n   WHY: ${r.why}\n   EVIDENCE: ${r.evidence}`).join('\n\n')}
=========================================
${report.metadata.emergencyStatusNotice}
Timestamp: ${report.metadata.analyzedAt}`;

    navigator.clipboard.writeText(formatted).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const renderActionCard = (item: PrioritizedAction, keyPrefix: string, index: number) => {
    const key = `${keyPrefix}-${index}`;
    const isChecked = checkedItems[key];

    return (
      <div
        key={key}
        id={`action-card-${key}`}
        className={`p-4 rounded-xl border transition-all ${
          isChecked
            ? 'bg-emerald-50/40 border-emerald-200 opacity-80'
            : item.priority === 'CRITICAL'
            ? 'bg-red-50/20 border-red-200 hover:border-red-300'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <label className="flex items-center gap-2 cursor-pointer mt-0.5">
              <input
                type="checkbox"
                checked={isChecked || false}
                onChange={() => toggleCheck(key)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
            </label>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {priorityBadge(item.priority)}
                <span className="text-xs font-mono text-slate-400">Step {index + 1}</span>
              </div>
              <div className={`text-sm font-extrabold text-slate-900 leading-snug ${isChecked ? 'line-through text-slate-500' : ''}`}>
                {item.action}
              </div>
            </div>
          </div>
        </div>

        {/* Why & Evidence rationale */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
            <strong className="text-slate-800 font-bold block mb-0.5">Why This Action:</strong>
            <p className="text-slate-600 leading-relaxed">{item.why}</p>
          </div>
          <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
            <strong className="text-slate-800 font-bold block mb-0.5">Grounding Evidence:</strong>
            <p className="text-slate-600 leading-relaxed">{item.evidence}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="recommended-actions-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Evidence-Aware Action Plan
            </h2>
            <p className="text-xs text-slate-500">
              Sorted by hazard priority with explicit causal justification and observational evidence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="copy-briefing-button"
            onClick={copyBriefing}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Briefing Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Field Briefing</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="print-report-button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 mt-5 mb-4 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Action Directives ({immediateActions.length + bystanderActions.length + responderActions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('immediate')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'immediate'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Immediate Critical ({immediateActions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bystander')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'bystander'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Bystander Directives ({bystanderActions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('responder')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'responder'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Responder Protocol ({responderActions.length})
        </button>
      </div>

      {/* Action Cards Container */}
      <div className="space-y-6">
        {(activeTab === 'all' || activeTab === 'immediate') && immediateActions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Zap className="w-4 h-4 text-red-600" />
              <span>Immediate Tactical Interventions</span>
            </div>
            <div className="space-y-3">
              {immediateActions.map((action, idx) => renderActionCard(action, 'immediate', idx))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'bystander') && bystanderActions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Bystander & Eyewitness Directives</span>
            </div>
            <div className="space-y-3">
              {bystanderActions.map((action, idx) => renderActionCard(action, 'bystander', idx))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'responder') && responderActions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
              <ListChecks className="w-4 h-4 text-sky-600" />
              <span>Emergency Dispatch & Mutual Aid Protocol</span>
            </div>
            <div className="space-y-3">
              {responderActions.map((action, idx) => renderActionCard(action, 'responder', idx))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click checkbox to mark tactical task verified during field operations.</span>
        <span>Priority sorted: CRITICAL &rarr; HIGH &rarr; MEDIUM</span>
      </div>
    </section>
  );
};
