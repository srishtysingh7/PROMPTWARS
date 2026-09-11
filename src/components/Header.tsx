import React from 'react';
import { ShieldAlert, Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasActiveReport: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasActiveReport }) => {
  return (
    <header id="crisisbridge-header" className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Crisis<span className="text-amber-600">Bridge</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Hackathon MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Multimodal Emergency Intake & Actionable Incident Synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Intake Active</span>
          </div>

          {hasActiveReport && (
            <button
              id="header-new-report-button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Intake</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
