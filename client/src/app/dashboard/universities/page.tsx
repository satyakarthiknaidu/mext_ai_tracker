'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Search, Building2, MapPin, ExternalLink, Globe, Loader2, Compass } from 'lucide-react';

interface University {
  id: string;
  name: string;
  field: string;
  location: string;
  universityType: string;
  englishProgram: boolean;
  scholarships: string;
  website: string | null;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [field, setField] = useState('');

  async function fetchUniversities() {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (field) queryParams.set('field', field);
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const data = await api.get<University[]>(`/universities${query}`);
      setUniversities(data || []);
    } catch (err: any) {
      console.error('Failed to load universities', err);
      setError('Could not load university registry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchUniversities();
  }, [search, field]);

  return (
    <div className="space-y-8">
      {/* Description header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Japanese University Finder</h2>
        <p className="text-slate-400 text-sm mt-1">
          Explore MEXT-affiliated national, public, and private universities across Japan. Inspect English-medium graduate course offerings.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by name or location (e.g. Kyoto, Tokyo)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Field of study filter */}
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Research Fields</option>
          <option value="Artificial Intelligence">Artificial Intelligence & Robotics</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Materials Science">Materials Science & Physics</option>
          <option value="Bioinformatics">Bioinformatics & Biology</option>
          <option value="Aerospace">Aerospace Engineering</option>
          <option value="Quantum Computing">Quantum Computing</option>
        </select>
      </div>

      {/* Universities list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : universities.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500">
          No universities matched your filters. Try adjusting your search term.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {universities.map((univ) => (
            <div key={univ.id} className="glass p-6 rounded-2xl border border-border/40 hover:border-indigo-500/20 transition-all flex flex-col justify-between gap-6">
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded">
                      {univ.universityType} University
                    </span>
                    <h3 className="font-extrabold text-white text-base leading-snug">
                      {univ.name}
                    </h3>
                  </div>
                  {univ.website && (
                    <a
                      href={univ.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-lg text-indigo-400 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Visit University Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Properties */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Location: <strong className="text-slate-200 font-semibold">{univ.location}, Japan</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">Key Fields: <span className="text-slate-400">{univ.field}</span></span>
                  </div>
                </div>

                {/* Program Tag */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {univ.englishProgram && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded-md font-semibold">
                      English Programs Available
                    </span>
                  )}
                  {univ.scholarships.split(',').map((sch, idx) => (
                    <span key={idx} className="text-[10px] bg-indigo-950/20 text-indigo-400 border border-indigo-950 px-2 py-0.5 rounded-md">
                      {sch.trim()}
                    </span>
                  ))}
                </div>

              </div>

              {/* Footer link */}
              {univ.website && (
                <div className="border-t border-slate-900 pt-4 mt-2">
                  <a
                    href={univ.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    <span>View Courses & Guidelines</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
