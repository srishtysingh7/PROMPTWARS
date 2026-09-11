import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DemoPicker } from './components/DemoPicker';
import { ReportInput } from './components/ReportInput';
import { StructuredReport } from './components/StructuredReport';
import { RecommendedActions } from './components/RecommendedActions';
import { DEMO_EXAMPLES } from './data/demoExamples';
import { IncidentReport, DemoExample } from './types';
import { AlertCircle, ShieldAlert, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<{
    dataUrl: string;
    mimeType: string;
    filename: string;
  } | null>(null);
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize with Demo 1 so user has instant playable content
  useEffect(() => {
    if (DEMO_EXAMPLES.length > 0) {
      const first = DEMO_EXAMPLES[0];
      setSelectedDemoId(first.id);
      setInputText(first.text);
      if (first.imageData) {
        setSelectedImage(first.imageData);
      }
    }
  }, []);

  const handleSelectDemo = (demo: DemoExample) => {
    setSelectedDemoId(demo.id);
    setInputText(demo.text);
    if (demo.imageData) {
      setSelectedImage(demo.imageData);
    } else {
      setSelectedImage(null);
    }
    setErrorMessage(null);
  };

  const handleReset = () => {
    setInputText('');
    setSelectedImage(null);
    setSelectedDemoId(null);
    setReport(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && !selectedImage) {
      setErrorMessage('Please provide either report text or an incident photograph.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Ingesting messy eyewitness inputs & imagery...');

    // Step updates mapping directly to the 6-stage cognitive pipeline
    const timer1 = setTimeout(() => setLoadingStep('Extracting information & multimodal observations...'), 600);
    const timer2 = setTimeout(() => setLoadingStep('Analyzing evidence claims & grounding sources...'), 1400);
    const timer3 = setTimeout(() => setLoadingStep('Computing confidence & isolating uncertainties/missing data...'), 2200);
    const timer4 = setTimeout(() => setLoadingStep('Evaluating risk matrices & synthesizing prioritized action plan...'), 3000);

    try {
      const response = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          image: selectedImage
            ? {
                data: selectedImage.dataUrl,
                mimeType: selectedImage.mimeType,
              }
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.report) {
        setReport(data.report);
        // Scroll to report on completion
        setTimeout(() => {
          const reportElement = document.getElementById('structured-incident-report');
          if (reportElement) {
            reportElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        throw new Error(data.error || 'Failed to synthesize incident report.');
      }
    } catch (err: any) {
      console.error('Incident analysis error:', err);
      setErrorMessage(
        err.message || 'An error occurred while connecting to the incident intelligence engine. Please try again.'
      );
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const pipelineStages = [
    { id: 'raw', name: 'Raw Input' },
    { id: 'extraction', name: 'Information Extraction' },
    { id: 'evidence', name: 'Evidence / Claim Analysis' },
    { id: 'uncertainty', name: 'Confidence & Uncertainty' },
    { id: 'risk', name: 'Risk Assessment' },
    { id: 'actions', name: 'Action Plan' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Header onReset={handleReset} hasActiveReport={Boolean(report)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hackathon Problem & Cognitive Pipeline Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                    CrisisBridge Cognitive Synthesis Engine
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Evidence-Aware AI
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Universal bridge transforming unstructured human intent & real-world crisis reports into structured, evidence-aware action plans.
                </p>
              </div>
            </div>

            {/* Subtle Safety Support Pill */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Decision Support &bull; Does not replace emergency dispatchers</span>
            </div>
          </div>

          {/* Visual Pipeline Stages Flow */}
          <div className="pt-3.5">
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
              {pipelineStages.map((stage, idx) => (
                <React.Fragment key={stage.id}>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      report
                        ? 'bg-slate-900 text-white shadow-xs'
                        : idx === 0
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 font-extrabold'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
                        report
                          ? 'bg-amber-400 text-slate-900 font-bold'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span>{stage.name}</span>
                  </div>

                  {idx < pipelineStages.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Example Scenarios */}
        <DemoPicker
          selectedDemoId={selectedDemoId}
          onSelectDemo={handleSelectDemo}
          isLoading={isLoading}
        />

        {/* Input Form (Text + Image Upload) */}
        <ReportInput
          text={inputText}
          onChangeText={(val) => {
            setInputText(val);
            if (selectedDemoId) setSelectedDemoId(null);
          }}
          image={selectedImage}
          onSelectImage={(img) => {
            setSelectedImage(img);
            if (selectedDemoId) setSelectedDemoId(null);
          }}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          loadingStep={loadingStep}
        />

        {/* Error Alert */}
        {errorMessage && (
          <div
            id="analysis-error-banner"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold">Analysis Warning: </strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Output Section */}
        {report && (
          <div className="space-y-7 pt-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                  Synthesized Incident Intelligence
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Actionable Response Plan Active
              </span>
            </div>

            {/* Structured Report Cards following hierarchy: Severity -> Immediate Action -> Verification Status -> Evidence -> Known/Uncertain/Missing */}
            <StructuredReport report={report} />

            {/* Recommended Action Plan (Action, Why, Evidence, Priority) */}
            <RecommendedActions report={report} />
          </div>
        )}
      </main>

      {/* Subtle Safety Disclaimer & Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">CrisisBridge</span>
            <span>&bull; Hackathon Decision Support System</span>
          </div>

          <p className="text-[11px] text-slate-500 text-center sm:text-right max-w-xl leading-relaxed">
            <strong>Safety Disclaimer:</strong> CrisisBridge provides AI-assisted decision support. Verify critical information with appropriate emergency services and trained responders.
          </p>
        </div>
      </footer>
    </div>
  );
}
