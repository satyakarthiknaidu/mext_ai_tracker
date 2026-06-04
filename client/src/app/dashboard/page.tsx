'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Calendar, FileCheck, CheckCircle2, ShieldAlert, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    profileCompletion: 75,
    applicationStatus: 'Embassy Screening In Progress',
    documentsCount: '4/6',
    proposalScore: 85,
    upcomingDeadline: 'June 20, 2026',
    unreadNotifications: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.get('/dashboard/summary');
        setStats(data);
      } catch (err) {
        console.warn('Failed to load dashboard summary, using fallback stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 to-slate-900/60 p-8 glass">
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI recommendation active</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Your MEXT Application Portal</h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Upload your credentials, review your research proposal draft, and check for matching Japanese universities. Antigravity AI mentor has analyzed your statement of purpose.
          </p>
        </div>
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Completion */}
        <div className="glass p-6 rounded-2xl border border-border/40 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm font-semibold">Profile Completion</span>
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>{stats.profileCompletion}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.profileCompletion}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Complete missing documents to reach 100%.</p>
        </div>

        {/* Documents */}
        <div className="glass p-6 rounded-2xl border border-border/40 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm font-semibold">Documents Status</span>
            <FileCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white">{stats.documentsCount}</div>
            <div className="text-xs font-medium text-slate-400">Completed Uploads</div>
          </div>
          <Link href="/dashboard/documents" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold block">
            Manage Documents &rarr;
          </Link>
        </div>

        {/* Proposal Score */}
        <div className="glass p-6 rounded-2xl border border-border/40 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm font-semibold">Proposal Score</span>
            <Trophy className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white">{stats.proposalScore}/100</div>
            <div className="text-xs font-medium text-slate-400">AI Evaluation Index</div>
          </div>
          <Link href="/dashboard/proposals" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold block">
            Optimize Proposal &rarr;
          </Link>
        </div>

        {/* Deadline Tracker */}
        <div className="glass p-6 rounded-2xl border border-border/40 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm font-semibold">Next Deadline</span>
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-white leading-tight truncate">{stats.upcomingDeadline}</div>
            <div className="text-xs font-medium text-slate-400">Embassy Application Form</div>
          </div>
          <Link href="/dashboard/deadlines" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold block">
            View Timeline Calendar &rarr;
          </Link>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Stage */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-border/40 space-y-6">
          <h3 className="font-extrabold text-lg text-slate-200">Application Progress Timeline</h3>
          <div className="relative pl-6 border-l border-indigo-900/60 space-y-8">
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-400">Stage 1: Document Upload (Completed)</span>
                <p className="text-sm text-slate-200 font-bold">Uploaded Degree, Transcript, Passport</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-400">Stage 2: Research Proposal (Completed)</span>
                <p className="text-sm text-slate-200 font-bold">Generated AI Proposal: "Adaptive Robotics in Space Exploration"</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900 animate-pulse" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-300">Stage 3: Professor Screening (In Progress)</span>
                <p className="text-sm text-slate-200 font-bold">Finding matching advisors at Tokyo University and Kyoto University</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Sidebar */}
        <div className="glass p-6 rounded-2xl border border-border/40 space-y-6">
          <h3 className="font-extrabold text-lg text-slate-200">AI Application Tasks</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex gap-2 items-start">
                <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-xs font-bold text-amber-200">2 Documents Missing</span>
              </div>
              <p className="text-[11px] text-slate-400">
                You need to upload your recommendation letter and medical check form before June 20.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex gap-2 items-start">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-xs font-bold text-slate-200">Recommendation Letter Template</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Generate a professional email asking your professors for a recommendation letter using the Email Generator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
