'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { api } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { Mail, Sparkles, Copy, Check, Loader2 } from 'lucide-react';

function EmailGeneratorForm() {
  const searchParams = useSearchParams();

  // Form states
  const [formData, setFormData] = useState({
    category: 'Supervisor Inquiry',
    professorName: '',
    university: '',
    researchInterest: '',
    studentName: 'Satyakarthik Naidu',
    background: 'Computer Science Graduate',
  });

  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [error, setError] = useState('');

  // Load query params if redirected from matching page
  useEffect(() => {
    const profName = searchParams.get('profName');
    const univ = searchParams.get('univ');
    const interest = searchParams.get('interest');

    setFormData((prev) => ({
      ...prev,
      professorName: profName || prev.professorName,
      university: univ || prev.university,
      researchInterest: interest || prev.researchInterest,
    }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGenerating(true);
    setCopied(false);

    try {
      const data = await api.post<{ emailBody: string }>('/emails/generate', formData);
      setEmailContent(data.emailBody || '');
    } catch (err: any) {
      console.error('Email generation failed', err);
      setError('Failed to generate email content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!emailContent) return;
    void navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Configuration Form - Column 5 */}
      <div className="lg:col-span-5 space-y-6">
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl border border-border/40 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-350">Email Template Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="Supervisor Inquiry">Supervisor Inquiry (First Contact)</option>
              <option value="Letter of Recommendation Request">Letter of Recommendation Request</option>
              <option value="Follow-up Inquiry">Follow-up Email</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-350">Professor Name</label>
            <input
              type="text"
              name="professorName"
              value={formData.professorName}
              onChange={handleChange}
              placeholder="e.g. Prof. Tanaka"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-350">Target University</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="e.g. The University of Tokyo"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-350">Research area / Lab focus</label>
            <input
              type="text"
              name="researchInterest"
              value={formData.researchInterest}
              onChange={handleChange}
              placeholder="e.g. Autonomous Robotic Control Systems"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-350">Student Full Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-350">Your Academic Degree / Background</label>
            <input
              type="text"
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="e.g. Computer Science Graduate, IIT"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:text-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs uppercase tracking-wider h-[40px]"
          >
            {generating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating Email...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Create Email Copy
              </>
            )}
          </button>
        </form>
      </div>

      {/* Draft Result - Column 7 */}
      <div className="lg:col-span-7 space-y-6">
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="glass p-6 rounded-2xl border border-border/40 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center pb-3 border-b border-slate-900">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                Generated Draft
              </h4>
              {emailContent && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:text-white px-2.5 py-1.5 rounded-lg text-slate-400 text-xs transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {emailContent ? (
              <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950/50 p-6 rounded-xl border border-slate-900 overflow-y-auto max-h-[500px]">
                {emailContent}
              </pre>
            ) : (
              <div className="flex flex-col justify-center items-center text-center text-slate-500 h-80 gap-3 border border-dashed border-slate-800 rounded-xl p-8">
                <Mail className="w-8 h-8 text-slate-600" />
                <span>Configure supervisor details on the left, then click Generate to draft your formal correspondence.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailsPage() {
  return (
    <div className="space-y-8">
      {/* Description header */}
      <div>
        <h2 className="text-2xl font-bold text-white">AI Email Correspondent</h2>
        <p className="text-slate-400 text-sm mt-1">
          Draft highly formal inquiries for research supervisor consent, recommendation requests, or follow-ups matching Japanese academic standards.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      }>
        <EmailGeneratorForm />
      </Suspense>
    </div>
  );
}
