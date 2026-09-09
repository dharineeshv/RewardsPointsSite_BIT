import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Download,
  RefreshCw,
  Calendar,
  Sparkles,
  Filter,
  Search,
  Eye,
  ChevronRight,
  ShieldCheck,
  Layers,
  FileCheck
} from 'lucide-react';

export default function CampusMediaView({ isDarkMode }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pdf' | 'image'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try local/serverless endpoint first
      let res = await fetch('/api/bit-media?per_page=20');
      let data = null;
      if (res.ok) {
        const json = await res.json();
        data = json.data || json;
      } else {
        // Direct fallback
        const fallbackRes = await fetch('https://bitsathy.ac.in/wp-json/wp/v2/media?per_page=20');
        if (fallbackRes.ok) {
          data = await fallbackRes.json();
        }
      }

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        throw new Error('Invalid media list received');
      }
    } catch (err) {
      console.error('Error fetching BIT media:', err);
      setError('Unable to load latest campus media feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Format clean date
  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return isoStr;
    }
  };

  // Clean HTML title entities
  const cleanTitle = (rawTitle) => {
    if (!rawTitle) return 'Campus Document / Media';
    return rawTitle
      .replace(/&#038;/g, '&')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, '-')
      .replace(/<[^>]+>/g, '');
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const isPdf = item.mime_type?.includes('pdf') || item.source_url?.endsWith('.pdf');
      const isImg = item.mime_type?.includes('image') || item.media_type === 'image';
      
      if (activeTab === 'pdf' && !isPdf) return false;
      if (activeTab === 'image' && !isImg) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (item.title?.rendered || '').toLowerCase();
        const slug = (item.slug || '').toLowerCase();
        return title.includes(q) || slug.includes(q);
      }
      return true;
    });
  }, [items, activeTab, searchQuery]);

  const pdfCount = useMemo(() => items.filter(i => i.mime_type?.includes('pdf') || i.source_url?.endsWith('.pdf')).length, [items]);
  const imgCount = useMemo(() => items.filter(i => i.mime_type?.includes('image') || i.media_type === 'image').length, [items]);

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 font-sans animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
              isDarkMode ? 'bg-indigo-950/70 text-indigo-400 border border-indigo-800/40' : 'bg-indigo-600 text-white shadow-indigo-500/25'
            }`}>
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  BIT Campus Circulars & Media
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  <span>Live bitsathy.ac.in Feed</span>
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Official college circulars, syllabus regulations, notifications, and event releases in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMedia}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Fetching...' : 'Refresh Feed'}</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800/80 text-slate-400 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Releases ({items.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pdf'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800/80 text-slate-400 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>PDFs & Circulars ({pdfCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'image'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800/80 text-slate-400 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>Posters & Photos ({imgCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars or titles..."
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs font-medium border outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500'
              }`}
            />
          </div>

        </div>
      </div>

      {/* 2. Media Grid Display */}
      {loading && items.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Connecting to bitsathy.ac.in media stream...
          </p>
        </div>
      ) : error ? (
        <div className={`p-8 rounded-3xl border text-center space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <p className="text-sm text-rose-500 font-bold">{error}</p>
          <button
            onClick={fetchMedia}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={`p-12 rounded-3xl border text-center space-y-2 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <p className="text-sm font-bold">No circulars or documents found matching your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isPdf = item.mime_type?.includes('pdf') || item.source_url?.endsWith('.pdf');
            const title = cleanTitle(item.title?.rendered);
            const dateStr = formatDate(item.date);
            const fileUrl = item.source_url;

            return (
              <div
                key={item.id}
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' 
                    : 'bg-white border-slate-200/90 hover:border-indigo-500/40 shadow-xs'
                }`}
              >
                {/* Visual Header / Thumbnail */}
                <div className={`relative h-44 w-full flex items-center justify-center overflow-hidden ${
                  isDarkMode ? 'bg-slate-950/60' : 'bg-slate-100'
                }`}>
                  {isPdf ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-xs">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-black tracking-wider uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        Official PDF Document
                      </span>
                    </div>
                  ) : (
                    <img
                      src={item.media_details?.sizes?.medium?.source_url || fileUrl}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}

                  {/* Date badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className={`text-sm font-bold line-clamp-2 leading-snug group-hover:text-indigo-500 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {title}
                    </h3>
                    <p className={`text-[11px] font-mono break-all line-clamp-1 ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {item.slug || 'circular-document'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDarkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Preview</span>
                    </button>

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      {isPdf ? (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Open PDF</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Full</span>
                        </>
                      )}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-4xl max-h-[90vh] rounded-3xl p-6 shadow-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5 max-w-[80%]">
                <h3 className="font-extrabold text-base truncate">
                  {cleanTitle(selectedItem.title?.rendered)}
                </h3>
                <p className="text-xs text-slate-400">
                  Published: {formatDate(selectedItem.date)} • {selectedItem.mime_type}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
              {selectedItem.mime_type?.includes('pdf') || selectedItem.source_url?.endsWith('.pdf') ? (
                <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                  <FileText className="w-16 h-16 text-rose-500 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-base">{cleanTitle(selectedItem.title?.rendered)}</h4>
                    <p className="text-xs text-slate-400 mt-1">Official BIT PDF Document</p>
                  </div>
                  <a
                    href={selectedItem.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download / View Official PDF</span>
                  </a>
                </div>
              ) : (
                <img
                  src={selectedItem.source_url}
                  alt={cleanTitle(selectedItem.title?.rendered)}
                  className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-md"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[50%]">
                Source: {selectedItem.source_url}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={selectedItem.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in New Tab</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
