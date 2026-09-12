import React, { useState, useMemo, useRef } from 'react';
import { 
  Users, Search, Mail, Copy, Check, Filter, 
  GraduationCap, Sparkles, Building, ChevronLeft, ChevronRight, UserCheck, RefreshCw,
  ExternalLink
} from 'lucide-react';
import studentMentorData from '../data/studentMentorMapping.json';

export const ALL_DEPARTMENTS = [
  { code: 'ALL', label: 'All Departments' },
  { code: 'CT', label: 'Computer Technology' },
  { code: 'CSE', label: 'Computer Science & Engineering' },
  { code: 'ECE', label: 'Electronics & Communication' },
  { code: 'IT', label: 'Information Technology' },
  { code: 'AI&DS', label: 'AI & Data Science' },
  { code: 'AIML', label: 'AI & Machine Learning' },
  { code: 'BT', label: 'Biotechnology' },
  { code: 'EEE', label: 'Electrical & Electronics' },
  { code: 'MECH', label: 'Mechanical Engineering' },
  { code: 'MTRS', label: 'Mechatronics' },
  { code: 'EIE', label: 'Instrumentation' },
  { code: 'CSBS', label: 'CS & Business Systems' },
  { code: 'AGRI', label: 'Agriculture' },
  { code: 'ISE', label: 'Information Science' },
  { code: 'CSD', label: 'CS & Design' },
  { code: 'FT', label: 'Fashion Technology' },
  { code: 'CIVIL', label: 'Civil Engineering' },
  { code: 'BM', label: 'Biomedical Engineering' }
];

