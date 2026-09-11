import React, { useState } from 'react';
import { EvidenceClaim, ConfidenceLevel } from '../types';
import { SearchCheck, FileText, CheckCircle2, AlertCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface EvidenceAnalysisProps {
  evidence: EvidenceClaim[];
}

export const EvidenceAnalysis: React.FC<EvidenceAnalysisProps> = ({ evidence }) => {
  const [filterConfidence, setFilterConfidence] = useState<ConfidenceLevel | 'ALL'>('ALL');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!evidence || evidence.length === 0) {
    return null;
  }

  const filtered = filterConfidence === 'ALL'
    ? evidence
    : evidence.filter((item) => item.confidence === filterConfidence);

  const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            HIGH CONFIDENCE
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3" />
            MEDIUM CONFIDENCE
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <HelpCircle className="w-3 h-3" />
            LOW CONFIDENCE / UNCONFIRMED
          </span>
        );
    }
  };

  return (
    <div id="evidence-claim-analysis-card" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              <SearchCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Evidence & Claim Analysis Layer
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              {evidence.length} Claims Evaluated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every analytical conclusion is mapped directly to empirical source observations with confidence bounds and reasoning.
          </p>
        </div>

        {/* Confidence Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs font-semibold">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFilterConfidence(level)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterConfidence === level
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {level === 'ALL' ? 'All Claims' : level}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 flex-1">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                      Claim Under Assessment
                    </div>
                    <div className="text-sm font-bold text-slate-900 leading-snug">
                      "{item.claim}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {getConfidenceBadge(item.confidence)}
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md sm:hidden"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Source and Reasoning Grid */}
              <div className="mt-3 pt-3 border-t border-slate-200/70 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-4 flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700 block">Attributed Source:</span>
                    <span className="text-slate-600">{item.source}</span>
                  </div>
                </div>

                <div className="md:col-span-8 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700 block">Model Reasoning & Truth Grounding:</span>
                    <p className="text-slate-600 leading-relaxed">{item.reasoning}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
