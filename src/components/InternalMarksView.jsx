import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  User,
  RefreshCw,
  GraduationCap,
  Activity,
  ChevronDown,
  ChevronUp,
  Sliders,
  ArrowRight,
  Sparkles,
  FlaskConical
} from 'lucide-react';
import {
  STUDENTS_INTERNAL_MARKS_LIST,
  BIT_SPREADSHEET_CONFIG,
  parseStudentRows
} from '../data/rp_distribution';
import { fetchStudentRewardPointsFromSheet, APPS_SCRIPT_SHEET_URL } from '../services/googleSheetsService';
import { fetchLiveGradioInternalMarks } from '../services/internalMarksGradioService';
import { getInstantStudentMentorData } from '../services/studentMentorService';
const studentMentorData = getInstantStudentMentorData();

const DEPT_CODE_TO_NAME = {
  'CT': 'COMPUTER TECHNOLOGY',
  'IT': 'INFORMATION TECHNOLOGY',
  'CS': 'COMPUTER SCIENCE AND ENGINEERING',
  'CSE': 'COMPUTER SCIENCE AND ENGINEERING',
  'EC': 'ELECTRONICS AND COMMUNICATION ENGINEERING',
  'ECE': 'ELECTRONICS AND COMMUNICATION ENGINEERING',
  'EE': 'ELECTRICAL AND ELECTRONICS ENGINEERING',
  'EEE': 'ELECTRICAL AND ELECTRONICS ENGINEERING',
  'AD': 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE',
  'AM': 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
  'ME': 'MECHANICAL ENGINEERING',
  'MECH': 'MECHANICAL ENGINEERING',
  'IS': 'INFORMATION SCIENCE AND ENGINEERING',
  'ISE': 'INFORMATION SCIENCE AND ENGINEERING',
  'CB': 'COMPUTER SCIENCE AND BUSINESS SYSTEMS',
  'CSBS': 'COMPUTER SCIENCE AND BUSINESS SYSTEMS',
  'CD': 'COMPUTER SCIENCE AND DESIGN',
  'CSD': 'COMPUTER SCIENCE AND DESIGN',
  'BT': 'BIOTECHNOLOGY',
  'BM': 'BIOMEDICAL ENGINEERING',
  'AG': 'AGRICULTURAL ENGINEERING',
  'CE': 'CIVIL ENGINEERING',
  'FD': 'FASHION TECHNOLOGY',
  'FT': 'FOOD TECHNOLOGY',
  'EI': 'ELECTRONICS AND INSTRUMENTATION ENGINEERING',
  'MC': 'MECHATRONICS ENGINEERING'
};

function resolveStudentDepartment(roll = '', defaultDept = '') {
  if (defaultDept && defaultDept !== 'N/A' && defaultDept !== 'Engineering') return defaultDept;
  const cleanRoll = String(roll || '').trim().toUpperCase();
  const mentorRec = Array.isArray(studentMentorData) ? studentMentorData.find(m => (m.rollNo || '').toUpperCase() === cleanRoll) : null;
  if (mentorRec?.department) return mentorRec.department;
  const letters = (cleanRoll.match(/[A-Z]+/g) || []).join('');
  if (letters && DEPT_CODE_TO_NAME[letters]) return DEPT_CODE_TO_NAME[letters];
  return 'ENGINEERING';
}

export function pointsToInternalMark(points) {
  const p = Math.max(0, Number(points) || 0);
  if (p <= 0) return '';
  if (p >= 500) return '15.00';
  if (p >= 450) return '14.50';
  if (p >= 400) return '14.00';
  if (p >= 360) return '13.50';
  if (p >= 320) return '13.00';
  if (p >= 280) return '12.50';
  if (p >= 240) return '12.00';
  if (p >= 200) return '11.00';
  if (p >= 160) return '10.00';
  if (p >= 120) return '9.00';
  if (p >= 80) return '8.00';
  if (p >= 50) return '6.00';
  if (p >= 25) return '4.00';
  return (Math.min(15, (p / 500) * 15)).toFixed(2);
}

