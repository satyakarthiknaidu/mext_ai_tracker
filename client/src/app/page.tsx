'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, FolderGit, FileCheck, Users, Mail, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19] text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full py-6 px-6 lg:px-16 flex items-center justify-between border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-bold tracking-tight text-gradient">MEXT Navigator AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your complete MEXT scholarship navigator</span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Master Your MEXT Application <br />
          <span className="text-gradient">with AI Guidance</span>
        </h1>

        <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
          From proposal drafting and document management to finding the right professors and deadline tracking. Experience a centralized platform designed to maximize your scholarship acceptance rate.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center w-full max-w-md">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] cursor-pointer"
          >
            Start Applying Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 font-semibold py-4 px-8 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="glass p-6 rounded-2xl border border-border/40 text-left hover:scale-[1.01] transition-all">
            <div className="p-3 bg-indigo-600/10 rounded-xl w-fit mb-4">
              <FolderGit className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Proposal Assistant</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Generate structured research proposals in English and Japanese. Get analytical feedback scores on clarity and feasibility.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-border/40 text-left hover:scale-[1.01] transition-all">
            <div className="p-3 bg-indigo-600/10 rounded-xl w-fit mb-4">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Professor Matcher</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Analyze your research interests against Japanese labs and universities. Generate direct contact emails to professors.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-border/40 text-left hover:scale-[1.01] transition-all">
            <div className="p-3 bg-indigo-600/10 rounded-xl w-fit mb-4">
              <FileCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">SOP & Resume Audit</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Scan your Statement of Purpose (SOP) and resume. Receive improvement recommendations, missing skills, and tone optimization.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-muted-foreground border-t border-border/30 bg-background/80 mt-auto">
        <p>&copy; {new Date().getFullYear()} MEXT Navigator AI. Designed for ambitious students globally.</p>
      </footer>
    </div>
  );
}
