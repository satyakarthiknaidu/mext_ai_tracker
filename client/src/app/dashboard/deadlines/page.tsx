'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Calendar, Trash2, Plus, CheckCircle, Clock, Loader2, Sparkles } from 'lucide-react';

interface Deadline {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  completed: boolean;
}

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  async function fetchDeadlines() {
    try {
      const data = await api.get<Deadline[]>('/deadlines');
      setDeadlines(data || []);
    } catch (err: any) {
      console.error('Failed to load deadlines', err);
      setError('Could not fetch deadline schedule.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchDeadlines();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const newDeadline = await api.post<Deadline>('/deadlines', { title, description, dueDate });
      setDeadlines([...deadlines, newDeadline].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      setSuccess('Deadline added successfully.');
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err: any) {
      console.error('Failed to create deadline', err);
      setError('Failed to create deadline.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCompleted = async (id: string, currentCompleted: boolean) => {
    setError('');
    setSuccess('');
    try {
      const updated = await api.patch<Deadline>(`/deadlines/${id}`, { completed: !currentCompleted });
      setDeadlines(deadlines.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      console.error('Failed to toggle completion', err);
      setError('Could not update deadline status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deadline?')) return;
    setDeletingId(id);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/deadlines/${id}`);
      setDeadlines(deadlines.filter((d) => d.id !== id));
      setSuccess('Deadline deleted.');
    } catch (err) {
      console.error('Failed to delete deadline', err);
      setError('Could not remove deadline.');
    } finally {
      setDeletingId(null);
    }
  };

  const getDaysRemaining = (dateString: string) => {
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyClasses = (dateString: string, completed: boolean) => {
    if (completed) return 'border-emerald-500/20 bg-emerald-950/5 text-slate-400';
    const days = getDaysRemaining(dateString);
    if (days < 0) return 'border-red-500/20 bg-red-950/5 text-red-300';
    if (days <= 7) return 'border-amber-500/20 bg-amber-950/5 text-amber-300 animate-pulse';
    return 'border-indigo-500/20 bg-slate-900/40 text-slate-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Area - Column 5 */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass p-6 rounded-2xl border border-border/40 space-y-4">
          <div>
            <h3 className="font-extrabold text-white text-base">Track Application Step</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Add MEXT milestone tasks, medical exams, or university submission timelines.</p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Milestone Task Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mail Recommendation Letters"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Additional Instructions</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Ask Prof. Tanaka for two sealed envelopes"
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:text-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add Milestone
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* List Area - Column 7 */}
      <div className="lg:col-span-7 space-y-6">
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : deadlines.length === 0 ? (
          <div className="glass p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500">
            No deadlines tracked. Use the form to plan your application milestones!
          </div>
        ) : (
          <div className="space-y-4">
            {deadlines.map((dl) => {
              const daysLeft = getDaysRemaining(dl.dueDate);
              const urgencyClasses = getUrgencyClasses(dl.dueDate, dl.completed);

              return (
                <div
                  key={dl.id}
                  className={`glass p-5 rounded-2xl border transition-all flex justify-between items-start gap-4 ${urgencyClasses}`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Completion checkbox button */}
                    <button
                      onClick={() => handleToggleCompleted(dl.id, dl.completed)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                        dl.completed
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-700 bg-slate-950 hover:border-slate-500 text-transparent'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <div className="space-y-1 min-w-0">
                      <h4 className={`text-sm font-bold leading-snug truncate ${dl.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {dl.title}
                      </h4>
                      {dl.description && (
                        <p className={`text-xs ${dl.completed ? 'text-slate-600 line-through' : 'text-slate-400'}`}>
                          {dl.description}
                        </p>
                      )}
                      
                      {/* Sub-label indicators */}
                      <div className="flex flex-wrap gap-2.5 items-center text-[10px] text-slate-500 font-semibold pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Due: {new Date(dl.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                        
                        {!dl.completed && (
                          <span className="flex items-center gap-1 font-bold">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {daysLeft < 0 ? (
                              <span className="text-red-400">Overdue ({Math.abs(daysLeft)} days ago)</span>
                            ) : daysLeft === 0 ? (
                              <span className="text-amber-400">Due Today!</span>
                            ) : (
                              <span className="text-indigo-400">{daysLeft} days remaining</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(dl.id)}
                    className="p-1.5 bg-slate-950 border border-slate-900 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer shrink-0"
                    disabled={deletingId === dl.id}
                  >
                    {deletingId === dl.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