export function computeLiveCourseMarks(baseRecord, liveRedeemedPoints) {
  if (!baseRecord) return baseRecord;
  // If baseRecord already has verified live Gradio courses, preserve them directly
  if (baseRecord.isLiveGradio && Array.isArray(baseRecord.theoryCourses) && baseRecord.theoryCourses.length > 0) {
    return baseRecord;
  }

  const rawRedeemed = Number(liveRedeemedPoints);
  const redeemed = !isNaN(rawRedeemed) && rawRedeemed >= 0 
    ? rawRedeemed 
    : (Number(baseRecord.redeemedPoints) || 0);

  let rawTheory = Array.isArray(baseRecord.theoryCourses) && baseRecord.theoryCourses.length > 0 
    ? baseRecord.theoryCourses.map(c => ({ ...c })) 
    : [];
  let rawAddon = Array.isArray(baseRecord.addonCourses) && baseRecord.addonCourses.length > 0 
    ? baseRecord.addonCourses.map(c => ({ ...c })) 
    : [];
  let rawLab = Array.isArray(baseRecord.labCourses) && baseRecord.labCourses.length > 0 
    ? baseRecord.labCourses.map(c => ({ ...c })) 
    : [];

  // Fallback defaults for courses if empty
  if (rawTheory.length === 0 && rawLab.length === 0) {
    const deptPrefix = (baseRecord.department?.toUpperCase().includes('COMPUTER TECH') || baseRecord.rollNo?.includes('CT')) ? '22CT' : '22';
    rawTheory = [
      { slot: 'TS1', code: `${deptPrefix}701`, ip1: '', ip2: '', total: '' },
      { slot: 'TS2', code: `${deptPrefix}702`, ip1: '', ip2: '', total: '' },
      { slot: 'TS3', code: `${deptPrefix}021`, ip1: '', ip2: '', total: '' }
    ];
  }

  let remainingPoints = redeemed;

  const updatedTheory = rawTheory.map((tc) => {
    const slotAlloc = Math.min(510, Math.max(0, remainingPoints));
    remainingPoints -= slotAlloc;
    const mark = pointsToInternalMark(slotAlloc);
    return {
      ...tc,
      allocatedPoints: slotAlloc,
      ip1: mark || (slotAlloc > 0 ? pointsToInternalMark(slotAlloc) : tc.ip1 || ''),
      ip2: tc.ip2 || '',
      total: mark || tc.total || tc.ip1 || (slotAlloc > 0 ? pointsToInternalMark(slotAlloc) : '0.00')
    };
  });

  const updatedAddon = rawAddon.map((ac) => {
    const slotAlloc = Math.min(510, Math.max(0, remainingPoints));
    remainingPoints -= slotAlloc;
    const mark = pointsToInternalMark(slotAlloc);
    return {
      ...ac,
      allocatedPoints: slotAlloc,
      ip1: mark || ac.ip1 || '',
      ip2: ac.ip2 || '',
      total: mark || ac.total || ac.ip1 || '0.00'
    };
  });

  const updatedLab = rawLab.map((lc) => {
    const slotAlloc = Math.min(510, Math.max(0, remainingPoints));
    remainingPoints -= slotAlloc;
    const mark = pointsToInternalMark(slotAlloc);
    return {
      ...lc,
      allocatedPoints: slotAlloc,
      ip1: mark || lc.ip1 || '',
      ip2: lc.ip2 || '',
      total: mark || lc.total || lc.ip1 || '0.00'
    };
  });

  const allCourses = [...updatedTheory, ...updatedAddon, ...updatedLab];
  const ip1TotalNum = allCourses.reduce((sum, c) => sum + (parseFloat(c.ip1) || 0), 0);
  const ip1Total = ip1TotalNum > 0 ? ip1TotalNum.toFixed(2) : (baseRecord.ip1Total || '0.00');
  const ip2Total = baseRecord.ip2Total || '0.00';
  const grandTotal = (parseFloat(ip1Total) + parseFloat(ip2Total)).toFixed(2);

  return {
    ...baseRecord,
    redeemedPoints: redeemed,
    theoryCourses: updatedTheory,
    addonCourses: updatedAddon,
    labCourses: updatedLab,
    totalTheoryCount: updatedTheory.length,
    totalLabCount: updatedLab.length,
    totalSubjectsCount: allCourses.length,
    ip1Total,
    ip2Total,
    grandTotal
  };
}

