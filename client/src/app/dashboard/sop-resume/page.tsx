'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Sparkles, FileText, CheckCircle, ListChecks, HelpCircle, Loader2, Gauge } from 'lucide-react';

interface SopAnalysisResult {
  score: number;
  grammarFeedback: string;
  structureFeedback: string;
  alignmentFeedback: string;
  toneFeedback: string;
  suggestions: string[];
}

interface ResumeAnalysisResult {
  score: number;
  skillsIdentified: string[];
  missingSkills: string[];
  suggestions: string[];
}

export default function SopResumePage() {
  const [activeTab, setActiveTab] = useState<'sop' | 'resume'>('sop');
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // Results
  const [sopResult, setSopResult] = useState<SopAnalysisResult | null>(null);
  const [resumeResult, setResumeResult] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setError('');
    setAnalyzing(true);

    try {
      if (activeTab === 'sop') {
        const result = await api.post<SopAnalysisResult>('/ai/analyze-sop', { sopText: inputText });
        setSopResult(result);
      } else {
        const result = await api.post<ResumeAnalysisResult>('/ai/analyze-resume', { resumeText: inputText });
        setResumeResult(result);
      }
    } catch (err: any) {
      console.error('Analysis failed', err);
      setError(err.message || 'AI audit failed. Please verify connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTabChange = (tab: 'sop' | 'resume') => {
    setActiveTab(tab);
    setInputText('');
    setError('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
    return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
  };

  return (
    <div className="space-y-8">
      {/* Description header */}
      <div>
        <h2 className="text-2xl font-bold text-white">SOP & Resume Audit</h2>
        <p className="text-slate-400 text-sm mt-1">
          Scan your MEXT Statement of Purpose (SOP) essay or academic CV. Get insights on keyword matching, professional tone, and structuring recommendations.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Tabs selector */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => handleTabChange('sop')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'sop'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Statement of Purpose (SOP)
        </button>
        <button
          onClick={() => handleTabChange('resume')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'resume'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Academic CV / Resume
        </button>
      </div>

      {/* Main Workspace grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor form panel - Column 7 */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleAnalyze} className="glass p-6 rounded-2xl border border-border/40 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Paste your {activeTab === 'sop' ? 'Statement of Purpose Draft' : 'Academic CV Content'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeTab === 'sop'
                    ? 'Paste your MEXT essay (typically detailing motivation, study plan, and future contributions in Japan)...'
                    : 'Paste your resume outline or academic CV text including education, technical stack, projects, and work history...'
                }
                rows={15}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={analyzing || !inputText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:text-indigo-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Perform AI Audit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Audit results panel - Column 5 */}
        <div className="lg:col-span-5 space-y-6">
          {activeTab === 'sop' && sopResult && (
            <div className="space-y-6">
              {/* Score indicator */}
              <div className="glass p-6 rounded-2xl border border-border/40 flex items-center gap-5">
                <div className={`p-4 rounded-xl border ${getScoreColor(sopResult.score)} flex flex-col items-center justify-center shrink-0 w-20 h-20`}>
                  <span className="text-2xl font-black">{sopResult.score}</span>
                  <span className="text-[9px] text-slate-500">SCORE</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">SOP Quality Index</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                    Analyzed against MEXT selection metrics. Scores above 80 are highly competitive.
                  </p>
                </div>
              </div>

              {/* Feedback categories */}
              <div className="glass p-6 rounded-2xl border border-border/40 space-y-5">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider pb-2 border-b border-slate-900">Evaluation Categories</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Grammar & Syntax</span>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-900">{sopResult.grammarFeedback}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Cohesion & Structure</span>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-900">{sopResult.structureFeedback}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Advisory Alignment</span>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-900">{sopResult.alignmentFeedback}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Academic Tone</span>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-900">{sopResult.toneFeedback}</p>
                  </div>
                </div>
              </div>

              {/* Suggestions list */}
              <div className="glass p-6 rounded-2xl border border-border/40 space-y-4">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Audit Recommendations</h4>
                <ul className="space-y-2.5">
                  {sopResult.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-indigo-200 leading-relaxed items-start">
                      <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'resume' && resumeResult && (
            <div className="space-y-6">
              {/* Score indicator */}
              <div className="glass p-6 rounded-2xl border border-border/40 flex items-center gap-5">
                <div className={`p-4 rounded-xl border ${getScoreColor(resumeResult.score)} flex flex-col items-center justify-center shrink-0 w-20 h-20`}>
                  <span className="text-2xl font-black">{resumeResult.score}</span>
                  <span className="text-[9px] text-slate-500">SCORE</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">Resume Strength Score</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                    Evaluates experience clarity and technical credentials matching.
                  </p>
                </div>
              </div>

              {/* Skills identified */}
              <div className="glass p-6 rounded-2xl border border-border/40 space-y-3">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-emerald-400" />
                  Identified Credentials
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {resumeResult.skillsIdentified.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-emerald-950/20 text-emerald-400 border border-emerald-900/60 px-2.5 py-0.5 rounded-md font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing skills */}
              <div className="glass p-6 rounded-2xl border border-border/40 space-y-3">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Recommended Skills to Add
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {resumeResult.missingSkills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-amber-950/20 text-amber-450 border border-amber-900/60 px-2.5 py-0.5 rounded-md font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions list */}
              <div className="glass p-6 rounded-2xl border border-border/40 space-y-4">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Audit Recommendations</h4>
                <ul className="space-y-2.5">
                  {resumeResult.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-indigo-200 leading-relaxed items-start">
                      <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!sopResult && !resumeResult && (
            <div className="glass p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 h-64 flex flex-col justify-center items-center gap-3">
              <FileText className="w-8 h-8 text-slate-600" />
              <span>No analysis generated yet. Paste your draft on the left and start auditing.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
