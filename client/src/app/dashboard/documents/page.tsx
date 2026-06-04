'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  UploadCloud,
  File,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
  FileWarning,
} from 'lucide-react';

const REQUIRED_DOCS = [
  { type: 'PASSPORT', label: 'Passport Identity Page' },
  { type: 'TRANSCRIPT', label: 'Academic Transcript' },
  { type: 'DEGREE', label: 'Graduation Degree / Certificate' },
  { type: 'RECOMMENDATION_LETTER', label: 'Recommendation Letter' },
  { type: 'MEDICAL_FORM', label: 'MEXT Medical Certificate' },
  { type: 'RESEARCH_PROPOSAL', label: 'Research Proposal Draft' },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await api.get('/documents');
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents', err);
      setError('Could not retrieve uploaded documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleUpload(file, type);
    }
  };

  const handleUpload = async (file: File, type: string) => {
    setError('');
    setUploadingType(type);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      await api.post('/documents/upload', formData);
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploadingType(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
    }
  };

  const getUploadedDoc = (type: string) => {
    return documents.find((doc) => doc.type === type);
  };

  return (
    <div className="space-y-8">
      {/* Description header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Application Document Manager</h2>
        <p className="text-slate-400 text-sm mt-1">
          Upload the six mandatory files required for the MEXT scholarship application. Files are verified locally.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-sm rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REQUIRED_DOCS.map((docType) => {
            const uploaded = getUploadedDoc(docType.type);
            const isUploading = uploadingType === docType.type;

            return (
              <div
                key={docType.type}
                className={`glass p-6 rounded-2xl border transition-all ${
                  uploaded
                    ? 'border-indigo-500/20'
                    : 'border-dashed border-slate-700 hover:border-slate-600'
                }`}
              >
                {uploaded ? (
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-400">
                        <File className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                          {docType.label}
                        </span>
                        <h4 className="text-sm font-bold text-white max-w-[200px] truncate">
                          {uploaded.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          {uploaded.status === 'PENDING' ? (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Uploaded (Pending Review)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Approved</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`http://localhost:3001${uploaded.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(uploaded.id)}
                        className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                    <div className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-500">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{docType.label}</h4>
                      <p className="text-xs text-slate-500 mt-1">PDF, DOCX, or Image (max 10MB)</p>
                    </div>
                    <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Upload File
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, docType.type)}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