export default function InternalMarksView({ currentUser, isDarkMode, onNavigateToSkew }) {
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
  const [showActivityBreakdown, setShowActivityBreakdown] = useState(false);
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

  // Detect logged-in student roll or dynamic default from master sheet
  const defaultRoll = useMemo(() => {
    const raw = (currentUser?.id || currentUser?.roll_no || currentUser?.rollNo || currentUser?.username || '').trim().toUpperCase();
    if (raw) {
      return raw.includes('@') ? raw.split('@')[0].toUpperCase() : raw;
    }
    return (studentsData[0]?.rollNo || '').toUpperCase();
  }, [currentUser, studentsData]);

  // Selected student roll
  const [selectedRoll, setSelectedRoll] = useState(defaultRoll);

  // Sync selectedRoll if defaultRoll changes (e.g. upon user login)
  useEffect(() => {
    if (defaultRoll && !selectedRoll) {
      setSelectedRoll(defaultRoll);
    }
  }, [defaultRoll]);

  // Active student object dynamically looked up from Master Sheet / datasets
  const activeStudent = useMemo(() => {
    const targetRoll = (selectedRoll || defaultRoll || studentsData[0]?.rollNo || '').trim().toUpperCase();

    // 1. Match from master sheet internal marks dataset
    const matched = studentsData.find(s => (s.rollNo || s.id || '').toUpperCase() === targetRoll) ||
      studentsData.find(s => (s.rollNo || s.id || '').toUpperCase().includes(targetRoll));

    if (matched) {
      // Dynamically recalculate if redeemed points are present
      return computeLiveCourseMarks(matched, matched.redeemedPoints || matched.redeemed_points);
    }

    // 2. Dynamic resolution from institute student mentor directory
    const mentorRec = Array.isArray(studentMentorData)
      ? studentMentorData.find(m => (m.rollNo || '').toUpperCase() === targetRoll)
      : null;

    const dynamicDept = resolveStudentDepartment(targetRoll, mentorRec?.department || currentUser?.department);
    const dynamicName = mentorRec?.name || currentUser?.name || targetRoll || 'Student';
    const dynamicMentor = mentorRec?.mentorName || mentorRec?.mentor || currentUser?.mentor || '';
    const dynamicYear = mentorRec?.year || currentUser?.year || 'IV';

    const fallbackRecord = {
      rollNo: targetRoll,
      name: dynamicName,
      year: dynamicYear,
      department: dynamicDept,
      courseCode: 'B. E.',
      mentor: dynamicMentor,
      activityBreakdown: [],
      theoryCourses: [],
      addonCourses: [],
      labCourses: [],
      totalTheoryCount: 0,
      totalLabCount: 0,
      totalSubjectsCount: 0,
      ip1Total: '0.00',
      ip2Total: '0.00',
      grandTotal: '0.00'
    };

    return computeLiveCourseMarks(fallbackRecord, 0);
  }, [studentsData, selectedRoll, defaultRoll, currentUser]);

  // Dynamic Live Sync function from Google Sheets API & Gradio Internal Marks
  const fetchLiveGoogleSheetData = useCallback(async (isManual = false) => {
    const rollToFetch = (selectedRoll || defaultRoll || currentUser?.id || currentUser?.roll_no || '').trim().toUpperCase();
    if (!rollToFetch) return;

    setSyncStatus('syncing');

    try {
      const dept = resolveStudentDepartment(rollToFetch);
      
      // Concurrently fetch live points from sheet and live verified internal marks from Gradio
      const [liveStudent, gradioMarks] = await Promise.allSettled([
        fetchStudentRewardPointsFromSheet(rollToFetch, dept),
        fetchLiveGradioInternalMarks(rollToFetch, isManual)
      ]);

      const liveStudentData = liveStudent.status === 'fulfilled' ? liveStudent.value : null;
      const gradioMarksData = gradioMarks.status === 'fulfilled' ? gradioMarks.value : null;

      if (liveStudentData || gradioMarksData) {
        setStudentsData(prevList => {
          const cleanRoll = String(rollToFetch).toUpperCase();
          const existingIdx = prevList.findIndex(s => (s.rollNo || s.id || '').toUpperCase() === cleanRoll);
          const baseRecord = existingIdx !== -1 ? prevList[existingIdx] : {};

          const mentorRec = Array.isArray(studentMentorData)
            ? studentMentorData.find(m => (m.rollNo || '').toUpperCase() === cleanRoll)
            : null;

          const liveRedeemed = liveStudentData?.redeemed_points ?? (gradioMarksData?.totalRedeemedPoints ? parseFloat(gradioMarksData.totalRedeemedPoints.replace(/,/g, '')) : baseRecord.redeemedPoints ?? 0);
          const liveBalance = liveStudentData?.balance_points ?? baseRecord.balancePoints ?? 0;
          const liveCumulative = liveStudentData?.cumulative_points ?? baseRecord.cumulativePoints ?? (liveRedeemed + liveBalance);

          // Compute baseline dynamic marks
          let computed = computeLiveCourseMarks({
            ...baseRecord,
            rollNo: cleanRoll,
            id: cleanRoll,
            name: liveStudentData?.name || baseRecord.name || mentorRec?.name || cleanRoll,
            mentor: liveStudentData?.mentor || baseRecord.mentor || mentorRec?.mentorName || '',
            department: liveStudentData?.department || baseRecord.department || mentorRec?.department || dept,
            year: liveStudentData?.year || baseRecord.year || mentorRec?.year || 'IV',
            balancePoints: liveBalance,
            cumulativePoints: liveCumulative,
            redeemedPoints: liveRedeemed,
            activityBreakdown: (liveStudentData?.activityBreakdown && liveStudentData.activityBreakdown.length > 0) ? liveStudentData.activityBreakdown : (baseRecord.activityBreakdown || []),
            eventLogs: (liveStudentData?.eventLogs && liveStudentData.eventLogs.length > 0) ? liveStudentData.eventLogs : (baseRecord.eventLogs || []),
          }, liveRedeemed);

          // If Gradio returned official live verified internal marks, prioritize it for marks
          if (gradioMarksData && Array.isArray(gradioMarksData.theoryCourses) && gradioMarksData.theoryCourses.length > 0) {
            computed = {
              ...computed,
              theoryCourses: gradioMarksData.theoryCourses,
              labCourses: (gradioMarksData.labCourses && gradioMarksData.labCourses.length > 0) ? gradioMarksData.labCourses : (computed.labCourses || []),
              addonCourses: (gradioMarksData.addonCourses && gradioMarksData.addonCourses.length > 0) ? gradioMarksData.addonCourses : (computed.addonCourses || []),
              totalTheoryCount: gradioMarksData.totalTheoryCount || computed.totalTheoryCount,
              totalLabCount: gradioMarksData.totalLabCount || computed.totalLabCount,
              totalSubjectsCount: gradioMarksData.totalSubjectsCount || computed.totalSubjectsCount,
              ip1Total: gradioMarksData.ip1Total || computed.ip1Total,
              ip2Total: gradioMarksData.ip2Total || computed.ip2Total || '0.00',
              grandTotal: gradioMarksData.grandTotal || computed.grandTotal,
              isLiveGradio: true
            };
          }

          const newList = [...prevList];
          if (existingIdx !== -1) {
            newList[existingIdx] = computed;
          } else {
            newList.unshift(computed);
          }

          try {
            localStorage.setItem('bit_live_internal_marks', JSON.stringify({
              time: new Date().toISOString(),
              students: newList
            }));
          } catch (e) {}

          return newList;
        });

        const now = new Date();
        setLastSyncTime(now);
        setSyncStatus('live');
        return;
      }

      setSyncStatus('ready');
    } catch (err) {
      console.warn('Live Internal Marks sync notice:', err);
      setSyncStatus('ready');
    }
  }, [currentUser, selectedRoll, defaultRoll]);

  // Background sync on component mount and roll change
  useEffect(() => {
    fetchLiveGoogleSheetData(false);
  }, [selectedRoll, defaultRoll]);

  // Search filter results across master sheet and college mentor directory (up to 8 matches)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const seen = new Set();
    const results = [];

    for (const s of studentsData) {
      const roll = (s.rollNo || s.id || '').toUpperCase();
      const name = (s.name || '').toLowerCase();
      if (roll.toLowerCase().includes(q) || name.includes(q)) {
        seen.add(roll);
        results.push({
          rollNo: roll,
          name: s.name,
          department: s.department,
          year: s.year
        });
        if (results.length >= 8) return results;
      }
    }

    if (Array.isArray(studentMentorData)) {
      for (const m of studentMentorData) {
        const roll = (m.rollNo || '').toUpperCase();
        if (!roll || seen.has(roll)) continue;
        const name = (m.name || '').toLowerCase();
        if (roll.toLowerCase().includes(q) || name.includes(q)) {
          seen.add(roll);
          results.push({
            rollNo: roll,
            name: m.name,
            department: m.department,
            year: m.year
          });
          if (results.length >= 8) return results;
        }
      }
    }

    return results;
  }, [studentsData, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 font-sans animate-fadeIn px-2 sm:px-4 py-4">
      
      {/* 1. Student Header Bar */}
      <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm relative transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold flex-shrink-0">
            <User className="w-6 h-6" />
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
            <div className="flex items-center gap-2 flex-wrap text-xs mt-1">
              <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {activeStudent.department} • Year {activeStudent.year} • {activeStudent.courseCode}
              </span>
              {activeStudent.mentor && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  isDarkMode
                    ? 'bg-purple-950/70 border-purple-800 text-purple-300'
                    : 'bg-purple-50 border-purple-200 text-purple-700'
                }`}>
                  <GraduationCap className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Mentor: {activeStudent.mentor}</span>
                </span>
              )}
              {activeStudent.specialLab && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  activeStudent.specialLab.code === 'UAL'
                    ? isDarkMode
                      ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                    : activeStudent.specialLab.code === 'PBL'
                    ? isDarkMode
                      ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : isDarkMode
                    ? 'bg-blue-950/70 border-blue-800 text-blue-300'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                  <span>Lab Track: {activeStudent.specialLab.label}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {onNavigateToSkew && (
          <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Want to see how many points are needed per mark (15 / 30 scale)?</span>
            </div>
            <button
              onClick={onNavigateToSkew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>View Skew Benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. 8 Activity Categories & Points Breakdown (Collapsible) */}
      <div className={`rounded-3xl border shadow-sm transition-all overflow-hidden ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          type="button"
          onClick={() => setShowActivityBreakdown(prev => !prev)}
          className={`w-full p-4 sm:p-5 flex items-center justify-between transition-colors cursor-pointer text-left ${
            isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  8 Activity Categories & Reward Points Breakdown
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {activeStudent.balancePoints !== undefined ? `${activeStudent.balancePoints.toLocaleString()} RP Remaining` : '0 RP Remaining'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                P-Skills, TAC, Student Initiatives, Special Labs & Hackathons breakdown
              </p>
            </div>
          </div>
          <div className={`p-1.5 rounded-xl border transition-all ${
            isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-700'
          }`}>
            {showActivityBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Collapsible Content */}
        {showActivityBreakdown && (
          <div className={`p-4 sm:p-6 border-t space-y-5 animate-fadeIn ${
            isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'
          }`}>
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Earned</span>
                <span className="text-lg font-black font-mono text-indigo-500 mt-0.5 block">
                  {activeStudent.totalPoints ? activeStudent.totalPoints.toLocaleString() : (activeStudent.cumulativePoints || 0)} <span className="text-xs">RP</span>
                </span>
              </div>
              <div className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cumulative</span>
                <span className="text-lg font-black font-mono text-emerald-500 mt-0.5 block">
                  {activeStudent.cumulativePoints ? activeStudent.cumulativePoints.toLocaleString() : (activeStudent.totalPoints || 0)} <span className="text-xs">RP</span>
                </span>
              </div>
              <div className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Redeemed RP</span>
                <span className="text-lg font-black font-mono text-amber-500 mt-0.5 block">
                  {activeStudent.redeemedPoints ? activeStudent.redeemedPoints.toLocaleString() : '0'} <span className="text-xs">RP</span>
                </span>
              </div>
              <div className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Balance</span>
                <span className="text-lg font-black font-mono text-cyan-500 mt-0.5 block">
                  {activeStudent.balancePoints ? activeStudent.balancePoints.toLocaleString() : (activeStudent.cumulativePoints || 0)} <span className="text-xs">RP</span>
                </span>
              </div>
            </div>

            {/* 8 Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(activeStudent.activityBreakdown || []).map((cat) => {
                const totalPts = activeStudent.totalPoints || activeStudent.cumulativePoints || 1;
                const percentage = totalPts > 0 ? Math.min(100, Math.round((cat.points / totalPts) * 100)) : 0;
                
                return (
                  <div
                    key={cat.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs truncate">{cat.label}</span>
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-600 dark:text-slate-300">
                        {cat.count} {cat.count === 1 ? 'Event' : 'Events'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="text-xs text-slate-400 font-medium">Points Earned</span>
                      <span className="text-sm font-extrabold font-mono text-indigo-500 dark:text-indigo-400">
                        {cat.points.toLocaleString()} RP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Search Bar & Live Sync Toolbar */}
      <div className={`p-3.5 sm:p-4 rounded-3xl border shadow-sm transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Search Input with Autocomplete */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                const target = searchQuery.trim().toUpperCase();
                setSyncStatus('syncing');
                setSelectedRoll(target);
                setSearchQuery('');
                setIsDropdownOpen(false);
              }
            }}
            placeholder="Search Roll No (eg. 7376231CS105, CT109)..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border outline-none transition-all ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
            }`}
          />

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchResults.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-50 overflow-hidden ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              {searchResults.map((s) => (
                <button
                  key={s.rollNo}
                  type="button"
                  onClick={() => {
                    setSyncStatus('syncing');
                    setSelectedRoll(s.rollNo);
                    setSearchQuery('');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer border-b last:border-b-0 ${
                    isDarkMode
                      ? 'border-slate-700/60 hover:bg-slate-700/50 text-slate-200'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <span className={`font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {s.name}
                    </span>
                    <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {s.department} • Year {s.year}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                    {s.rollNo}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Sync Indicator & Manual Refresh Button */}
        <button
          type="button"
          onClick={() => fetchLiveGoogleSheetData(true)}
          disabled={syncStatus === 'syncing'}
          title="Click to refresh latest marks"
          className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
            syncStatus === 'syncing'
              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse'
              : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin text-blue-500' : 'text-blue-500'}`} />
          <span>
            {syncStatus === 'syncing' ? 'Refreshing...' : 'Refresh'}
          </span>
        </button>
      </div>

      {/* 4. Exact Internal Marks Distribution Table (Matching Provided Sample UI) */}
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
              
              {/* SKELETON LOADING STATE (Until live verified Gradio data resolves) */}
              {syncStatus === 'syncing' && !activeStudent?.isLiveGradio ? (
                <>
                  <tr>
                    <td colSpan={4} className="py-3 px-2 sm:px-4">
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-500 bg-blue-500/10 px-4 py-2.5 rounded-2xl border border-blue-500/20 animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-500 shrink-0" />
                        <span>Fetching exact live internal marks from Gradio for {activeStudent.rollNo}...</span>
                      </div>
                    </td>
                  </tr>
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={`skel-row-${i}`} className="animate-pulse">
                      <td className="py-2.5 px-2 sm:px-4">
                        <div className={`h-5 rounded-lg w-28 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-center">
                        <div className={`h-5 rounded-lg w-14 mx-auto ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-center">
                        <div className={`h-5 rounded-lg w-10 mx-auto ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-center">
                        <div className={`h-5 rounded-lg w-14 mx-auto ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                      </td>
                    </tr>
                  ))}
                  <tr className={`border-t-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-300'} animate-pulse`}>
                    <td className="py-4 px-2 sm:px-4">
                      <div className={`h-6 rounded-lg w-36 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    </td>
                    <td className="py-4 px-2 sm:px-4 text-center">
                      <div className={`h-6 rounded-lg w-16 mx-auto ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    </td>
                    <td className="py-4 px-2 sm:px-4 text-center">
                      <div className={`h-6 rounded-lg w-10 mx-auto ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    </td>
                    <td className="py-4 px-2 sm:px-4 text-center">
                      <div className={`h-6 rounded-lg w-16 mx-auto ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {/* SECTION 1: THEORY COURSES */}
                  <tr>
                    <td className={`pt-6 pb-2 px-2 sm:px-4 font-black uppercase tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-950'
                    }`}>
                      THEORY COURSES - ({activeStudent.totalTheoryCount || (activeStudent.theoryCourses || []).length || 0} COURSES)
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
                  {(activeStudent.theoryCourses || []).map((tc, idx) => (
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
                  {(activeStudent.addonCourses || []).length > 0 &&
                    (activeStudent.addonCourses || []).map((ac, idx) => (
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
                      LAB. COURSES - ({activeStudent.totalLabCount || (activeStudent.labCourses || []).length || 0} COURSES)
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
                  {(activeStudent.labCourses || []).length > 0 &&
                    (activeStudent.labCourses || []).map((lc, idx) => (
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
                </>
              )}

            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
