'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  LayoutDashboard,
  FolderLock,
  BookOpen,
  UserCheck,
  SearchCode,
  Calendar,
  FileSearch2,
  MailQuestion,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Document Manager', href: '/dashboard/documents', icon: FolderLock },
    { name: 'Proposal Builder', href: '/dashboard/proposals', icon: BookOpen },
    { name: 'Professor Matching', href: '/dashboard/matching', icon: UserCheck },
    { name: 'University Finder', href: '/dashboard/universities', icon: SearchCode },
    { name: 'Deadline Tracker', href: '/dashboard/deadlines', icon: Calendar },
    { name: 'SOP & Resume Analyzer', href: '/dashboard/sop-resume', icon: FileSearch2 },
    { name: 'AI Email Generator', href: '/dashboard/emails', icon: MailQuestion },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-slate-950/80 backdrop-blur-md hidden md:flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-border/40 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <span className="text-lg font-bold tracking-tight text-gradient">MEXT Navigator</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/40">
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
          <h1 className="font-semibold text-lg text-slate-200">
            {navItems.find((item) => item.href === pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-border/40">
              <UserIcon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">{user.name}</span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded uppercase font-bold">
                {user.role}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