export default function StudentMentorMappingView({ currentUser, isDarkMode = true }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedRoll, setCopiedRoll] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const chipsScrollRef = useRef(null);
  const pageSize = 30;

  const scrollChips = (direction) => {
    if (chipsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      chipsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Compute student count per department
  const deptCounts = useMemo(() => {
    const counts = { ALL: studentMentorData.length };
    studentMentorData.forEach(item => {
      const code = item.deptCode || 'OTHER';
      counts[code] = (counts[code] || 0) + 1;
    });
    return counts;
  }, []);

  // Current logged in user's mentor mapping
  const userRoll = (currentUser?.id || currentUser?.roll_no || currentUser?.rollNo || '').toUpperCase().trim();
  const myMentorRecord = useMemo(() => {
    if (!userRoll) return null;
    return studentMentorData.find(item => item.rollNo === userRoll) || null;
  }, [userRoll]);

  // Filtered student-mentor list
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return studentMentorData.filter(item => {
      // Exact Dept filter by deptCode
      if (selectedDept !== 'ALL') {
        if (item.deptCode !== selectedDept) {
          return false;
        }
      }

      // Search query filter
      if (!q) return true;
      const rollMatch = item.rollNo.toLowerCase().includes(q);
      const studentMatch = item.studentName.toLowerCase().includes(q);
      const mentorMatch = item.mentorName.toLowerCase().includes(q);
      const emailMatch = (item.mentorEmail || '').toLowerCase().includes(q);
      const deptMatch = (item.department || '').toLowerCase().includes(q) || (item.deptCode || '').toLowerCase().includes(q);
      return rollMatch || studentMatch || mentorMatch || emailMatch || deptMatch;
    });
  }, [searchQuery, selectedDept]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Reset page on search or filter change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDeptChange = (deptCode) => {
    setSelectedDept(deptCode);
    setCurrentPage(1);
  };

  const handleCopy = (text, type, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'roll') {
      setCopiedRoll(id);
      setTimeout(() => setCopiedRoll(null), 2000);
    } else {
      setCopiedEmail(id);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-16 px-1 sm:px-0">
      {/* Top Banner */}
      <div className={`p-4 sm:p-7 rounded-3xl border relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-slate-800 text-white shadow-xl' 
          : 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border-indigo-100 text-slate-900 shadow-sm'
      }`}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 dark:text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Academic Allocation</span>
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              Student-to-Mentor Registry
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            Student & Faculty Mentor Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every enrolled student is officially mapped with their designated faculty mentor and institutional email.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-4 sm:mt-5 max-w-xl">
            <div className={`p-2.5 sm:p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200'
            }`}>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Total Mappings</span>
              <span className="text-base sm:text-xl font-black text-indigo-500 dark:text-indigo-400">
                {studentMentorData.length.toLocaleString()} Students
              </span>
            </div>
            <div className={`p-2.5 sm:p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200'
            }`}>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Filtered Results</span>
              <span className="text-base sm:text-xl font-black text-emerald-500 dark:text-emerald-400">
                {filteredList.length.toLocaleString()}
              </span>
            </div>
            <div className={`col-span-2 sm:col-span-1 p-2.5 sm:p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200'
            }`}>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Departments</span>
              <span className="text-base sm:text-xl font-black text-purple-500 dark:text-purple-400">
                {ALL_DEPARTMENTS.length - 1} Branches
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Logged-In Student's Assigned Mentor Highlight */}
      {myMentorRecord && (
        <div className={`p-4 sm:p-6 rounded-3xl border relative overflow-hidden transition-all border-l-4 border-l-emerald-500 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/25 flex-shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    Your Assigned Mentor
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                    {myMentorRecord.rollNo} • {myMentorRecord.deptCode}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black mt-1 text-slate-900 dark:text-white truncate">
                  {myMentorRecord.mentorName}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Designated advisor for <strong className="text-slate-700 dark:text-slate-200">{myMentorRecord.studentName}</strong>
                </p>
              </div>
            </div>

            {/* Email Actions */}
            {myMentorRecord.mentorEmail && (
              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                <a
                  href={`mailto:${myMentorRecord.mentorEmail}`}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(myMentorRecord.mentorEmail, 'email', 'my-mentor')}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    copiedEmail === 'my-mentor'
                      ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                      : isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Copy email"
                >
                  {copiedEmail === 'my-mentor' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search & All 18 Department Filter Chips */}
      <div className={`p-3.5 sm:p-5 rounded-3xl border transition-all ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Roll No, Name, Mentor..."
              className={`w-full pl-10 pr-14 py-2.5 rounded-2xl border text-xs sm:text-sm transition-all outline-none ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 hover:text-slate-200 cursor-pointer px-1.5 py-0.5 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department Select Dropdown */}
          <div className="w-full sm:w-72 flex-shrink-0">
            <select
              value={selectedDept}
              onChange={(e) => handleDeptChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600'
              }`}
            >
              {ALL_DEPARTMENTS.map(d => {
                const cnt = deptCounts[d.code] || 0;
                return (
                  <option key={d.code} value={d.code}>
                    {d.code === 'ALL' ? `All Departments (${cnt})` : `${d.code} - ${d.label} (${cnt})`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Complete Department Quick Filter Chips */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Department Quick Filters:
            </span>
            {selectedDept !== 'ALL' && (
              <button
                type="button"
                onClick={() => handleDeptChange('ALL')}
                className="text-[10px] font-bold text-indigo-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="relative flex items-center gap-1.5">
            {/* Left Scroll Arrow Button */}
            <button
              type="button"
              onClick={() => scrollChips('left')}
              className={`p-2 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isDarkMode 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500' 
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
              }`}
              title="Scroll left"
              aria-label="Scroll departments left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Scrollable Chips Container */}
            <div 
              ref={chipsScrollRef}
              className="flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth flex-1 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {ALL_DEPARTMENTS.map(dept => {
                const count = deptCounts[dept.code] || 0;
                if (dept.code !== 'ALL' && count === 0) return null;
                const isSelected = selectedDept === dept.code;
                return (
                  <button
                    key={dept.code}
                    type="button"
                    onClick={() => handleDeptChange(dept.code)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : isDarkMode
                          ? 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                    title={dept.label}
                  >
                    <span>{dept.code}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      isSelected 
                        ? 'bg-white/25 text-white font-black' 
                        : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow Button */}
            <button
              type="button"
              onClick={() => scrollChips('right')}
              className={`p-2 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isDarkMode 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500' 
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
              }`}
              title="Scroll right"
              aria-label="Scroll departments right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. MOBILE RESPONSIVE CARD VIEW (Visible on mobile screens < md) */}
      <div className="block md:hidden space-y-3">
        {paginatedList.length === 0 ? (
          <div className={`p-8 text-center rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50 text-indigo-400" />
            <p className="font-bold text-sm">No mappings found</p>
            <p className="text-xs text-slate-500 mt-1">Try another roll number or department filter.</p>
            <button
              type="button"
              onClick={() => { setSelectedDept('ALL'); setSearchQuery(''); }}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          paginatedList.map((item) => (
            <div 
              key={item.rollNo}
              className={`p-4 rounded-2xl border transition-all ${
                item.rollNo === userRoll
                  ? isDarkMode ? 'bg-emerald-950/30 border-emerald-500/40 shadow-md shadow-emerald-500/10' : 'bg-emerald-50/80 border-emerald-300'
                  : isDarkMode ? 'bg-slate-900/90 border-slate-800/90' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Card Top: Roll & Dept & Year Badges */}
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-lg border ${
                    item.rollNo === userRoll
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : isDarkMode ? 'bg-slate-800 text-indigo-300 border-slate-700' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {item.rollNo}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.rollNo, 'roll', item.rollNo)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="Copy Roll"
                  >
                    {copiedRoll === item.rollNo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                    {item.deptCode}
                  </span>
                  {item.year && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                      Yr {item.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Student Name */}
              <h4 className={`font-black text-sm mb-1 leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {item.studentName}
              </h4>
              <p className="text-[11px] text-slate-400 mb-2.5 truncate">
                {item.department}
              </p>

              {/* Mentor Block */}
              <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Mentor</span>
                  <span className={`text-xs font-black truncate ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {item.mentorName}
                  </span>
                </div>

                {item.mentorEmail && (
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/50">
                    <a
                      href={`mailto:${item.mentorEmail}`}
                      className={`font-mono text-[11px] flex items-center gap-1 truncate hover:underline ${
                        isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                      }`}
                    >
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.mentorEmail}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.mentorEmail, 'email', item.rollNo)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-200 cursor-pointer shrink-0"
                      title="Copy Email"
                    >
                      {copiedEmail === item.rollNo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. DESKTOP TABLE VIEW (Visible on tablet & desktop >= md) */}
      <div className={`hidden md:block rounded-3xl border overflow-hidden transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-black uppercase tracking-wider ${
                isDarkMode ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
              }`}>
                <th className="py-3.5 px-4 sm:px-6">ROLL NO.</th>
                <th className="py-3.5 px-4 sm:px-6">STUDENT NAME</th>
                <th className="py-3.5 px-4 sm:px-6">DEPARTMENT</th>
                <th className="py-3.5 px-4 sm:px-6">MENTOR NAME</th>
                <th className="py-3.5 px-4 sm:px-6">MAIL ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-sm">No student-mentor mappings found for this filter</p>
                    <p className="text-xs text-slate-500 mt-0.5">Try searching with a different roll number, keyword, or select All Departments.</p>
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => (
                  <tr 
                    key={item.rollNo}
                    className={`transition-colors ${
                      item.rollNo === userRoll
                        ? isDarkMode ? 'bg-emerald-950/30' : 'bg-emerald-50/60'
                        : isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Roll No */}
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-lg border text-[11px] ${
                          item.rollNo === userRoll
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-black'
                            : isDarkMode ? 'bg-slate-800/90 text-indigo-300 border-slate-700' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {item.rollNo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.rollNo, 'roll', item.rollNo)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          title="Copy Roll Number"
                        >
                          {copiedRoll === item.rollNo ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4 sm:px-6 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {item.studentName}
                        </span>
                        {item.year && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/60">
                            Yr {item.year}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                          {item.deptCode}
                        </span>
                        <span className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {item.department}
                        </span>
                      </div>
                    </td>

                    {/* Mentor Name */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs ${
                          isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                        }`}>
                          {item.mentorName}
                        </span>
                      </div>
                    </td>

                    {/* Mentor Mail ID */}
                    <td className="py-3.5 px-4 sm:px-6">
                      {item.mentorEmail ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${item.mentorEmail}`}
                            className={`font-mono text-[11px] hover:underline flex items-center gap-1 ${
                              isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                            }`}
                          >
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{item.mentorEmail}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.mentorEmail, 'email', item.rollNo)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                            title="Copy Mentor Email"
                          >
                            {copiedEmail === item.rollNo ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Universal Pagination Bar (Mobile & Desktop) */}
      {filteredList.length > pageSize && (
        <div className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className="text-slate-400 font-medium text-center sm:text-left text-[11px] sm:text-xs">
            Showing <strong className="text-slate-200">{(currentPage - 1) * pageSize + 1}</strong> to <strong className="text-slate-200">{Math.min(currentPage * pageSize, filteredList.length)}</strong> of <strong className="text-slate-200">{filteredList.length.toLocaleString()}</strong> mappings
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`p-2 rounded-xl border font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-bold text-slate-300 text-xs">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={`p-2 rounded-xl border font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
