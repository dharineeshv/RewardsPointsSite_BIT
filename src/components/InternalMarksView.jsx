import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  User,
  RefreshCw
} from 'lucide-react';
import {
  STUDENTS_INTERNAL_MARKS_LIST,
  BIT_SPREADSHEET_CONFIG,
  parseStudentRows
} from '../data/rp_distribution';

export default function InternalMarksView({ currentUser, isDarkMode }) {
  const [studentsData, setStudentsData] = useState(() => {
    try {
      const cached = localStorage.getItem('bit_live_internal_marks');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.students) && parsed.students.length > 0) {
          return parsed.students;
        }
      }
    } catch {
      // ignore
    }
    return STUDENTS_INTERNAL_MARKS_LIST;
  });

  const [syncStatus, setSyncStatus] = useState('ready'); // 'ready' | 'syncing' | 'live' | 'fallback'
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    try {
      const cached = localStorage.getItem('bit_live_internal_marks');
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed.time ? new Date(parsed.time) : null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dynamic Live Sync function from Google Sheets API
  const fetchLiveGoogleSheetData = useCallback(async (isManual = false) => {
    setSyncStatus('syncing');

    // Retrieve active Google OAuth Bearer token
    let token = null;
    try {
      token =
        currentUser?.accessToken ||
        currentUser?.token ||
        currentUser?.idToken ||
        localStorage.getItem('google_auth_token') ||
        sessionStorage.getItem('google_auth_token');
    } catch {
      // ignore
    }

    // Default fallback token or proxy if student signed in
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const endpoint = BIT_SPREADSHEET_CONFIG.getEndpoint();
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });

      if (res.ok) {
        const json = await res.json();
        const rows = json.values || [];
        if (rows.length > 2) {
          const parsed = parseStudentRows(rows);
          if (parsed.length > 0) {
            setStudentsData(parsed);
            const now = new Date();
            setLastSyncTime(now);
            setSyncStatus('live');
            try {
              localStorage.setItem(
                'bit_live_internal_marks',
                JSON.stringify({ students: parsed, time: now.toISOString() })
              );
            } catch {
              // ignore storage limit
            }
            return;
          }
        }
      }
      // If token expired or not authorized, keep using current / snapshot dataset
      setSyncStatus(lastSyncTime ? 'live' : 'ready');
    } catch (err) {
      console.warn('Live Google Sheet fetch notice:', err);
      setSyncStatus('ready');
    }
  }, [currentUser, lastSyncTime]);

  // Attempt background sync on component mount
  useEffect(() => {
    fetchLiveGoogleSheetData(false);
  }, []);

  // Detect logged-in student roll or default
  const defaultRoll = useMemo(() => {
    const raw = (currentUser?.id || currentUser?.roll_no || '7376232CT109').trim().toUpperCase();
    return raw.includes('@') ? raw.split('@')[0].toUpperCase() : raw;
  }, [currentUser]);

  // Selected student roll
  const [selectedRoll, setSelectedRoll] = useState(defaultRoll);

  // Active student object
  const activeStudent = useMemo(() => {
    return (
      studentsData.find(s => s.rollNo === selectedRoll) ||
      studentsData.find(s => s.rollNo.includes(selectedRoll)) ||
      studentsData.find(s => s.rollNo === defaultRoll) ||
      studentsData[0] || {
        rollNo: '7376232CT109',
        name: 'DHARINEESH V',
        year: 'IV',
        department: 'COMPUTER TECHNOLOGY',
        courseCode: 'B. Tech.',
        theoryCourses: [
          { slot: 'TS1', code: '22CT701', ip1: '14.00', ip2: '', total: '14.00' },
          { slot: 'TS2', code: '22CT702', ip1: '13.00', ip2: '', total: '13.00' },
          { slot: 'TS3', code: '22CT021', ip1: '13.50', ip2: '', total: '13.50' }
        ],
        addonCourses: [],
        labCourses: [],
        totalTheoryCount: 3,
        totalLabCount: 0,
        totalSubjectsCount: 3,
        ip1Total: '40.50',
        ip2Total: '0.00',
        grandTotal: '40.50'
      }
    );
  }, [studentsData, selectedRoll, defaultRoll]);

  // Search filter results (up to 8 matches)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return studentsData.filter(
      s => s.rollNo.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [studentsData, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 font-sans animate-fadeIn px-2 sm:px-4 py-4">
      
      {/* 1. Student Search Bar */}
      <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm relative transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-black text-base sm:text-lg tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  {activeStudent.name || activeStudent.rollNo}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {activeStudent.rollNo}
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {activeStudent.department} • Year {activeStudent.year} • {activeStudent.courseCode}
              </p>
            </div>
          </div>

          {/* Search Box Input with Instant Autocomplete & Live Refresh */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Live Sync Indicator & Manual Refresh Button */}
            <button
              type="button"
              onClick={() => fetchLiveGoogleSheetData(true)}
              disabled={syncStatus === 'syncing'}
              title="Click to refresh latest marks from Google Sheet"
              className={`px-3 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                syncStatus === 'syncing'
                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse'
                  : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-blue-500' : 'text-blue-500'}`} />
              <span className="hidden md:inline">
                {syncStatus === 'syncing' ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search Roll No (eg. CT109, CT120)..."
                className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs font-semibold border outline-none transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                }`}
              />

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && searchResults.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl z-50 overflow-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                {searchResults.map((s) => (
                  <button
                    key={s.rollNo}
                    type="button"
                    onClick={() => {
                      setSelectedRoll(s.rollNo);
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-all cursor-pointer border-b last:border-b-0 ${
                      isDarkMode
                        ? 'border-slate-700/60 hover:bg-slate-700/50 text-slate-200'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className={`font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {s.name}
                      </span>
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {s.department}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[11px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                      {s.rollNo}
                    </span>
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Exact Internal Marks Distribution Table (Matching Provided Sample UI) */}
      <div className={`p-6 sm:p-10 rounded-3xl border shadow-md transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200/90 text-slate-900'
      }`}>
        
        {/* Centered Blue Underlined Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0044ff] dark:text-[#3880ff] tracking-wide uppercase underline decoration-2 underline-offset-8 inline-block font-sans cursor-default">
            INTERNAL MARKS DISTRIBUTION
          </h2>
        </div>

        {/* Clean Table Layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-transparent">
                <th className={`py-3 px-2 sm:px-4 font-extrabold tracking-tight text-right sm:text-center w-1/2 sm:w-auto ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-950'
                }`}>
                  SUBJECTS
                </th>
                <th className={`py-3 px-2 sm:px-4 font-extrabold tracking-tight text-center ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-950'
                }`}>
                  IP - 1
                </th>
                <th className={`py-3 px-2 sm:px-4 font-extrabold tracking-tight text-center ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-950'
                }`}>
                  IP - 2
                </th>
                <th className={`py-3 px-2 sm:px-4 font-extrabold tracking-tight text-center ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-950'
                }`}>
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent font-medium">
              
              {/* SECTION 1: THEORY COURSES */}
              <tr>
                <td className={`pt-6 pb-2 px-2 sm:px-4 font-black uppercase tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  THEORY COURSES - ({activeStudent.totalTheoryCount} COURSES)
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  (15)
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  (15)
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  (30)
                </td>
              </tr>

              {/* Theory Course Rows */}
              {activeStudent.theoryCourses.map((tc, idx) => (
                <tr key={idx} className="transition-colors">
                  <td className="py-1.5 px-2 sm:px-4 font-bold text-[#009ce0] hover:underline cursor-pointer">
                    {tc.code}
                  </td>
                  <td className={`py-1.5 px-2 sm:px-4 text-center font-mono ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    {tc.ip1 || ''}
                  </td>
                  <td className={`py-1.5 px-2 sm:px-4 text-center font-mono ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    {tc.ip2 || ''}
                  </td>
                  <td className={`py-1.5 px-2 sm:px-4 text-center font-mono font-extrabold ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    {tc.total || tc.ip1 || '0.00'}
                  </td>
                </tr>
              ))}

              {/* SECTION 2: ADD-ON / HONOR / MINOR COURSES */}
              <tr>
                <td className={`pt-6 pb-2 px-2 sm:px-4 font-black uppercase tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  ADD-ON / HONOR / MINOR COURSES
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  ()
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  (30)
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  (30)
                </td>
              </tr>

              {/* Add-on Course Rows (if any) */}
              {activeStudent.addonCourses.length > 0 &&
                activeStudent.addonCourses.map((ac, idx) => (
                  <tr key={idx} className="transition-colors">
                    <td className="py-1.5 px-2 sm:px-4 font-bold text-[#009ce0] hover:underline cursor-pointer">
                      {ac.code}
                    </td>
                    <td className={`py-1.5 px-2 sm:px-4 text-center font-mono ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-800'
                    }`}>
                      {ac.ip1 || ''}
                    </td>
                    <td className={`py-1.5 px-2 sm:px-4 text-center font-mono ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-800'
                    }`}>
                      {ac.ip2 || ''}
                    </td>
                    <td className={`py-1.5 px-2 sm:px-4 text-center font-mono font-extrabold ${
                      isDarkMode ? 'text-white' : 'text-slate-950'
                    }`}>
                      {ac.total || ac.ip1 || '0.00'}
                    </td>
                  </tr>
                ))}

              {/* SECTION 3: LAB COURSES */}
              <tr>
                <td className={`pt-6 pb-2 px-2 sm:px-4 font-black uppercase tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  LAB. COURSES - ({activeStudent.totalLabCount} COURSES)
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  (20)
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  (20)
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-extrabold font-mono ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-900'
                }`}>
                  (40)
                </td>
              </tr>

              {/* Lab Course Rows (if any) */}
              {activeStudent.labCourses.length > 0 &&
                activeStudent.labCourses.map((lc, idx) => (
                  <tr key={idx} className="transition-colors">
                    <td className="py-1.5 px-2 sm:px-4 font-bold text-[#009ce0] hover:underline cursor-pointer">
                      {lc.code}
                    </td>
                    <td className={`py-1.5 px-2 sm:px-4 text-center font-mono ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-800'
                    }`}>
                      {lc.ip1 || ''}
                    </td>
                    <td className={`py-1.5 px-2 sm:px-4 text-center font-mono ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-800'
                    }`}>
                      {lc.ip2 || ''}
                    </td>
                    <td className={`py-1.5 px-2 sm:px-4 text-center font-mono font-extrabold ${
                      isDarkMode ? 'text-white' : 'text-slate-950'
                    }`}>
                      {lc.total || lc.ip1 || '0.00'}
                    </td>
                  </tr>
                ))}

              {/* SECTION 4: GRAND TOTALS */}
              <tr className={`border-t-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                <td className={`pt-6 pb-2 px-2 sm:px-4 font-black uppercase tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  TOTAL - ({activeStudent.totalSubjectsCount} SUBJECTS)
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-mono font-black ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  {activeStudent.ip1Total || '0.00'}
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-mono font-black ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  {activeStudent.ip2Total || '0.00'}
                </td>
                <td className={`pt-6 pb-2 px-2 sm:px-4 text-center font-mono font-black ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  {activeStudent.grandTotal || activeStudent.ip1Total || '0.00'}
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
