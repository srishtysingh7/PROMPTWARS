import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, ArrowRight, Loader2, Sparkles, FileText } from 'lucide-react';

interface ReportInputProps {
  text: string;
  onChangeText: (value: string) => void;
  image: { dataUrl: string; mimeType: string; filename: string } | null;
  onSelectImage: (image: { dataUrl: string; mimeType: string; filename: string } | null) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  loadingStep: string;
}

export const ReportInput: React.FC<ReportInputProps> = ({
  text,
  onChangeText,
  image,
  onSelectImage,
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onSelectImage({
        dataUrl,
        mimeType: file.type || 'image/jpeg',
        filename: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const canAnalyze = (text.trim().length > 0 || image !== null) && !isLoading;

  return (
    <div id="incident-intake-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Incident Intake Form</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit unstructured field notes, eyewitness observations, and photographic evidence.
          </p>
        </div>

        {text && !isLoading && (
          <button
            type="button"
            onClick={() => onChangeText('')}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
          >
            Clear Text
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Text Input Area */}
        <div className="lg:col-span-7 flex flex-col">
          <label
            htmlFor="incident-text-input"
            className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Eyewitness / Bystander Report (Text)</span>
          </label>
          <div className="relative flex-1">
            <textarea
              id="incident-text-input"
              rows={8}
              value={text}
              disabled={isLoading}
              onChange={(e) => onChangeText(e.target.value)}
              placeholder="Type what happened in detail:&#10;• What do you see on scene?&#10;• Are vehicles, pedestrians, or structures compromised?&#10;• Any live wires, fire, smoke, water accumulation, or fuel odor?&#10;• Exact or approximate location cues..."
              className="w-full h-full min-h-[190px] p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
            <span>Raw text will be structured by Gemini into tactical dispatch intelligence.</span>
            <span>{text.length} chars</span>
          </div>
        </div>

        {/* Photo Upload Area */}
        <div className="lg:col-span-5 flex flex-col">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Visual Evidence (Photo Upload)</span>
          </label>

          <input
            ref={fileInputRef}
            id="incident-file-input"
            type="file"
            accept="image/*,.svg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {image ? (
            <div
              id="uploaded-image-preview"
              className="relative flex-1 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden flex flex-col items-center justify-center group min-h-[190px]"
            >
              <img
                src={image.dataUrl}
                alt="Uploaded emergency scene"
                className="max-h-[185px] w-full object-contain p-2"
              />

              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  id="replace-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold shadow-sm transition-all"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  id="remove-image-btn"
                  onClick={() => onSelectImage(null)}
                  className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-sm transition-all"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2 text-center">
                <span className="text-[11px] font-mono text-slate-200 truncate max-w-[90%] inline-block">
                  {image.filename}
                </span>
              </div>
            </div>
          ) : (
            <div
              id="image-dropzone"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-[190px] ${
                isDragging
                  ? 'border-amber-500 bg-amber-50/50 scale-[0.99]'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 mb-2.5">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop incident photo
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                or <span className="text-amber-600 font-medium">browse device</span> (JPG, PNG, WEBP, SVG)
              </p>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Multimodal vision analyzes live hazards, entrapment & fluid spills.</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Strict factual rigor: Zero hallucination, observations distinguished from assumptions.</span>
        </div>

        <button
          id="analyze-incident-button"
          type="button"
          disabled={!canAnalyze}
          onClick={onAnalyze}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm ${
            canAnalyze
              ? 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white cursor-pointer ring-1 ring-slate-800'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span className="font-semibold text-slate-100">{loadingStep || 'Analyzing with Gemini...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Analyze Incident</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
