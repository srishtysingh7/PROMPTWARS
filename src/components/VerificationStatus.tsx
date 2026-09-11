import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck } from 'lucide-react';
import { VerificationCounts } from '../types';

interface VerificationStatusProps {
  counts: VerificationCounts;
  totalClaims: number;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ counts, totalClaims }) => {
  return (
    <div
      id="verification-status-section"
      className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
                Verification Status
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Factual Rigor Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict truth-grounding: Zero hallucinations, clear separation of observed facts from assumptions.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Evaluated Data Points:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
            {totalClaims} Items
          </span>
        </div>
      </div>

      {/* Verification Status KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
        {/* Confirmed */}
        <div
          id="verification-confirmed-card"
          className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between group hover:border-emerald-500/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Confirmed
              </div>
              <div className="text-xs text-slate-400">Directly Observed Facts</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              {counts.confirmed}
            </span>
          </div>
        </div>

        {/* Needs Verification */}
        <div
          id="verification-needs-check-card"
          className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between group hover:border-amber-500/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Needs Check
              </div>
              <div className="text-xs text-slate-400">Assumptions / Uncertain</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
              {counts.needsCheck}
            </span>
          </div>
        </div>

        {/* Missing Information */}
        <div
          id="verification-missing-card"
          className="bg-slate-950/60 border border-sky-500/30 rounded-xl p-4 flex items-center justify-between group hover:border-sky-500/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                Missing
              </div>
              <div className="text-xs text-slate-400">Critical Gaps for Responders</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black font-mono text-sky-400">
              {counts.missing}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
