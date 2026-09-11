import React from 'react';
import { DEMO_EXAMPLES } from '../data/demoExamples';
import { DemoExample } from '../types';
import { Waves, Car, Zap, Sparkles } from 'lucide-react';

interface DemoPickerProps {
  selectedDemoId: string | null;
  onSelectDemo: (demo: DemoExample) => void;
  isLoading: boolean;
}

export const DemoPicker: React.FC<DemoPickerProps> = ({
  selectedDemoId,
  onSelectDemo,
  isLoading,
}) => {
  const getDemoIcon = (id: string) => {
    switch (id) {
      case 'flooded-road':
        return <Waves className="w-4 h-4 text-sky-600" />;
      case 'road-accident':
        return <Car className="w-4 h-4 text-red-600" />;
      case 'fallen-tree-wires':
        return <Zap className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div id="demo-examples-container" className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Hackathon Verification Scenarios
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          Click any preset to pre-load messy text & incident photo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEMO_EXAMPLES.map((demo, index) => {
          const isSelected = selectedDemoId === demo.id;
          return (
            <button
              key={demo.id}
              id={`demo-card-${demo.id}`}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectDemo(demo)}
              className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                  : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200/60">
                      {getDemoIcon(demo.id)}
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      Demo 0{index + 1}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {demo.title}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {demo.shortDesc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Includes text & photo</span>
                <span className="font-semibold text-slate-600 hover:text-amber-600">
                  Load Preset &rarr;
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
