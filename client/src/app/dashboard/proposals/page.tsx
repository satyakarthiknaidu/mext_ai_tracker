'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Sparkles, Trophy, Plus, FileText, Trash2, ArrowRight, Loader2, Gauge, Check } from 'lucide-react';

interface Proposal {
  id: string;
  fieldOfStudy: string;
  researchInterest: string;
  problemStatement: string;
  methodology: string;
  expectedOutcome: string;
  generatedTitle: string | null;
  background: string | null;
  objectives: string | null;
  detailedMethodology: string | null;
  timeline: string | null;
  expectedResults: string | null;
  clarityScore: number | null;
  originalityScore: number | null;
  feasibilityScore: number | null;
  grammarScore: number | null;
  feedbackRemarks: string | null;
  createdAt: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    fieldOfStudy: 'Computer Science & Artificial Intelligence',
    researchInterest: 'Adaptive Multi-Agent Systems in Robotic Logistics',
    problemStatement: 'Current warehouse robotics rely on centralized path planning, leading to computational bottlenecks and high collisions when scaling to over 100 active units.',
    methodology: 'Implement a decentralized Reinforcement Learning approach using consensus algorithms for real-time local collision avoidance and dynamic task reassignment.',
    expectedOutcome: 'A simulated benchmark demonstrating a 35% reduction in traffic gridlock and 20% faster average delivery completion times compared to centralized planning.',
  });

  async function fetchProposals() {
    try {
      const data = await api.get<Proposal[]>('/proposals');
      setProposals(data || []);
      if (data && data.length > 0 && !selectedProposal) {
        setSelectedProposal(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to fetch proposals', err);
      setError('Could not load past proposals.');
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    void fetchProposals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGenerating(true);

    try {
      const newProposal = await api.post<Proposal>('/proposals', formData);
      setProposals([newProposal, ...proposals]);
      setSelectedProposal(newProposal);
      setSuccess('AI Research Proposal generated and saved successfully!');
    } catch (err: any) {
      console.error('Generation failed', err);
      setError(err.message || 'Failed to generate proposal with AI. Check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this proposal?')) return;
    setDeletingId(id);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/proposals/${id}`);
      const updated = proposals.filter((p) => p.id !== id);
      setProposals(updated);
      if (selectedProposal?.id === id) {
        setSelectedProposal(updated.length > 0 ? updated[0] : null);
      }
      setSuccess('Proposal deleted successfully.');
    } catch (err: any) {
      console.error('Deletion failed', err);
      setError('Failed to delete proposal.');
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
    return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - List of Proposals (Col Span 4) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass p-6 rounded-2xl border border-border/40 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-white text-base">Your Drafts</h3>
            <button
              onClick={() => setSelectedProposal(null)}
              className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              title="Create New Proposal"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {loadingList ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No research proposals generated yet. Fill the form to create your first!
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {proposals.map((prop) => {
                const isActive = selectedProposal?.id === prop.id;
                return (
                  <div
                    key={prop.id}
                    onClick={() => setSelectedProposal(prop)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive
                        ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                          {prop.fieldOfStudy}
                        </h4>
                        <p className="text-xs font-bold text-slate-200 truncate">
                          {prop.generatedTitle || prop.researchInterest}
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          {new Date(prop.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDelete(prop.id, e)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        disabled={deletingId === prop.id}
                      >
                        {deletingId === prop.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Panel - Form or Result Display (Col Span 8) */}
      <div className="lg:col-span-8 space-y-6">
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Display details of existing proposal OR builder form */}
        {selectedProposal ? (
          <div className="space-y-6">
            {/* Action header */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-950">
                AI Generation Result
              </span>
              <button
                onClick={() => setSelectedProposal(null)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold"
              >
                Create another <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Generated Proposal Panel */}
            <div className="glass p-8 rounded-2xl border border-border/40 space-y-8">
              {/* Proposal Header */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400">Research Title Proposal:</div>
                <h2 className="text-2xl font-black text-white leading-tight">
                  {selectedProposal.generatedTitle}
                </h2>
                <div className="text-xs font-medium text-slate-400">
                  Field: <span className="text-slate-200 font-semibold">{selectedProposal.fieldOfStudy}</span> | Interest: <span className="text-slate-200 font-semibold">{selectedProposal.researchInterest}</span>
                </div>
              </div>

              {/* AI Metric Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl border ${getScoreColor(selectedProposal.clarityScore || 0)} flex flex-col justify-between h-24`}>
                  <span className="text-xs text-slate-400 font-semibold">Clarity & Focus</span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black">{selectedProposal.clarityScore || 0}</span>
                    <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${getScoreColor(selectedProposal.originalityScore || 0)} flex flex-col justify-between h-24`}>
                  <span className="text-xs text-slate-400 font-semibold">Academic Originality</span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black">{selectedProposal.originalityScore || 0}</span>
                    <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${getScoreColor(selectedProposal.feasibilityScore || 0)} flex flex-col justify-between h-24`}>
                  <span className="text-xs text-slate-400 font-semibold">Feasibility Index</span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black">{selectedProposal.feasibilityScore || 0}</span>
                    <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${getScoreColor(selectedProposal.grammarScore || 0)} flex flex-col justify-between h-24`}>
                  <span className="text-xs text-slate-400 font-semibold">Scientific Grammar</span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black">{selectedProposal.grammarScore || 0}</span>
                    <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* AI Feedback */}
              {selectedProposal.feedbackRemarks && (
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/10 space-y-2">
                  <div className="flex gap-2 items-center text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Antigravity AI Evaluation Review</span>
                  </div>
                  <p className="text-xs text-indigo-200 leading-relaxed italic">
                    "{selectedProposal.feedbackRemarks}"
                  </p>
                </div>
              )}

              {/* Research Proposal Content Sections */}
              <div className="space-y-6 pt-2 border-t border-slate-800">
                {/* 1. Background */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">1. Literature Background & Rationale</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                    {selectedProposal.background}
                  </p>
                </div>

                {/* 2. Objectives */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">2. Research Objectives</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                    {selectedProposal.objectives}
                  </p>
                </div>

                {/* 3. Methodology */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">3. Detailed Methodology</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                    {selectedProposal.detailedMethodology}
                  </p>
                </div>

                {/* 4. Timeline */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">4. Milestones & 2-Year Research Plan</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                    {selectedProposal.timeline}
                  </p>
                </div>

                {/* 5. Expected Results */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">5. Expected Outcomes & Scientific Value</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                    {selectedProposal.expectedResults}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl border border-border/40 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">AI Research Proposal Builder</h2>
              <p className="text-slate-400 text-xs mt-1">
                Enter your research concepts. Antigravity AI will draft a complete, professional proposal aligned with Japanese academic standards.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Field of Study</label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Electrical Engineering"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Research Title / Focus</label>
                  <input
                    type="text"
                    name="researchInterest"
                    value={formData.researchInterest}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Solar Cell Efficiency Optimisation"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Problem Statement (What issues are you trying to resolve?)</label>
                <textarea
                  name="problemStatement"
                  rows={3}
                  value={formData.problemStatement}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Detail the scientific bottlenecks or research gaps..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Proposed Methodology (How will you conduct your research?)</label>
                <textarea
                  name="methodology"
                  rows={3}
                  value={formData.methodology}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Describe your experimental design, algorithm choice, simulation setups..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Expected Outcome (What results do you expect to achieve?)</label>
                <textarea
                  name="expectedOutcome"
                  rows={3}
                  value={formData.expectedOutcome}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Summarize the concrete academic value, patents or breakthroughs..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:text-indigo-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin animate-infinite" />
                    Generating Academic Proposal...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Build Proposal
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
