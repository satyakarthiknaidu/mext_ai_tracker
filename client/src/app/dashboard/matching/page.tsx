'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { UserCheck, Sparkles, Mail, Building, MapPin, Loader2, Award, Edit, CheckCircle } from 'lucide-react';

interface Professor {
  id: string;
  name: string;
  university: string;
  researchArea: string;
  keywords: string;
  labUrl: string | null;
  email: string | null;
}

interface ProfessorMatch {
  id: string;
  professorId: string;
  professor: Professor;
  matchScore: number;
  status: 'PENDING' | 'CONTACTED' | 'ACCEPTED' | 'REJECTED';
  notes: string | null;
}

export default function MatchingPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<ProfessorMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [researchInterest, setResearchInterest] = useState('Reinforcement Learning and Robot Path Optimization');

  // Status updates
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchMatches() {
    try {
      const data = await api.get<ProfessorMatch[]>('/matching');
      setMatches(data || []);
    } catch (err: any) {
      console.error('Failed to load matches', err);
      setError('Could not retrieve professor matches.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchMatches();
  }, []);

  const handleRunMatching = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setRunning(true);

    try {
      const result = await api.post<ProfessorMatch[]>('/matching/run', { researchInterest });
      setMatches(result || []);
      setSuccess('AI Matchmaking alignment complete!');
    } catch (err: any) {
      console.error('Matching run failed', err);
      setError('Failed to run AI Matchmaking.');
    } finally {
      setRunning(false);
    }
  };

  const handleStatusChange = async (matchId: string, newStatus: string) => {
    setUpdatingId(matchId);
    setError('');
    setSuccess('');
    try {
      const updated = await api.patch<ProfessorMatch>(`/matching/${matchId}`, { status: newStatus });
      setMatches(matches.map((m) => (m.id === matchId ? updated : m)));
      setSuccess(`Status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Status update failed', err);
      setError('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 75) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-emerald-400 bg-emerald-950 border-emerald-800';
      case 'CONTACTED':
        return 'text-indigo-400 bg-indigo-950 border-indigo-800';
      case 'REJECTED':
        return 'text-red-400 bg-red-950 border-red-800';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  const handleDraftEmail = (match: ProfessorMatch) => {
    const profName = encodeURIComponent(match.professor.name);
    const univ = encodeURIComponent(match.professor.university);
    const interest = encodeURIComponent(match.professor.researchArea);
    router.push(`/dashboard/emails?profName=${profName}&univ=${univ}&interest=${interest}`);
  };

  return (
    <div className="space-y-8">
      {/* Description header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Professor Matchmaking Portal</h2>
        <p className="text-slate-400 text-sm mt-1">
          Evaluate your research statement against active laboratory paradigms in Japan. Identify advisors and track contact progression.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Matchmaking trigger input */}
      <div className="glass p-6 rounded-2xl border border-border/40">
        <form onSubmit={handleRunMatching} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-semibold text-slate-300">Your Research Focus (or Statement of Purpose Topic)</label>
            <input
              type="text"
              value={researchInterest}
              onChange={(e) => setResearchInterest(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Adaptive Robotics & AI consensus algorithms"
              required
            />
          </div>
          <button
            type="submit"
            disabled={running}
            className="w-full md:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:text-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-wider h-[40px]"
          >
            {running ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Matching...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Find matching labs
              </>
            )}
          </button>
        </form>
      </div>

      {/* Matches Listing */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500">
          No matches found yet. Type in your research focus above and run matching!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="glass p-6 rounded-2xl border border-border/40 hover:border-indigo-500/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              {/* Professor Info */}
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-extrabold text-white text-base truncate">
                    {match.professor.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getScoreColor(match.matchScore)}`}>
                    {match.matchScore}% AI Match
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Building className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{match.professor.university}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Focus: <strong className="text-slate-300 font-semibold">{match.professor.researchArea}</strong></span>
                  </div>
                </div>

                {/* Keywords overlap */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {match.professor.keywords.split(',').map((kw, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800/80">
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                {/* Select status dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">Contact Status</label>
                  <select
                    value={match.status}
                    onChange={(e) => handleStatusChange(match.id, e.target.value)}
                    disabled={updatingId === match.id}
                    className={`bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-semibold ${getStatusColor(match.status)}`}
                  >
                    <option value="PENDING">Pending Approval</option>
                    <option value="CONTACTED">Inquired (Email Sent)</option>
                    <option value="ACCEPTED">Unofficial Consent</option>
                    <option value="REJECTED">Declined</option>
                  </select>
                </div>

                {/* Draft Email button */}
                <div className="space-y-1 flex items-end">
                  <button
                    onClick={() => handleDraftEmail(match)}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer h-[32px] md:mt-4"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Draft Email
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
