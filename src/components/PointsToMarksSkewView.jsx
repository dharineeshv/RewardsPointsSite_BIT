import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Search,
  Sparkles,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  Layers,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle2,
  Sliders,
  BarChart2,
  Percent,
  FileSpreadsheet,
  FlaskConical
} from 'lucide-react';
import rawData from '../data/rp_distribution_raw.json';
import { STUDENT_SPECIAL_LAB_MAP } from '../data/rp_distribution';

// Benchmark point cutoffs per internal mark (out of 15) for each year
export const YEAR_SKEW_BENCHMARKS = {
  'IV': {
    title: 'Year IV Benchmark Cutoffs (Skew-1)',
    benchmarkRatio: '1600 RP Base',
    maxMarks: 15,
    maxMarksAlt: 30,
    cutoffs: [
      { mark: 15, mark30: 30, points: 2880, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
      { mark: 14, mark30: 28, points: 2304, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
      { mark: 13, mark30: 26, points: 1920, color: 'text-teal-400 bg-teal-400/10 border-teal-400/30' },
      { mark: 12, mark30: 24, points: 1536, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' },
      { mark: 11, mark30: 22, points: 1344, color: 'text-sky-400 bg-sky-400/10 border-sky-400/30' },
      { mark: 10, mark30: 20, points: 1152, color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
      { mark: 9, mark30: 18, points: 960, color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30' },
      { mark: 8, mark30: 16, points: 768, color: 'text-violet-400 bg-violet-400/10 border-violet-400/30' },
      { mark: 7, mark30: 14, points: 672, color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
      { mark: 6, mark30: 12, points: 576, color: 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/30' },
      { mark: 5, mark30: 10, points: 480, color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
      { mark: 4, mark30: 8, points: 384, color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
      { mark: 3, mark30: 6, points: 288, color: 'text-rose-400 bg-rose-400/10 border-rose-400/30' },
      { mark: 2, mark30: 4, points: 192, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
      { mark: 1, mark30: 2, points: 96, color: 'text-red-500 bg-red-500/10 border-red-500/30' },
      { mark: 0, mark30: 0, points: 0, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
    ]
  },
  'III': {
    title: 'Year III Benchmark Cutoffs (Skew - III)',
    benchmarkRatio: '500 RP Base',
    maxMarks: 15,
    maxMarksAlt: 30,
    cutoffs: [
      { mark: 15, mark30: 30, points: 2934, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
      { mark: 14, mark30: 28, points: 2322, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
      { mark: 13, mark30: 26, points: 1782, color: 'text-teal-400 bg-teal-400/10 border-teal-400/30' },
      { mark: 12, mark30: 24, points: 1278, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' },
      { mark: 11, mark30: 22, points: 1089, color: 'text-sky-400 bg-sky-400/10 border-sky-400/30' },
      { mark: 10, mark30: 20, points: 900, color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
      { mark: 9, mark30: 18, points: 711, color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30' },
      { mark: 8, mark30: 16, points: 522, color: 'text-violet-400 bg-violet-400/10 border-violet-400/30' },
      { mark: 7, mark30: 14, points: 450, color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
      { mark: 6, mark30: 12, points: 387, color: 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/30' },
      { mark: 5, mark30: 10, points: 324, color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
      { mark: 4, mark30: 8, points: 261, color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
      { mark: 3, mark30: 6, points: 189, color: 'text-rose-400 bg-rose-400/10 border-rose-400/30' },
      { mark: 2, mark30: 4, points: 126, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
      { mark: 1, mark30: 2, points: 63, color: 'text-red-500 bg-red-500/10 border-red-500/30' },
      { mark: 0, mark30: 0, points: 0, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
    ]
  },
  'II': {
    title: 'Year II Benchmark Cutoffs (Skew-2)',
    benchmarkRatio: '300 RP Base',
    maxMarks: 15,
    maxMarksAlt: 30,
    cutoffs: [
      { mark: 15, mark30: 30, points: 2500, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
      { mark: 14, mark30: 28, points: 2000, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
      { mark: 13, mark30: 26, points: 1600, color: 'text-teal-400 bg-teal-400/10 border-teal-400/30' },
      { mark: 12, mark30: 24, points: 1200, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' },
      { mark: 11, mark30: 22, points: 1000, color: 'text-sky-400 bg-sky-400/10 border-sky-400/30' },
      { mark: 10, mark30: 20, points: 800, color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
      { mark: 8, mark30: 16, points: 500, color: 'text-violet-400 bg-violet-400/10 border-violet-400/30' },
      { mark: 5, mark30: 10, points: 300, color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
      { mark: 0, mark30: 0, points: 0, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
    ]
  },
  'I': {
    title: 'Year I Benchmark Cutoffs (Skew)',
    benchmarkRatio: '1000 RP Base',
    maxMarks: 15,
    maxMarksAlt: 30,
    cutoffs: [
      { mark: 15, mark30: 30, points: 2000, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
      { mark: 14, mark30: 28, points: 1700, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
      { mark: 13, mark30: 26, points: 1400, color: 'text-teal-400 bg-teal-400/10 border-teal-400/30' },
      { mark: 12, mark30: 24, points: 1100, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' },
      { mark: 10, mark30: 20, points: 800, color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
      { mark: 5, mark30: 10, points: 400, color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
      { mark: 0, mark30: 0, points: 0, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
    ]
  }
};

// Helper to resolve student department name from profile or roll number
export function resolveStudentDepartment(user) {
  if (!user) return 'INFORMATION TECHNOLOGY';
  const userDept = (user.department || '').trim().toUpperCase();
  const userRoll = (user.roll_no || user.rollNo || user.roll || '').trim().toUpperCase();

  // Extract department letters from roll number e.g. 7376222IT134 -> IT, 7376221CS101 -> CS, 7376232AG102 -> AG
  const rollDeptMatch = userRoll.match(/^7376\d{2,3}([A-Z]{2,4})\d{2,4}$/);
  const rollDeptCode = rollDeptMatch ? rollDeptMatch[1] : '';

  const DEPT_MAP = {
    'AG': 'AGRICULTURAL ENGINEERING',
    'AD': 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE',
    'AIDS': 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE',
    'AI&DS': 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE',
    'AL': 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
    'AM': 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
    'AIML': 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
    'AI&ML': 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
    'BM': 'BIOMEDICAL ENGINEERING',
    'BME': 'BIOMEDICAL ENGINEERING',
    'BT': 'BIOTECHNOLOGY',
    'CE': 'CIVIL ENGINEERING',
    'CIVIL': 'CIVIL ENGINEERING',
    'CB': 'COMPUTER SCIENCE AND BUSINESS SYSTEMS',
    'CSBS': 'COMPUTER SCIENCE AND BUSINESS SYSTEMS',
    'CD': 'COMPUTER SCIENCE AND DESIGN',
    'CSD': 'COMPUTER SCIENCE AND DESIGN',
    'CS': 'COMPUTER SCIENCE AND ENGINEERING',
    'CSE': 'COMPUTER SCIENCE AND ENGINEERING',
    'CT': 'COMPUTER TECHNOLOGY',
    'EE': 'ELECTRICAL AND ELECTRONICS ENGINEERING',
    'EEE': 'ELECTRICAL AND ELECTRONICS ENGINEERING',
    'EC': 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    'ECE': 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    'EI': 'ELECTRONICS AND INSTRUMENTATION ENGINEERING',
    'EIE': 'ELECTRONICS AND INSTRUMENTATION ENGINEERING',
    'FT': 'FASHION TECHNOLOGY',
    'FD': 'FASHION TECHNOLOGY',
    'FOOD': 'FOOD TECHNOLOGY',
    'IS': 'INFORMATION SCIENCE AND ENGINEERING',
    'ISE': 'INFORMATION SCIENCE AND ENGINEERING',
    'IT': 'INFORMATION TECHNOLOGY',
    'ME': 'MECHANICAL ENGINEERING',
    'MECH': 'MECHANICAL ENGINEERING',
    'MC': 'MECHATRONICS ENGINEERING',
    'MTR': 'MECHATRONICS ENGINEERING'
  };

  if (rollDeptCode && DEPT_MAP[rollDeptCode]) {
    return DEPT_MAP[rollDeptCode];
  }

  if (userDept && DEPT_MAP[userDept]) {
    return DEPT_MAP[userDept];
  }

  if (userDept) {
    for (const [code, fullName] of Object.entries(DEPT_MAP)) {
      if (userDept === fullName || userDept.includes(fullName) || fullName.includes(userDept)) {
        return fullName;
      }
    }
  }

  return 'INFORMATION TECHNOLOGY';
}

export default function PointsToMarksSkewView({ currentUser, isDarkMode = true, onNavigateToMarks }) {
  const initialYear = currentUser?.year 
    ? (String(currentUser.year).replace(/^Year\s*/i, '').trim() || 'IV')
    : 'IV';
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const userDepartment = useMemo(() => resolveStudentDepartment(currentUser), [currentUser]);
  const [selectedDept, setSelectedDept] = useState(userDepartment || 'ALL');
  const [searchStudent, setSearchStudent] = useState('');
  const [activeTabSection, setActiveTabSection] = useState('benchmarks'); // 'benchmarks' | 'students'

  const currentRoll = useMemo(() => (currentUser?.roll_no || currentUser?.rollNo || currentUser?.roll || '').toUpperCase(), [currentUser]);

  // Extract studentwise skew list from master sheet
  const studentSkewList = useMemo(() => {
    const rawRows = rawData?.sheets?.['Studentwise Skew'] || [];
    const list = [];
    for (let i = 3; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || !row[1]) continue;
      const roll = String(row[1]).trim().toUpperCase();
      if (!/^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(roll)) continue;

      const name = String(row[3] || '').trim();
      const yr = String(row[5] || 'IV').trim();
      const dept = String(row[6] || '').trim();
      const bal = parseFloat(String(row[7] || '0').replace(/,/g, '')) || 0;
      const courses = [];
      for (let c = 8; c <= 16; c++) {
        if (row[c] && row[c].trim() && row[c].trim() !== '0') {
          courses.push(row[c].trim());
        }
      }

      const specialLab = (STUDENT_SPECIAL_LAB_MAP && STUDENT_SPECIAL_LAB_MAP[roll]) || {
        code: 'PBL',
        label: 'PBL (Project-Based Learning)',
        badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      };

      list.push({
        id: `skew-${i}`,
        rollNo: roll,
        name: name || roll,
        year: yr,
        department: dept,
        specialLab,
        balancePoints: bal,
        courses,
        theoryCount: row[17] || '0',
        labCount: row[18] || '0',
        ratio: row[19] || '0'
      });
    }
    return list;
  }, []);

  // List of unique departments and their student counts
  const departmentOptions = useMemo(() => {
    const counts = {};
    studentSkewList.forEach(s => {
      if (s.department) {
        counts[s.department] = (counts[s.department] || 0) + 1;
      }
    });
    return Object.keys(counts).sort().map(dept => ({
      name: dept,
      count: counts[dept]
    }));
  }, [studentSkewList]);

  // Filtered student list (defaults to logged-in student's department)
  const filteredStudents = useMemo(() => {
    let list = studentSkewList;

    if (searchStudent.trim()) {
      const q = searchStudent.toLowerCase().trim();
      list = list.filter(s =>
        s.rollNo.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.courses.some(c => c.toLowerCase().includes(q))
      );
    } else if (selectedDept && selectedDept !== 'ALL') {
      list = list.filter(s => s.department.toUpperCase() === selectedDept.toUpperCase());
    }

    // Sort so that the current logged-in user is at the top if present
    if (currentRoll) {
      list = [...list].sort((a, b) => {
        if (a.rollNo === currentRoll) return -1;
        if (b.rollNo === currentRoll) return 1;
        return 0;
      });
    }

    return list;
  }, [studentSkewList, searchStudent, selectedDept, currentRoll]);

  // Current year benchmark data
  const currentYearData = YEAR_SKEW_BENCHMARKS[selectedYear] || YEAR_SKEW_BENCHMARKS['IV'];

  // Current student's actual points
  const studentPts = useMemo(() => {
    const rawPts = currentUser?.currentPoints ?? currentUser?.balance_points ?? currentUser?.points ?? 0;
    const num = parseInt(String(rawPts).replace(/,/g, ''), 10);
    return isNaN(num) ? 0 : num;
  }, [currentUser]);

  // Determine the student's earned benchmark tier for the currently selected year
  const studentBenchmark = useMemo(() => {
    const cutoffs = currentYearData.cutoffs;
    let matched = cutoffs[cutoffs.length - 1];
    for (let i = 0; i < cutoffs.length; i++) {
      if (studentPts >= cutoffs[i].points) {
        matched = cutoffs[i];
        break;
      }
    }
    return matched;
  }, [studentPts, currentYearData]);

  return (
    <div className="max-w-6xl mx-auto w-full space-y-4 sm:space-y-6 font-sans animate-fadeIn px-2 sm:px-4 py-2 sm:py-4">
      
      {/* Header Banner */}
      <div className={`p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800'
          : 'bg-gradient-to-br from-white via-indigo-50/50 to-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Official Institutional Grading Scale</span>
            </div>
            <h1 className={`text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Reward Points → Internal Marks Conversion Matrix
            </h1>
            <p className={`text-[11px] sm:text-sm max-w-2xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Understand how your Reward Points (RP) translate into Continuous Internal Evaluation (CIE) marks for IP1, IP2, and semester internal grades.
            </p>
          </div>

          {/* Year Switcher Pills */}
          <div className={`w-full sm:w-auto grid grid-cols-4 sm:flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl sm:rounded-2xl border shadow-sm transition-colors ${
            isDarkMode
              ? 'bg-slate-900/90 border-slate-700/80'
              : 'bg-slate-100 border-slate-300'
          }`}>
            {['IV', 'III', 'II', 'I'].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`py-1.5 px-1 sm:py-1.5 sm:px-3.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                  selectedYear === yr
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
                    : isDarkMode
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white hover:shadow-xs'
                }`}
              >
                <span>Year {yr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3-Card Visual Concept Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3.5 sm:mt-6 pt-3 sm:pt-5 border-t border-slate-800/40">
          <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className={`text-[11px] sm:text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>What is "Skew"?</span>
            </div>
            <p className={`text-[10px] sm:text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              The mathematical curve mapping your earned Reward Points directly into academic internal continuous assessment marks.
            </p>
          </div>

          <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Calculator className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className={`text-[11px] sm:text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>15 vs 30 Marks Explained</span>
            </div>
            <p className={`text-[10px] sm:text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong>Out of 15</strong>: Individual assessments (IP1, IP2). <strong>Out of 30</strong>: Total combined semester internal evaluation.
            </p>
          </div>

          <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className={`text-[11px] sm:text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>How to Get Full Marks?</span>
            </div>
            <p className={`text-[10px] sm:text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Earning <strong>{currentYearData.cutoffs[0]?.points?.toLocaleString()} RP</strong> (for Year {selectedYear}) unlocks <strong>100% full marks ({currentYearData.cutoffs[0]?.mark}/{currentYearData.cutoffs[0]?.mark} or {currentYearData.cutoffs[0]?.mark30}/{currentYearData.cutoffs[0]?.mark30})</strong>.
            </p>
          </div>
        </div>

        {/* View Switcher Sub-tabs */}
        <div className="grid grid-cols-2 gap-2 mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800/40 w-full">
          <button
            onClick={() => setActiveTabSection('benchmarks')}
            className={`w-full justify-center py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 text-center ${
              activeTabSection === 'benchmarks'
                ? 'bg-indigo-600 text-white shadow-md font-black'
                : isDarkMode
                ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-950 border border-slate-300'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Cutoff Benchmarks</span>
          </button>

          <button
            onClick={() => setActiveTabSection('students')}
            className={`w-full justify-center py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 text-center ${
              activeTabSection === 'students'
                ? 'bg-indigo-600 text-white shadow-md font-black'
                : isDarkMode
                ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-950 border border-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Student Ledger</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: OFFICIAL CUTOFF BENCHMARK TABLE & MOBILE CARDS */}
      {activeTabSection === 'benchmarks' && (
        <div className={`rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Table Header with Student Standing Summary */}
          <div className="p-3.5 sm:p-6 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`text-sm sm:text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {currentYearData.title}
                </h2>
                <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  {currentYearData.benchmarkRatio}
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Points required to earn each grade tier for Year {selectedYear}.
              </p>
            </div>

            {/* Current Score Summary Pill */}
            <div className={`w-full sm:w-auto px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border flex items-center justify-between sm:justify-start gap-3 shrink-0 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Your Current Balance
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono font-black text-xs sm:text-sm text-indigo-400">
                    {studentPts.toLocaleString()} RP
                  </span>
                  <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    → <strong className="text-emerald-400">{studentBenchmark.mark}/15</strong> ({studentBenchmark.mark30}/30)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Mobile Cards View (< sm screens) */}
          <div className="block sm:hidden divide-y divide-slate-800/40 p-2 space-y-2">
            {currentYearData.cutoffs.map((item, idx) => {
              const isCurrentTarget = studentBenchmark.mark === item.mark;
              const isUnlocked = item.points <= studentPts;
              const percent = Math.round((item.mark / currentYearData.maxMarks) * 100);
              const neededPts = Math.max(0, item.points - studentPts);

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrentTarget
                      ? isDarkMode
                        ? 'bg-indigo-950/60 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-sm'
                        : 'bg-indigo-50 border-indigo-500/80 ring-1 ring-indigo-500/40 shadow-sm'
                      : isDarkMode
                      ? 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Row: Mark Badges + Percentage */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg font-mono font-black text-xs border ${item.color}`}>
                        {item.mark} / 15
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                        isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {item.mark30} / 30
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      percent === 100 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : percent >= 80 
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                          : percent >= 50
                            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                            : 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
                    }`}>
                      {percent}% {percent === 100 ? '• Full Score' : ''}
                    </span>
                  </div>

                  {/* Bottom Row: Points Required + Status Indicator */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/30">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Requires:</span>
                      <span className={`font-mono font-black text-xs ${item.points > 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {item.points.toLocaleString()} RP
                      </span>
                    </div>

                    <div>
                      {isCurrentTarget ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                          🎯 Current Tier
                        </span>
                      ) : isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-[10px] font-mono">
                          <span>+{neededPts.toLocaleString()} RP needed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Desktop Table View (>= sm screens) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${
                  isDarkMode ? 'bg-slate-950/60 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  <th className="py-3.5 px-4">
                    <div>IP1 / IP2 Mark</div>
                    <span className="text-[10px] font-normal opacity-70">Out of 15</span>
                  </th>
                  <th className="py-3.5 px-4">
                    <div>Total Internal</div>
                    <span className="text-[10px] font-normal opacity-70">Out of 30</span>
                  </th>
                  <th className="py-3.5 px-4">
                    <div>Reward Points Required</div>
                    <span className="text-[10px] font-normal opacity-70">Minimum Threshold</span>
                  </th>
                  <th className="py-3.5 px-4">
                    <div>Grade Equivalent</div>
                    <span className="text-[10px] font-normal opacity-70">Performance %</span>
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    <div>Your Status</div>
                    <span className="text-[10px] font-normal opacity-70">Requirement</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                {currentYearData.cutoffs.map((item, idx) => {
                  const isCurrentTarget = studentBenchmark.mark === item.mark;
                  const isUnlocked = item.points <= studentPts;
                  const percent = Math.round((item.mark / currentYearData.maxMarks) * 100);
                  const neededPts = Math.max(0, item.points - studentPts);

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isCurrentTarget
                          ? isDarkMode
                            ? 'bg-indigo-950/50 border-l-4 border-indigo-500 font-bold'
                            : 'bg-indigo-50/90 border-l-4 border-indigo-600 font-bold'
                          : isDarkMode
                          ? 'hover:bg-slate-800/30 text-slate-300'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {/* Mark (Out of 15) */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-black text-xs border ${item.color}`}>
                          {item.mark} / 15
                        </span>
                      </td>

                      {/* Mark (Out of 30) */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded-md border ${
                          isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {item.mark30} / 30
                        </span>
                      </td>

                      {/* Points Required */}
                      <td className="py-3.5 px-4 font-mono font-black text-sm">
                        <span className={item.points > 0 ? 'text-indigo-400 font-extrabold' : 'text-slate-500'}>
                          {item.points.toLocaleString()} RP
                        </span>
                      </td>

                      {/* Grade Equivalent % */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            percent === 100 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : percent >= 80 
                                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                                : percent >= 50
                                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                                  : 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
                          }`}>
                            {percent}% {percent === 100 ? '• Full Score' : ''}
                          </span>
                        </div>
                      </td>

                      {/* Status / Requirement */}
                      <td className="py-3.5 px-4 text-right">
                        {isCurrentTarget ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow-xs">
                            🎯 Current Tier ({item.mark}/15)
                          </span>
                        ) : isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Unlocked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] font-medium font-mono">
                            <span>Need +{neededPts.toLocaleString()} RP</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: STUDENT SKEW LEDGER (FROM MASTER SHEET) */}
      {activeTabSection === 'students' && (
        <div className={`rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3.5 sm:p-6 border-b border-slate-800/60 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-sm sm:text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Student CIE Allocation Records
                </h2>
                <span className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {filteredStudents.length} Students
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedDept === 'ALL' 
                  ? 'Showing all students across college departments' 
                  : `Filtered by department: ${selectedDept}`}
              </p>
            </div>

            {/* Department Dropdown & Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Department Dropdown */}
              <div className="relative w-full sm:w-64">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className={`w-full pl-3 pr-8 py-2 text-xs font-bold rounded-xl border transition-all appearance-none cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                  }`}
                >
                  <option value="ALL">All Departments ({studentSkewList.length})</option>
                  {departmentOptions.map(dept => (
                    <option key={dept.name} value={dept.name}>
                      {dept.name} ({dept.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Roll, Name, or Course..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border transition-all ${
                    isDarkMode
                      ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 1. Mobile Cards View (< sm screens) */}
          <div className="block sm:hidden p-2 space-y-2">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No students found matching current filters.
              </div>
            ) : (
              filteredStudents.map((st) => {
                const isCurrentUser = currentRoll && st.rollNo === currentRoll;
                const stYearData = YEAR_SKEW_BENCHMARKS[st.year] || YEAR_SKEW_BENCHMARKS['IV'];
                let stPredictedMark = 0;
                for (const cut of stYearData.cutoffs) {
                  if (st.balancePoints >= cut.points) {
                    stPredictedMark = cut.mark;
                    break;
                  }
                }

                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrentUser
                        ? isDarkMode
                          ? 'bg-indigo-950/60 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-sm'
                          : 'bg-indigo-50 border-indigo-500/80 ring-1 ring-indigo-500/40 shadow-sm'
                        : isDarkMode
                        ? 'bg-slate-950/50 border-slate-800/80'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Header: Name + Roll + Predicted Mark */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {st.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-500 text-white shadow-xs">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-indigo-400 mt-0.5">
                          {st.rollNo}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 block">
                          {stPredictedMark} / 15 CIE
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold block mt-0.5">
                          {st.balancePoints.toLocaleString()} RP
                        </span>
                      </div>
                    </div>

                    {/* Department & Year */}
                    <div className="mt-2 pt-2 border-t border-slate-800/30 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate max-w-[70%] font-medium">{st.department}</span>
                      <span className="font-bold">Year {st.year}</span>
                    </div>

                    {/* Courses */}
                    {st.courses.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {st.courses.map((c, idx) => (
                          <span
                            key={idx}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                              isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 2. Desktop Table View (>= sm screens) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${
                  isDarkMode ? 'bg-slate-950/60 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">Balance Points</th>
                  <th className="py-3 px-4">Course Slots</th>
                  <th className="py-3 px-4 text-right">Predicted CIE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {filteredStudents.map((st) => {
                  const isCurrentUser = currentRoll && st.rollNo === currentRoll;
                  const stYearData = YEAR_SKEW_BENCHMARKS[st.year] || YEAR_SKEW_BENCHMARKS['IV'];
                  let stPredictedMark = 0;
                  for (const cut of stYearData.cutoffs) {
                    if (st.balancePoints >= cut.points) {
                      stPredictedMark = cut.mark;
                      break;
                    }
                  }

                  return (
                    <tr
                      key={st.id}
                      className={`transition-colors ${
                        isCurrentUser
                          ? isDarkMode
                            ? 'bg-indigo-950/40 border-l-4 border-indigo-500 text-white'
                            : 'bg-indigo-50 border-l-4 border-indigo-600 text-slate-900'
                          : isDarkMode
                          ? 'hover:bg-slate-800/40 text-slate-300'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{st.name}</div>
                          {isCurrentUser && (
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-indigo-500 text-white shadow-xs">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5">
                          <span className="font-mono text-[11px] text-indigo-400">{st.rollNo}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{st.department}</span>
                        <div className="text-[11px] text-slate-500">Year {st.year}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-indigo-400">
                        {st.balancePoints.toLocaleString()} RP
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {st.courses.slice(0, 4).map((c, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700"
                            >
                              {c}
                            </span>
                          ))}
                          {st.courses.length > 4 && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              +{st.courses.length - 4} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          {stPredictedMark} / 15
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cross Navigation Footnote */}
      <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 hidden sm:block" />
          <span>
            Want to see your detailed subject-wise IP1 & IP2 mark statement sheet?
          </span>
        </div>
        {onNavigateToMarks && (
          <button
            onClick={onNavigateToMarks}
            className="w-full sm:w-auto justify-center px-3.5 py-2 sm:py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 shadow-md shadow-indigo-600/20"
          >
            <span>Open Student Statement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}
