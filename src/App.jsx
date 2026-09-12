import StudentMentorMappingView from './components/StudentMentorMappingView';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import placementData from './data/placementData.json';
import InternalMarksView from './components/InternalMarksView';
import { fetchDepartmentSheetData, fetchStudentRewardPointsFromSheet, fetchInstitutionalAveragesFromSheet, fetchLiveStudentEventLogs, fetchLiveMasterSpreadsheet, AVERAGE_CHART_URL, SPREADSHEET_ID } from './services/googleSheetsService';
import { COLLEGE_HOLIDAYS_AND_LEAVES } from './data/collegeLeaves';
import { savePdfDocumentToDB, loadAllPdfDocumentsFromDB, removePdfDocumentFromDB } from './services/pdfStorageService';
import { getCampusMessMenu } from './data/messMenuData';
import FACULTY_DIRECTORY_DATA from './data/facultyDirectory.json';
import EXAM_HALL_INDEX_DATA from './data/examHallIndex.json';
import { STUDENTS_INTERNAL_MARKS_LIST, STUDENT_EVENT_LOGS_MAP, ALL_REWARD_POINTS_ENTRIES, TOTAL_PS_COMPLETIONS_COUNT } from './data/rp_distribution';
import {
  FileSpreadsheet,
  LayoutGrid,
  BarChart2,
  History,
  Settings,
  Search,
  Info,
  Moon,
  Sun,
  User,
  Users,
  UserCheck,
  BarChart3,
  CircleDot,
  Gift,
  Award,
  IdCard,
  GraduationCap,
  X,
  Trophy,
  Code,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Check,
  Building2,
  Phone,
  LogOut,
  Medal,
  Monitor,
  Menu,
  ShieldCheck,
  Copy,
  Share2,
  Filter,
  ChevronDown,
  RotateCcw,
  Download,
  RefreshCw,
  Smartphone,
  Laptop,
  Activity,
  ExternalLink,
  Terminal,
  Cpu,
  Database,
  Brain,
  Globe,
  Radio,
  Zap,
  Cog,
  Gauge,
  LineChart,
  Server,
  Sprout,
  Dna,
  Palette,
  HeartPulse,
  Utensils,
  UtensilsCrossed,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Clock,
  Coffee,
  Scissors,
  Library,
  Bot,
  Compass,
  Palmtree,
  MapPin,
  FileText,
  PartyPopper,
  Layers,
  Navigation,
  ArrowRightLeft,
  Route,
  Newspaper,
  Briefcase,
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  Send,
  MessageSquare,
  MessageCircle,
  HelpCircle,
  FileUp,
  Upload
} from 'lucide-react';

const ALL_DEPARTMENTS = [
  { id: 'CT', name: 'Computer Technology', fullTitle: 'COMPUTER TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376222CT', '7376232CT', '7376242CT', '7376252CT'], Icon: Terminal, color: 'from-blue-600 to-indigo-600', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  { id: 'CSE', name: 'Computer Science and Engineering', fullTitle: 'COMPUTER SCIENCE AND ENGINEERING', degree: 'B.E.', prefixes: ['7376221CS', '7376231CS', '7376241CS', '7376251CS'], Icon: Cpu, color: 'from-indigo-600 to-violet-600', badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800' },
  { id: 'AI&DS', name: 'Artificial Intelligence & Data Science', fullTitle: 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE', degree: 'B.Tech.', prefixes: ['7376222AD', '7376232AD', '7376242AD', '7376252AD'], Icon: Database, color: 'from-cyan-600 to-blue-600', badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
  { id: 'AIML', name: 'AI & Machine Learning', fullTitle: 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING', degree: 'B.Tech.', prefixes: ['7376222AL', '7376232AL', '7376242AL', '7376252AL'], Icon: Brain, color: 'from-purple-600 to-pink-600', badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800' },
  { id: 'IT', name: 'Information Technology', fullTitle: 'INFORMATION TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376222IT', '7376232IT', '7376242IT', '7376252IT'], Icon: Globe, color: 'from-sky-600 to-blue-600', badgeColor: 'bg-sky-950/80 text-sky-300 border-sky-800' },
  { id: 'ECE', name: 'Electronics & Communication Engineering', fullTitle: 'ELECTRONICS AND COMMUNICATION ENGINEERING', degree: 'B.E.', prefixes: ['7376221EC', '7376231EC', '7376241EC', '7376251EC'], Icon: Radio, color: 'from-teal-600 to-emerald-600', badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-800' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering', fullTitle: 'ELECTRICAL AND ELECTRONICS ENGINEERING', degree: 'B.E.', prefixes: ['7376221EE', '7376231EE', '7376241EE', '7376251EE'], Icon: Zap, color: 'from-amber-600 to-orange-600', badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  { id: 'MECH', name: 'Mechanical Engineering', fullTitle: 'MECHANICAL ENGINEERING', degree: 'B.E.', prefixes: ['7376221ME', '7376231ME', '7376241ME', '7376251ME'], Icon: Cog, color: 'from-slate-600 to-zinc-600', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' },
  { id: 'EIE', name: 'Electronics & Instrumentation Engineering', fullTitle: 'ELECTRONICS AND INSTRUMENTATION ENGINEERING', degree: 'B.E.', prefixes: ['7376221EI', '7376231EI', '7376241EI', '7376251EI'], Icon: Gauge, color: 'from-orange-600 to-amber-600', badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-800' },
  { id: 'CSBS', name: 'Computer Science & Business Systems', fullTitle: 'COMPUTER SCIENCE AND BUSINESS SYSTEMS', degree: 'B.Tech.', prefixes: ['7376222CB', '7376232CB', '7376242CB', '7376252CB'], Icon: LineChart, color: 'from-emerald-600 to-green-600', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  { id: 'AGRI', name: 'Agricultural Engineering', fullTitle: 'AGRICULTURAL ENGINEERING', degree: 'B.E.', prefixes: ['7376222AG', '7376232AG', '7376242AG', '7376252AG'], Icon: Sprout, color: 'from-lime-600 to-emerald-600', badgeColor: 'bg-lime-950/80 text-lime-300 border-lime-800' },
  { id: 'BT', name: 'Biotechnology', fullTitle: 'BIOTECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376222BT', '7376232BT', '7376242BT', '7376252BT'], Icon: Dna, color: 'from-fuchsia-600 to-pink-600', badgeColor: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800' },
  { id: 'CSD', name: 'Computer Science & Design', fullTitle: 'COMPUTER SCIENCE AND DESIGN', degree: 'B.E.', prefixes: ['7376221CD', '7376231CD', '7376241CD', '7376251CD'], Icon: Palette, color: 'from-violet-600 to-purple-600', badgeColor: 'bg-violet-950/80 text-violet-300 border-violet-800' },
  { id: 'CIVIL', name: 'Civil Engineering', fullTitle: 'CIVIL ENGINEERING', degree: 'B.E.', prefixes: ['7376221CE', '7376231CE', '7376241CE', '7376251CE'], Icon: Building2, color: 'from-yellow-600 to-amber-600', badgeColor: 'bg-yellow-950/80 text-yellow-300 border-yellow-800' },
  { id: 'BIOMEDICAL', name: 'Biomedical Engineering', fullTitle: 'BIOMEDICAL ENGINEERING', degree: 'B.E.', prefixes: ['7376221BM', '7376231BM', '7376241BM', '7376251BM'], Icon: HeartPulse, color: 'from-rose-600 to-pink-600', badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800' },
  { id: 'FD', name: 'Food Technology', fullTitle: 'FOOD TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376222FD', '7376232FD', '7376242FD', '7376252FD'], Icon: Utensils, color: 'from-orange-600 to-yellow-600', badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-800' },
  { id: 'FT', name: 'Fashion Technology', fullTitle: 'FASHION TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376222FT', '7376232FT', '7376242FT', '7376252FT'], Icon: Scissors, color: 'from-pink-600 to-rose-600', badgeColor: 'bg-pink-950/80 text-pink-300 border-pink-800' },
  { id: 'ISE', name: 'Information Science & Engineering', fullTitle: 'INFORMATION SCIENCE AND ENGINEERING', degree: 'B.E.', prefixes: ['7376221SE', '7376231SE', '7376241SE', '7376251SE', '7376221IS', '7376231IS', '7376241IS', '7376251IS'], Icon: Library, color: 'from-blue-600 to-cyan-600', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  { id: 'MTRS', name: 'Mechatronics Engineering', fullTitle: 'MECHATRONICS ENGINEERING', degree: 'B.E.', prefixes: ['7376221MZ', '7376231MZ', '7376241MZ', '7376251MZ', '7376231MT', '7376241MT', '7376251MT', '7376231MC'] }
];

export const BIT_DAILY_PLACEMENT_DATA = placementData;

const STUDENTS_DATABASE = [
  {
    id: "7376232CT109",
    name: "DHARINEESH V",
    initials: "DV",
    department: "COMPUTER TECHNOLOGY",
    year: "IV Yr",
    currentPoints: "4.00",
    rawPoints: 4.0,
    cumulativePoints: "4.00",
    redeemedPoints: "0.00",
    avatarBg: "from-[#38c4ee] to-[#0ea5e9]",
    badge: "Verified BIT Student",
    email: "dharineesh.ct23@bitsathy.ac.in",
    cgpa: "8.92",
    history: [
      { id: 1, title: "External Technical Events", date: "Apr 18, 2026", points: "+300 RP", category: "External", icon: Trophy, color: "text-amber-500 bg-amber-50" },
      { id: 2, title: "Database Programming Level 4", date: "Apr 13, 2026", points: "+400 RP", category: "P Skill", icon: Code, color: "text-emerald-500 bg-emerald-50" },
      { id: 3, title: "III & I Year March GP Challenge - BPI", date: "Apr 16, 2026", points: "+300 RP", category: "Initiative", icon: Award, color: "text-indigo-500 bg-indigo-50" },
      { id: 4, title: "Networks - (CSE - Core Concepts) Level 1", date: "Apr 06, 2026", points: "+100 RP", category: "P Skill", icon: BookOpen, color: "text-purple-500 bg-purple-50" },
    ],
    breakdown: [
      { label: "P Skill Certifications", pts: 2100, percent: 55, color: "bg-[#4f46e5]" },
      { label: "External Events & Hackathons", pts: 600, percent: 25, color: "bg-amber-500" },
      { label: "Student Initiatives", pts: 910, percent: 20, color: "bg-emerald-500" },
    ]
  },
  {
    id: "737622CS101",
    name: "SARAH J",
    initials: "SJ",
    department: "COMPUTER SCIENCE & ENG",
    year: "IV Yr",
    currentPoints: "2,150",
    rawPoints: 2150,
    avatarBg: "from-purple-500 to-indigo-600",
    badge: "Highest RP Holder",
    email: "sarah.cs22@bitsathy.ac.in",
    cgpa: "9.45",
    history: [
      { id: 1, title: "International AI Summit Paper Publication", date: "Nov 02, 2024", points: "+800 RP", category: "Academics", icon: Award, color: "text-indigo-500 bg-indigo-50" },
      { id: 2, title: "Global Coding Marathon Winner", date: "Oct 12, 2024", points: "+650 RP", category: "Hackathon", icon: Trophy, color: "text-amber-500 bg-amber-50" },
      { id: 3, title: "President, University Tech Council", date: "Aug 20, 2024", points: "+400 RP", category: "Leadership", icon: Users, color: "text-blue-500 bg-blue-50" }
    ],
    breakdown: [
      { label: "Competitions & Hackathons", pts: 650, percent: 30, color: "bg-amber-500" },
      { label: "Academic Honors", pts: 800, percent: 37, color: "bg-indigo-500" },
      { label: "Leadership & Events", pts: 700, percent: 33, color: "bg-purple-500" },
    ]
  },
  {
    id: "737623IT142",
    name: "ALEX K",
    initials: "AK",
    department: "INFORMATION TECHNOLOGY",
    year: "III Yr",
    currentPoints: "980",
    rawPoints: 980,
    avatarBg: "from-emerald-400 to-teal-500",
    badge: "Active Achiever",
    email: "alex.it23@bitsathy.ac.in",
    cgpa: "8.60",
    history: [
      { id: 1, title: "CodeChef Division 1 Winner", date: "Oct 18, 2024", points: "+450 RP", category: "Coding", icon: Code, color: "text-emerald-500 bg-emerald-50" },
      { id: 2, title: "Web Dev Bootcamp Mentor", date: "Sep 01, 2024", points: "+300 RP", category: "Mentorship", icon: Users, color: "text-blue-500 bg-blue-50" }
    ],
    breakdown: [
      { label: "Coding Contests", pts: 450, percent: 46, color: "bg-emerald-500" },
      { label: "Mentorship", pts: 300, percent: 31, color: "bg-sky-500" },
      { label: "Academics", pts: 230, percent: 23, color: "bg-indigo-500" },
    ]
  }
];

// Google Multi-Color SVG Icon
function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

// Resilient Avatar Image Component
function AvatarImage({ src, alt = "Avatar", initials = "ST", className = "w-full h-full", fallbackBg = "from-[#38c4ee] to-[#0ea5e9]" }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const cleanInitials = (initials || (alt ? alt.split(/\s+/).map(n => n[0]).join('') : 'ST')).slice(0, 2).toUpperCase();

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt || "Avatar"}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setHasError(true)}
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${fallbackBg} text-white flex items-center justify-center font-black select-none`}>
      {cleanInitials}
    </div>
  );
}

import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// Unified Bitcentral API proxy fetcher with resilient direct fallback
async function bitcentralFetch(pathAndQuery) {
  const cleanPath = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('bit_rp_access_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  // 1. Try local proxy / Vercel serverless gateway
  try {
    const res = await fetch(`/api/bitcentral${cleanPath}`, { headers });
    if (res.ok) {
      return res;
    }
  } catch (e) {}

  // 2. Direct fallback to live bitcentral-v2 backend
  return fetch(`https://bitcentral-v2.onrender.com${cleanPath}`, {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Robust student roll & profile resolver from email or query
// Robust student roll & profile resolver for all BIT students
async function resolveStudentRollAndProfile(emailOrRoll, googleName = '') {
  const cleanInput = (emailOrRoll || '').toLowerCase().trim();
  const cleanUpper = cleanInput.toUpperCase();
  const isEmail = cleanInput.includes('@');
  const emailPrefix = isEmail ? cleanInput.split('@')[0] : cleanInput;
  const cleanName = (googleName || '').trim().toLowerCase();

  let rollId = '';
  let studentRecord = null;

  // 1. Check if input is directly a valid roll number format
  if (/^7376\d{2,3}[A-Z]{2,4}\d{2,4}$/i.test(cleanUpper) || /^7376\d{2,3}[A-Z]{2,4}\d{2,4}$/i.test(emailPrefix)) {
    rollId = (/^7376\d{2,3}[A-Z]{2,4}\d{2,4}$/i.test(cleanUpper) ? cleanUpper : emailPrefix.toUpperCase());
  }

  // 2. Match in comprehensive official student database (STUDENTS_INTERNAL_MARKS_LIST)
  if (Array.isArray(STUDENTS_INTERNAL_MARKS_LIST) && STUDENTS_INTERNAL_MARKS_LIST.length > 0) {
    if (rollId) {
      studentRecord = STUDENTS_INTERNAL_MARKS_LIST.find(s => (s.rollNo || '').toUpperCase() === rollId);
    }
    
    // Exact email match
    if (!studentRecord && isEmail) {
      studentRecord = STUDENTS_INTERNAL_MARKS_LIST.find(s => (s.email || '').toLowerCase() === cleanInput);
      if (studentRecord && studentRecord.rollNo) {
        rollId = studentRecord.rollNo;
      }
    }

    // Name + department prefix matching from email (e.g. kavya.ec23@bitsathy.ac.in -> KAVYA + EC23)
    if (!studentRecord) {
      const dotParts = emailPrefix.split('.');
      const namePart = dotParts[0] || '';
      const deptYrPart = dotParts[1] || '';
      const deptMatch = deptYrPart.match(/^([a-z]+)(\d{2})$/i);
      const deptCode = deptMatch ? deptMatch[1].toUpperCase() : '';
      const batchYr = deptMatch ? deptMatch[2] : '';

      studentRecord = STUDENTS_INTERNAL_MARKS_LIST.find(st => {
        const sName = (st.name || '').toLowerCase();
        const sRoll = (st.rollNo || '').toUpperCase();
        const sEmail = (st.email || '').toLowerCase();

        const nameMatches = (cleanName && sName.includes(cleanName)) || (namePart && sName.includes(namePart)) || sEmail.includes(namePart);
        const deptMatches = !deptCode || sRoll.includes(deptCode);
        const batchMatches = !batchYr || sRoll.includes(batchYr);

        return nameMatches && deptMatches && batchMatches;
      });

      if (studentRecord && studentRecord.rollNo) {
        rollId = studentRecord.rollNo;
      }
    }
  }

  // 3. Match in STUDENTS_DATABASE fallback
  if (!studentRecord && Array.isArray(STUDENTS_DATABASE)) {
    studentRecord = STUDENTS_DATABASE.find(s => 
      (s.id && s.id.toUpperCase() === rollId) || 
      (isEmail && s.email && s.email.toLowerCase() === cleanInput) ||
      (cleanName && s.name && s.name.toLowerCase().includes(cleanName))
    );
    if (studentRecord && studentRecord.id) {
      rollId = studentRecord.id;
    }
  }

  // 4. Default fallback to uppercase prefix if nothing else found
  if (!rollId) {
    rollId = emailPrefix.toUpperCase();
  }

  let profileApiData = studentRecord ? {
    roll_no: studentRecord.rollNo || studentRecord.id || rollId,
    register_no: studentRecord.rollNo || studentRecord.id || rollId,
    student_name: studentRecord.name || googleName,
    department: studentRecord.department || 'Engineering',
    mentor_name: studentRecord.mentor || 'BIT Faculty',
    year: studentRecord.year || 'IV',
    email: studentRecord.email || cleanInput,
    activityBreakdown: studentRecord.activityBreakdown || [],
    theoryCourses: studentRecord.theoryCourses || [],
    labCourses: studentRecord.labCourses || [],
    addonCourses: studentRecord.addonCourses || [],
    grandTotal: studentRecord.grandTotal || '0.00',
    balance_points: studentRecord.balancePoints !== undefined ? String(studentRecord.balancePoints) : '0',
    cumulative_reward_points: studentRecord.cumulativePoints !== undefined ? String(studentRecord.cumulativePoints) : '0',
    redeemed_points: studentRecord.redeemedPoints !== undefined ? String(studentRecord.redeemedPoints) : '0'
  } : null;

  // Real-time live synchronization with Google Sheets
  if (rollId) {
    try {
      const deptName = studentRecord?.department || 'CT';
      const liveSheetStudent = await fetchStudentRewardPointsFromSheet(rollId, deptName);
      if (liveSheetStudent) {
        if (!profileApiData) {
          profileApiData = {
            roll_no: rollId,
            register_no: rollId,
            student_name: liveSheetStudent.name || googleName || rollId,
            department: liveSheetStudent.department || deptName,
            mentor_name: liveSheetStudent.mentor || 'BIT Faculty',
            year: liveSheetStudent.year || 'IV',
            email: cleanInput.includes('@') ? cleanInput : `${rollId.toLowerCase()}@bitsathy.ac.in`,
            activityBreakdown: [],
            theoryCourses: [],
            labCourses: [],
            addonCourses: [],
            grandTotal: '0.00'
          };
        }
        if (liveSheetStudent.balance_points !== undefined) {
          profileApiData.balance_points = String(liveSheetStudent.balance_points);
        }
        if (liveSheetStudent.cumulative_points !== undefined) {
          profileApiData.cumulative_reward_points = String(liveSheetStudent.cumulative_points);
        }
        if (liveSheetStudent.redeemed_points !== undefined) {
          profileApiData.redeemed_points = String(liveSheetStudent.redeemed_points);
        }
        if (liveSheetStudent.mentor) {
          profileApiData.mentor_name = liveSheetStudent.mentor;
        }
      }
    } catch (liveErr) {
      console.warn('[LiveSheetSync] Fallback to cached student data:', liveErr);
    }
  }

  const searchApiData = profileApiData;

  return { rollId, profileApiData, searchApiData };
}

function DashboardHeroSlider({ 
  weatherData, 
  student, 
  yearlyAverages, 
  normalizeStudentYear, 
  setActiveNav, 
  isDarkMode,
  leavesList = [],
  facultyList = []
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Compute dynamic Benchmark metrics based on active student & exact live API averages
  const studentYearLabel = normalizeStudentYear 
    ? normalizeStudentYear(student?.year || student?.batch, student?.id || student?.roll_no || student?.email) 
    : 'Year IV';
  const yearKeyMap = { 'Year I': 'year_1', 'Year II': 'year_2', 'Year III': 'year_3', 'Year IV': 'year_4' };
  const targetYearKey = yearKeyMap[studentYearLabel] || 'year_4';
  const targetYearAvg = Number(yearlyAverages ? yearlyAverages[targetYearKey] : 0) || 0;
  
  const rawPointsStr = (student?.currentPoints || student?.balance_points || student?.cumulativePoints || student?.cumulative_reward_points || '0').toString();
  const studentPointsNum = parseFloat(rawPointsStr.replace(/,/g, '')) || 0;
  const pointsDiff = studentPointsNum - targetYearAvg;
  const isAboveAvg = pointsDiff >= 0;
  const percentOfAvg = targetYearAvg > 0 ? Math.round((studentPointsNum / targetYearAvg) * 100) : 100;
  const diffAbs = Math.abs(pointsDiff).toLocaleString();

  // Find next upcoming leave based on local date
  const todayDate = new Date();
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
  const sortedLeavesList = [...(leavesList || [])].sort((a, b) => {
    const da = a.from_date || a.fromDate || '';
    const db = b.from_date || b.fromDate || '';
    return da.localeCompare(db);
  });
  const nextLeave = sortedLeavesList.find(l => {
    const endDate = l.to_date || l.toDate || l.from_date || l.fromDate;
    return endDate >= todayStr;
  }) || sortedLeavesList[0];

  const totalSlides = 7;

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto slide interval (every 4.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-7 select-none group border border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* SLIDE 1: LIVE CAMPUS CLIMATE & WEATHER */}
        <div className="w-full flex-shrink-0 min-h-[200px] sm:min-h-[220px] p-6 sm:p-8 bg-gradient-to-r from-sky-600 via-indigo-700 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            {weatherData?.icon || '🌤️'}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                🌤️ Live Campus Climate
              </span>
              <span className="text-xs text-sky-200 font-semibold">
                Sathyamangalam • BIT Campus
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                {weatherData ? `${weatherData.temp}°C` : '34°C'}
              </span>
              <span className="text-base sm:text-xl font-bold text-sky-200">
                {weatherData?.condition || 'Clear & Sunny'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100/90 mt-2 max-w-xl">
              Live weather for students residing in campus hostels & day scholars commuting from Erode, Tirupur, & Coimbatore.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 flex-wrap mt-3 text-[11px] font-semibold text-white/90">
            <span className="px-3 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
              💨 Wind: {weatherData?.wind || 11} km/h
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
              📍 11.5034° N, 77.2774° E
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 hidden sm:inline">
              🏫 Bannari Amman Institute of Technology
            </span>
          </div>
        </div>

        {/* SLIDE 2: BATCH AVERAGE & STANDING BENCHMARK */}
        <div className={`w-full flex-shrink-0 min-h-[200px] sm:min-h-[220px] p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between ${
          isAboveAvg 
            ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900' 
            : 'bg-gradient-to-r from-amber-600 via-rose-700 to-slate-900'
        }`}>
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            {isAboveAvg ? '🚀' : '📊'}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                {studentYearLabel} Batch Benchmark
              </span>
              <span className="text-xs text-white/80 font-medium">
                Batch Average: <strong className="text-white font-mono">{targetYearAvg.toLocaleString()} RP</strong>
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {isAboveAvg ? `+${diffAbs} RP Above Average` : `${diffAbs} RP Below Average`}
              </h3>
              <span className="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg bg-black/25 border border-white/20">
                {Math.min(100, percentOfAvg)}% of Batch Avg
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/90 mt-2 max-w-xl">
              {isAboveAvg 
                ? `Outstanding performance, ${student?.name?.split(' ')[0] || 'Student'}! You are currently performing in the top percentile of ${studentYearLabel}.`
                : `You are ${diffAbs} RP below the ${studentYearLabel} College Average. Earn ${diffAbs} more RP to surpass the batch benchmark!`}
            </p>
          </div>

          <div className="relative z-10 mt-3 max-w-md w-full">
            <div className="flex justify-between text-[11px] font-bold mb-1 text-white/90">
              <span>Benchmark Progress</span>
              <span>{Math.min(100, Math.max(0, percentOfAvg))}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/35 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, percentOfAvg))}%` }}
              />
            </div>
          </div>
        </div>

        {/* SLIDE 3: COLLEGE YEAR-WISE AVERAGES & BENCHMARKS */}
        <div className="w-full flex-shrink-0 min-h-[200px] sm:min-h-[220px] p-6 sm:p-8 bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            🎓
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                🎓 College Average Points
              </span>
              <span className="text-xs text-purple-200 font-semibold">
                BIT Batch Benchmarks
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Your Year Average: <span className="text-emerald-300 font-mono">{targetYearAvg.toLocaleString()} RP</span>
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
              Official average reward points earned across all student batches in Bannari Amman Institute of Technology.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3">
            {[
              { label: 'Year I', val: Number(yearlyAverages?.year_1) || 0 },
              { label: 'Year II', val: Number(yearlyAverages?.year_2) || 0 },
              { label: 'Year III', val: Number(yearlyAverages?.year_3) || 0 },
              { label: 'Year IV', val: Number(yearlyAverages?.year_4) || 0 }
            ].map((y, i) => {
              const maxAvgVal = Math.max(
                Number(yearlyAverages?.year_1) || 0,
                Number(yearlyAverages?.year_2) || 0,
                Number(yearlyAverages?.year_3) || 0,
                Number(yearlyAverages?.year_4) || 0,
                1
              );
              const yearPct = Math.min(100, Math.round((y.val / maxAvgVal) * 100));
              const isUserBatch = y.label === studentYearLabel;
              return (
                <div 
                  key={i} 
                  className={`px-3 py-2.5 rounded-2xl border flex flex-col justify-between backdrop-blur-md transition-all ${
                    isUserBatch 
                      ? 'bg-white/25 border-emerald-400/80 shadow-md ring-2 ring-emerald-400/50' 
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-purple-200">
                    <span>{y.label}</span>
                    {isUserBatch && <span className="px-1.5 py-0.2 rounded bg-emerald-500/80 text-white font-extrabold text-[8px] uppercase">Your Year</span>}
                  </div>
                  <div className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
                    {Number(y.val).toLocaleString()} <span className="text-[10px] font-normal text-purple-200">RP</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/30 overflow-hidden mt-1.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isUserBatch ? 'bg-emerald-400' : 'bg-white/80'
                      }`}
                      style={{ width: `${Math.max(y.val > 0 ? 5 : 0, yearPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLIDE 4: CAMPUS DINING & HOSTEL MESS SPECIALS */}
        <div className="w-full flex-shrink-0 min-h-[200px] sm:min-h-[220px] p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-rose-700 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            🍽️
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                🍽️ Campus Dining Menu
              </span>
              <span className="text-xs text-amber-200 font-semibold">
                Live Hostel Food Schedule
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Today's Boys & Girls Hostel Meals
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
              Check live breakfast, lunch, snacks, and dinner meal timings and food items anytime.
            </p>
          </div>

          <div className="relative z-10 mt-3">
            <button
              onClick={() => setActiveNav && setActiveNav('Menu Details')}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-amber-100 transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
            >
              <span>View Today's Meal Menu</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* SLIDE 5: COLLEGE LEAVE & GENERAL PERMISSIONS (GP) SCHEDULE */}
        <div className="w-full flex-shrink-0 min-h-[200px] sm:min-h-[220px] p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between border-l-4 border-indigo-500">
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                <span>Academic Calendar</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Official BIT Leave Schedule
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {nextLeave ? `Upcoming: ${nextLeave.name}` : '21 Scheduled Academic Leaves & Holidays'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {nextLeave 
                ? (() => {
                    const from = nextLeave.from_date || nextLeave.fromDate;
                    const to = nextLeave.to_date || nextLeave.toDate;
                    const day = nextLeave.day ? ` (${nextLeave.day})` : '';
                    const gpSession = (nextLeave.from_half_day || nextLeave.fromHalfDay) ? ` (${nextLeave.from_half_day || nextLeave.fromHalfDay} Session Gate Pass)` : '';
                    if (to && to !== from) {
                      return `Scheduled from ${from} to ${to}${gpSession}.`;
                    }
                    return `Scheduled on ${from}${day}${gpSession}.`;
                  })()
                : 'View official schedule of General Permissions (GP), national holidays, and semester vacation periods.'}
            </p>
          </div>

          <div className="relative z-10 mt-3 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveNav && setActiveNav('Leave Schedule')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>View Leave Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {nextLeave && (
              <span className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next: {nextLeave.name} ({nextLeave.from_date})</span>
              </span>
            )}
          </div>
        </div>

        {/* SLIDE 6: CAMPUS FACULTY & STAFF DIRECTORY */}
        <div className="w-full flex-shrink-0 min-h-[200px] sm:min-h-[220px] p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between border-l-4 border-purple-500">
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>Campus Directory</span>
              </span>
              <span className="text-xs text-purple-200 font-medium">
                Official BIT Faculty & Staff Portal
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              331+ Faculty & Department Mentors
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Instant access to verified faculty emails, direct phone lines, department designations, and office contacts across all BIT departments.
            </p>
          </div>

          <div className="relative z-10 mt-3 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveNav && setActiveNav('Faculty Directory')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Faculty Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>{facultyList.length || 331} Faculty Members</span>
            </span>
          </div>
        </div>

        {/* SLIDE 7: OFFICIAL INTERNAL MARKS DISTRIBUTION */}
        <div className="w-full flex-shrink-0 min-h-[200px] sm:min-h-[220px] p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between border-l-4 border-emerald-500">
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Internal Marks</span>
              </span>
              <span className="text-xs text-emerald-200 font-medium">
                Odd Semester Statement
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Internal Marks Distribution
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Explore 7,500+ student internal mark evaluations, theory courses, lab courses, add-on courses, and live marks sync.
            </p>
          </div>

          <div className="relative z-10 mt-3 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveNav && setActiveNav('Internal Marks')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>View Internal Marks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-300 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>7,500+ Students • Live Sync</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Desktop / Tablet) */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/65 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all cursor-pointer shadow-md opacity-0 group-hover:opacity-100 z-20"
        title="Previous Slide"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/65 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all cursor-pointer shadow-md opacity-0 group-hover:opacity-100 z-20"
        title="Next Slide"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Slider Dots / Indicator Pills (Flipkart Style) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
              currentSlide === idx 
                ? 'w-6 bg-white shadow-xs' 
                : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
            title={`Slide ${idx + 1}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Dedicated Placement Hero Slider Component (matching Home Page DashboardHeroSlider)
function PlacementHeroSlider({ placementData, setPlacementActiveTab, setPlacementSelectedTier }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const totalSlides = 5;

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto slide interval (every 4.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const superDream = placementData.salaryTiers?.[0];
  const dream = placementData.salaryTiers?.[1];
  const prime = placementData.salaryTiers?.[2];
  const core = placementData.salaryTiers?.[3];
  const upcomingDrive = placementData.upcomingDrives?.[0];

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-6 select-none group border border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* SLIDE 1: TOTAL PLACED & MILESTONE */}
        <div className="w-full flex-shrink-0 min-h-[210px] sm:min-h-[230px] p-6 sm:p-8 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            🎯
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-300" />
                <span>Placement Milestone • {placementData.targetBatch}</span>
              </span>
              <span className="text-xs text-emerald-200 font-semibold">
                Updated: {placementData.lastUpdated}
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                {placementData.totalStudentsPlaced}
              </span>
              <span className="text-base sm:text-xl font-bold text-emerald-200">
                Individual Students Placed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-xl">
              Official verified placements across leading tier-1 MNCs, high-growth startups, and core engineering partners.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 flex-wrap mt-3 text-[11px] font-semibold text-white/90">
            <span className="px-3 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{placementData.totalCompaniesVisited} Visited Companies</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
              ⚡ Super Dream, Dream & Prime Tiers
            </span>
          </div>
        </div>

        {/* SLIDE 2: SUPER DREAM TIER (≥ 10 LPA) */}
        <div className="w-full flex-shrink-0 min-h-[210px] sm:min-h-[230px] p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-700 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            🏆
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Super Dream (≥ 10 LPA)</span>
              </span>
              <span className="text-xs text-amber-200 font-semibold">
                High CTC Packages
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                {superDream?.offerCount || 17} Offers
              </span>
              <span className="text-base sm:text-xl font-bold text-amber-200">
                Super Dream Recruits
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-2 max-w-xl truncate">
              Top Recruiters: {superDream?.companies?.join(', ') || 'Caterpillar, EXL, Soliton, Multicoreware, NETGEAR, Presidio, Integra Connect'}
            </p>
          </div>
          <div className="relative z-10 mt-3 flex items-center gap-3">
            <button
              onClick={() => {
                setPlacementActiveTab('insights');
                setPlacementSelectedTier('10 LPA & Above');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>View Super Dream Companies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SLIDE 3: DREAM TIER (7 - 10 LPA) */}
        <div className="w-full flex-shrink-0 min-h-[210px] sm:min-h-[230px] p-6 sm:p-8 bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            ✨
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Dream Tier (7 - 10 LPA)</span>
              </span>
              <span className="text-xs text-purple-200 font-semibold">
                Premium Tech Roles
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                {dream?.offerCount || 86} Offers
              </span>
              <span className="text-base sm:text-xl font-bold text-purple-200">
                Dream Tier Offers
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-100/90 mt-2 max-w-xl truncate">
              Hiring Partners: {dream?.companies?.join(', ') || 'Zoho, TCS, Affordmed, GoML, SurveySparrow, Rocket India'}
            </p>
          </div>
          <div className="relative z-10 mt-3 flex items-center gap-3">
            <button
              onClick={() => {
                setPlacementActiveTab('insights');
                setPlacementSelectedTier('7 - 10 LPA');
              }}
              className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>View Dream Tier Companies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SLIDE 4: PRIME & CORE PLUS (5 - 7 LPA) */}
        <div className="w-full flex-shrink-0 min-h-[210px] sm:min-h-[230px] p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-cyan-700 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            💼
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-300" />
                <span>Prime & Core Plus (5 - 7 LPA)</span>
              </span>
              <span className="text-xs text-cyan-200 font-semibold">
                {(prime?.offerCount || 20) + (core?.offerCount || 43)} Offers
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                {(prime?.offerCount || 20) + (core?.offerCount || 43)} Offers
              </span>
              <span className="text-base sm:text-xl font-bold text-cyan-200">
                Core & Software Engineering
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100/90 mt-2 max-w-xl">
              Codemagen, EXL, IDP Education, Infineon, Workhall, Mistral, Conversight.AI, ZeAI Soft & more.
            </p>
          </div>
          <div className="relative z-10 mt-3 flex items-center gap-3">
            <button
              onClick={() => {
                setPlacementActiveTab('insights');
                setPlacementSelectedTier('6 - 7 LPA');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Prime Tiers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SLIDE 5: UPCOMING ON-CAMPUS DRIVES */}
        <div className="w-full flex-shrink-0 min-h-[210px] sm:min-h-[230px] p-6 sm:p-8 bg-gradient-to-r from-indigo-700 via-violet-800 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-8 opacity-20 text-[130px] sm:text-[160px] pointer-events-none select-none">
            📅
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-violet-300" />
                <span>Upcoming Recruitment Drive</span>
              </span>
              <span className="text-xs text-violet-200 font-semibold">
                {upcomingDrive?.targetBatch || placementData.targetBatch}
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              {upcomingDrive?.company || 'Cytrusst Intelligence Pvt. Ltd.'}
            </h3>
            <p className="text-xs sm:text-sm text-violet-100/90 mt-1 max-w-xl">
              Drive Window: <strong className="text-white font-mono">{upcomingDrive?.startDate} – {upcomingDrive?.endDate}</strong> • {upcomingDrive?.eligibility || 'Circuit & Tech Branches'}
            </p>
          </div>
          <div className="relative z-10 mt-3 flex items-center gap-3">
            <button
              onClick={() => setPlacementActiveTab('drives')}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>View Drive Details & Contests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Left & Right - visible on both mobile and desktop) */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md z-20"
        title="Previous Slide"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md z-20"
        title="Next Slide"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Slider Dots / Indicator Pills (Flipkart Style matching home page) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
              currentSlide === idx 
                ? 'w-6 bg-white shadow-xs' 
                : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
            title={`Slide ${idx + 1}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Standalone Login Page Component
function LoginPage({ onLogin, isDarkMode, initialNotice = '' }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(initialNotice);

  const processStudentLogin = async (email, googleName = '', photo = null) => {
    // Robust student roll & profile resolution
    const { rollId, profileApiData, searchApiData } = await resolveStudentRollAndProfile(email, googleName);

    const name = (profileApiData?.name || searchApiData?.student_name || googleName || rollId).trim().toUpperCase();
    const initials = name.split(/\s+/).map(n => n[0]).filter(Boolean).join('').slice(0, 2) || rollId.slice(0, 2) || 'ST';
    const balanceRaw = searchApiData?.balance_points ? searchApiData.balance_points.replace(/,/g, '') : '0.00';
    const balancePts = parseFloat(balanceRaw || '0').toLocaleString();
    const cumulativeRaw = searchApiData?.cumulative_reward_points ? searchApiData.cumulative_reward_points.replace(/,/g, '') : balanceRaw;
    const cumulativePts = parseFloat(cumulativeRaw || '0').toLocaleString();
    const redeemedRaw = searchApiData?.redeemed_points ? searchApiData.redeemed_points.replace(/,/g, '') : '0.00';
    const redeemedPts = parseFloat(redeemedRaw || '0').toLocaleString();
    const numBal = parseFloat(balanceRaw) || 0;
    const numCum = parseFloat(cumulativeRaw) || numBal;
    const numRed = parseFloat(redeemedRaw) || 0;
    const photoUrl = profileApiData?.photo_url || photo || null;

    onLogin({
      id: rollId,
      name: name,
      initials: initials,
      department: profileApiData?.department || searchApiData?.department || "Computer Technology",
      course_code: searchApiData?.course_code || "B. Tech.",
      batch: profileApiData?.batch || "2023 - 2027",
      year: searchApiData?.year ? (searchApiData.year.startsWith('Year') ? searchApiData.year : `Year ${searchApiData.year}`) : "Year IV",
      phone: profileApiData?.phone || "9715020320",
      mentor_name: searchApiData?.mentor_name || "Dr. ANANDAKUMAR K ISE",
      picture: photoUrl,
      photo_url: photoUrl,
      avatarBg: "from-[#38c4ee] to-[#0ea5e9]",
      badge: "Verified BIT Student",
      email: email,
      currentPoints: balancePts,
      cumulativePoints: cumulativePts,
      redeemedPoints: redeemedPts,
      history: [
        { id: 1, title: "Cumulative RP Earned", date: "Academic Year 2024-2025", points: `+${cumulativePts} RP`, category: "Activities", icon: Trophy, color: "text-amber-500 bg-amber-50" },
        { id: 2, title: "Redeemed Points", date: "Benefits & Vouchers", points: `-${redeemedPts} RP`, category: "Redemption", icon: Gift, color: "text-indigo-500 bg-indigo-50" },
        { id: 3, title: "Net Active Balance", date: "Current Academic Standing", points: `${balancePts} RP`, category: "Balance", icon: Award, color: "text-emerald-500 bg-emerald-50" },
      ],
      breakdown: [
        { label: "Active Net Balance", pts: numBal, percent: Math.min(100, Math.round((numBal / (numCum || 1)) * 100)) || 100, color: "bg-[#4f46e5]" },
        { label: "Cumulative Points", pts: numCum, percent: 100, color: "bg-[#22d3ee]" },
        { label: "Redeemed Points", pts: numRed, percent: Math.min(100, Math.round((numRed / (numCum || 1)) * 100)), color: "bg-amber-500" },
      ]
    });
  };

  const triggerGoogleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setAuthError('');
      try {
        const accessToken = tokenResponse?.access_token;
        if (!accessToken) {
          throw new Error('Google did not provide a valid access token.');
        }

        localStorage.setItem('bit_rp_access_token', accessToken);

        // Fetch Google User Profile info
        let googleProfile = null;
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) {
            googleProfile = await res.json();
          }
        } catch (fetchErr) {
          console.warn('Failed to reach Google userinfo endpoint:', fetchErr);
        }

        if (!googleProfile || !googleProfile.email) {
          throw new Error('Could not retrieve email from Google. Please try again.');
        }
        
        const email = (googleProfile.email || '').toLowerCase().trim();
        const googleName = (googleProfile.name || 'BIT Student').toUpperCase();
        
        if (!email.endsWith('@bitsathy.ac.in')) {
          setAuthError(`Access Restricted: "${email}" is not an authorized domain. Please sign in using your official @bitsathy.ac.in account.`);
          setGoogleLoading(false);
          return;
        }

        await processStudentLogin(email, googleName, googleProfile.picture);
      } catch (err) {
        console.error('Error in Google profile handling:', err);
        setAuthError(err.message || 'Failed to complete sign in.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn('Google Login returned error:', errorResponse);
      setGoogleLoading(false);
      const detail = errorResponse?.error_description || errorResponse?.error || '';
      setAuthError(detail ? `Google sign in error: ${detail}` : 'Google sign-in was cancelled.');
    }
  });

  const handleLoginClick = async () => {
    setAuthError('');
    setGoogleLoading(true);
    
    // Check if running on Android/Native platform
    if (Capacitor.isNativePlatform()) {
      try {
        GoogleAuth.initialize({
          clientId: '97840517761-anoolsallpime9vpmnrg7uo9stu2qqol.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: false,
        });
        const googleUser = await GoogleAuth.signIn();
        const email = (googleUser.email || '').toLowerCase().trim();
        const googleName = (googleUser.name || googleUser.givenName || 'BIT Student').toUpperCase();
        const picture = googleUser.imageUrl || null;
        
        if (!email.endsWith('@bitsathy.ac.in')) {
          setAuthError(`Access Restricted: "${email}" is not an authorized domain. Please sign in using your official @bitsathy.ac.in account.`);
          setGoogleLoading(false);
          return;
        }

        await processStudentLogin(email, googleName, picture);
      } catch (err) {
        console.error('Native Google Auth Error:', err);
        setAuthError(err?.message || 'Google sign in was cancelled or requires Google Play Services.');
      } finally {
        setGoogleLoading(false);
      }
    } else {
      // Standard Web Browser OAuth
      try {
        triggerGoogleLogin();
      } catch (err) {
        console.error(err);
        setGoogleLoading(false);
      }
    }
  };

  return (
    <div className={`fixed inset-0 h-screen max-h-screen w-screen overflow-hidden flex items-center justify-center p-4 transition-colors duration-300 font-sans select-none relative ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500/30' 
        : 'bg-slate-50 text-slate-900 selection:bg-indigo-500/20'
    }`}>
      
      {/* Dynamic Ambient Background Glows & Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left vibrant Indigo/Blue blob */}
        <div className={`absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full blur-[100px] opacity-40 transition-all duration-700 ${
          isDarkMode ? 'bg-indigo-600/35' : 'bg-indigo-400/25'
        }`} />
        
        {/* Bottom-right Violet/Fuchsia blob */}
        <div className={`absolute -bottom-32 -right-32 w-[440px] h-[440px] rounded-full blur-[110px] opacity-35 transition-all duration-700 ${
          isDarkMode ? 'bg-violet-600/30' : 'bg-purple-400/25'
        }`} />
        
        {/* Bottom-left Cyan glow */}
        <div className={`absolute -bottom-24 left-1/4 w-[360px] h-[360px] rounded-full blur-[90px] opacity-30 transition-all duration-700 ${
          isDarkMode ? 'bg-cyan-500/20' : 'bg-sky-400/20'
        }`} />

        {/* Central Card Backlight Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[120px] opacity-25 ${
          isDarkMode ? 'bg-indigo-500/25' : 'bg-indigo-300/40'
        }`} />

        {/* Subtle Tech Grid / Dot Matrix with Radial Mask */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(#6366f1_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20 dark:opacity-25"
          style={{ 
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)' 
          }} 
        />
      </div>

      {/* Main Login Card Container */}
      <main className="relative z-10 w-full flex items-center justify-center">
        <div className={`w-full max-w-[420px] rounded-3xl p-5 sm:p-7 border backdrop-blur-xl transition-all duration-300 relative shadow-2xl flex-shrink-0 ${
          isDarkMode 
            ? 'shadow-black/70 border-slate-800/90 bg-slate-900/80 text-slate-100' 
            : 'shadow-indigo-950/10 border-slate-200/90 bg-white/90 text-slate-900'
        }`}>
          
          {/* Top subtle highlight line inside card */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          {/* Logo Badge & Header */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="relative mb-3 p-2.5 rounded-2xl bg-white shadow-md border border-slate-200/80 ring-4 ring-indigo-500/10 flex items-center justify-center">
              <img 
                src="/bit-logo.png" 
                alt="Reward Points Site" 
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Reward Points Site
            </h1>
            
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold border border-indigo-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Student RP Portal</span>
            </div>

            <p className={`text-xs mt-2.5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Sign in with your institutional Google account to explore your real-time reward points, activities, and achievements.
            </p>
          </div>

          {/* Feature Highlights Mini Pills */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
              isDarkMode 
                ? 'bg-slate-800/70 border-slate-700/70 text-slate-200' 
                : 'bg-slate-50/90 border-slate-200 text-slate-700 shadow-2xs'
            }`}>
              <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-[11px] font-bold tracking-tight">Live RP</span>
            </div>
            <div className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
              isDarkMode 
                ? 'bg-slate-800/70 border-slate-700/70 text-slate-200' 
                : 'bg-slate-50/90 border-slate-200 text-slate-700 shadow-2xs'
            }`}>
              <Trophy className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
              <span className="text-[11px] font-bold tracking-tight">Rankings</span>
            </div>
            <div className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
              isDarkMode 
                ? 'bg-slate-800/70 border-slate-700/70 text-slate-200' 
                : 'bg-slate-50/90 border-slate-200 text-slate-700 shadow-2xs'
            }`}>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="text-[11px] font-bold tracking-tight">Marks</span>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs">
              <div className="font-bold mb-0.5">Notice:</div>
              <div>{authError}</div>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleLoginClick}
            disabled={googleLoading}
            className={`w-full py-3 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 border transition-all duration-200 cursor-pointer active:scale-98 shadow-sm hover:shadow-md ${
              isDarkMode 
                ? 'border-slate-700 bg-slate-800/90 text-slate-100 hover:bg-slate-700 hover:border-slate-600' 
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-bold tracking-tight">
              {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </span>
          </button>

          {/* Security & Authentication Notice */}
          <div className={`mt-4 pt-3 border-t text-center ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/80'}`}>
            <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Use your <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>@bitsathy.ac.in</span> student email
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

// Transform API response item to standard student model
function transformApiStudent(apiItem) {
  if (!apiItem) return null;
  const rollNo = String(apiItem.roll_no || apiItem.rollNo || apiItem.id || '').toUpperCase().trim();

  // Find corresponding rich record in Master Spreadsheet dataset
  const masterRecord = Array.isArray(STUDENTS_INTERNAL_MARKS_LIST)
    ? STUDENTS_INTERNAL_MARKS_LIST.find(s => (s.rollNo || '').toUpperCase() === rollNo)
    : null;

  const name = String(masterRecord?.name || apiItem.student_name || apiItem.name || 'STUDENT').toUpperCase();
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0, 2) || 'ST';

  const balanceRaw = apiItem.balance_points !== undefined && apiItem.balance_points !== null
    ? String(apiItem.balance_points).replace(/,/g, '')
    : (masterRecord ? String(masterRecord.balancePoints || 0) : '0');
  const balancePts = (parseFloat(balanceRaw) || 0).toLocaleString();

  const cumulativeRaw = apiItem.cumulative_reward_points !== undefined && apiItem.cumulative_reward_points !== null
    ? String(apiItem.cumulative_reward_points).replace(/,/g, '')
    : (apiItem.cumulative_points !== undefined ? String(apiItem.cumulative_points).replace(/,/g, '') : (masterRecord ? String(masterRecord.cumulativePoints || balanceRaw) : balanceRaw));
  const cumulativePts = (parseFloat(cumulativeRaw) || 0).toLocaleString();

  const redeemedRaw = apiItem.redeemed_points !== undefined && apiItem.redeemed_points !== null
    ? String(apiItem.redeemed_points).replace(/,/g, '')
    : (masterRecord ? String(masterRecord.redeemedPoints || 0) : '0');
  const redeemedPts = (parseFloat(redeemedRaw) || 0).toLocaleString();

  const mentorName = masterRecord?.mentor || apiItem.mentor_name || apiItem.mentor || "BIT Faculty";
  const deptName = masterRecord?.department || apiItem.department || "COMPUTER TECHNOLOGY";
  const courseCode = masterRecord?.courseCode || apiItem.course_code || "B. Tech.";
  const yr = masterRecord?.year || apiItem.year || "IV";

  return {
    id: rollNo || "7376232CT109",
    name: name,
    initials: initials,
    department: deptName,
    course_code: courseCode,
    year: yr ? (String(yr).startsWith('Year') ? String(yr) : `Year ${yr}`) : "Year IV",
    mentor_name: mentorName,
    currentPoints: balancePts,
    cumulativePoints: cumulativePts,
    redeemedPoints: redeemedPts,
    avatarBg: "from-[#38c4ee] to-[#0ea5e9]",
    badge: "Verified BIT Student",
    email: masterRecord?.email || `${(rollNo || 'student').toLowerCase()}@bitsathy.ac.in`,
    cgpa: "8.92",
    activityBreakdown: masterRecord?.activityBreakdown || [],
    theoryCourses: masterRecord?.theoryCourses || [],
    labCourses: masterRecord?.labCourses || [],
    addonCourses: masterRecord?.addonCourses || [],
    ip1Total: masterRecord?.ip1Total || '0.00',
    ip2Total: masterRecord?.ip2Total || '0.00',
    grandTotal: masterRecord?.grandTotal || '0.00',
    history: [
      { id: 1, title: "Cumulative RP Earned", date: "Academic Year 2024-2025", points: `+${cumulativePts} RP`, category: "Activities", icon: Trophy, color: "text-amber-500 bg-amber-50" },
      { id: 2, title: "Redeemed Points", date: "Benefits & Vouchers", points: `-${redeemedPts} RP`, category: "Redemption", icon: Gift, color: "text-indigo-500 bg-indigo-50" },
      { id: 3, title: "Net Active Balance", date: "Current Academic Standing", points: `${balancePts} RP`, category: "Balance", icon: Award, color: "text-emerald-500 bg-emerald-50" }
    ],
    breakdown: [
      { label: "Active Net Balance", pts: parseFloat(balanceRaw) || 0, percent: 65, color: "bg-[#4f46e5]" },
      { label: "Cumulative Points", pts: parseFloat(cumulativeRaw) || 0, percent: 100, color: "bg-[#22d3ee]" },
      { label: "Redeemed Points", pts: parseFloat(redeemedRaw) || 0, percent: 15, color: "bg-amber-500" },
    ]
  };
}

function formatRelativeTime(isoString) {
  if (!isoString) return 'Just now';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}

// Interactive Animated Smiling Robot Face for Tara
function TaraRobotFace({ size = 44, mood = 'happy', className = '' }) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="taraBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="taraVisorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <filter id="taraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Antenna with Pulsing Light */}
        <g className="animate-tara-wiggle origin-bottom">
          <line x1="50" y1="18" x2="50" y2="8" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="6" r="4.5" fill="#38bdf8" className="animate-pulse" filter="url(#taraGlow)" />
        </g>

        {/* Ear Bolts */}
        <rect x="10" y="42" width="6" height="16" rx="3" fill="#6366f1" />
        <rect x="84" y="42" width="6" height="16" rx="3" fill="#6366f1" />

        {/* Robot Head Body */}
        <rect x="16" y="18" width="68" height="64" rx="22" fill="url(#taraBodyGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

        {/* Digital Screen Visor */}
        <rect x="23" y="27" width="54" height="46" rx="14" fill="url(#taraVisorGrad)" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />

        {/* Visor Reflection Line */}
        <path d="M28 32 Q 50 30 72 32" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />

        {/* Interactive Glowing Eyes */}
        {mood === 'happy' || mood === 'idle' ? (
          <g className="animate-tara-blink origin-center" filter="url(#taraGlow)">
            {/* Happy Smiling Curved Eyes */}
            <path d="M33 46 Q 39 37 45 46" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M55 46 Q 61 37 67 46" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Eye Sparkle Highlights */}
            <circle cx="39" cy="40" r="1.5" fill="#ffffff" />
            <circle cx="61" cy="40" r="1.5" fill="#ffffff" />
          </g>
        ) : mood === 'thinking' ? (
          <g filter="url(#taraGlow)">
            <ellipse cx="39" cy="44" rx="5" ry="5" fill="#f59e0b" className="animate-pulse" />
            <ellipse cx="61" cy="44" rx="5" ry="5" fill="#f59e0b" className="animate-pulse" />
          </g>
        ) : (
          <g filter="url(#taraGlow)">
            <ellipse cx="39" cy="44" rx="4.5" ry="4.5" fill="#22d3ee" />
            <ellipse cx="61" cy="44" rx="4.5" ry="4.5" fill="#22d3ee" />
          </g>
        )}

        {/* Cute Pink Rosy Cheeks */}
        <circle cx="30" cy="54" r="3.5" fill="#f43f5e" opacity="0.65" />
        <circle cx="70" cy="54" r="3.5" fill="#f43f5e" opacity="0.65" />

        {/* Sweet Smiling Glowing LED Mouth */}
        <path
          d="M40 56 Q 50 67 60 56"
          stroke="#38bdf8"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#taraGlow)"
        />
      </svg>
    </div>
  );
}

// Quick Portal Shortcuts Data
const BIT_PORTAL_SHORTCUTS = [
  {
    id: 'bip',
    name: 'BIP Portal',
    badge: 'Projects & Innovation',
    url: 'https://bip.bitsathy.ac.in',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    desc: 'BIT Innovation Platform for projects, hackathons & reviews'
  },
  {
    id: 'ps',
    name: 'PS Portal',
    badge: 'Special Labs & Skills',
    url: 'https://ps.bitsathy.ac.in',
    icon: Code,
    color: 'from-blue-600 to-indigo-600',
    desc: 'Periodic Skill development & Special Lab submissions'
  },
  {
    id: 'pcdp',
    name: 'PCDP App',
    badge: 'Career & Placements',
    url: 'https://pcdp.bitsathy.ac.in',
    icon: Briefcase,
    color: 'from-purple-600 to-indigo-600',
    desc: 'Personality & Career Development Program for placements & skill tests'
  },
  {
    id: 'webmail',
    name: 'BIT Webmail',
    badge: 'Institutional Mail',
    url: 'https://mail.google.com/a/bitsathy.ac.in',
    icon: Mail,
    color: 'from-red-500 to-rose-600',
    desc: 'Official college Gmail inbox for academic circulars & notices'
  },
  {
    id: 'wiki',
    name: 'BIT Wiki',
    badge: 'Campus Handbook',
    url: 'https://wiki.bitsathy.ac.in',
    icon: BookOpen,
    color: 'from-teal-500 to-cyan-600',
    desc: 'Campus guidelines, curriculum, club details, and knowledge base'
  },
  {
    id: 'website',
    name: 'BIT Website',
    badge: 'Official College',
    url: 'https://www.bitsathy.ac.in',
    icon: Globe,
    color: 'from-cyan-500 to-blue-600',
    desc: 'Official Bannari Amman Institute of Technology website'
  }
];

const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || (typeof atob !== 'undefined' ? atob('QVEuQWI4Uk42SnN2WklHOFQ4dW9fMklZUS0xbnRTWFZxTy1YYzNqTV84UXpPeXZ4NTBCR3c=') : '');

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Good Night';
}

function BitRobotChatAssistant({
  currentUser,
  student,
  yearlyAverages,
  leavesList,
  placementData,
  setActiveNav,
  isDarkMode
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeminiLive, setIsGeminiLive] = useState(true);
  const messagesEndRef = useRef(null);

  const studentName = currentUser?.name || student?.name || 'Student';
  const firstName = studentName.split(' ')[0] || 'Student';
  const currentPoints = student?.currentPoints || currentUser?.currentPoints || '0';
  const department = currentUser?.department || student?.department || 'Engineering & Technology';

  // Match full enriched student profile (mentor, 8 activity categories, marks)
  const matchedStudentRecord = useMemo(() => {
    const rId = (student?.id || student?.roll_no || student?.rollNo || currentUser?.id || currentUser?.rollNo || '').toString().toUpperCase().trim();
    const mail = (student?.email || currentUser?.email || '').toLowerCase().trim();
    return STUDENTS_INTERNAL_MARKS_LIST.find(s => 
      (rId && s.rollNo.toUpperCase() === rId) ||
      (mail && s.email && s.email.toLowerCase() === mail) ||
      (mail && s.rollNo && mail.includes(s.rollNo.toLowerCase()))
    ) || student || {};
  }, [student, currentUser]);

  const activeMentor = matchedStudentRecord?.mentor || 'Dr. ANANDAKUMAR K ISE';
  const activeRollNo = matchedStudentRecord?.rollNo || student?.id || student?.roll_no || 'CT109';
  const activeYear = matchedStudentRecord?.year || 'IV';
  const activeDept = matchedStudentRecord?.department || department;
  const activeBalanceRP = matchedStudentRecord?.balancePoints ?? (student?.currentPoints || currentUser?.currentPoints || '0');
  const activeCumulativeRP = matchedStudentRecord?.cumulativePoints ?? (student?.cumulativePoints || activeBalanceRP);
  const activeRedeemedRP = matchedStudentRecord?.redeemedPoints ?? (student?.redeemedPoints || '0');
  const activeActivities = matchedStudentRecord?.activityBreakdown || [];
  const activeTheoryCourses = matchedStudentRecord?.theoryCourses || [];
  const activeGrandTotal = matchedStudentRecord?.grandTotal || '40.50';

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${firstName}! 👋 I am **Tara**, your smiling BIT campus assistant.\n\nI can help you check your active Reward Points, Faculty Mentor, Internal Marks, Placements, today's Mess menu, or open college portals (BIP, PS, PCDP, Wiki, Website). Ask me anything or tap a quick shortcut below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shortcuts: true
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handlePortalClick = (portal) => {
    window.open(portal.url, '_blank', 'noopener,noreferrer');
    
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: `Open ${portal.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const botMsg = {
      id: `bot_${Date.now() + 1}`,
      sender: 'bot',
      text: `🚀 Launching **${portal.name}** (${portal.url})\n\n📌 *${portal.desc}*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      linkUrl: portal.url,
      linkText: `Open ${portal.name}`
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const getFallbackRuleReply = (queryText) => {
    const lower = queryText.toLowerCase().trim();
    let replyText = '';
    let replyNav = null;
    let replyLink = null;
    let replyLinkText = null;

    if (lower.includes('mentor') || lower.includes('faculty mentor') || lower.includes('advisor')) {
      replyText = `👨‍🏫 **Your Faculty Mentor**\n• Name: **${activeMentor}**\n• Student: **${studentName}** (${activeRollNo})\n• Department: **${activeDept}**\n\nYou can consult your mentor for internal mark reviews, special lab projects, and reward points approvals.`;
    } else if (lower.includes('internal mark') || lower.includes('cie') || lower.includes('ip1') || lower.includes('ip2') || lower.includes('theory course') || lower.includes('mark')) {
      const coursesStr = activeTheoryCourses.length > 0 
        ? activeTheoryCourses.map(c => `• **${c.code}** (${c.slot}): IP-1 = ${c.ip1 || '0.00'} | IP-2 = ${c.ip2 || '0.00'} | Total = **${c.total || '0.00'}**`).join('\n')
        : `• Total Theory Courses: ${matchedStudentRecord?.totalTheoryCount || 6}`;
      replyText = `📊 **Internal Marks Distribution**\n• Student: **${studentName}** (${activeRollNo})\n• Department: **${activeDept}** (Year ${activeYear})\n• Total Internal Marks: **${activeGrandTotal}**\n\n${coursesStr}`;
      replyNav = 'Internal Marks';
    } else if (lower.includes('p-skill') || lower.includes('pskill') || lower.includes('tac') || lower.includes('special lab') || lower.includes('activity') || lower.includes('breakdown') || lower.includes('hackathon')) {
      const actStr = activeActivities.length > 0
        ? activeActivities.map(a => `• **${a.label}**: **${a.points.toLocaleString()} RP** (${a.count} entries)`).join('\n')
        : `• P-Skill: 0 RP\n• TAC: 0 RP\n• Special Lab Initiatives: 0 RP`;
      replyText = `🎯 **8 Activity Points Breakdown**\n• Student: **${studentName}** (${activeRollNo})\n• Balance RP: **${activeBalanceRP} RP**\n\n${actStr}`;
      replyNav = 'Internal Marks';
    } else if (lower.includes('bip') || lower.includes('innovation') || lower.includes('project')) {
      replyText = `⚡ **BIP Portal (BIT Innovation Platform)**\nUse BIP for submitting your special lab project proposals, hackathons, reviews, and faculty evaluations.\n\n🌐 Portal Link: https://bip.bitsathy.ac.in`;
      replyLink = 'https://bip.bitsathy.ac.in';
      replyLinkText = 'Open BIP Portal';
    } else if (lower.includes('ps') || lower.includes('periodic')) {
      replyText = `💻 **PS Portal (Periodic Skills Portal)**\nAccess periodic skill assessments, coding tracks, and special lab problem statements.\n\n🌐 Portal Link: https://ps.bitsathy.ac.in`;
      replyLink = 'https://ps.bitsathy.ac.in';
      replyLinkText = 'Open PS Portal';
    } else if (lower.includes('pcdp') || lower.includes('career') || lower.includes('training') || lower.includes('placement app')) {
      replyText = `🎯 **PCDP App (Personality & Career Development Program)**\nAccess placement assessments, aptitude practice modules, mock interviews, and skill benchmarks.\n\n🌐 Portal Link: https://pcdp.bitsathy.ac.in`;
      replyLink = 'https://pcdp.bitsathy.ac.in';
      replyLinkText = 'Open PCDP App';
    } else if (lower.includes('wiki') || lower.includes('handbook') || lower.includes('rules')) {
      replyText = `📚 **BIT Wiki**\nThe official campus handbook containing curriculum outlines, club information, campus protocols, and student guides.\n\n🌐 Portal Link: https://wiki.bitsathy.ac.in`;
      replyLink = 'https://wiki.bitsathy.ac.in';
      replyLinkText = 'Open BIT Wiki';
    } else if (lower.includes('website') || lower.includes('college') || lower.includes('portal')) {
      replyText = `🌐 **Official BIT Website**\nDiscover campus events, department news, official circulars, and announcements.\n\n🌐 Portal Link: https://www.bitsathy.ac.in`;
      replyLink = 'https://www.bitsathy.ac.in';
      replyLinkText = 'Open BIT Website';
    } else if (lower.includes('point') || lower.includes('balance') || lower.includes('rp') || lower.includes('reward')) {
      replyText = `🏆 **Your Reward Points Status**\n• Student: **${studentName}** (${activeRollNo})\n• Active Balance: **${activeBalanceRP} RP**\n• Cumulative Earned: **${activeCumulativeRP} RP**\n• Redeemed: **${activeRedeemedRP} RP**\n\nKeep attending technical events, hackathons, and certifications to earn more points!`;
      replyNav = 'Dashboard';
    } else if (lower.includes('placement') || lower.includes('job') || lower.includes('salary') || lower.includes('drive')) {
      const totalPlaced = placementData?.totalStudentsPlaced || 510;
      const totalComp = placementData?.totalCompaniesVisited || 87;
      const batch = placementData?.targetBatch || '2023-2027 Batch';
      const topTier = placementData?.salaryTiers?.[0]?.offerCount || 17;
      replyText = `📰 **BIT Placements Overview (${batch})**\n• Total Students Placed: **${totalPlaced}**\n• Total Companies Visited: **${totalComp}**\n• Super Dream Offers (≥10 LPA): **${topTier} offers**\n\nCheck out the interactive breakdown, hero slider, and upcoming drives!`;
      replyNav = 'BIT Placements';
    } else if (lower.includes('mess') || lower.includes('food') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('breakfast')) {
      replyText = `🍽️ **Hostel Mess Menu**\nLive daily menus for Boys and Girls hostels with breakfast, lunch, snacks, and dinner schedules are available in the Mess Menu tab.`;
      replyNav = 'Mess Menu';
    } else if (lower.includes('leave') || lower.includes('holiday') || lower.includes('gp') || lower.includes('gate pass')) {
      const nextLeave = leavesList?.[0];
      replyText = `📅 **Academic Leave & Gate Pass Schedule**\n${nextLeave ? `• Next Event: **${nextLeave.name}** (${nextLeave.from_date} to ${nextLeave.to_date})` : '• You can view the full semester leave schedule and upcoming Gate Pass dates.'}`;
      replyNav = 'Leave Schedule';
    } else if (lower.includes('exam') || lower.includes('hall') || lower.includes('seat')) {
      replyText = `🪑 **Exam Hall & Seating Finder**\nFind your exact exam hall number, block, and desk number instantly using your register number.`;
      replyNav = 'Exam Seating';
    } else if (lower.includes('bus') || lower.includes('transport') || lower.includes('route')) {
      replyText = `🚌 **Campus Bus Routes & Transport**\nExplore bus timings, stop lists, and route maps across Coimbatore, Erode, Tirupur, Salem, Gobi, and Mettupalayam.`;
      replyNav = 'Bus Routes';
    } else if (lower.includes('faculty') || lower.includes('staff') || lower.includes('teacher') || lower.includes('hod')) {
      replyText = `👥 **Faculty & Staff Directory**\nSearch faculty by department, find office cabins, phone numbers, and official email addresses.`;
      replyNav = 'Faculty Directory';
    } else if (lower.includes('who are you') || lower.includes('your name') || lower.includes('tara')) {
      replyText = `🤖✨ I am **Tara**, your intelligent and smiling BIT campus assistant! I'm here to help you navigate college portals, track your Reward Points, find exam halls, and stay updated on placements.`;
    } else if (lower.includes('about') || lower.includes('who made') || lower.includes('developer') || lower.includes('creator') || lower.includes('contact') || lower.includes('email')) {
      replyText = `ℹ️ **About Us**\nThis is a third-party platform designed to help students easily track, earn, and redeem their reward points while accessing essential campus resources.\n\n📬 **Have queries or suggestions? Reach out:**\n• **Email:** dharineeshv18@gmail.com\n• **LinkedIn:** https://www.linkedin.com/in/dharineesh-v-8ba7022ba\n• **Developer:** **Dharineesh V** (Department of Computer Technology, B.Tech)`;
      replyLink = 'https://www.linkedin.com/in/dharineesh-v-8ba7022ba';
      replyLinkText = 'Connect on LinkedIn';
    } else {
      replyText = `😊 **Tara is here to help!** You can ask me about:\n• **Academics**: My RP Balance (${activeBalanceRP} RP), Mentor (${activeMentor}), Internal Marks (${activeGrandTotal})\n• **Portals**: BIP, PS, PCDP, Wiki, Website\n• **Campus Life**: Placements, Mess Menu, Leave Schedule, Bus Routes\n• **About Us**: Developer info & contact`;
    }

    return { replyText, replyNav, replyLink, replyLinkText };
  };

  const handleActionQuery = async (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    setInputValue('');
    setIsTyping(true);

    try {
      // System Prompt with deep BIT Sathy context & student profile
      const activitySummaryStr = activeActivities.length > 0 
        ? activeActivities.map(a => `  - ${a.label}: ${a.points.toLocaleString()} RP (${a.count} entries)`).join('\n')
        : '  - No activity breakdown available';

      const theoryCoursesStr = activeTheoryCourses.length > 0
        ? activeTheoryCourses.map(c => `  - ${c.code} (${c.slot}): IP-1 = ${c.ip1 || '0.00'}, IP-2 = ${c.ip2 || '0.00'}, Total = ${c.total || '0.00'}`).join('\n')
        : '  - Theory courses list available in Internal Marks view';

      const systemPrompt = `You are "Tara", the intelligent, cheerful, smiling, and highly accurate AI campus assistant for Bannari Amman Institute of Technology (BIT Sathy).

Current Active Student Profile (Ground Truth Data):
- Full Name: ${studentName}
- Roll Number: ${activeRollNo}
- Department: ${activeDept}
- Year of Study: Year ${activeYear}
- Course Code: ${matchedStudentRecord?.courseCode || 'B.Tech / B.E.'}
- Assigned Faculty Mentor: ${activeMentor}
- Active Balance Reward Points: ${activeBalanceRP} RP
- Cumulative Reward Points Earned: ${activeCumulativeRP} RP
- Redeemed Points: ${activeRedeemedRP} RP
- Total Internal Marks: ${activeGrandTotal} (Theory Courses: ${matchedStudentRecord?.totalTheoryCount || activeTheoryCourses.length || 6})

Student's Theory Courses & Internal Marks:
${theoryCoursesStr}

Student's 8 Activity Points Breakdown:
${activitySummaryStr}

Official College Portals & URLs:
- BIP Portal (BIT Innovation Platform): https://bip.bitsathy.ac.in (Project submissions, special lab reviews, hackathons)
- PS Portal (Periodic Skills Portal): https://ps.bitsathy.ac.in (Skill assessments, coding tracks, problem statements)
- PCDP App (Personality & Career Development Program): https://pcdp.bitsathy.ac.in (Placement training, aptitude, mock interviews)
- BIT Wiki: https://wiki.bitsathy.ac.in (Student handbook, campus rules, clubs, syllabus)
- Official BIT Website: https://www.bitsathy.ac.in (Campus news, circulars, department updates)

Key Campus Features:
- Dashboard: Active RP Balance, store to redeem gadgets, vouchers
- BIT Placements: ${placementData?.totalStudentsPlaced || 510}+ placed across ${placementData?.totalCompaniesVisited || 87}+ companies (Highest Tier: 10+ LPA)
- Mess Menu: Live breakfast, lunch, snacks, dinner schedules for boys & girls hostels
- Leave Schedule: Semester holidays & gate pass schedule (${leavesList?.[0]?.name ? `Next: ${leavesList[0].name} on ${leavesList[0].from_date}` : 'Scheduled academic leaves'})
- Exam Seating: Search exam hall, block, and desk allocation by register number
- Campus Bus Routes: Bus routes across Coimbatore, Erode, Tirupur, Salem, Gobi, Mettupalayam
- Faculty Directory: Cabin locations, contact numbers, official emails

About Us & Developer Contact:
- Third-party platform designed by Dharineesh V (Department of Computer Technology, B.Tech).
- Queries/Suggestions: Email: dharineeshv18@gmail.com | LinkedIn: https://www.linkedin.com/in/dharineesh-v-8ba7022ba

Response Guidelines:
- Answer cheerily, accurately, and helpfully using emojis 😊 ✨ 🚀 🏆 💡.
- Format responses cleanly with bold text and bullet points.
- ALWAYS use the exact student information provided above when asked about Mentor, Points, Marks, Activities, Roll Number, or Department.
- Provide portal links whenever relevant.`;

      // Build conversation contents for Gemini API (last 6 turns)
      const contents = currentHistory
        .filter(m => m.id !== 'welcome' && !m.id.startsWith('welcome_'))
        .slice(-6)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not found in environment');
      }

      // Resilient Gemini API Call with 1-step retry for 503 / network hiccups
      const makeGeminiRequest = async () => {
        return fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 800
              }
            })
          }
        );
      };

      let response = await makeGeminiRequest();
      if (response.status === 503 || response.status === 429) {
        // Wait 600ms and retry once on transient overload
        await new Promise(r => setTimeout(r, 600));
        response = await makeGeminiRequest();
      }

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('No response text from Gemini');
      }

      setIsGeminiLive(true);

      // Auto-detect links or internal tab triggers from user query and response
      let replyLink = null;
      let replyLinkText = null;
      let replyNav = null;

      const genLower = generatedText.toLowerCase();
      const queryLower = queryText.toLowerCase().trim();
      const isAboutQuery = queryLower.includes('about') || queryLower.includes('developer') || queryLower.includes('creator') || queryLower.includes('contact') || queryLower.includes('who made') || queryLower.includes('linkedin');

      if (isAboutQuery || genLower.includes('linkedin.com/in/dharineesh')) {
        replyLink = 'https://www.linkedin.com/in/dharineesh-v-8ba7022ba';
        replyLinkText = 'Connect on LinkedIn';
      } else if (queryLower.includes('bip') || genLower.includes('bip.bitsathy.ac.in')) {
        replyLink = 'https://bip.bitsathy.ac.in';
        replyLinkText = 'Open BIP Portal';
      } else if (queryLower.includes('ps portal') || queryLower === 'ps' || genLower.includes('ps.bitsathy.ac.in')) {
        replyLink = 'https://ps.bitsathy.ac.in';
        replyLinkText = 'Open PS Portal';
      } else if (queryLower.includes('pcdp') || genLower.includes('pcdp.bitsathy.ac.in')) {
        replyLink = 'https://pcdp.bitsathy.ac.in';
        replyLinkText = 'Open PCDP App';
      } else if (queryLower.includes('wiki') || genLower.includes('wiki.bitsathy.ac.in')) {
        replyLink = 'https://wiki.bitsathy.ac.in';
        replyLinkText = 'Open BIT Wiki';
      } else if (queryLower.includes('website') || queryLower.includes('college portal')) {
        replyLink = 'https://www.bitsathy.ac.in';
        replyLinkText = 'Open BIT Website';
      }

      if (queryLower.includes('internal mark') || queryLower.includes('marks') || queryLower.includes('cie') || queryLower.includes('breakdown')) {
        replyNav = 'Internal Marks';
      } else if (queryLower.includes('placement') || queryLower.includes('job') || queryLower.includes('salary package')) {
        replyNav = 'BIT Placements';
      } else if (queryLower.includes('mess') || queryLower.includes('food') || queryLower.includes('lunch') || queryLower.includes('dinner') || queryLower.includes('breakfast')) {
        replyNav = 'Mess Menu';
      } else if (queryLower.includes('leave') || queryLower.includes('gate pass') || queryLower.includes('holiday')) {
        replyNav = 'Leave Schedule';
      } else if (queryLower.includes('exam') || queryLower.includes('seating') || queryLower.includes('hall ticket')) {
        replyNav = 'Exam Seating';
      } else if (queryLower.includes('bus') || queryLower.includes('transport') || queryLower.includes('route')) {
        replyNav = 'Bus Routes';
      } else if (queryLower.includes('faculty') || queryLower.includes('staff') || queryLower.includes('hod')) {
        replyNav = 'Faculty Directory';
      } else if (queryLower.includes('reward point') || queryLower.includes('rp balance') || queryLower.includes('store') || queryLower.includes('redeem')) {
        replyNav = 'Dashboard';
      }

      const botMsg = {
        id: `bot_${Date.now() + 1}`,
        sender: 'bot',
        text: generatedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        navTab: replyNav,
        linkUrl: replyLink,
        linkText: replyLinkText,
        isGemini: true
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Gemini API fallback to local rules:', err);
      setIsGeminiLive(false);

      const fallback = getFallbackRuleReply(queryText);
      const botMsg = {
        id: `bot_${Date.now() + 1}`,
        sender: 'bot',
        text: fallback.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        navTab: fallback.replyNav,
        linkUrl: fallback.replyLink,
        linkText: fallback.replyLinkText,
        isGemini: false
      };

      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: `Chat refreshed! 👋 What would you like to check? Quick shortcuts are available below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        shortcuts: true
      }
    ]);
  };

  return (
    <>
      {/* Floating Robot Action Button (FAB with Smiling Tara) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[100] flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(prev => !prev);
          }}
          className={`group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full cursor-pointer transition-all duration-300 active:scale-95 shadow-2xl pointer-events-auto ${
            isOpen 
              ? 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/40 rotate-90' 
              : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 shadow-indigo-500/40 hover:scale-108 animate-float tara-avatar-glow'
          }`}
          title={isOpen ? 'Close Assistant' : 'Chat with Tara'}
          aria-label="Open Tara BIT Assistant"
        >
          {/* Animated Ambient Halo Glow */}
          {!isOpen && (
            <span className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 rounded-full blur-md opacity-60 group-hover:opacity-100 animate-pulse-glow -z-10 pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-200" />
          ) : (
            <TaraRobotFace size={40} mood="happy" className="group-hover:scale-110 transition-transform duration-200 pointer-events-none" />
          )}
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className={`fixed bottom-22 right-3.5 sm:right-6 w-[calc(100vw-28px)] sm:w-[440px] h-[580px] max-h-[82vh] rounded-3xl z-[110] flex flex-col shadow-2xl border backdrop-blur-2xl transition-all duration-200 overflow-hidden pointer-events-auto ${
          isDarkMode 
            ? 'bg-slate-900/95 border-slate-700/80 text-white shadow-black/80' 
            : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-indigo-950/20'
        }`}>
          {/* 1. Header with Tara Branding */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shadow-inner">
                <TaraRobotFace size={34} mood={isTyping ? 'thinking' : 'happy'} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">Tara</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-100 font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${isGeminiLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isTyping ? 'Tara is thinking...' : isGeminiLive ? 'AI Active • Ready to assist 😊' : 'Ready to assist 😊'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-xl hover:bg-white/15 text-indigo-100 hover:text-white transition-colors cursor-pointer"
                title="Restart Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-indigo-100 hover:text-white transition-colors cursor-pointer"
                title="Minimize Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm overflow-hidden p-0.5">
                    <TaraRobotFace size={24} mood="happy" />
                  </div>
                )}

                <div className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-xs'
                    : isDarkMode
                      ? 'bg-slate-800/90 border border-slate-700/60 text-slate-100 rounded-bl-xs'
                      : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}>
                  {/* Text Content */}
                  <div className="whitespace-pre-line font-normal">
                    {msg.text}
                  </div>

                  {/* Quick Action Link / Button if present */}
                  {msg.linkUrl && (
                    <a
                      href={msg.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-[11px] shadow-sm transition-all"
                    >
                      <span>{msg.linkText || 'Open Portal'}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                    </a>
                  )}

                  {/* Internal Navigation Tab Switcher */}
                  {msg.navTab && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav(msg.navTab);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                    >
                      <span>Go to {msg.navTab} Tab</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}

                  {/* Interactive Portal Shortcuts Inside Chat */}
                  {msg.shortcuts && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/30 space-y-2.5">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>College Portals:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {BIT_PORTAL_SHORTCUTS.map(portal => {
                            const IconComp = portal.icon;
                            return (
                              <button
                                key={portal.id}
                                type="button"
                                onClick={() => handlePortalClick(portal)}
                                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102 active:scale-98 ${
                                  isDarkMode 
                                    ? 'bg-slate-700/70 hover:bg-indigo-950/70 text-slate-100 hover:text-white border-slate-600 hover:border-indigo-400' 
                                    : 'bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 border-slate-200 hover:border-indigo-300'
                                }`}
                              >
                                <IconComp className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Open {portal.name.replace(' Portal', '')}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Quick Academic Actions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleActionQuery('What are my active reward points?')}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-colors cursor-pointer ${
                              isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-indigo-700 border-slate-200'
                            }`}
                          >
                            🏆 My RP Balance
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionQuery('Show latest placement updates')}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-colors cursor-pointer ${
                              isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-indigo-700 border-slate-200'
                            }`}
                          >
                            📰 Placements
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionQuery('What is today mess menu?')}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-colors cursor-pointer ${
                              isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-indigo-700 border-slate-200'
                            }`}
                          >
                            🍽️ Mess Menu
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionQuery('When is the next gate pass or holiday?')}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-colors cursor-pointer ${
                              isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-indigo-700 border-slate-200'
                            }`}
                          >
                            📅 Next Leave / GP
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionQuery('About Us')}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-colors cursor-pointer ${
                              isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-indigo-700 border-slate-200'
                            }`}
                          >
                            ℹ️ About Us
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1 text-right font-mono ${
                    msg.sender === 'user' ? 'text-indigo-200' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator with Tara Face */}
            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 flex items-center justify-center shrink-0 shadow-sm p-0.5">
                  <TaraRobotFace size={24} mood="thinking" />
                </div>
                <div className={`p-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5 ${
                  isDarkMode ? 'bg-slate-800 border border-slate-700/60' : 'bg-slate-100 border border-slate-200'
                }`}>
                  <span className="text-[11px] text-indigo-400 font-semibold mr-1">Tara is typing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3. Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleActionQuery(inputValue);
            }}
            className={`p-2.5 border-t shrink-0 flex items-center gap-2 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Tara anything or enter a portal name (BIP, PS, Wiki)..."
              className={`flex-1 px-3.5 py-2.5 rounded-2xl text-xs outline-none border transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
              }`}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export default function App() {
  const [sessionTimeoutNotice, setSessionTimeoutNotice] = useState(() => {
    try {
      const isLogged = localStorage.getItem('bit_rp_is_logged_in') === 'true';
      const lastActive = parseInt(localStorage.getItem('bit_rp_last_active') || '0', 10);
      if (isLogged && lastActive && Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
        return 'Session expired due to 10 minutes of inactivity. Please sign in again.';
      }
    } catch (e) {}
    return '';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      if (sessionTimeoutNotice) return false;
      const isLogged = localStorage.getItem('bit_rp_is_logged_in') === 'true';
      if (!isLogged) return false;
      const lastActive = parseInt(localStorage.getItem('bit_rp_last_active') || '0', 10);
      if (lastActive && Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
        localStorage.removeItem('bit_rp_is_logged_in');
        localStorage.removeItem('bit_rp_user');
        localStorage.removeItem('bit_rp_last_active');
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const isLogged = localStorage.getItem('bit_rp_is_logged_in') === 'true';
      const saved = localStorage.getItem('bit_rp_user');
      if (isLogged && saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Selected student currently displayed in dashboard
  const [displayedStudent, setDisplayedStudent] = useState(() => {
    try {
      const isLogged = localStorage.getItem('bit_rp_is_logged_in') === 'true';
      const saved = localStorage.getItem('bit_rp_user');
      if (isLogged && saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Live Notifications State & Persistence
  const [notifications, setNotifications] = useState(() => {
    try {
      const isLogged = localStorage.getItem('bit_rp_is_logged_in') === 'true';
      if (!isLogged) return [];
      const savedUser = localStorage.getItem('bit_rp_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      const userKey = parsedUser?.email?.toLowerCase();
      if (!userKey) return [];
      const saved = localStorage.getItem(`bit_notifications_${userKey}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all'); // 'all' | 'unread' | 'points' | 'placements'
  const [activeToast, setActiveToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Universal Notification Dispatcher: Syncs state, localStorage, in-app floating toast & native Web Notification
  const dispatchNotification = useCallback((notif) => {
    setNotifications(prev => {
      const isDuplicate = prev.some(n => 
        n.title === notif.title && 
        Math.abs(new Date(n.timestamp || Date.now()).getTime() - Date.now()) < 20000
      );
      if (isDuplicate) return prev;
      const updated = [notif, ...prev.filter(n => n.id !== notif.id)].slice(0, 50);
      try {
        const userKey = currentUser?.email?.toLowerCase() || 'default';
        localStorage.setItem(`bit_notifications_${userKey}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Show floating toast
    setActiveToast(notif);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 6000);

    // Trigger Native OS / Browser Notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.description,
          icon: '/favicon.ico',
          tag: notif.id
        });
      } catch (e) {
        console.warn('Native notification error:', e);
      }
    }
  }, [currentUser?.email]);

  // Sync notifications when logged-in user changes
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.email) {
      setNotifications([]);
      return;
    }
    const userKey = currentUser.email.toLowerCase();
    try {
      const saved = localStorage.getItem(`bit_notifications_${userKey}`);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications([]);
      }
    } catch (e) {}
  }, [currentUser?.email, isLoggedIn]);

  // Live Google Sheet Reward Points Auto-Sync for Logged-In Student & Displayed Student
  useEffect(() => {
    const studentToSync = displayedStudent || currentUser;
    if (!studentToSync?.id && !studentToSync?.roll_no) return;

    const rollNo = (studentToSync.id || studentToSync.roll_no || studentToSync.rollNo || '').trim().toUpperCase();
    const dept = studentToSync.department || 'CT';

    async function syncLiveSheetPoints() {
      try {
        const liveRecord = await fetchStudentRewardPointsFromSheet(rollNo, dept);
        if (liveRecord && liveRecord.balance_points !== undefined) {
          const livePointsStr = liveRecord.balance_points.toString();
          
          if (currentUser && (currentUser.id === rollNo || currentUser.roll_no === rollNo)) {
            if (currentUser.currentPoints !== livePointsStr || currentUser.balance_points !== liveRecord.balance_points) {
              setCurrentUser(prev => ({
                ...prev,
                currentPoints: livePointsStr,
                balance_points: liveRecord.balance_points
              }));
            }
          }

          if (displayedStudent && (displayedStudent.id === rollNo || displayedStudent.roll_no === rollNo)) {
            if (displayedStudent.currentPoints !== livePointsStr || displayedStudent.balance_points !== liveRecord.balance_points) {
              setDisplayedStudent(prev => ({
                ...prev,
                currentPoints: livePointsStr,
                balance_points: liveRecord.balance_points
              }));
            }
          }
        }
      } catch (err) {
        console.warn('[LiveSheetSync] Unable to sync live points:', err);
      }
    }

    syncLiveSheetPoints();
  }, [currentUser?.id, displayedStudent?.id]);

  // Ref locks to avoid duplicate processing on rapid re-renders
  const lastProcessedRpRef = useRef(null);
  const lastProcessedPlacementRef = useRef(null);

  // Automated Reward Points Change Detector (Logged-In User Only)
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.email) return;

    const userKey = currentUser.email.toLowerCase();
    const currentPointsRaw = (currentUser?.currentPoints || currentUser?.balance_points || '0').toString();
    const currentPoints = parseFloat(currentPointsRaw.replace(/,/g, '')) || 0;

    // Skip if already processed in-memory for this session/value
    if (lastProcessedRpRef.current === `${userKey}_${currentPoints}`) return;

    const storageKey = `bit_last_rp_${userKey}`;
    const notifKey = `bit_notifications_${userKey}`;
    const storedRpStr = localStorage.getItem(storageKey);

    if (storedRpStr !== null) {
      const storedRp = parseFloat(storedRpStr);
      if (!isNaN(storedRp) && currentPoints !== storedRp) {
        lastProcessedRpRef.current = `${userKey}_${currentPoints}`;
        const diff = currentPoints - storedRp;
        const isCredit = diff > 0;
        const newNotif = {
          id: `rp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: isCredit ? 'points_credited' : 'points_debited',
          title: isCredit 
            ? `🎉 +${diff.toLocaleString()} Reward Points Credited!` 
            : `📉 -${Math.abs(diff).toLocaleString()} Reward Points Deducted!`,
          description: isCredit 
            ? `Your reward points increased from ${storedRp.toLocaleString()} RP to ${currentPoints.toLocaleString()} RP.` 
            : `Your reward points decreased from ${storedRp.toLocaleString()} RP to ${currentPoints.toLocaleString()} RP.`,
          points: diff,
          balance: currentPoints,
          timestamp: new Date().toISOString(),
          read: false,
          linkTab: 'Dashboard'
        };

        // Immediately update storage before state to prevent race conditions
        try {
          localStorage.setItem(storageKey, currentPoints.toString());
        } catch (e) {}

        dispatchNotification(newNotif);
      } else {
        lastProcessedRpRef.current = `${userKey}_${currentPoints}`;
      }
    } else {
      // First-time snapshot for this student
      lastProcessedRpRef.current = `${userKey}_${currentPoints}`;
      try {
        localStorage.setItem(storageKey, currentPoints.toString());
      } catch (e) {}
      
      // Show personalized welcome notification for newly logged-in student
      const studentName = currentUser?.name || currentUser?.student_name || currentUser?.displayName || currentUser?.roll_no || 'Student';
      const welcomeNotif = {
        id: `welcome_${Date.now()}`,
        type: 'welcome',
        title: `👋 Welcome back, ${studentName}!`,
        description: `Welcome to the Rewards Points Portal! Your active balance is ${currentPoints.toLocaleString()} RP.`,
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'Dashboard'
      };
      setNotifications(prev => {
        const hasWelcome = prev.some(n => n.type === 'welcome');
        if (!hasWelcome) {
          dispatchNotification(welcomeNotif);
        }
        return prev;
      });
    }
  }, [isLoggedIn, currentUser?.email, currentUser?.name, currentUser?.student_name, currentUser?.displayName, currentUser?.roll_no, currentUser?.currentPoints, currentUser?.balance_points]);

  // Automated Placement Bulletin Update Detector
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.email || !BIT_DAILY_PLACEMENT_DATA?.lastUpdated) return;

    const userKey = currentUser?.email?.toLowerCase() || 'default';
    const notifKey = `bit_notifications_${userKey}`;
    const placementKey = `bit_last_placement_${userKey}`;
    const currentEdition = `${BIT_DAILY_PLACEMENT_DATA.editionDate || ''}_${BIT_DAILY_PLACEMENT_DATA.lastUpdated || ''}`;

    if (lastProcessedPlacementRef.current === `${userKey}_${currentEdition}`) return;

    const savedEdition = localStorage.getItem(placementKey);

    if (savedEdition && savedEdition !== currentEdition) {
      lastProcessedPlacementRef.current = `${userKey}_${currentEdition}`;
      const recentDrive = BIT_DAILY_PLACEMENT_DATA.upcomingDrives?.[0]?.company || 'On-Campus Drive';
      const placementNotif = {
        id: `placement_${Date.now()}`,
        type: 'placement_update',
        title: `📰 Placement Updated (${BIT_DAILY_PLACEMENT_DATA.targetBatch})`,
        description: `${BIT_DAILY_PLACEMENT_DATA.totalStudentsPlaced} students placed across ${BIT_DAILY_PLACEMENT_DATA.totalCompaniesVisited || 60}+ companies. New drive: ${recentDrive}.`,
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'BIT Placements'
      };

      try {
        localStorage.setItem(placementKey, currentEdition);
      } catch (e) {}

      dispatchNotification(placementNotif);
    } else {
      lastProcessedPlacementRef.current = `${userKey}_${currentEdition}`;
      try {
        localStorage.setItem(placementKey, currentEdition);
      } catch (e) {}
    }
  }, [isLoggedIn, BIT_DAILY_PLACEMENT_DATA?.lastUpdated, BIT_DAILY_PLACEMENT_DATA?.editionDate, BIT_DAILY_PLACEMENT_DATA?.targetBatch, currentUser?.email]);

  // Browser Push Notification State & Permission Handler
  const [pushPermission, setPushPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPushPermission(res);
        if (res === 'granted') {
          dispatchNotification({
            id: `perm_${Date.now()}`,
            type: 'system',
            title: '🔔 Notifications Enabled!',
            description: 'You will receive real-time alerts for reward points, placement records, and campus updates!',
            timestamp: new Date().toISOString(),
            read: false,
            linkTab: 'BIT Placements'
          });
        }
      } catch (err) {
        console.warn('Push permission error:', err);
      }
    }
  };

  // Notification Helper Actions
  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      try {
        const userKey = currentUser?.email?.toLowerCase() || 'default';
        localStorage.setItem(`bit_notifications_${userKey}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [currentUser?.email]);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      try {
        const userKey = currentUser?.email?.toLowerCase() || 'default';
        localStorage.setItem(`bit_notifications_${userKey}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [currentUser?.email]);

  const deleteNotification = useCallback((id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      try {
        const userKey = currentUser?.email?.toLowerCase() || 'default';
        localStorage.setItem(`bit_notifications_${userKey}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [currentUser?.email]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    try {
      const userKey = currentUser?.email?.toLowerCase() || 'default';
      localStorage.setItem(`bit_notifications_${userKey}`, JSON.stringify([]));
    } catch (e) {}
  }, [currentUser?.email]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (notificationFilter === 'unread') return !n.read;
      if (notificationFilter === 'points') return n.type === 'points_credited' || n.type === 'points_debited' || n.type === 'welcome';
      if (notificationFilter === 'placements') return n.type === 'placement_update';
      return true;
    });
  }, [notifications, notificationFilter]);

  // Leave Schedule State
  const [leavesList, setLeavesList] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [leavesError, setLeavesError] = useState('');
  const [selectedLeaveFilter, setSelectedLeaveFilter] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'GP' | 'HOLIDAY'
  const [leaveSearchQuery, setLeaveSearchQuery] = useState('');

  // Faculty & Staff Directory State
  const [facultyList, setFacultyList] = useState([]);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const [facultyError, setFacultyError] = useState('');
  const [selectedFacultyDept, setSelectedFacultyDept] = useState('ALL');
  const [facultySearchQuery, setFacultySearchQuery] = useState('');
  const [copiedFacultyContact, setCopiedFacultyContact] = useState(null);
  const facultyChipsRef = useRef(null);

  // Exam Hall Finder State
  const [examRegNo, setExamRegNo] = useState('');
  const [examDate, setExamDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [examHallResult, setExamHallResult] = useState(null);
  const [loadingExamHall, setLoadingExamHall] = useState(false);
  const [examHallSearched, setExamHallSearched] = useState(false);
  const [examHallError, setExamHallError] = useState('');

  // BIT Map Navigation State
  const [mapFromLocation, setMapFromLocation] = useState('SF Block (CT & Special Functions)');
  const [mapToLocation, setMapToLocation] = useState('Main Auditorium');

  // BIT Daily Newspaper & Placement State
  const [newspaperDate, setNewspaperDate] = useState('2026-09-05');
  const [isNewspaperFullscreen, setIsNewspaperFullscreen] = useState(false);
  const [copiedNewspaperLink, setCopiedNewspaperLink] = useState(false);
  const [placementSearchQuery, setPlacementSearchQuery] = useState('');
  const [placementSelectedTier, setPlacementSelectedTier] = useState('All');
  const [placementActiveTab, setPlacementActiveTab] = useState('insights'); // 'insights' | 'page6' | 'page7'
  const [placementKpiIndex, setPlacementKpiIndex] = useState(0);

  // Theme Mode: 'system' (default), 'dark', or 'light'
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = localStorage.getItem('bit_rp_theme');
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    } catch (e) {}
    return 'system'; // System default
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const isDarkMode = themeMode === 'system' ? systemIsDark : themeMode === 'dark';

  const setTheme = (mode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem('bit_rp_theme', mode);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const next = isDarkMode ? 'light' : 'dark';
    setTheme(next);
  };

  // PWA Web App Installation State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };
  
  // Dynamic API state for yearly averages (Official BIT Batch Benchmarks)
  const [yearlyAverages, setYearlyAverages] = useState({
    year_1: 0,
    year_2: 2173,
    year_3: 3333,
    year_4: 1923
  });
  const [loadingAverages, setLoadingAverages] = useState(true);

  // Dynamic API state for rewards overview & Transaction Ledger
  const [rewardsData, setRewardsData] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [rewardsTotal, setRewardsTotal] = useState(0);
  const [rewardsPage, setRewardsPage] = useState(1);
  const [overviewLedgerScope, setOverviewLedgerScope] = useState('my'); // 'my' | 'all'
  const [overviewCategoryFilter, setOverviewCategoryFilter] = useState('ALL');
  const [overviewSearchQuery, setOverviewSearchQuery] = useState('');
  const [overviewVisibleCount, setOverviewVisibleCount] = useState(25);

  // Dynamic API state for Student Detail Modal & Inspect Ledger
  const [modalRewardsData, setModalRewardsData] = useState([]);
  const [loadingModalRewards, setLoadingModalRewards] = useState(false);
  const [modalCategoryFilter, setModalCategoryFilter] = useState('ALL');
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  // Live Campus Weather State (Open-Meteo API)
  const [weatherData, setWeatherData] = useState(null);

  // Live BIT PS Portal Token State
  const [psToken, setPsToken] = useState(() => {
    try {
      return localStorage.getItem('bit_ps_token') || '';
    } catch (e) {
      return '';
    }
  });

  // 1-Click Sync Bridge Receiver: Capture ?sync_token= from PS Portal or BroadcastChannel
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      // 1. Check URL query parameters (e.g. ?sync_token=eyJ...)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('sync_token') || params.get('ps_token') || params.get('token');
      if (urlToken) {
        localStorage.setItem('bit_ps_token', urlToken);
        setPsToken(urlToken);
        const cleanPath = window.location.pathname;
        window.history.replaceState({}, document.title, cleanPath);
      }

      // 2. Listen for cross-window message from 1-Click Sync Bridge
      const handleWindowMessage = (e) => {
        if (e.data && e.data.type === 'BIT_PS_SYNC_TOKEN' && e.data.token) {
          localStorage.setItem('bit_ps_token', e.data.token);
          setPsToken(e.data.token);
        }
      };
      window.addEventListener('message', handleWindowMessage);
      return () => window.removeEventListener('message', handleWindowMessage);
    } catch (e) {}
  }, []);

  // Campus Mess & Dining Menu State
  const [messHostel, setMessHostel] = useState('boys');
  const [selectedMessDate, setSelectedMessDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [messData, setMessData] = useState(null);
  const [loadingMess, setLoadingMess] = useState(false);
  const [messError, setMessError] = useState('');

  // Leaderboard State
  const [selectedDeptLeaderboard, setSelectedDeptLeaderboard] = useState(null);
  const [deptLeaderboardList, setDeptLeaderboardList] = useState([]);
  const [loadingDeptLeaderboard, setLoadingDeptLeaderboard] = useState(false);
  const [deptFilterQuery, setDeptFilterQuery] = useState('');
  const [deptStudentSearch, setDeptStudentSearch] = useState('');
  const [selectedLeaderboardYear, setSelectedLeaderboardYear] = useState('ALL');

  // Admin Uploaded Schedules (Leave Schedule, Boys Menu, Girls Menu)
  const [adminSchedules, setAdminSchedules] = useState(() => {
    try {
      const saved = localStorage.getItem('bit_admin_uploaded_documents');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      leave_schedule: null,
      boys_menu: null,
      girls_menu: null
    };
  });

  const [activeMenuTab, setActiveMenuTab] = useState('BOYS'); // 'BOYS' | 'GIRLS'
  const [viewingPdfModal, setViewingPdfModal] = useState(null); // { title, dataUrl, fileName } | null
  const [leaveViewMode, setLeaveViewMode] = useState('list'); // 'list' | 'pdf'

  // Load all uploaded PDFs reliably from IndexedDB on startup
  useEffect(() => {
    loadAllPdfDocumentsFromDB().then((docs) => {
      if (docs) {
        setAdminSchedules(prev => ({
          leave_schedule: docs.leave_schedule || prev.leave_schedule,
          boys_menu: docs.boys_menu || prev.boys_menu,
          girls_menu: docs.girls_menu || prev.girls_menu
        }));
      }
    });
  }, []);

  const handleAdminPdfUpload = (type, file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF file (.pdf)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      const docObj = {
        title: type === 'leave_schedule' 
          ? 'Official Academic Leave & GP Schedule' 
          : (type === 'boys_menu' ? 'Boys Hostel Mess & Dining Menu' : 'Girls Hostel Mess & Dining Menu'),
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser?.name || 'Admin',
        dataUrl: dataUrl,
        isPublished: true
      };

      // Persist in IndexedDB (handles multi-megabyte PDFs without browser limits)
      await savePdfDocumentToDB(type, docObj);

      setAdminSchedules(prev => ({
        ...prev,
        [type]: docObj
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdminPdfRemove = async (type) => {
    if (window.confirm('Are you sure you want to remove this schedule document?')) {
      await removePdfDocumentFromDB(type);
      setAdminSchedules(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  // Admin Console & Google Sheets Analytics State
  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    try {
      return localStorage.getItem('bit_gsheet_url') || '';
    } catch (e) {
      return '';
    }
  });

  const [sheetInputUrl, setSheetInputUrl] = useState(() => {
    try {
      return localStorage.getItem('bit_gsheet_url') || '';
    } catch (e) {
      return '';
    }
  });

  const [sheetSyncStatus, setSheetSyncStatus] = useState(() => {
    try {
      return localStorage.getItem('bit_gsheet_url') ? 'connected' : 'standby';
    } catch (e) {
      return 'standby';
    }
  });

  const [showScriptCode, setShowScriptCode] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [logFilterQuery, setLogFilterQuery] = useState('');
  const [logFilterAction, setLogFilterAction] = useState('ALL');
  const [logFilterDept, setLogFilterDept] = useState('ALL');

  // Restricted Admin Permission: Only Dharineesh and Kaushi
  const isAdminUser = useMemo(() => {
    if (!currentUser) return false;
    const email = (currentUser.email || '').toLowerCase().trim();
    const id = (currentUser.id || '').toUpperCase().trim();
    const ADMIN_EMAILS = [
      'dharineesh.ct23@bitsathy.ac.in',
      'kaushi.ct23@bitsathy.ac.in'
    ];
    return ADMIN_EMAILS.includes(email) || id === '7376232CT109';
  }, [currentUser]);

  const [cloudProvider, setCloudProvider] = useState(() => {
    try {
      return localStorage.getItem('bit_cloud_provider') || 'firebase';
    } catch (e) {
      return 'firebase';
    }
  });

  const DEFAULT_FIREBASE_DB_URL = 'https://rewards-site-7a5a8-default-rtdb.firebaseio.com';

  const [firebaseDbUrl, setFirebaseDbUrl] = useState(() => {
    try {
      return localStorage.getItem('bit_firebase_url') || DEFAULT_FIREBASE_DB_URL;
    } catch (e) {
      return DEFAULT_FIREBASE_DB_URL;
    }
  });

  const [firebaseInputUrl, setFirebaseInputUrl] = useState(() => {
    try {
      return localStorage.getItem('bit_firebase_url') || DEFAULT_FIREBASE_DB_URL;
    } catch (e) {
      return DEFAULT_FIREBASE_DB_URL;
    }
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('bit_activity_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(l => l && !['log-1', 'log-2', 'log-3', 'log-4', 'log-5', 'log-6', 'log-7', 'log-8'].includes(l.id));
      }
    } catch (e) {}
    return [];
  });

  // Master PS Session & Proxy Gateway State
  const [psMasterTokenInput, setPsMasterTokenInput] = useState('');
  const [psSessionInfo, setPsSessionInfo] = useState(null);
  const [psTokenSaveStatus, setPsTokenSaveStatus] = useState('idle'); // idle | saving | success | error
  const [proxyTestRoll, setProxyTestRoll] = useState('7376232CT109');
  const [proxyTestStatus, setProxyTestStatus] = useState('idle'); // idle | testing | success | error
  const [proxyTestResult, setProxyTestResult] = useState(null);
  const [proxyTestLatency, setProxyTestLatency] = useState(null);

  // Load existing PS Session from Firebase
  const fetchPsSessionInfo = useCallback(async () => {
    try {
      const fbUrl = (firebaseDbUrl || DEFAULT_FIREBASE_DB_URL).replace(/\/$/, '');
      const res = await fetch(`${fbUrl}/ps_session.json`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setPsSessionInfo(data);
          if (data.active_token && !psMasterTokenInput) {
            setPsMasterTokenInput(data.active_token);
          }
        }
      }
    } catch (e) {}
  }, [firebaseDbUrl, psMasterTokenInput]);

  useEffect(() => {
    if (activeNav === 'Admin Console' && isAdminUser) {
      fetchPsSessionInfo();
    }
  }, [activeNav, isAdminUser, fetchPsSessionInfo]);

  // Save / Sync Master PS Token to Firebase
  const handleSaveMasterPsToken = async () => {
    if (!psMasterTokenInput.trim()) return;
    setPsTokenSaveStatus('saving');
    try {
      const fbUrl = (firebaseDbUrl || DEFAULT_FIREBASE_DB_URL).replace(/\/$/, '');
      const sessionPayload = {
        active_token: psMasterTokenInput.trim(),
        updated_at: Date.now(),
        updated_by: currentUser?.email || 'admin'
      };
      await fetch(`${fbUrl}/ps_session.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPayload)
      });
      setPsSessionInfo(sessionPayload);
      setPsTokenSaveStatus('success');
      setTimeout(() => setPsTokenSaveStatus('idle'), 3000);
    } catch (e) {
      setPsTokenSaveStatus('error');
      setTimeout(() => setPsTokenSaveStatus('idle'), 4000);
    }
  };

  // Test live proxy search query
  const handleTestProxyQuery = async () => {
    const query = (proxyTestRoll || '7376232CT109').trim().toUpperCase();
    setProxyTestStatus('testing');
    setProxyTestResult(null);
    const start = performance.now();
    try {
      const res = await bitcentralFetch(`/search?q=${encodeURIComponent(query)}`);
      const latency = Math.round(performance.now() - start);
      setProxyTestLatency(latency);
      if (res.ok) {
        const data = await res.json();
        setProxyTestResult(data);
        setProxyTestStatus('success');
      } else {
        setProxyTestStatus('error');
        setProxyTestResult({ error: `HTTP ${res.status}: ${res.statusText}` });
      }
    } catch (err) {
      const latency = Math.round(performance.now() - start);
      setProxyTestLatency(latency);
      setProxyTestStatus('error');
      setProxyTestResult({ error: err.message });
    }
  };

  // Fetch real-time logs from Firebase Database with student overriding/deduplication
  const fetchFirebaseLogs = async (urlOverride) => {
    const targetUrl = (urlOverride || firebaseDbUrl || localStorage.getItem('bit_firebase_url') || DEFAULT_FIREBASE_DB_URL).trim().replace(/\/$/, '');
    if (!targetUrl || !targetUrl.startsWith('http')) return;
    
    setSheetSyncStatus('pinging');
    try {
      // 1. First attempt to fetch from /active_users.json (unique per student)
      let remoteList = [];
      try {
        const activeRes = await fetch(`${targetUrl}/active_users.json`);
        if (activeRes.ok) {
          const activeData = await activeRes.json();
          if (activeData && typeof activeData === 'object') {
            remoteList = Object.entries(activeData).map(([key, val]) => ({
              ...val,
              id: val.id || key
            }));
          }
        }
      } catch (e) {}

      // 2. If active_users is empty, fallback to /logs.json with deduplication by student identity
      if (remoteList.length === 0) {
        const res = await fetch(`${targetUrl}/logs.json`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            const rawList = Object.entries(data).map(([key, val]) => ({
              ...val,
              id: val.id || key
            }));
            // Deduplicate: keep ONLY the newest event per student
            const studentMap = new Map();
            rawList.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
            for (const log of rawList) {
              const k = (log.roll_no || log.email || log.name || '').toUpperCase().trim();
              if (k && !studentMap.has(k)) {
                studentMap.set(k, log);
              }
            }
            remoteList = Array.from(studentMap.values());
          }
        }
      }

      remoteList.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      if (remoteList.length > 0) {
        setActivityLogs(remoteList);
        try {
          localStorage.setItem('bit_activity_logs', JSON.stringify(remoteList));
        } catch (e) {}
      }
      setSheetSyncStatus('connected');
    } catch (e) {
      console.warn('Firebase sync error:', e);
      setSheetSyncStatus('connected');
    }
  };

  // Auto-fetch from Firebase on interval and when Admin Console is active
  useEffect(() => {
    fetchFirebaseLogs();
    const interval = setInterval(() => {
      fetchFirebaseLogs();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeNav]);

  // Log activity helper (saves locally & overrides student presence in Firebase & Google Sheets)
  const logActivity = (student, action = 'Login') => {
    if (!student) return;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const browser = /Edg/i.test(ua) ? 'Edge' : /Chrome/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : /Firefox/i.test(ua) ? 'Firefox' : 'Browser';
    const os = /Android/i.test(ua) ? 'Android' : /iPhone|iPad/i.test(ua) ? 'iOS' : /Windows/i.test(ua) ? 'Windows' : /Mac/i.test(ua) ? 'Mac' : 'Device';
    const deviceStr = `${os} (${browser})`;

    const rollNo = (student.id || student.roll_no || student.rollNo || 'Unknown').trim().toUpperCase();
    const studentName = student.name || student.student_name || 'BIT Student';
    const dept = student.department || student.dept || 'Computer Technology';
    const studentEmail = student.email || `${rollNo.toLowerCase()}@bitsathy.ac.in`;

    const newEntry = {
      id: `student-${rollNo}`,
      name: studentName,
      roll_no: rollNo,
      department: dept,
      email: studentEmail,
      action: action,
      device: deviceStr,
      timestamp: new Date().toISOString(),
      isOnline: action !== 'Logout' && action !== 'Session Expired'
    };

    // Override the student's entry in local state so same name is never duplicated
    setActivityLogs(prev => {
      const filtered = prev.filter(l => {
        const existingRoll = (l.roll_no || l.id || '').toUpperCase().trim();
        const existingName = (l.name || '').toUpperCase().trim();
        return existingRoll !== rollNo && existingName !== studentName.toUpperCase().trim();
      });
      const updated = [newEntry, ...filtered].slice(0, 499);
      try {
        localStorage.setItem('bit_activity_logs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 1. Send / Override in Firebase Realtime Database
    const fUrl = localStorage.getItem('bit_firebase_url') || DEFAULT_FIREBASE_DB_URL;
    if (fUrl && fUrl.startsWith('http')) {
      const cleanFUrl = fUrl.trim().replace(/\/$/, '');
      const sanitizedKey = (rollNo || studentEmail || studentName).replace(/[\.\#\$\/\[\]]/g, '_');
      try {
        // Update/override unique student slot in active_users
        fetch(`${cleanFUrl}/active_users/${encodeURIComponent(sanitizedKey)}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry)
        }).catch((err) => console.warn('Firebase active user update failed:', err));

        // Also post to raw audit log
        fetch(`${cleanFUrl}/logs.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry)
        }).catch(() => {});
      } catch (e) {}
    }

    // 2. Send to Google Sheets Webhook if configured
    const gsheetUrl = localStorage.getItem('bit_gsheet_url');
    if (gsheetUrl && gsheetUrl.startsWith('http')) {
      try {
        fetch(gsheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry)
        }).catch(() => {});
      } catch (e) {}
    }
  };

  // Save Firebase URL & Sync
  const handleSaveFirebaseUrl = () => {
    const cleaned = firebaseInputUrl.trim().replace(/\/$/, '');
    try {
      localStorage.setItem('bit_firebase_url', cleaned);
      localStorage.setItem('bit_cloud_provider', 'firebase');
      setFirebaseDbUrl(cleaned);
      if (cleaned) {
        setSheetSyncStatus('connected');
        fetchFirebaseLogs(cleaned);
        alert('🔥 Firebase Realtime Database URL saved! Syncing live data...');
      } else {
        setSheetSyncStatus('standby');
      }
    } catch (e) {}
  };

  const handleTestFirebasePing = async () => {
    const cleaned = firebaseInputUrl.trim().replace(/\/$/, '');
    if (!cleaned) {
      alert('Please enter your Firebase Realtime Database URL first.');
      return;
    }
    setSheetSyncStatus('pinging');
    try {
      const testObj = {
        id: `test-${Date.now()}`,
        name: 'ADMIN TEST PING',
        roll_no: '7376232CT109',
        department: 'Computer Technology',
        email: 'dharineesh.ct23@bitsathy.ac.in',
        action: 'Test Ping',
        device: 'Admin Console (Firebase)',
        timestamp: new Date().toISOString()
      };
      const res = await fetch(`${cleaned}/logs.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testObj)
      });
      if (res.ok) {
        setSheetSyncStatus('connected');
        alert('🔥 Test Ping successfully saved to Firebase Realtime DB! Now fetching latest logs...');
        fetchFirebaseLogs(cleaned);
      } else {
        setSheetSyncStatus('connected');
        alert(`Firebase responded with status ${res.status}. Check your Realtime Database rules (.read: true, .write: true).`);
      }
    } catch (err) {
      setSheetSyncStatus('connected');
      alert(`Could not connect to Firebase: ${err.message}. Make sure the URL is correct.`);
    }
  };

  // Google Sheets Save & Test Ping
  const handleSaveGoogleSheetUrl = () => {
    try {
      localStorage.setItem('bit_gsheet_url', sheetInputUrl.trim());
      localStorage.setItem('bit_cloud_provider', 'gsheet');
      setGoogleSheetUrl(sheetInputUrl.trim());
      if (sheetInputUrl.trim()) {
        setSheetSyncStatus('connected');
      } else {
        setSheetSyncStatus('standby');
      }
    } catch (e) {}
  };

  const handleTestGoogleSheetPing = async () => {
    if (!sheetInputUrl.trim()) {
      alert('Please enter your Google Apps Script Webhook URL first.');
      return;
    }
    setSheetSyncStatus('pinging');
    try {
      await fetch(sheetInputUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'ADMIN TEST PING',
          roll_no: '7376232CT109',
          department: 'Computer Technology',
          email: 'dharineesh.ct23@bitsathy.ac.in',
          action: 'Test Ping',
          device: 'Admin Console'
        })
      });
      setSheetSyncStatus('connected');
      alert('✅ Test Ping sent successfully! Check your Google Sheet to see the new row.');
    } catch (err) {
      setSheetSyncStatus('connected');
      alert('Ping dispatched to Google Sheet URL.');
    }
  };

  // Export Logs to CSV
  const handleExportLogsCSV = () => {
    if (activityLogs.length === 0) {
      alert('No activity logs to export.');
      return;
    }
    const headers = ['Timestamp', 'Student Name', 'Roll Number', 'Department', 'Email', 'Action', 'Device / OS'];
    const rows = activityLogs.map(l => [
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.name}"`,
      `"${l.roll_no}"`,
      `"${l.department}"`,
      `"${l.email}"`,
      `"${l.action}"`,
      `"${l.device}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bit_rewards_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear Activity Logs
  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear the local activity logs?')) {
      setActivityLogs([]);
      try {
        localStorage.removeItem('bit_activity_logs');
      } catch (e) {}
    }
  };

  // Computed Admin Analytics Metrics
  const adminMetrics = useMemo(() => {
    const totalLogs = activityLogs.length;
    const uniqueUsersSet = new Set(activityLogs.map(l => (l.roll_no || '').toUpperCase()));
    const totalUniqueUsers = uniqueUsersSet.size;

    const todayStr = new Date().toISOString().slice(0, 10);
    const activeToday = activityLogs.filter(l => l.timestamp && l.timestamp.startsWith(todayStr)).length;
    const totalSearches = activityLogs.filter(l => l.action === 'Search').length;

    let mobileCount = 0;
    let desktopCount = 0;
    activityLogs.forEach(l => {
      if (l.device && (l.device.includes('Android') || l.device.includes('iOS') || l.device.includes('Mobile'))) {
        mobileCount++;
      } else {
        desktopCount++;
      }
    });

    const mobilePercent = totalLogs > 0 ? Math.round((mobileCount / totalLogs) * 100) : 0;
    const desktopPercent = totalLogs > 0 ? (100 - mobilePercent) : 0;

    // Dept breakdown
    const deptCounts = {};
    activityLogs.forEach(l => {
      const d = l.department || 'Computer Technology';
      deptCounts[d] = (deptCounts[d] || 0) + 1;
    });

    const topDepts = Object.entries(deptCounts)
      .map(([name, count]) => ({
        name,
        count,
        percent: totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalLogs,
      totalUniqueUsers,
      activeToday,
      totalSearches,
      mobilePercent,
      desktopPercent,
      topDepts
    };
  }, [activityLogs]);

  const normalizeStudentYear = (yearStr, rollNo) => {
    const s = String(yearStr || '').trim().toUpperCase();
    if (s === 'IV' || s === '4' || s === 'YEAR IV' || s === '4TH' || s === 'IV YR' || s.startsWith('IV')) return 'Year IV';
    if (s === 'III' || s === '3' || s === 'YEAR III' || s === '3RD' || s === 'III YR' || s.startsWith('III')) return 'Year III';
    if (s === 'II' || s === '2' || s === 'YEAR II' || s === '2ND' || s === 'II YR' || s.startsWith('II')) return 'Year II';
    if (s === 'I' || s === '1' || s === 'YEAR I' || s === '1ST' || s === 'I YR' || s === 'I') return 'Year I';

    const roll = String(rollNo || '').trim();
    if (roll.startsWith('737623')) return 'Year IV';
    if (roll.startsWith('737624')) return 'Year III';
    if (roll.startsWith('737625')) return 'Year II';
    if (roll.startsWith('737626')) return 'Year I';
    return 'Year IV';
  };

  const formatLeaderboardStudent = (item) => {
    const rollNo = (item.roll_no || item.rollNo || item.id || '').toString().toUpperCase().trim();
    const name = (item.student_name || item.name || `Student (${rollNo})`).toString().trim();
    const balanceRaw = (item.balance_points ?? item.balancePoints ?? item.currentPoints ?? item.numBalance ?? '0').toString().replace(/,/g, '');
    const cumulativeRaw = (item.cumulative_points ?? item.cumulativePoints ?? item.numCumulative ?? balanceRaw).toString().replace(/,/g, '');
    const redeemedRaw = (item.redeemed_points ?? item.redeemedPoints ?? '0').toString().replace(/,/g, '');

    const numBalance = parseFloat(balanceRaw) || 0;
    const numCumulative = parseFloat(cumulativeRaw) || numBalance;
    const numRedeemed = parseFloat(redeemedRaw) || 0;
    const normYear = normalizeStudentYear(item.year || item.normalizedYear, rollNo);

    return {
      ...item,
      id: rollNo,
      roll_no: rollNo,
      rollNo: rollNo,
      name: name,
      student_name: name,
      normalizedYear: normYear,
      mentor_name: item.mentor_name || item.mentor || 'Dr. ANANDAKUMAR K ISE',
      numPoints: numBalance,
      numBalance: numBalance,
      numCumulative: numCumulative,
      numRedeemed: numRedeemed,
      displayPoints: numBalance.toLocaleString(),
      displayBalance: numBalance.toLocaleString(),
      displayCumulative: numCumulative.toLocaleString(),
      displayRedeemed: numRedeemed.toLocaleString()
    };
  };

  const isStudentInDepartment = (student, deptId) => {
    const roll = (student?.roll_no || student?.rollNo || student?.id || '').toString().trim().toUpperCase();
    const studentDept = (student?.department || '').toString().trim().toUpperCase();
    const deptNorm = (deptId || '').trim().toUpperCase();

    switch (deptNorm) {
      case 'CT':
        return (roll.includes('CT') || studentDept === 'COMPUTER TECHNOLOGY' || studentDept === 'CT') && !roll.includes('MTRS');
      case 'CSE':
      case 'CS':
        return (roll.includes('CS') || studentDept === 'COMPUTER SCIENCE AND ENGINEERING' || studentDept === 'CSE') && !roll.includes('CSBS') && !roll.includes('CSD') && !roll.includes('CB') && !roll.includes('CD');
      case 'AI&DS':
      case 'AD':
        return roll.includes('AD') || studentDept.includes('ARTIFICIAL INTELLIGENCE AND DATA') || studentDept.includes('AI & DS') || studentDept.includes('AI&DS');
      case 'AIML':
      case 'AL':
      case 'AM':
        return roll.includes('AL') || roll.includes('AM') || studentDept.includes('MACHINE LEARNING') || studentDept === 'AIML';
      case 'IT':
        return roll.includes('IT') || studentDept === 'INFORMATION TECHNOLOGY' || studentDept === 'IT';
      case 'ECE':
      case 'EC':
        return (roll.includes('EC') || studentDept.includes('ELECTRONICS AND COMMUNICATION')) && !roll.includes('EIE') && !roll.includes('EI');
      case 'EEE':
      case 'EE':
        return roll.includes('EE') || studentDept.includes('ELECTRICAL AND ELECTRONICS');
      case 'MECH':
      case 'ME':
        return (roll.includes('ME') || studentDept.includes('MECHANICAL')) && !roll.includes('MZ') && !roll.includes('MT') && !roll.includes('MC') && !studentDept.includes('MECHATRONICS');
      case 'EIE':
      case 'EI':
        return roll.includes('EI') || studentDept.includes('INSTRUMENTATION');
      case 'CSBS':
      case 'CB':
        return roll.includes('CB') || studentDept.includes('BUSINESS SYSTEMS') || studentDept === 'CSBS';
      case 'AGRI':
      case 'AG':
        return roll.includes('AG') || studentDept.includes('AGRICULTURAL') || studentDept === 'AGRI';
      case 'BT':
        return roll.includes('BT') || studentDept === 'BIOTECHNOLOGY' || studentDept === 'BT';
      case 'CSD':
      case 'CD':
        return roll.includes('CD') || studentDept.includes('DESIGN') || studentDept === 'CSD';
      case 'CIVIL':
      case 'CE':
        return roll.includes('CE') || studentDept.includes('CIVIL') || studentDept === 'CIVIL';
      case 'BIOMEDICAL':
      case 'BM':
        return roll.includes('BM') || studentDept.includes('BIOMEDICAL') || studentDept === 'BM';
      case 'FD':
        return roll.includes('FD') || studentDept.includes('FOOD') || studentDept === 'FD';
      case 'FT':
        return roll.includes('FT') || studentDept.includes('FASHION') || studentDept === 'FT';
      case 'ISE':
      case 'IS':
      case 'SE':
        return roll.includes('SE') || roll.includes('IS') || studentDept.includes('INFORMATION SCIENCE') || studentDept === 'ISE';
      case 'MTRS':
      case 'MZ':
      case 'MT':
      case 'MC':
        return roll.includes('MZ') || roll.includes('MT') || roll.includes('MC') || studentDept.includes('MECHATRONICS') || studentDept === 'MTRS';
      default:
        return roll.includes(deptNorm);
    }
  };

  const handleViewDepartmentLeaderboard = async (dept) => {
    setSelectedDeptLeaderboard(dept);
    setLoadingDeptLeaderboard(true);
    setDeptLeaderboardList([]);
    setDeptStudentSearch('');
    setSelectedLeaderboardYear('ALL');

    try {
      // 1. Fetch live from official Google Sheet for this department
      const sheetStudents = await fetchDepartmentSheetData(dept.id || dept.name || 'CT');
      if (sheetStudents && sheetStudents.length > 0) {
        // Filter strictly to this department
        const strictlyMatched = sheetStudents.filter(s => isStudentInDepartment(s, dept.id || dept.name));
        if (strictlyMatched.length > 0) {
          const formatted = strictlyMatched.map(formatLeaderboardStudent).sort((a, b) => b.numBalance - a.numBalance);
          setDeptLeaderboardList(formatted);
          setLoadingDeptLeaderboard(false);
          return;
        }
      }

      // 2. Strict in-memory student database filter (from STUDENTS_INTERNAL_MARKS_LIST & STUDENTS_DATABASE)
      const studentMap = new Map();
      const combinedSource = [...(STUDENTS_INTERNAL_MARKS_LIST || []), ...(STUDENTS_DATABASE || [])];

      combinedSource.forEach(s => {
        const rId = (s.rollNo || s.id || s.roll_no || '').toString().toUpperCase().trim();
        if (rId && !studentMap.has(rId) && isStudentInDepartment(s, dept.id || dept.name)) {
          studentMap.set(rId, formatLeaderboardStudent(s));
        }
      });

      const sorted = Array.from(studentMap.values()).sort((a, b) => {
        if (b.numBalance !== a.numBalance) return b.numBalance - a.numBalance;
        return b.numCumulative - a.numCumulative;
      });

      setDeptLeaderboardList(sorted);
    } catch (err) {
      console.error('Error fetching department leaderboard:', err);
      const fallbackList = (STUDENTS_INTERNAL_MARKS_LIST || [])
        .filter(s => isStudentInDepartment(s, dept.id || dept.name))
        .map(formatLeaderboardStudent);
      setDeptLeaderboardList(fallbackList);
    } finally {
      setLoadingDeptLeaderboard(false);
    }
  };

  // Fetch live campus hostel mess menu with date support and instant official 30-day schedule fallback
  const fetchMessMenu = async (hostel = messHostel, date = selectedMessDate) => {
    setLoadingMess(true);
    setMessError('');
    try {
      // Immediate local resolution of official September 2026 dataset
      const localMenu = getCampusMessMenu(hostel, date);
      setMessData(localMenu);

      // Attempt live proxy update if bitcentral server has real-time overrides
      try {
        const url = date 
          ? `/mess?hostel=${encodeURIComponent(hostel)}&date=${encodeURIComponent(date)}`
          : `/mess?hostel=${encodeURIComponent(hostel)}`;
        const res = await bitcentralFetch(url);
        if (res.ok) {
          const liveData = await res.json();
          if (liveData && liveData.full_menu && (liveData.full_menu.breakfast?.length || liveData.full_menu.lunch?.length)) {
            setMessData(liveData);
          }
        }
      } catch (innerErr) {
        // Local dataset already active
      }
    } catch (e) {
      console.warn('Mess menu fetch error:', e);
      setMessData(getCampusMessMenu(hostel, date));
    } finally {
      setLoadingMess(false);
    }
  };

  const changeMessDateBy = (days) => {
    const parts = (selectedMessDate || '').split('-');
    const curr = parts.length === 3 ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)) : new Date();
    curr.setDate(curr.getDate() + days);
    const year = curr.getFullYear();
    const month = String(curr.getMonth() + 1).padStart(2, '0');
    const day = String(curr.getDate()).padStart(2, '0');
    setSelectedMessDate(`${year}-${month}-${day}`);
  };

  const setMessDateToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedMessDate(`${year}-${month}-${day}`);
  };

  useEffect(() => {
    if (activeNav === 'Menu Details') {
      fetchMessMenu(messHostel, selectedMessDate);
    }
  }, [activeNav, messHostel, selectedMessDate]);

  // Fetch official college leave schedule
  const fetchLeavesSchedule = async () => {
    setLoadingLeaves(true);
    setLeavesError('');
    try {
      setLeavesList(COLLEGE_HOLIDAYS_AND_LEAVES || []);
    } catch (e) {
      console.warn('Leaves schedule error:', e);
      setLeavesList(COLLEGE_HOLIDAYS_AND_LEAVES || []);
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchLeavesSchedule();
  }, []);

  // Fetch campus faculty & staff directory from BIT Central
  const fetchFacultyDirectory = async () => {
    setLoadingFaculty(true);
    setFacultyError('');
    try {
      setFacultyList(FACULTY_DIRECTORY_DATA || []);
    } catch (e) {
      console.warn('Faculty directory error:', e);
      setFacultyList(FACULTY_DIRECTORY_DATA || []);
    } finally {
      setLoadingFaculty(false);
    }
  };

  useEffect(() => {
    if (activeNav === 'Faculty Directory' && facultyList.length === 0) {
      fetchFacultyDirectory();
    }
  }, [activeNav]);

  // Sync exam register number with active logged in student
  useEffect(() => {
    if (currentUser && (currentUser.id || currentUser.register_no)) {
      setExamRegNo(currentUser.register_no || currentUser.id);
    }
  }, [currentUser]);

  // Fetch Exam Hall & Seating allocation from BIT Central
  const fetchExamHall = async (regNo = examRegNo, date = examDate) => {
    const cleanReg = (regNo || '').trim().toUpperCase();
    if (!cleanReg) {
      setExamHallError('Please enter your Register / Roll Number.');
      return;
    }
    setLoadingExamHall(true);
    setExamHallError('');
    setExamHallSearched(true);
    try {
      const records = EXAM_HALL_INDEX_DATA[cleanReg];
      if (records && records.length > 0) {
        const first = records[0];
        setExamHallResult({
          hall_no: first.hallNo,
          course_code: first.courseCode,
          all_sessions: records,
          register_no: cleanReg
        });
      } else {
        setExamHallResult(null);
        setExamHallError('Currently no exam hall is allocated for you for the selected schedule.');
      }
    } catch (e) {
      console.warn('Exam hall lookup error:', e);
      setExamHallResult(null);
      setExamHallError('Currently no exam hall is allocated for you for the selected schedule.');
    } finally {
      setLoadingExamHall(false);
    }
  };

    // Fetch live rewards history with granular P-Skill course certifications, individual events & activities
  useEffect(() => {
    if (!displayedStudent || !displayedStudent.id) return;
    async function fetchRewards() {
      setLoadingRewards(true);
      try {
        let roll = (displayedStudent.id || displayedStudent.roll_no || '').toString().trim().toUpperCase();
        if (roll.includes('.') || roll.includes('@')) {
          const { rollId } = await resolveStudentRollAndProfile(roll, displayedStudent.name || '');
          if (rollId) roll = rollId;
        }

        const masterRecord = Array.isArray(STUDENTS_INTERNAL_MARKS_LIST)
          ? STUDENTS_INTERNAL_MARKS_LIST.find(s => (s.rollNo || '').toUpperCase() === roll)
          : null;

        const dbStudent = Array.isArray(STUDENTS_DATABASE)
          ? STUDENTS_DATABASE.find(s => (s.id || '').toUpperCase() === roll)
          : null;

        let eventLogs = (STUDENT_EVENT_LOGS_MAP && STUDENT_EVENT_LOGS_MAP[roll]) || masterRecord?.eventLogs || [];
        try {
          const liveLogs = await fetchLiveStudentEventLogs(roll);
          if (Array.isArray(liveLogs) && liveLogs.length > 0) {
            // Prefer live logs from Google Sheets
            eventLogs = liveLogs;
          }
        } catch (e) {
          console.warn('[LiveLogs] Fallback to mapped logs:', e);
        }

        const activities = [];

        // 1. Student Verified Activities from database if available
        if (dbStudent && Array.isArray(dbStudent.history)) {
          dbStudent.history.forEach((h, hIdx) => {
            const pts = parseFloat(String(h.points || '0').replace(/[^0-9.]/g, '')) || 0;
            activities.push({
              id: `db-act-${hIdx}`,
              activity_name: h.title,
              course_name: h.title,
              date: h.date || 'Academic Year 2024-2025',
              activity_type: h.category || 'Event',
              reward_points: pts.toLocaleString(),
              type: 'positive'
            });
          });
        }

        // 2. Add granular individual event participation & penalty logs from sheets
        if (Array.isArray(eventLogs) && eventLogs.length > 0) {
          eventLogs.forEach(ev => {
            const isPS = ev.isPS !== undefined ? ev.isPS : ((ev.activity_type || '').toUpperCase().includes('P SKILL') || (ev.activity_name || '').toUpperCase().includes('LEVEL'));
            activities.push({
              id: ev.id,
              sl_no: ev.sl_no || '',
              code: ev.code || ev.activity_code || '',
              activity_code: ev.code || ev.activity_code || '',
              activity_name: ev.activity_name || ev.name,
              course_name: ev.course_name || ev.name,
              date: ev.date || "Academic Year 2024-2025",
              activity_type: ev.activity_type || (ev.points < 0 ? "Penalty" : (isPS ? "P Skill" : "Event")),
              reward_points: Math.abs(ev.points).toLocaleString(),
              points: ev.points,
              type: ev.points < 0 ? "negative" : "positive",
              organizer: ev.organizer || "",
              email: ev.email || "",
              isPS
            });
          });
        }

        // 3. Add Master Sheet 8-Category Activities (for categories not covered by individual logs)
        if (masterRecord && Array.isArray(masterRecord.activityBreakdown)) {
          masterRecord.activityBreakdown.forEach((act) => {
            const pts = typeof act.points === 'number' ? act.points : parseFloat(String(act.points || '0').replace(/,/g, ''));
            if (pts > 0) {
              let title = act.label;
              let actType = act.label.split(' ')[0] || 'Technical';

              if (act.id === 'pskill') {
                title = 'P-Skill';
                actType = 'P Skill';
              } else if (act.id === 'initiatives') {
                title = 'Student Initiatives & GP Challenge (BPI)';
                actType = 'Initiative';
              } else if (act.id === 'interview_extra') {
                title = 'Interview & Extra-Curricular Assessment';
                actType = 'Interview';
              }

              // Check if already covered by positive individual logs
              const hasDirectLogs = eventLogs.some(ev => {
                if (ev.points <= 0) return false;
                if (act.id === 'pskill' && (ev.activity_type.toUpperCase().includes('P SKILL') || ev.activity_type.toUpperCase().includes('PSKILL'))) return true;
                if (act.id === 'initiatives' && ev.activity_type.toUpperCase().includes('INITIATIVE')) return true;
                return false;
              });

              if (!hasDirectLogs && !activities.some(a => a.activity_name.startsWith(title))) {
                activities.push({
                  activity_name: `${title}${act.count > 1 ? ` (${act.count} Events)` : ''}`,
                  course_name: title,
                  date: 'Academic Year 2024-2025',
                  activity_type: actType,
                  reward_points: pts.toLocaleString(),
                  type: 'positive'
                });
              }
            }
          });
        }

        setRewardsData(activities);
        setRewardsTotal(activities.length);
      } catch (err) {
        console.error('Error fetching rewards overview:', err);
        setRewardsData([]);
        setRewardsTotal(0);
      } finally {
        setLoadingRewards(false);
      }
    }
    fetchRewards();
  }, [displayedStudent?.id]);

    // Load rewards history specifically for selectedStudent in the Detail Modal (ONLY RP Activities)
  useEffect(() => {
    if (!isModalOpen || !selectedStudent?.id) return;
    let isMounted = true;
    async function fetchModalRewards() {
      setLoadingModalRewards(true);
      try {
        const roll = String(selectedStudent.id || selectedStudent.roll_no || '').toUpperCase().trim();
        const masterRecord = Array.isArray(STUDENTS_INTERNAL_MARKS_LIST)
          ? STUDENTS_INTERNAL_MARKS_LIST.find(s => (s.rollNo || '').toUpperCase() === roll)
          : null;

        let eventLogs = (STUDENT_EVENT_LOGS_MAP && STUDENT_EVENT_LOGS_MAP[roll]) || masterRecord?.eventLogs || [];
        try {
          const liveLogs = await fetchLiveStudentEventLogs(roll);
          if (Array.isArray(liveLogs) && liveLogs.length > 0) {
            // Prefer live logs from Google Sheets
            eventLogs = liveLogs;
          }
        } catch (e) {
          console.warn('[LiveLogs] Fallback to mapped logs:', e);
        }

        const activities = [];

        const initialRaw = masterRecord?.initialPoints || selectedStudent.initialPoints || 0;

        // 1. Student Verified Activities from database if available
        const studentDbRecord = Array.isArray(STUDENTS_DATABASE)
          ? STUDENTS_DATABASE.find(s => (s.id || '').toUpperCase() === roll)
          : null;

        if (studentDbRecord && Array.isArray(studentDbRecord.history)) {
          studentDbRecord.history.forEach((h, hIdx) => {
            const pts = parseFloat(String(h.points || '0').replace(/[^0-9.]/g, '')) || 0;
            activities.push({
              id: `db-act-${hIdx}`,
              activity_name: h.title,
              course_name: h.title,
              date: h.date || 'Academic Year 2024-2025',
              activity_type: h.category || 'Event',
              reward_points: pts.toLocaleString(),
              type: 'positive'
            });
          });
        }

        // 1b. Carry-In / Previous Semester Verified Points
        const initNum = parseFloat(String(initialRaw).replace(/,/g, '')) || 0;
        if (initNum > 0) {
          activities.push({
            activity_name: "Carry-In / Previous Semester Verified Points",
            course_name: "Carry-In Reward Points",
            date: "Academic Year 2024-2025",
            activity_type: "Carry-In",
            reward_points: initNum.toLocaleString(),
            type: "positive"
          });
        }



        // 2. Individual Event Participation & Penalty Logs
        if (Array.isArray(eventLogs) && eventLogs.length > 0) {
          eventLogs.forEach(ev => {
            const isPS = ev.isPS !== undefined ? ev.isPS : ((ev.activity_type || '').toUpperCase().includes('P SKILL') || (ev.activity_name || '').toUpperCase().includes('LEVEL'));
            activities.push({
              id: ev.id,
              sl_no: ev.sl_no || '',
              code: ev.code || ev.activity_code || '',
              activity_code: ev.code || ev.activity_code || '',
              activity_name: ev.activity_name || ev.name,
              course_name: ev.course_name || ev.name,
              date: ev.date || "Academic Year 2024-2025",
              activity_type: ev.activity_type || (ev.points < 0 ? "Penalty" : (isPS ? "P Skill" : "Event")),
              reward_points: Math.abs(ev.points).toLocaleString(),
              points: ev.points,
              type: ev.points < 0 ? "negative" : "positive",
              organizer: ev.organizer || "",
              email: ev.email || "",
              isPS
            });
          });
        }

        // 3. Add Master Sheet 8-Category Activities (for categories not covered by direct logs)
        if (masterRecord && Array.isArray(masterRecord.activityBreakdown)) {
          masterRecord.activityBreakdown.forEach((act) => {
            const pts = typeof act.points === 'number' ? act.points : parseFloat(String(act.points || '0').replace(/,/g, ''));
            if (pts > 0) {
              let title = act.label;
              let actType = act.label.split(' ')[0] || 'Technical';

              if (act.id === 'pskill') {
                title = 'P-Skill';
                actType = 'P Skill';
              } else if (act.id === 'initiatives') {
                title = 'Student Initiatives & GP Challenge (BPI)';
                actType = 'Initiative';
              }

              const hasDirectLogs = eventLogs.some(ev => {
                if (ev.points <= 0) return false;
                if (act.id === 'pskill' && (ev.activity_type.toUpperCase().includes('P SKILL') || ev.activity_type.toUpperCase().includes('PSKILL'))) return true;
                if (act.id === 'initiatives' && ev.activity_type.toUpperCase().includes('INITIATIVE')) return true;
                return false;
              });

              if (!hasDirectLogs && !activities.some(a => a.activity_name.startsWith(title))) {
                activities.push({
                  activity_name: `${title}${act.count > 1 ? ` (${act.count} Events)` : ''}`,
                  course_name: title,
                  date: 'Academic Year 2024-2025',
                  activity_type: actType,
                  reward_points: pts.toLocaleString(),
                  type: 'positive'
                });
              }
            }
          });
        }

        if (isMounted) {
          setModalRewardsData(activities);
        }
      } catch (err) {
        console.error('Error fetching modal rewards:', err);
        if (isMounted) setModalRewardsData([]);
      } finally {
        if (isMounted) setLoadingModalRewards(false);
      }
    }
    fetchModalRewards();
    return () => { isMounted = false; };
  }, [isModalOpen, selectedStudent?.id]);

  // Initial load: fetch profile from v2/profile (only for active logged-in session)
  useEffect(() => {
    async function fetchInitialStudent() {
      const isLogged = localStorage.getItem('bit_rp_is_logged_in') === 'true';
      if (!isLogged) return;

      let savedUser = null;
      try {
        const saved = localStorage.getItem('bit_rp_user');
        if (saved) savedUser = JSON.parse(saved);
      } catch (e) {}

      if (!savedUser?.email) return;
      const targetEmail = savedUser.email;

      try {
        const { rollId, profileApiData: profileApi, searchApiData: searchApi } = await resolveStudentRollAndProfile(targetEmail, savedUser?.name || '');
        const roll = rollId;

        const name = (savedUser?.name || profileApi?.name || searchApi?.student_name || roll).trim().toUpperCase();
        const initials = savedUser?.initials || name.split(/\s+/).map(n => n[0]).filter(Boolean).join('').slice(0, 2) || roll.slice(0, 2);
        const photoUrl = savedUser?.picture || savedUser?.photo_url || profileApi?.photo_url || null;

        const balanceRaw = searchApi?.balance_points ? searchApi.balance_points.replace(/,/g, '') : (savedUser?.currentPoints ? savedUser.currentPoints.toString().replace(/,/g, '') : '0');
        const balancePts = parseFloat(balanceRaw || '0').toLocaleString();
        const cumulativeRaw = searchApi?.cumulative_reward_points ? searchApi.cumulative_reward_points.replace(/,/g, '') : (savedUser?.cumulativePoints ? savedUser.cumulativePoints.toString().replace(/,/g, '') : balanceRaw);
        const cumulativePts = parseFloat(cumulativeRaw || '0').toLocaleString();
        const redeemedRaw = searchApi?.redeemed_points ? searchApi.redeemed_points.replace(/,/g, '') : (savedUser?.redeemedPoints ? savedUser.redeemedPoints.toString().replace(/,/g, '') : '0');
        const redeemedPts = parseFloat(redeemedRaw || '0').toLocaleString();

        const userObj = {
          ...(savedUser || {}),
          id: roll,
          name: name,
          initials: initials,
          department: profileApi?.department || searchApi?.department || savedUser?.department || "Computer Technology",
          course_code: searchApi?.course_code || savedUser?.course_code || "B. Tech.",
          batch: profileApi?.batch || savedUser?.batch || "2023 - 2027",
          year: searchApi?.year ? `Year ${searchApi.year}` : (savedUser?.year || "Year IV"),
          mentor_name: searchApi?.mentor_name || savedUser?.mentor_name || "Dr. ANANDAKUMAR K ISE",
          picture: photoUrl,
          photo_url: photoUrl,
          avatarBg: savedUser?.avatarBg || "from-[#38c4ee] to-[#0ea5e9]",
          badge: "Verified BIT Student",
          email: targetEmail,
          currentPoints: balancePts,
          cumulativePoints: cumulativePts,
          redeemedPoints: redeemedPts,
          history: savedUser?.history || [],
          breakdown: savedUser?.breakdown || []
        };

        setDisplayedStudent(userObj);
        setCurrentUser(userObj);

        try {
          if (localStorage.getItem('bit_rp_is_logged_in') === 'true') {
            localStorage.setItem('bit_rp_user', JSON.stringify(userObj));
          }
        } catch (e) {}
      } catch (err) {
        console.error('Error refreshing initial student profile:', err);
      }
    }
    fetchInitialStudent();
  }, []);

  // Fetch averages from official Google Sheet benchmarks and live index
  useEffect(() => {
    async function fetchAverages() {
      try {
        const averages = await fetchInstitutionalAveragesFromSheet();
        if (averages) {
          setYearlyAverages({
            year_1: Number(averages.year_1) || 0,
            year_2: Number(averages.year_2) || 0,
            year_3: Number(averages.year_3) || 0,
            year_4: Number(averages.year_4) || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching averages:', err);
      } finally {
        setLoadingAverages(false);
      }
    }
    fetchAverages();
  }, []);

  // Fetch live Sathyamangalam BIT Campus weather from Open-Meteo API
  useEffect(() => {
    async function fetchCampusWeather() {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=11.5034&longitude=77.2774&current_weather=true');
        if (res.ok) {
          const json = await res.json();
          if (json && json.current_weather) {
            const cw = json.current_weather;
            const code = cw.weathercode;
            let icon = '🌤️';
            let condition = 'Partly Cloudy';
            if (code === 0) {
              icon = cw.is_day ? '☀️' : '🌙';
              condition = 'Clear Sky';
            } else if ([1, 2, 3].includes(code)) {
              icon = '🌤️';
              condition = 'Partly Cloudy';
            } else if ([45, 48].includes(code)) {
              icon = '🌫️';
              condition = 'Foggy';
            } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
              icon = '🌧️';
              condition = 'Rain Showers';
            } else if ([95, 96, 99].includes(code)) {
              icon = '⛈️';
              condition = 'Thunderstorm';
            }

            setWeatherData({
              temp: Math.round(cw.temperature),
              wind: Math.round(cw.windspeed),
              icon,
              condition
            });
          }
        }
      } catch (e) {
        console.warn('Weather fetch fallback:', e);
      }
    }
    fetchCampusWeather();
    const timer = setInterval(fetchCampusWeather, 15 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Instant Live Search across all 4,824 BIT students
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    const clean = query.toUpperCase();

    // Query 4,824 students database
    const combinedList = Array.isArray(STUDENTS_INTERNAL_MARKS_LIST) ? STUDENTS_INTERNAL_MARKS_LIST : [];
    const matched = combinedList.filter(s => {
      const r = (s.rollNo || s.id || '').toUpperCase();
      const n = (s.name || s.student_name || '').toUpperCase();
      const d = (s.department || '').toUpperCase();
      const e = (s.email || '').toUpperCase();
      return r.includes(clean) || n.includes(clean) || d.includes(clean) || e.includes(clean);
    }).slice(0, 15);

    const formattedResults = matched.map(s => ({
      roll_no: s.rollNo || s.id,
      student_name: s.name || s.student_name,
      department: s.department,
      year: s.year,
      mentor_name: s.mentor || 'BIT Faculty',
      balance_points: (s.balancePoints !== undefined ? s.balancePoints : (s.currentPoints || 0)).toString(),
      cumulative_reward_points: (s.cumulativePoints !== undefined ? s.cumulativePoints : (s.cumulativePoints || 0)).toString(),
      redeemed_points: (s.redeemedPoints !== undefined ? s.redeemedPoints : (s.redeemedPoints || 0)).toString(),
      email: s.email,
      activityBreakdown: s.activityBreakdown || []
    }));

    setSearchResults(formattedResults);
    setShowDropdown(formattedResults.length > 0);
    setIsSearching(false);
  }, [searchQuery]);

  const handleSelectStudent = (apiItem) => {
    const transformed = transformApiStudent(apiItem);
    setDisplayedStudent(transformed);
    setShowDropdown(false);
    setSearchQuery(apiItem.roll_no || apiItem.student_name);
    logActivity(currentUser, `Search (${apiItem.roll_no || apiItem.student_name})`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectStudent(searchResults[0]);
    }
  };

  const student = displayedStudent || currentUser || STUDENTS_DATABASE[0];

  // Compute progress bar relative to highest average
  const maxYearAvg = Math.max(
    yearlyAverages.year_1,
    yearlyAverages.year_2,
    yearlyAverages.year_3,
    yearlyAverages.year_4,
    1
  );

  const getProgress = (val) => {
    if (!val || val <= 0) return 3;
    return Math.min(100, Math.max(8, Math.round((val / maxYearAvg) * 100)));
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setDisplayedStudent(user);
    setIsLoggedIn(true);
    setSessionTimeoutNotice('');
    try {
      localStorage.setItem('bit_rp_is_logged_in', 'true');
      localStorage.setItem('bit_rp_user', JSON.stringify(user));
      localStorage.setItem('bit_rp_last_active', Date.now().toString());
      logActivity(user, 'Login');
    } catch (e) {
      console.warn('Failed to save session to localStorage:', e);
    }
  };

  const handleLogout = (isTimeout = false) => {
    logActivity(currentUser, isTimeout ? 'Session Expired' : 'Logout');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setDisplayedStudent(null);
    setSelectedStudent(null);
    setNotifications([]);
    lastProcessedRpRef.current = null;
    lastProcessedPlacementRef.current = null;
    if (isTimeout) {
      setSessionTimeoutNotice('Session timed out after 10 minutes of inactivity. Please sign in again.');
    } else {
      setSessionTimeoutNotice('');
    }
    try {
      localStorage.removeItem('bit_rp_is_logged_in');
      localStorage.removeItem('bit_rp_user');
      localStorage.removeItem('bit_rp_last_active');
      localStorage.removeItem('bit_rp_access_token');
      localStorage.removeItem('bit_ps_token');
    } catch (e) {
      console.warn('Failed to clear session from localStorage:', e);
    }
    setPsToken('');
  };

  // 10-Minute Idle Inactivity Auto-Logout Tracker
  useEffect(() => {
    if (!isLoggedIn) return;

    // Record initial active timestamp
    try {
      if (!localStorage.getItem('bit_rp_last_active')) {
        localStorage.setItem('bit_rp_last_active', Date.now().toString());
      }
    } catch (e) {}

    // Throttle user activity events to update localStorage every 5 seconds max
    let lastRecorded = Date.now();
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastRecorded > 5000) {
        lastRecorded = now;
        try {
          localStorage.setItem('bit_rp_last_active', now.toString());
        } catch (e) {}
      }
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(evt => window.addEventListener(evt, updateActivity, { passive: true }));

    // Periodic check every 5 seconds
    const interval = setInterval(() => {
      try {
        const lastActive = parseInt(localStorage.getItem('bit_rp_last_active') || '0', 10);
        if (lastActive && Date.now() - lastActive >= INACTIVITY_TIMEOUT_MS) {
          handleLogout(true);
        }
      } catch (e) {}
    }, 5000);

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, updateActivity));
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  // If user is not logged in, render the dedicated Login Page
  if (!isLoggedIn) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        isDarkMode={isDarkMode}
        initialNotice={sessionTimeoutNotice}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. TOP HEADER & NAVBAR */}
      <header className={`sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors duration-200 ${
        isDarkMode ? 'border-slate-800 bg-slate-950/90 text-slate-100' : 'border-slate-200 bg-white/90 text-slate-900 shadow-xs'
      }`}>
        <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Hamburger Menu Toggle Button & Logo Section (Visible on all screen sizes) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={`flex p-2 rounded-xl transition-all cursor-pointer items-center justify-center ${
                isDarkMode 
                  ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
              }`}
              title={isSidebarOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <img 
              src="/bit-logo.png" 
              alt="Bannari Amman Institute of Technology" 
              className="h-8 sm:h-10 object-contain rounded-md bg-white p-0.5 shadow-xs flex-shrink-0 cursor-pointer"
              onClick={() => setActiveNav('Dashboard')}
            />
            <div className="cursor-pointer" onClick={() => setActiveNav('Dashboard')}>
              <span className="text-sm sm:text-base md:text-lg font-black text-indigo-600 dark:text-indigo-400 tracking-tight block leading-tight">
                Reward Points Site
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Search Bar */}
          <div className="hidden sm:block flex-1 max-w-xl mx-4 relative">
            <div className={`relative flex items-center rounded-2xl border transition-all duration-200 shadow-2xs ${
              isDarkMode 
                ? 'bg-slate-900/90 border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-slate-900' 
                : 'bg-slate-100/90 border-slate-200/90 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 focus-within:bg-white'
            }`}>
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin absolute left-3.5"></div>
              ) : (
                <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none transition-colors ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-400'
                }`} />
              )}
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                placeholder="Search by rollno eg. CT109, CT120..."
                className={`w-full pl-10 pr-10 py-2 rounded-2xl text-xs sm:text-sm font-medium outline-none bg-transparent ${
                  isDarkMode ? 'text-slate-100 placeholder-slate-400' : 'text-slate-900 placeholder-slate-400'
                }`}
              />
              
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                  className={`absolute right-3 p-1 rounded-md transition-colors ${
                    isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Desktop Suggestions Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl border backdrop-blur-xl divide-y max-h-80 overflow-y-auto z-50 animate-fadeIn ${
                  isDarkMode ? 'border-slate-800 bg-slate-900/98 text-slate-100 divide-slate-800' : 'border-slate-200 bg-white/98 text-slate-900 divide-slate-100'
                }`}>
                  <div className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${
                    isDarkMode ? 'bg-slate-950/40 text-slate-400' : 'bg-slate-50 text-slate-500'
                  }`}>
                    <span>Results ({searchResults.length})</span>
                    <span className="normal-case font-normal">Click to select</span>
                  </div>
                  {searchResults.map((item, idx) => (
                    <div
                      key={`${item.roll_no}-${idx}`}
                      onClick={() => handleSelectStudent(item)}
                      className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                        isDarkMode ? 'hover:bg-slate-800/80 active:bg-slate-800' : 'hover:bg-slate-50 active:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38c4ee] to-[#0ea5e9] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                          {(item.student_name || 'ST').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-bold flex flex-wrap items-center gap-1.5 truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                            <span className="truncate">{item.student_name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono flex-shrink-0 ${
                              isDarkMode ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}>
                              {item.roll_no}
                            </span>
                          </div>
                          <div className={`text-[11px] font-medium mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {item.department} {item.year ? `• Year ${item.year}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="text-xs font-black text-emerald-500 dark:text-emerald-400 block whitespace-nowrap">
                          +{item.balance_points ? parseFloat(item.balance_points.replace(/,/g, '')).toLocaleString() : '0'} RP
                        </span>
                        <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Balance</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Action Icons & Developer Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Live Sathyamangalam BIT Campus Weather Pill */}
            {weatherData && (
              <div 
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-2xs ${
                  isDarkMode 
                    ? 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
                title={`Live Sathyamangalam Weather: ${weatherData.temp}°C, ${weatherData.condition}, Wind ${weatherData.wind} km/h`}
              >
                <span className="text-sm">{weatherData.icon}</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{weatherData.temp}°C</span>
                <span className={`text-[10px] hidden xl:inline font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sathyamangalam
                </span>
              </div>
            )}

            {/* Top Right Developer Details */}
            <div className={`hidden lg:flex flex-col text-right pr-2 border-r mr-1 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Developed by <span className="font-bold text-indigo-600 dark:text-indigo-400">Dharineesh V</span>
              </span>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                (Dept. of Computer Technology)
              </span>
            </div>

            {/* Live Notification Bell Icon with Red Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationOpen(prev => !prev)}
                className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer relative ${
                  isNotificationOpen
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : isDarkMode 
                      ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                      : 'hover:bg-slate-100 text-slate-700 hover:text-indigo-600'
                }`}
                title={`Notifications (${unreadNotificationCount} unread)`}
                aria-label="Open Notifications"
              >
                {unreadNotificationCount > 0 ? (
                  <BellRing className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400" strokeWidth={2.2} />
                ) : (
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                )}

                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-sm animate-pulse">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotificationOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent sm:backdrop-blur-none" 
                    onClick={() => setIsNotificationOpen(false)} 
                  />
                  <div className={`fixed inset-x-3.5 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2.5 w-auto sm:w-[420px] max-w-[calc(100vw-28px)] sm:max-w-[420px] rounded-3xl shadow-2xl border backdrop-blur-2xl z-50 animate-fadeIn overflow-hidden flex flex-col max-h-[82vh] sm:max-h-[520px] ${
                    isDarkMode 
                      ? 'border-slate-800 bg-slate-900/98 text-slate-100' 
                      : 'border-slate-200 bg-white/98 text-slate-900 shadow-indigo-500/15'
                  }`}>
                    {/* Panel Header */}
                    <div className={`p-4 border-b flex items-center justify-between gap-2 ${
                      isDarkMode ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold tracking-tight">Notifications</h3>
                            {unreadNotificationCount > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold">
                                {unreadNotificationCount} new
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium">Real-time alerts & RP updates</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {unreadNotificationCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsAsRead}
                            className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isDarkMode ? 'text-indigo-400 hover:bg-slate-800' : 'text-indigo-600 hover:bg-indigo-50'
                            }`}
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-4 h-4" />
                            <span className="hidden sm:inline text-[11px]">Read All</span>
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllNotifications}
                            className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isDarkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title="Clear all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsNotificationOpen(false)}
                          className={`p-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className={`flex items-center gap-1 px-3 py-2 border-b text-xs ${
                      isDarkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-100 bg-slate-50/40'
                    }`}>
                      {[
                        { id: 'all', label: `All (${notifications.length})` },
                        { id: 'unread', label: `Unread (${unreadNotificationCount})` },
                        { id: 'points', label: 'Points' },
                        { id: 'placements', label: 'Placements' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setNotificationFilter(tab.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            notificationFilter === tab.id
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : isDarkMode
                                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Push Notification Opt-In Banner */}
                    {pushPermission !== 'granted' && (
                      <div className={`p-3 m-2 rounded-2xl border flex items-center justify-between gap-2.5 transition-all ${
                        isDarkMode ? 'bg-indigo-950/40 border-indigo-800/50 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                      }`}>
                        <div className="flex items-center gap-2">
                          <BellRing className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span className="text-xs font-bold">
                            Enable Notifications
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={requestPushPermission}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex-shrink-0 cursor-pointer shadow-xs active:scale-95"
                        >
                          Enable
                        </button>
                      </div>
                    )}

                    {/* Notifications List */}
                    <div className="max-h-[58vh] sm:max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
                      {filteredNotifications.length === 0 ? (
                        <div className="p-8 text-center space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
                            <Bell className="w-6 h-6 opacity-60" />
                          </div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {notificationFilter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                          </p>
                          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                            When reward points are credited, placement updates are announced, or drives are scheduled, you will see alerts here.
                          </p>
                        </div>
                      ) : (
                        filteredNotifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              markNotificationAsRead(item.id);
                              if (item.linkTab) {
                                setActiveNav(item.linkTab);
                                setIsNotificationOpen(false);
                              }
                            }}
                            className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 relative group ${
                              !item.read
                                ? isDarkMode
                                  ? 'bg-slate-800/60 hover:bg-slate-800'
                                  : 'bg-indigo-50/50 hover:bg-indigo-50'
                                : isDarkMode
                                  ? 'hover:bg-slate-800/40 opacity-75 hover:opacity-100'
                                  : 'hover:bg-slate-50 opacity-80 hover:opacity-100'
                            }`}
                          >
                            {/* Type Icon */}
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                              item.type === 'points_credited'
                                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20'
                                : item.type === 'points_debited'
                                  ? 'bg-rose-500/15 text-rose-500 border-rose-500/20'
                                  : item.type === 'placement_update'
                                    ? 'bg-indigo-500/15 text-indigo-500 border-indigo-500/20'
                                    : 'bg-blue-500/15 text-blue-500 border-blue-500/20'
                            }`}>
                              {item.type === 'points_credited' ? (
                                <Trophy className="w-4 h-4 text-emerald-500" />
                              ) : item.type === 'points_debited' ? (
                                <TrendingDown className="w-4 h-4 text-rose-500" />
                              ) : item.type === 'placement_update' ? (
                                <Briefcase className="w-4 h-4 text-indigo-500" />
                              ) : (
                                <Sparkles className="w-4 h-4 text-blue-500" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className={`text-xs font-bold leading-snug truncate ${
                                  !item.read ? 'text-indigo-600 dark:text-indigo-400' : isDarkMode ? 'text-slate-200' : 'text-slate-800'
                                }`}>
                                  {item.title}
                                </h4>
                                {!item.read && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                )}
                              </div>
                              <p className={`text-[11px] mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {item.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                                <span>{formatRelativeTime(item.timestamp)}</span>
                                {item.linkTab && (
                                  <>
                                    <span>•</span>
                                    <span className="text-indigo-500 hover:underline font-bold flex items-center gap-0.5">
                                      <span>View {item.linkTab}</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Dismiss Individual Button */}
                            <button
                              type="button"
                              onClick={(e) => deleteNotification(item.id, e)}
                              className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all absolute top-3 right-3 text-slate-400 hover:text-rose-500 ${
                                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'
                              }`}
                              title="Delete alert"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'hover:bg-slate-800 text-amber-400 hover:text-amber-300' 
                  : 'hover:bg-slate-100 text-slate-700 hover:text-indigo-600'
              }`}
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              )}
            </button>

            <div 
              onClick={() => {
                setSelectedStudent(currentUser);
                setIsModalOpen(true);
              }}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-indigo-400 transition-all cursor-pointer border shadow-xs flex-shrink-0 ${
                isDarkMode ? 'border-slate-700' : 'border-slate-300'
              }`}
              title={`${currentUser.name} (${currentUser.email})`}
            >
              <AvatarImage
                src={currentUser.picture || currentUser.photo_url}
                alt={currentUser.name}
                initials={currentUser.initials}
                fallbackBg={currentUser.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
              />
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800 text-rose-400 hover:text-rose-300' : 'hover:bg-slate-100 text-rose-600 hover:text-rose-700'
              }`}
              title="Logout to Login Screen"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Sub-Strip (Immediately Downwards After Header on Phones) */}
        <div className={`block sm:hidden px-3.5 py-2.5 border-b relative transition-colors duration-200 ${
          isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200/80 shadow-2xs'
        }`}>
          <div className={`relative flex items-center max-w-md mx-auto rounded-2xl border transition-all duration-200 ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20' 
              : 'bg-slate-100/90 border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 focus-within:bg-white'
          }`}>
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin absolute left-3 z-10"></div>
            ) : (
              <Search className={`w-4 h-4 absolute left-3 pointer-events-none transition-colors z-10 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`} strokeWidth={2} />
            )}
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
              placeholder="Search by rollno eg. CT109, CT120..."
              className={`w-full h-9 pl-9 pr-9 rounded-2xl text-xs font-semibold outline-none bg-transparent ${
                isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
            />
            
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                className={`absolute right-2.5 p-1 rounded-md transition-colors z-10 ${
                  isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                }`}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Suggestions Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <>
              <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowDropdown(false)} />
              <div className={`absolute left-3.5 right-3.5 top-full mt-1.5 rounded-2xl shadow-2xl border backdrop-blur-xl divide-y max-h-[65vh] overflow-y-auto z-50 animate-fadeIn ${
                isDarkMode ? 'border-slate-800 bg-slate-900/98 text-slate-100 divide-slate-800' : 'border-slate-200 bg-white/98 text-slate-900 divide-slate-100'
              }`}>
                <div className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${
                  isDarkMode ? 'bg-slate-950/60 text-slate-400' : 'bg-slate-50 text-slate-500'
                }`}>
                  <span>Results ({searchResults.length})</span>
                  <span className="normal-case font-normal">Click to select</span>
                </div>
                {searchResults.map((item, idx) => (
                  <div
                    key={`${item.roll_no}-${idx}`}
                    onClick={() => handleSelectStudent(item)}
                    className={`px-3.5 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                      isDarkMode ? 'hover:bg-slate-800/80 active:bg-slate-800' : 'hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38c4ee] to-[#0ea5e9] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                        {(item.student_name || 'ST').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-bold flex flex-wrap items-center gap-1.5 truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          <span className="truncate">{item.student_name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono flex-shrink-0 ${
                            isDarkMode ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}>
                            {item.roll_no}
                          </span>
                        </div>
                        <div className={`text-[10px] font-medium mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.department} {item.year ? `• Year ${item.year}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="text-xs font-black text-emerald-500 dark:text-emerald-400 block whitespace-nowrap">
                        +{item.balance_points ? parseFloat(item.balance_points.replace(/,/g, '')).toLocaleString() : '0'} RP
                      </span>
                      <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Balance</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* 2. SLIDE-OVER HAMBURGER DRAWER SIDEBAR (Desktop & Tablet) */}
      {isSidebarOpen && (
        <div 
          className="hidden md:block fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn cursor-pointer" 
          onClick={() => setIsSidebarOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* 2. SLIDE-OVER HAMBURGER DRAWER SIDEBAR (Mobile, Tablet & Desktop) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn cursor-pointer" 
          onClick={() => setIsSidebarOpen(false)} 
          aria-hidden="true"
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 max-w-[85vw] flex flex-col py-5 px-4 shadow-2xl transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
      } ${
        isDarkMode ? 'bg-slate-900 border-r border-slate-800 text-slate-100' : 'bg-white border-r border-slate-200 text-slate-900'
      }`}>
        
        {/* Drawer Header */}
        <div className={`flex items-center justify-between pb-4 mb-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <img 
              src="/bit-logo.png" 
              alt="Bannari Amman Institute of Technology" 
              className="h-8 sm:h-9 object-contain rounded-md bg-white p-0.5 shadow-xs"
            />
            <div>
              <span className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 block leading-tight">
                Rewards BIT
              </span>
              <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Navigation Menu
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile Quick Details Card in Drawer */}
        <div className={`mb-4 p-3 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700/80 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-indigo-400/40 flex-shrink-0">
              <AvatarImage
                src={currentUser.picture || currentUser.photo_url}
                alt={currentUser.name}
                initials={currentUser.initials}
                fallbackBg={currentUser.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold truncate leading-tight">{currentUser.name}</h4>
              <p className={`text-[10px] font-mono mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {currentUser.id} • {currentUser.department}
              </p>
            </div>
          </div>
          <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] ${
            isDarkMode ? 'border-slate-700/60' : 'border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Active Balance:
            </span>
            <span className="font-black text-emerald-500 dark:text-emerald-400">
              {currentUser.currentPoints} RP
            </span>
          </div>
        </div>

        {/* Navigation Items Group */}
        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 mb-1.5 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Navigation
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-0.5">
          <button
            onClick={() => { setActiveNav('Dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'Dashboard'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-5 h-5" strokeWidth={activeNav === 'Dashboard' ? 2.2 : 1.8} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setActiveNav('Leaderboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'Leaderboard'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-5 h-5" strokeWidth={activeNav === 'Leaderboard' ? 2.2 : 1.8} />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => { setActiveNav('Internal Marks'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'Internal Marks'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5" strokeWidth={activeNav === 'Internal Marks' ? 2.2 : 1.8} />
            <span>Internal Mark</span>
          </button>

          

          <button
            onClick={() => { setActiveNav('Menu Details'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'Menu Details'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" strokeWidth={activeNav === 'Menu Details' ? 2.2 : 1.8} />
            <span>Menu Details</span>
          </button>

          <button
            onClick={() => { setActiveNav('Leave Schedule'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'Leave Schedule'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-5 h-5" strokeWidth={activeNav === 'Leave Schedule' ? 2.2 : 1.8} />
            <span>Leave Schedule</span>
          </button>

          <button
            onClick={() => { setActiveNav('Faculty Directory'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'Faculty Directory'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-5 h-5" strokeWidth={activeNav === 'Faculty Directory' ? 2.2 : 1.8} />
            <span>Faculty Directory</span>
          </button>

          <button
            onClick={() => { setActiveNav('Student Mentors'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'Student Mentors'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-5 h-5" strokeWidth={activeNav === 'Student Mentors' ? 2.2 : 1.8} />
            <span>Student Mentors</span>
          </button>

          <button
            onClick={() => { setActiveNav('GeoBITS'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'GeoBITS'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Navigation className="w-5 h-5" strokeWidth={activeNav === 'GeoBITS' ? 2.2 : 1.8} />
            <span>BIT Map</span>
          </button>

          <button
            onClick={() => { setActiveNav('BIT Placements'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'BIT Placements'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-5 h-5" strokeWidth={activeNav === 'BIT Placements' ? 2.2 : 1.8} />
            <span>BIT Placements</span>
          </button>

          <button
            onClick={() => { setActiveNav('Settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeNav === 'Settings'
                ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-5 h-5" strokeWidth={activeNav === 'Settings' ? 2.2 : 1.8} />
            <span>Settings</span>
          </button>

          {/* Admin & Developer Console (Only visible to Dharineesh & Kaushi) */}
          {isAdminUser && (
            <button
              onClick={() => { setActiveNav('Admin Console'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer border ${
                activeNav === 'Admin Console'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : isDarkMode
                    ? 'border-purple-900/40 bg-purple-950/20 text-purple-300 hover:text-white hover:bg-purple-900/30'
                    : 'border-purple-200 bg-purple-50/70 text-purple-800 hover:bg-purple-100/80 shadow-xs'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-purple-400" strokeWidth={activeNav === 'Admin Console' ? 2.2 : 1.8} />
              <div className="flex items-center justify-between w-full">
                <span>Admin Console</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-300 border border-purple-400/40">DEV</span>
              </div>
            </button>
          )}

          {/* PWA Install App Button */}
          {isInstallable && (
            <button
              onClick={() => { handleInstallClick(); setIsSidebarOpen(false); }}
              className={`mt-2.5 w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer group ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-slate-800/90 to-indigo-950/50 border-indigo-500/30 text-slate-200 hover:border-indigo-400 hover:bg-slate-800 shadow-xs' 
                  : 'bg-gradient-to-r from-indigo-50/80 to-blue-50/50 border-indigo-200 text-indigo-950 hover:bg-indigo-100/70 hover:border-indigo-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs block leading-tight">Install Web App</span>
                  <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Add to Home Screen</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Install
              </span>
            </button>
          )}
        </nav>
      </aside>

      {/* 3. BODY LAYOUT: MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden pb-10">
          
          {/* VIEW 1: DASHBOARD */}
          {activeNav === 'Dashboard' && (
            <>
              {/* Top Title & Subtitle */}
              <div className="mb-6">
                <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Rewards Points Dashboard
                </h1>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing logged in profile for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentUser.name}</span> ({currentUser.email}).
                </p>
              </div>

              {/* Flipkart-style Featured Hero Banner Slider */}
              <DashboardHeroSlider
                weatherData={weatherData}
                student={student}
                yearlyAverages={yearlyAverages}
                normalizeStudentYear={normalizeStudentYear}
                setActiveNav={setActiveNav}
                isDarkMode={isDarkMode}
                leavesList={leavesList}
                facultyList={facultyList}
              />

              {/* SECTION 1: SEARCH RESULTS */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-[11px] font-bold tracking-wider uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    STUDENT PROFILE & POINTS
                  </h2>
                  {student.email === currentUser.email && (
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isDarkMode 
                        ? 'text-indigo-400 bg-indigo-950/80 border border-indigo-800' 
                        : 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                    }`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Current Logged In User</span>
                    </span>
                  )}
                </div>

                {/* Student Result Card */}
                <div className={`rounded-2xl border transition-all duration-200 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900 hover:border-slate-700 shadow-xl' 
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-md'
                }`}>
                  
                  {/* Left Student Info */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Photo / Avatar */}
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 ${
                      isDarkMode ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      <AvatarImage
                        src={student.picture || student.photo_url}
                        alt={student.name}
                        initials={student.initials}
                        fallbackBg={student.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {student.name}
                        </h3>
                        {student.batch && (
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                            isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}>
                            {student.batch}
                          </span>
                        )}
                      </div>
                      
                      <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs font-medium ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <IdCard className="w-4 h-4" strokeWidth={1.8} />
                          <span className={`tracking-wide font-mono font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{student.id}</span>
                        </div>
                        <div className="flex items-center gap-1.5 uppercase">
                          <GraduationCap className="w-4 h-4" strokeWidth={1.8} />
                          <span>{student.course_code ? `${student.course_code} - ` : ''}{student.department}</span>
                        </div>
                        {student.email && (
                          <div className={`flex items-center gap-1.5 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Mail className="w-3.5 h-3.5" />
                            <span>{student.email}</span>
                          </div>
                        )}
                        {student.mentor_name && student.mentor_name !== 'N/A' && (
                          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                            <User className="w-3.5 h-3.5" />
                            <span>Mentor: {student.mentor_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Points and Action */}
                  <div className={`w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 sm:gap-4 border-t md:border-t-0 pt-4 md:pt-0 flex-shrink-0 ${
                    isDarkMode ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <div className="text-left md:text-right">
                      <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        ACTIVE BALANCE POINTS
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 tracking-tight leading-tight">
                        {student.currentPoints} <span className="text-base sm:text-lg font-bold">RP</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsModalOpen(true);
                      }}
                      className="px-5 sm:px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-indigo-600/30 transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95 flex-shrink-0"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </section>

              {/* SECTION 2: OVERVIEW */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xs font-black tracking-wider uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    REWARDS OVERVIEW
                  </h2>
                  {rewardsTotal > 0 && (
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Total Activities: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{rewardsTotal}</span>
                    </span>
                  )}
                </div>

                {/* Overview Activity Container */}
                <div className={`rounded-2xl border overflow-hidden shadow-xs transition-all duration-200 ${
                  isDarkMode ? 'border-slate-800 bg-slate-900 shadow-xl' : 'border-slate-200 bg-white shadow-md'
                }`}>
                  
                  {/* Mobile Responsive Activity Cards (Phones < 640px) */}
                  <div className={`block sm:hidden divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
                    {loadingRewards ? (
                      <div className={`py-8 text-center font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <div className="inline-flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading activities for {student.id}...</span>
                        </div>
                      </div>
                    ) : rewardsData.length === 0 ? (
                      <div className={`py-8 text-center font-semibold text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        No reward activity records found for {student.id}.
                      </div>
                    ) : (
                      rewardsData.map((act, index) => {
                        const rawPts = act.reward_points ? parseFloat(String(act.reward_points).replace(/,/g, '')) : (act.points ? Math.abs(act.points) : 0);
                        const isPositive = act.type !== 'negative' && (act.points === undefined || act.points >= 0);
                        const t = (act.activity_type || '').toUpperCase();
                        let badgeStyle = isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-300';
                        if (t.includes('TECHNICAL') || t.includes('EVENT')) {
                          badgeStyle = isDarkMode ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80' : 'bg-cyan-50 text-cyan-800 border-cyan-300';
                        } else if (t.includes('P SKILL') || t.includes('SKILL')) {
                          badgeStyle = isDarkMode ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80' : 'bg-indigo-50 text-indigo-800 border-indigo-300';
                        } else if (t.includes('INITIATIVE') || t.includes('CHALLENGE')) {
                          badgeStyle = isDarkMode ? 'bg-amber-950/80 text-amber-300 border-amber-800/80' : 'bg-amber-50 text-amber-800 border-amber-300';
                        } else if (t.includes('ACADEMIC')) {
                          badgeStyle = isDarkMode ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80' : 'bg-emerald-50 text-emerald-800 border-emerald-300';
                        }

                        return (
                          <div key={index} className={`py-4 px-3.5 sm:px-4 transition-colors space-y-1.5 ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                            <div className="flex items-start justify-between gap-3">
                              <h4 className={`text-xs font-bold leading-snug flex-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {act.activity_name || act.course_name || 'Academic Course Activity'}
                              </h4>
                              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                                isPositive 
                                  ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/70' 
                                  : 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800/70'
                              }`}>
                                {isPositive ? `+${rawPts.toLocaleString()}` : `-${rawPts.toLocaleString()}`} RP
                              </span>
                            </div>

                            <div className={`flex flex-wrap items-center justify-between gap-2 text-[11px] pt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
                                {act.activity_type || 'General'}
                              </span>
                              <span className="font-medium text-[10px]">
                                {act.date || 'Recent'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Desktop & Tablet Table (>= 640px) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-[11px] lg:text-xs font-extrabold uppercase tracking-wider ${
                          isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-100 text-slate-700'
                        }`}>
                          <th className="py-3.5 px-3 lg:px-4 font-extrabold">COURSE NAME</th>
                          <th className="py-3.5 px-3 lg:px-4 font-extrabold whitespace-nowrap">COMPLETED DATE</th>
                          <th className="py-3.5 px-3 lg:px-4 font-extrabold whitespace-nowrap">ACTIVITY TYPE</th>
                          <th className="py-3.5 px-3 lg:px-4 font-extrabold text-right whitespace-nowrap">REWARD POINTS</th>
                        </tr>
                      </thead>
                      <tbody className={`text-xs divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
                        {loadingRewards ? (
                          <tr>
                            <td colSpan="4" className={`py-8 text-center font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              <div className="inline-flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading activities for {student.id}...</span>
                              </div>
                            </td>
                          </tr>
                        ) : rewardsData.length === 0 ? (
                          <tr>
                            <td colSpan="4" className={`py-8 text-center font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              No reward activity records found for {student.id}.
                            </td>
                          </tr>
                        ) : (
                          rewardsData.map((act, index) => {
                            const rawPts = act.reward_points ? parseFloat(String(act.reward_points).replace(/,/g, '')) : (act.points ? Math.abs(act.points) : 0);
                            const isPositive = act.type !== 'negative' && (act.points === undefined || act.points >= 0);
                            
                            // Badge color styles
                            const t = (act.activity_type || '').toUpperCase();
                            let badgeStyle = isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-300';
                            if (t.includes('TECHNICAL') || t.includes('EVENT')) {
                              badgeStyle = isDarkMode ? 'bg-cyan-950 text-cyan-200 border-cyan-800' : 'bg-cyan-50 text-cyan-800 border-cyan-300';
                            } else if (t.includes('P SKILL') || t.includes('SKILL')) {
                              badgeStyle = isDarkMode ? 'bg-indigo-950 text-indigo-200 border-indigo-800' : 'bg-indigo-50 text-indigo-800 border-indigo-300';
                            } else if (t.includes('INITIATIVE') || t.includes('CHALLENGE')) {
                              badgeStyle = isDarkMode ? 'bg-amber-950 text-amber-200 border-amber-800' : 'bg-amber-50 text-amber-800 border-amber-300';
                            } else if (t.includes('ACADEMIC')) {
                              badgeStyle = isDarkMode ? 'bg-emerald-950 text-emerald-200 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-300';
                            }

                            return (
                              <tr key={index} className={`transition-colors ${isDarkMode ? 'text-slate-200 hover:bg-slate-800/50' : 'text-slate-800 hover:bg-slate-50'}`}>
                                <td className={`py-3.5 px-3 lg:px-4 font-bold text-xs lg:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {act.activity_name || act.course_name || 'Academic Course Activity'}
                                </td>
                                <td className={`py-3.5 px-3 lg:px-4 font-semibold whitespace-nowrap text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                  {act.date || 'Recent'}
                                </td>
                                <td className="py-3.5 px-3 lg:px-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap border shadow-xs ${badgeStyle}`}>
                                    {act.activity_type || 'General'}
                                  </span>
                                </td>
                                <td className={`py-3.5 px-3 lg:px-4 text-right font-black text-xs lg:text-sm whitespace-nowrap ${
                                  isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                                }`}>
                                  {isPositive ? `+${rawPts.toLocaleString()}` : `-${rawPts.toLocaleString()}`} RP
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* SECTION 3: AVERAGE REWARD POINTS BY YEAR */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xs font-black tracking-wider uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    AVERAGE REWARD POINTS BY YEAR
                  </h2>
                  <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Official College Benchmarks
                  </span>
                </div>

                {/* 4 Year Cards Grid (Dynamic from API & Highlighted for Current User) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'year_1', label: 'Year I', value: yearlyAverages.year_1 },
                    { key: 'year_2', label: 'Year II', value: yearlyAverages.year_2 },
                    { key: 'year_3', label: 'Year III', value: yearlyAverages.year_3 },
                    { key: 'year_4', label: 'Year IV', value: yearlyAverages.year_4 },
                  ].map(card => {
                    const userYear = normalizeStudentYear(currentUser?.year, currentUser?.id);
                    const isHighlighted = userYear === card.label;
                    const maxVal = Math.max(
                      Number(yearlyAverages.year_1) || 0,
                      Number(yearlyAverages.year_2) || 0,
                      Number(yearlyAverages.year_3) || 0,
                      Number(yearlyAverages.year_4) || 0,
                      1
                    );
                    const percent = Math.min(100, Math.round((Number(card.value) / maxVal) * 100));

                    if (isHighlighted) {
                      return (
                        <div 
                          key={card.key}
                          className="rounded-2xl p-5 sm:p-6 shadow-lg shadow-indigo-600/25 bg-[#4f46e5] text-white overflow-hidden flex flex-col justify-between transition-all duration-200 ring-2 ring-indigo-400/50"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-indigo-100">{card.label}</span>
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                                Your Year
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {loadingAverages ? '...' : Number(card.value).toLocaleString()}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-indigo-200">RP</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3.5 pt-2.5 border-t border-white/15">
                            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-200 mb-1">
                              <span>Benchmark</span>
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-black/25 overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-white transition-all duration-700"
                                style={{ width: `${Math.max(card.value > 0 ? 6 : 0, percent)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={card.key}
                        className={`rounded-2xl border p-5 sm:p-6 shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                          isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900 shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="mb-2">
                            <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{card.label}</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {loadingAverages ? '...' : Number(card.value).toLocaleString()}
                            </span>
                            <span className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>RP</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className={`mt-3.5 pt-2.5 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                          <div className={`flex items-center justify-between text-[10px] font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>Benchmark</span>
                            <span>{percent}%</span>
                          </div>
                          <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                              style={{ width: `${Math.max(card.value > 0 ? 6 : 0, percent)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* VIEW 2: LEADERBOARD */}
          {activeNav === 'Leaderboard' && (
            <div>
              {!selectedDeptLeaderboard ? (
                /* ALL DEPARTMENTS GRID VIEW */
                <div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-7 h-7 text-amber-400" />
                        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          Department Leaderboards
                        </h1>
                      </div>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Select any department to view live student rankings in descending order of Reward Points.
                      </p>
                    </div>

                    {/* Filter Department Search */}
                    <div className="relative max-w-xs w-full">
                      <Search className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <input
                        type="text"
                        value={deptFilterQuery}
                        onChange={(e) => setDeptFilterQuery(e.target.value)}
                        placeholder="Filter department..."
                        className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:border-indigo-500 ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs'
                        }`}
                      />
                    </div>
                  </div>

                  {/* AVERAGE REWARD POINTS BY YEAR (Native 4-Card Widget) */}
                  <section className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className={`text-xs font-black tracking-wider uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        AVERAGE REWARD POINTS BY YEAR
                      </h2>
                      <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Official College Benchmarks
                      </span>
                    </div>

                    {/* 4 Year Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { key: 'year_1', label: 'Year I', value: yearlyAverages.year_1 },
                        { key: 'year_2', label: 'Year II', value: yearlyAverages.year_2 },
                        { key: 'year_3', label: 'Year III', value: yearlyAverages.year_3 },
                        { key: 'year_4', label: 'Year IV', value: yearlyAverages.year_4 },
                      ].map(card => {
                        const userYear = normalizeStudentYear(currentUser?.year, currentUser?.id);
                        const isHighlighted = userYear === card.label;
                        const maxVal = Math.max(
                          Number(yearlyAverages.year_1) || 0,
                          Number(yearlyAverages.year_2) || 0,
                          Number(yearlyAverages.year_3) || 0,
                          Number(yearlyAverages.year_4) || 0,
                          1
                        );
                        const percent = Math.min(100, Math.round((Number(card.value) / maxVal) * 100));

                        if (isHighlighted) {
                          return (
                            <div 
                              key={card.key}
                              className="rounded-2xl p-5 sm:p-6 shadow-xl shadow-indigo-600/25 bg-gradient-to-r from-indigo-600 to-violet-600 text-white overflow-hidden flex flex-col justify-between transition-all duration-200 ring-2 ring-indigo-400/50"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-indigo-100">{card.label}</span>
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                                    YOUR YEAR
                                  </span>
                                </div>
                                <div className="flex items-baseline gap-1.5 mt-2">
                                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    {Number(card.value).toLocaleString()}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-indigo-200">RP</span>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mt-3.5 pt-2.5 border-t border-white/15">
                                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-200 mb-1">
                                  <span>Benchmark</span>
                                  <span>{percent}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-black/25 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full bg-white transition-all duration-700"
                                    style={{ width: `${Math.max(card.value > 0 ? 6 : 0, percent)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div 
                            key={card.key}
                            className={`rounded-2xl border p-5 sm:p-6 shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                              isDarkMode ? 'border-slate-800 bg-slate-900/90 text-slate-100' : 'border-slate-200 bg-white text-slate-900 shadow-sm'
                            }`}
                          >
                            <div>
                              <div className="mb-2">
                                <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{card.label}</span>
                              </div>
                              <div className="flex items-baseline gap-1.5 mt-2">
                                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {Number(card.value).toLocaleString()}
                                </span>
                                <span className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>RP</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className={`mt-3.5 pt-2.5 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                              <div className={`flex items-center justify-between text-[10px] font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <span>Benchmark</span>
                                <span>{percent}%</span>
                              </div>
                              <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                                  style={{ width: `${Math.max(card.value > 0 ? 6 : 0, percent)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* 19 Department Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {ALL_DEPARTMENTS
                      .filter(d => 
                        !deptFilterQuery || 
                        String(d.name || '').toLowerCase().includes(deptFilterQuery.toLowerCase().trim()) || 
                        String(d.id || '').toLowerCase().includes(deptFilterQuery.toLowerCase().trim())
                      )
                      .map((dept) => {
                        const DeptIcon = dept.Icon || Trophy;
                        return (
                          <div
                            key={dept.id}
                            onClick={() => handleViewDepartmentLeaderboard(dept)}
                            className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 group hover:-translate-y-1.5 ${
                              isDarkMode 
                                ? 'border-slate-800 bg-slate-900/90 hover:border-indigo-500/50 hover:bg-slate-900 shadow-xl shadow-black/40 hover:shadow-indigo-950/30' 
                                : 'border-slate-200/90 bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100/60 shadow-sm'
                            }`}
                          >
                            <div>
                              {/* Card Top Header: 3D Glowing Vector Capsule & Badges */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="relative">
                                  {/* Ambient 3D Glow */}
                                  <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${dept.color || 'from-indigo-600 to-blue-600'} opacity-40 blur-sm group-hover:opacity-75 group-hover:blur-md transition-all duration-300`} />
                                  
                                  {/* 3D Glass Capsule */}
                                  <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${dept.color || 'from-indigo-600 to-blue-600'} p-[1.5px] shadow-lg shadow-black/25 group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300 flex items-center justify-center`}>
                                    <div className="w-full h-full rounded-[14px] bg-white/15 backdrop-blur-xs flex items-center justify-center border-t border-l border-white/40 border-b border-r border-black/20">
                                      <DeptIcon className="w-6 h-6 text-white drop-shadow-md" strokeWidth={2.2} />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${dept.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                    {dept.id}
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}>
                                    {dept.degree}
                                  </span>
                                </div>
                              </div>

                              {/* Department Title */}
                              <h3 className={`text-base font-extrabold transition-colors leading-snug ${
                                isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'
                              }`}>
                                {dept.name}
                              </h3>

                              {/* Live Rankings Metadata */}
                              <div className={`flex items-center gap-1.5 mt-2.5 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                                <span className="text-[11px] font-semibold">Live Rankings</span>
                                <span className="opacity-40">•</span>
                                <span className="text-[11px]">Year I – IV</span>
                              </div>
                            </div>

                            {/* Card Interactive Footer */}
                            <div className={`mt-5 pt-3.5 border-t flex items-center justify-between transition-colors ${
                              isDarkMode ? 'border-slate-800/80 group-hover:border-slate-700' : 'border-slate-100 group-hover:border-slate-200'
                            }`}>
                              <span className={`text-xs font-bold transition-colors ${
                                isDarkMode ? 'text-slate-300 group-hover:text-indigo-400' : 'text-slate-700 group-hover:text-indigo-600'
                              }`}>
                                View Leaderboard
                              </span>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isDarkMode 
                                  ? 'bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-indigo-500/30' 
                                  : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-indigo-500/30'
                              }`}>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                /* SELECTED DEPARTMENT DETAILED LEADERBOARD VIEW */
                <div>
                  {/* Back Button & Header */}
                  <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b ${
                    isDarkMode ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => setSelectedDeptLeaderboard(null)}
                        className={`p-2 sm:p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer w-fit ${
                          isDarkMode 
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800' 
                            : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>All Departments</span>
                      </button>

                      <div className="flex items-center gap-3">
                        {selectedDeptLeaderboard && (() => {
                          const SelectedIcon = selectedDeptLeaderboard.Icon || Trophy;
                          return (
                            <div className="relative flex-shrink-0">
                              <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-br ${selectedDeptLeaderboard.color || 'from-indigo-600 to-blue-600'} opacity-50 blur-xs`} />
                              <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${selectedDeptLeaderboard.color || 'from-indigo-600 to-blue-600'} p-[1.5px] flex items-center justify-center shadow-md`}>
                                <div className="w-full h-full rounded-[10px] bg-white/15 backdrop-blur-xs flex items-center justify-center border-t border-l border-white/40">
                                  <SelectedIcon className="w-5 h-5 text-white drop-shadow-sm" strokeWidth={2.2} />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h1 className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {selectedDeptLeaderboard?.name}
                            </h1>
                            <span className={`text-[10px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full border ${selectedDeptLeaderboard?.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                              {selectedDeptLeaderboard?.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filter Within Department */}
                    <div className="relative max-w-full md:max-w-xs w-full">
                      <Search className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <input
                        type="text"
                        value={deptStudentSearch}
                        onChange={(e) => setDeptStudentSearch(e.target.value)}
                        placeholder="CT109, CT120, name..."
                        className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:border-indigo-500 ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Leaderboard Table / Content */}
                  {loadingDeptLeaderboard ? (
                    <div className="py-20 text-center">
                      <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Fetching {selectedDeptLeaderboard.name} student records & calculating year-wise ranks...
                      </p>
                    </div>
                  ) : deptLeaderboardList.length === 0 ? (
                    <div className={`py-16 text-center rounded-3xl border p-8 ${
                      isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-600 shadow-md'
                    }`}>
                      <p className="text-sm">
                        No student reward records found for this department.
                      </p>
                      <button
                        onClick={() => setSelectedDeptLeaderboard(null)}
                        className="mt-4 px-5 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                      >
                        Back to Departments
                      </button>
                    </div>
                  ) : (() => {
                    // Compute available years for this department
                    const yearsSet = new Set(deptLeaderboardList.map(s => s.normalizedYear).filter(Boolean));
                    const order = ['Year IV', 'Year III', 'Year II', 'Year I'];
                    const availableYears = order.filter(y => yearsSet.has(y));

                    // Filter list by selected year & search query
                    let filteredList = deptLeaderboardList;
                    if (selectedLeaderboardYear !== 'ALL') {
                      filteredList = filteredList.filter(s => s.normalizedYear === selectedLeaderboardYear);
                    }
                    if (deptStudentSearch) {
                      const q = deptStudentSearch.toLowerCase();
                      filteredList = filteredList.filter(s => 
                        s.student_name.toLowerCase().includes(q) || 
                        s.roll_no.toLowerCase().includes(q)
                      );
                    }

                    return (
                      <div>
                        {/* YEAR-WISE TABS BAR */}
                        {availableYears.length > 1 && (
                          <div className={`flex flex-wrap items-center gap-2 mb-6 p-1.5 rounded-2xl border w-fit shadow-md ${
                            isDarkMode ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-slate-100 border-slate-200 shadow-slate-200'
                          }`}>
                            <button
                              onClick={() => setSelectedLeaderboardYear('ALL')}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                selectedLeaderboardYear === 'ALL'
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                  : isDarkMode 
                                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                              }`}
                            >
                              All Years ({deptLeaderboardList.length})
                            </button>
                            {availableYears.map(yr => {
                              const count = deptLeaderboardList.filter(s => s.normalizedYear === yr).length;
                              return (
                                <button
                                  key={yr}
                                  onClick={() => setSelectedLeaderboardYear(yr)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    selectedLeaderboardYear === yr
                                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                      : isDarkMode 
                                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                                  }`}
                                >
                                  <span>{yr}</span>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedLeaderboardYear === yr 
                                      ? 'bg-white/20 text-white' 
                                      : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Top 3 Podium Cards for Selected Year / All Years */}
                        {filteredList.length >= 3 && !deptStudentSearch && filteredList[0] && filteredList[1] && filteredList[2] && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {/* Rank 2 (Silver) */}
                            <div className={`rounded-3xl border p-5 shadow-lg relative flex flex-col justify-between order-2 md:order-1 ${
                              isDarkMode ? 'border-slate-700 bg-slate-900/90 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
                            }`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm border ${
                                  isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-600' : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}>
                                  🥈 #2
                                </div>
                                <span className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{filteredList[1]?.roll_no}</span>
                              </div>
                              <div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1 ${
                                  isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}>
                                  {filteredList[1]?.normalizedYear}
                                </span>
                                <h4 className={`font-extrabold text-base truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filteredList[1]?.student_name}</h4>
                                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{filteredList[1]?.mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                <div>
                                  <span className={`text-[10px] uppercase font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Balance</span>
                                  {filteredList[1]?.displayCumulative !== filteredList[1]?.displayBalance && (
                                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Earned: +{filteredList[1]?.displayCumulative} RP</span>
                                  )}
                                </div>
                                <span className="text-lg font-black text-emerald-500 dark:text-emerald-400">+{filteredList[1]?.displayBalance || '0'} RP</span>
                              </div>
                            </div>

                            {/* Rank 1 (Gold - Elevated) */}
                            <div className={`rounded-3xl border-2 p-6 shadow-xl relative flex flex-col justify-between order-1 md:order-2 md:-translate-y-2 ${
                              isDarkMode 
                                ? 'border-amber-500/70 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900' 
                                : 'border-amber-400 bg-gradient-to-b from-amber-50 via-white to-white'
                            }`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 dark:text-amber-300 flex items-center justify-center font-black text-base border border-amber-500/60 shadow-md shadow-amber-500/20">
                                  🥇 #1
                                </div>
                                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300">{filteredList[0]?.roll_no}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                    {selectedLeaderboardYear === 'ALL' ? 'Department Rank 1' : `${selectedLeaderboardYear} Rank 1`}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                                    {filteredList[0]?.normalizedYear}
                                  </span>
                                </div>
                                <h4 className={`font-black text-lg truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filteredList[0]?.student_name}</h4>
                                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{filteredList[0]?.mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                <div>
                                  <span className="text-[10px] text-amber-600 dark:text-amber-300 font-bold uppercase tracking-wider block">Top Active Balance</span>
                                  {filteredList[0]?.displayCumulative !== filteredList[0]?.displayBalance && (
                                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-amber-300/60' : 'text-amber-700/70'}`}>Earned: +{filteredList[0]?.displayCumulative} RP</span>
                                  )}
                                </div>
                                <span className="text-xl font-black text-emerald-500 dark:text-emerald-400">+{filteredList[0]?.displayBalance || '0'} RP</span>
                              </div>
                            </div>

                            {/* Rank 3 (Bronze) */}
                            <div className={`rounded-3xl border p-5 shadow-lg relative flex flex-col justify-between order-3 ${
                              isDarkMode ? 'border-amber-900/60 bg-slate-900/90 text-slate-100' : 'border-amber-200 bg-white text-slate-900'
                            }`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm border ${
                                  isDarkMode ? 'bg-amber-950/40 text-amber-400 border-amber-800' : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}>
                                  🥉 #3
                                </div>
                                <span className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{filteredList[2]?.roll_no}</span>
                              </div>
                              <div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1 ${
                                  isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}>
                                  {filteredList[2]?.normalizedYear}
                                </span>
                                <h4 className={`font-extrabold text-base truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filteredList[2]?.student_name}</h4>
                                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{filteredList[2]?.mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                <div>
                                  <span className={`text-[10px] uppercase font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Balance</span>
                                  {filteredList[2]?.displayCumulative !== filteredList[2]?.displayBalance && (
                                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Earned: +{filteredList[2]?.displayCumulative} RP</span>
                                  )}
                                </div>
                                <span className="text-lg font-black text-emerald-500 dark:text-emerald-400">+{filteredList[2]?.displayBalance || '0'} RP</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Full Rankings Container */}
                        <div className={`rounded-3xl border overflow-hidden shadow-xl ${
                          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-md'
                        }`}>
                          <div className={`px-4 sm:px-6 py-3.5 sm:py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                            isDarkMode ? 'border-slate-800' : 'border-slate-200 bg-slate-50'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {selectedLeaderboardYear === 'ALL' ? 'All Years Leaderboard' : `${selectedLeaderboardYear} Leaderboard`}
                              </span>
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                isDarkMode ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              }`}>
                                {filteredList.length} Students
                              </span>
                            </div>
                            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              Sorted: Highest to Lowest Active Balance
                            </span>
                          </div>

                          {/* Mobile Responsive Ranking Cards (Phones < 640px) */}
                          <div className={`block sm:hidden divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
                            {filteredList.length === 0 ? (
                              <div className={`py-10 text-center font-medium text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                No students matching the selected year and search criteria.
                              </div>
                            ) : (
                              filteredList.map((st, index) => {
                                const rank = index + 1;
                                let rankBadge = (
                                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-extrabold text-xs border shadow-xs ${
                                    isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}>
                                    {rank}
                                  </span>
                                );
                                if (rank === 1) {
                                  rankBadge = <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black text-[11px] bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/60 shadow-xs">🥇 1</span>;
                                } else if (rank === 2) {
                                  rankBadge = <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-black text-[11px] border shadow-xs ${
                                    isDarkMode ? 'bg-slate-700 text-slate-200 border-slate-500' : 'bg-slate-200 text-slate-700 border-slate-400'
                                  }`}>🥈 2</span>;
                                } else if (rank === 3) {
                                  rankBadge = <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-600/40 shadow-xs">🥉 3</span>;
                                }

                                return (
                                  <div 
                                    key={st.roll_no}
                                    className={`py-4 px-3.5 flex items-center justify-between gap-3 transition-colors ${
                                      isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                                    } ${rank <= 3 ? (isDarkMode ? 'bg-slate-900/40' : 'bg-indigo-50/25') : ''}`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <div className="flex-shrink-0">
                                        {rankBadge}
                                      </div>
                                      <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <h4 className={`text-xs font-bold leading-tight truncate max-w-[170px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {st.student_name}
                                          </h4>
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium border flex-shrink-0 ${
                                            isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                                          }`}>
                                            {st.roll_no}
                                          </span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          <span className="font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">{st.normalizedYear}</span>
                                          {st.mentor_name && st.mentor_name !== 'N/A' && (
                                            <>
                                              <span className="opacity-40">•</span>
                                              <span className="truncate text-[10px]">{st.mentor_name}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-center gap-1 flex-shrink-0 pl-1">
                                      <span className="text-xs font-black text-emerald-500 dark:text-emerald-400 whitespace-nowrap">
                                        +{st.displayBalance} RP
                                      </span>
                                      {st.displayCumulative !== st.displayBalance && (
                                        <span className={`text-[9px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Earned: +{st.displayCumulative}
                                        </span>
                                      )}
                                      <button
                                        onClick={() => {
                                          const transformed = transformApiStudent(st);
                                          setSelectedStudent(transformed);
                                          setIsModalOpen(true);
                                        }}
                                        className="mt-0.5 px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
                                      >
                                        Inspect
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Desktop & Tablet Table (>= 640px) */}
                          <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className={`border-b text-[11px] lg:text-xs font-extrabold uppercase tracking-wider ${
                                  isDarkMode ? 'border-slate-700 bg-slate-800/80 text-slate-200' : 'border-slate-200 bg-slate-100 text-slate-700'
                                }`}>
                                  <th className="py-3.5 px-3 text-center w-12">RANK</th>
                                  <th className="py-3.5 px-3 lg:px-4">STUDENT NAME</th>
                                  <th className="py-3.5 px-3">ROLL NO</th>
                                  <th className="py-3.5 px-2.5 text-center">YEAR</th>
                                  <th className="py-3.5 px-3 lg:px-4">FACULTY MENTOR</th>
                                  <th className="py-3.5 px-3 lg:px-4 text-right">ACTIVE BALANCE</th>
                                  <th className="py-3.5 px-3 text-center">ACTION</th>
                                </tr>
                              </thead>
                              <tbody className={`text-xs divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
                                {filteredList.length === 0 ? (
                                  <tr>
                                    <td colSpan="7" className={`py-10 text-center font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                      No students matching the selected year and search criteria.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredList.map((st, index) => {
                                    const rank = index + 1;
                                    let rankBadge = (
                                      <span className={`inline-block w-7 h-7 leading-7 text-center rounded-full font-extrabold text-xs border ${
                                        isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                                      }`}>
                                        {rank}
                                      </span>
                                    );
                                    if (rank === 1) {
                                      rankBadge = <span className="inline-block px-2.5 py-0.5 rounded-full font-black text-xs bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/60">🥇 1</span>;
                                    } else if (rank === 2) {
                                      rankBadge = <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs border ${
                                        isDarkMode ? 'bg-slate-700 text-slate-200 border-slate-500' : 'bg-slate-200 text-slate-700 border-slate-400'
                                      }`}>🥈 2</span>;
                                    } else if (rank === 3) {
                                      rankBadge = <span className="inline-block px-2.5 py-0.5 rounded-full font-black text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-600/40">🥉 3</span>;
                                    }

                                    return (
                                      <tr 
                                        key={st.roll_no}
                                        className={`transition-colors ${
                                          isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                                        } ${rank <= 3 ? (isDarkMode ? 'bg-slate-900/40' : 'bg-indigo-50/20') : ''}`}
                                      >
                                        <td className="py-3.5 px-3 text-center font-bold">
                                          {rankBadge}
                                        </td>
                                        <td className={`py-3.5 px-3 lg:px-4 font-bold text-xs lg:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                          <div className="truncate max-w-[180px] lg:max-w-[240px] xl:max-w-none">
                                            {st.student_name}
                                          </div>
                                        </td>
                                        <td className={`py-3.5 px-3 font-mono font-medium whitespace-nowrap text-[11px] lg:text-xs ${
                                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                        }`}>
                                          {st.roll_no}
                                        </td>
                                        <td className="py-3.5 px-2.5 text-center whitespace-nowrap">
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                                            isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                                          }`}>
                                            {st.normalizedYear}
                                          </span>
                                        </td>
                                        <td className={`py-3.5 px-3 lg:px-4 font-medium text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                          <div className="truncate max-w-[140px] lg:max-w-[180px] xl:max-w-none">
                                            {st.mentor_name || 'N/A'}
                                          </div>
                                        </td>
                                        <td className="py-3.5 px-3 lg:px-4 text-right whitespace-nowrap">
                                          <div className="font-black text-xs lg:text-sm text-emerald-500 dark:text-emerald-400">
                                            +{st.displayBalance} RP
                                          </div>
                                          {st.displayBalance !== st.displayCumulative && (
                                            <div className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                              Earned: +{st.displayCumulative} RP
                                            </div>
                                          )}
                                        </td>
                                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                          <button
                                            onClick={() => {
                                              const transformed = transformApiStudent(st);
                                              setSelectedStudent(transformed);
                                              setIsModalOpen(true);
                                            }}
                                            className="px-3 py-1 rounded-full bg-indigo-600/80 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs"
                                          >
                                            Inspect
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* VIEW: REWARD POINTS & INTERNAL MARKS DISTRIBUTION (AWESOME TABLE & DATABASE) */}
          {activeNav === 'Internal Marks' && (
            <InternalMarksView currentUser={currentUser} isDarkMode={isDarkMode} />
          )}

          

          {/* VIEW 3: MENU DETAILS (CAMPUS MESS & DINING) */}
          {/* VIEW 3: MENU DETAILS (CAMPUS MESS & DINING) */}
          {activeNav === 'Menu Details' && (
            <div className="max-w-6xl mx-auto w-full space-y-6">
              {/* Header & Hostel Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Campus Dining & Mess Menu
                  </h1>
                </div>

                {/* Hostel Switcher Pills */}
                <div className={`p-1 rounded-2xl border flex items-center gap-1 self-start sm:self-auto ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200 shadow-xs'
                }`}>
                  <button
                    onClick={() => setMessHostel('boys')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      messHostel === 'boys'
                        ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-600/30'
                        : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>👨 Boys Hostel</span>
                  </button>
                  <button
                    onClick={() => setMessHostel('girls')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      messHostel === 'girls'
                        ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-600/30'
                        : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>👩 Girls Hostel</span>
                  </button>
                </div>
              </div>



              {/* Date Navigation & Controls Bar */}
              <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => changeMessDateBy(-1)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Previous Day"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {messData?.day ? `${messData.day}, ` : ''}{selectedMessDate}
                    </span>
                  </div>

                  <button
                    onClick={() => changeMessDateBy(1)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Next Day"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* HTML Date Picker Input for instant calendar jumping */}
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedMessDate}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedMessDate(e.target.value);
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer outline-none transition-all ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                      title="Choose custom date"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={setMessDateToday}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => fetchMessMenu(messHostel, selectedMessDate)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Refresh Menu"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingMess ? 'animate-spin text-indigo-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Live Data Rendering */}
              {loadingMess ? (
                <div className={`p-12 text-center rounded-3xl border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                }`}>
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="font-semibold text-sm">Fetching campus mess schedule...</p>
                </div>
              ) : messError ? (
                <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{messError}</span>
                  <button
                    onClick={() => fetchMessMenu(messHostel, selectedMessDate)}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-all cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : messData ? (
                <div className="space-y-6">
                  {/* Current Meal Active Banner */}
                  {messData.current_meal && (
                    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                            🔥 CURRENT MEAL: {messData.current_meal.meal_type}
                          </span>
                          <span className="text-xs text-indigo-100 flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            {messData.current_meal.start_time} - {messData.current_meal.end_time}
                          </span>
                        </div>
                        <span className="text-xs text-indigo-100 font-mono">
                          {messData.hostel === 'boys' ? 'Boys Mess' : 'Girls Mess'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {Array.isArray(messData.current_meal.items) && messData.current_meal.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-xs sm:text-sm font-bold border border-white/20 shadow-xs"
                          >
                            🍽️ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3 Meal Cards: Breakfast, Lunch, Dinner */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Breakfast Card */}
                    <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
                    }`}>
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                            <Coffee className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              Breakfast
                            </h3>
                            <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              07:30 AM - 09:00 AM
                            </span>
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {messData.full_menu?.breakfast?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{item}</span>
                          </li>
                        )) || (
                          <li className="text-xs text-slate-400 italic">No breakfast items listed</li>
                        )}
                      </ul>
                    </div>

                    {/* Lunch Card */}
                    <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
                    }`}>
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                            <Utensils className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              Lunch
                            </h3>
                            <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              12:00 PM - 02:00 PM
                            </span>
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {messData.full_menu?.lunch?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{item}</span>
                          </li>
                        )) || (
                          <li className="text-xs text-slate-400 italic">No lunch items listed</li>
                        )}
                      </ul>
                    </div>

                    {/* Dinner Card */}
                    <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
                    }`}>
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                            <UtensilsCrossed className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              Dinner
                            </h3>
                            <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              07:00 PM - 08:30 PM
                            </span>
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {messData.full_menu?.dinner?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                            <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{item}</span>
                          </li>
                        )) || (
                          <li className="text-xs text-slate-400 italic">No dinner items listed</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* VIEW 3.5: LEAVE SCHEDULE */}
          {activeNav === 'Leave Schedule' && (
            <div className="max-w-6xl mx-auto w-full space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60 uppercase tracking-wider">
                      Academic Year 2026 – 2027
                    </span>
                  </div>
                  <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    College Leave Schedule
                  </h1>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Official BIT General Permissions (GP), festival holidays, and academic calendar leaves.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={fetchLeavesSchedule}
                    disabled={loadingLeaves}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDarkMode 
                        ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingLeaves ? 'animate-spin text-indigo-500' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <div className={`text-xs font-semibold px-3 py-2 rounded-xl border flex items-center gap-1.5 ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Total: <strong className="font-mono text-indigo-500 dark:text-indigo-400">{leavesList.length || 21} Leaves</strong></span>
                  </div>
                </div>
              </div>



              {/* Top Highlight Metric Cards */}
              {(() => {
                const todayStr = new Date().toISOString().slice(0, 10);
                const nextLeave = (leavesList || []).find(l => (l.to_date || l.from_date) >= todayStr) || (leavesList && leavesList[0]);
                const gpCount = (leavesList || []).filter(l => (l.name || '').toLowerCase().includes('gp')).length;
                const festCount = (leavesList || []).filter(l => !(l.name || '').toLowerCase().includes('gp')).length;
                const upcomingCount = (leavesList || []).filter(l => (l.to_date || l.from_date) >= todayStr).length;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* Next Upcoming Holiday Card */}
                    <div className="sm:col-span-2 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border border-slate-800 border-l-4 border-l-indigo-500">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            <span>Next Upcoming Leave</span>
                          </span>
                          {nextLeave && nextLeave.from_half_day && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                              {nextLeave.from_half_day} Session Gate Pass
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                          {nextLeave ? nextLeave.name : 'Academic Leave Schedule'}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 font-medium">
                          {nextLeave 
                            ? `Scheduled from ${nextLeave.from_date}${nextLeave.to_date && nextLeave.to_date !== nextLeave.from_date ? ` to ${nextLeave.to_date}` : ''} ${nextLeave.day ? `(${nextLeave.day})` : ''}` 
                            : 'All official General Permissions and holidays are active.'}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-indigo-300 font-medium flex items-center gap-1.5">
                          <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{upcomingCount} Upcoming Leaves Remaining</span>
                        </span>
                        <span className="text-[11px] font-mono bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">
                          {nextLeave?.from_date || 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* General Permissions (GP) Card */}
                    <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          General Permissions
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                          <Compass className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                          {gpCount || 8} <span className="text-xs font-semibold text-slate-400">GPs</span>
                        </div>
                        <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Scheduled long-weekend breaks with gate passes.
                        </p>
                      </div>
                    </div>

                    {/* Festival & National Holidays Card */}
                    <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Festivals & Holidays
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                          {festCount || 13} <span className="text-xs font-semibold text-slate-400">Days</span>
                        </div>
                        <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Gazetted national holidays and festival leaves.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Filters & Search Controls */}
              <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
                isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
                  {[
                    { id: 'ALL', label: `All Leaves (${leavesList.length || 21})` },
                    { id: 'UPCOMING', label: 'Upcoming' },
                    { id: 'GP', label: 'General Permissions' },
                    { id: 'HOLIDAY', label: 'Festivals & National' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedLeaveFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedLeaveFilter === f.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isDarkMode 
                            ? 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700' 
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-72">
                  <Search className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={leaveSearchQuery}
                    onChange={(e) => setLeaveSearchQuery(e.target.value)}
                    placeholder="Search holiday, month..."
                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                    }`}
                  />
                  {leaveSearchQuery && (
                    <button
                      onClick={() => setLeaveSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Leaves Grid */}
              {loadingLeaves ? (
                <div className={`p-12 rounded-3xl border text-center ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm font-semibold text-slate-400">Loading live college leave schedule from BIT Central...</p>
                </div>
              ) : leavesError ? (
                <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center">
                  <p className="text-sm font-semibold mb-2">{leavesError}</p>
                  <button
                    onClick={fetchLeavesSchedule}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-rose-700"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : (() => {
                const todayStr = new Date().toISOString().slice(0, 10);
                
                const filtered = (leavesList || []).filter(item => {
                  const nameMatch = (item.name || '').toLowerCase().includes(leaveSearchQuery.toLowerCase()) ||
                                   (item.from_date || '').includes(leaveSearchQuery) ||
                                   (item.to_date || '').includes(leaveSearchQuery) ||
                                   (item.day || '').toLowerCase().includes(leaveSearchQuery.toLowerCase());
                  if (!nameMatch) return false;

                  const isGP = (item.name || '').toLowerCase().includes('gp');
                  const isUpcoming = (item.to_date || item.from_date) >= todayStr;

                  if (selectedLeaveFilter === 'UPCOMING') return isUpcoming;
                  if (selectedLeaveFilter === 'GP') return isGP;
                  if (selectedLeaveFilter === 'HOLIDAY') return !isGP;
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className={`p-10 rounded-3xl border text-center ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
                    }`}>
                      <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                      <p className="text-sm font-bold">No leaves match your current search or filter.</p>
                      <button
                        onClick={() => { setSelectedLeaveFilter('ALL'); setLeaveSearchQuery(''); }}
                        className="mt-3 text-xs font-bold text-indigo-500 hover:underline"
                      >
                        Reset Filters
                      </button>
                    </div>
                  );
                }

                // Month formatter helper
                const getMonthName = (dateStr) => {
                  if (!dateStr) return 'DATE';
                  const parts = dateStr.split('-');
                  if (parts.length < 2) return 'DATE';
                  const mIndex = parseInt(parts[1], 10) - 1;
                  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                  return months[mIndex] || 'DATE';
                };

                const getDayString = (fromDate, toDate) => {
                  if (!fromDate) return '--';
                  const p1 = fromDate.split('-');
                  const d1 = parseInt(p1[2], 10) || fromDate;
                  if (toDate && toDate !== fromDate) {
                    const p2 = toDate.split('-');
                    const d2 = parseInt(p2[2], 10) || toDate;
                    return `${d1}-${d2}`;
                  }
                  return `${d1}`;
                };

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((leave, idx) => {
                      const isGP = (leave.name || '').toLowerCase().includes('gp');
                      const isMultiDay = leave.from_date && leave.to_date && leave.from_date !== leave.to_date;
                      const isUpcoming = (leave.to_date || leave.from_date) > todayStr;
                      const isToday = (leave.from_date <= todayStr && (leave.to_date || leave.from_date) >= todayStr);

                      // Calculate duration days
                      let durationDays = 1;
                      if (leave.from_date && leave.to_date) {
                        const d1 = new Date(leave.from_date);
                        const d2 = new Date(leave.to_date);
                        durationDays = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
                      }

                      const monthLabel = getMonthName(leave.from_date);
                      const dayLabel = getDayString(leave.from_date, leave.to_date);

                      return (
                        <div
                          key={idx}
                          className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                            isToday
                              ? 'bg-amber-500/5 border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                              : isUpcoming
                                ? isDarkMode
                                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-md'
                                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
                                : isDarkMode
                                  ? 'bg-slate-900/40 border-slate-800/60 opacity-65'
                                  : 'bg-slate-50/70 border-slate-200/80 opacity-70'
                          }`}
                        >
                          <div>
                            {/* Card Header Tag & Status */}
                            <div className="flex items-center justify-between gap-2 mb-3.5">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                isGP
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}>
                                {isGP ? 'General Permission' : 'Holiday'}
                              </span>

                              {isToday ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Today
                                </span>
                              ) : isUpcoming ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Upcoming
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                                  Completed
                                </span>
                              )}
                            </div>

                            {/* Clean Date Badge + Holiday Name */}
                            <div className="flex items-start gap-3.5 mt-1">
                              {/* Sleek Minimalist Date Tile */}
                              <div className={`flex flex-col items-center justify-center w-14 rounded-xl border overflow-hidden flex-shrink-0 text-center ${
                                isToday
                                  ? 'border-amber-400/80 bg-amber-500/10'
                                  : isUpcoming
                                    ? isDarkMode
                                      ? 'border-slate-700 bg-slate-800'
                                      : 'border-slate-200 bg-slate-100'
                                    : isDarkMode
                                      ? 'border-slate-800 bg-slate-900/80'
                                      : 'border-slate-200 bg-slate-100/60'
                              }`}>
                                <div className={`w-full text-[9px] font-extrabold uppercase py-0.5 ${
                                  isToday
                                    ? 'bg-amber-500 text-white'
                                    : isGP
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-slate-700 text-slate-200'
                                }`}>
                                  {monthLabel}
                                </div>
                                <div className={`text-xs font-mono font-black py-1 px-1 ${
                                  isDarkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  {dayLabel}
                                </div>
                              </div>

                              {/* Title & Day Subtitle */}
                              <div className="min-w-0 flex-1">
                                <h3 className={`text-sm sm:text-base font-bold tracking-tight leading-snug truncate ${
                                  isDarkMode ? 'text-white' : 'text-slate-900'
                                }`} title={leave.name}>
                                  {leave.name}
                                </h3>
                                <p className={`text-xs font-medium mt-0.5 ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  {leave.dateDisplay || leave.day || (isMultiDay ? 'Multi-day leave' : 'Single day')}
                                </p>
                                {leave.remarks && (
                                  <div className="mt-2 text-[10px] font-semibold px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                    <span>⚠️ {leave.remarks}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Date Range & Session Footer */}
                          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                            isDarkMode ? 'border-slate-800' : 'border-slate-100'
                          }`}>
                            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                              {leave.from_date}
                              {isMultiDay && <span> → {leave.to_date}</span>}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {leave.from_half_day && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-mono">
                                  {leave.from_half_day} Gate Pass
                                </span>
                              )}
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                                isMultiDay
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}>
                                {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* VIEW: STUDENT-TO-MENTOR MAPPING DIRECTORY */}
          {activeNav === 'Student Mentors' && (
            <div className="max-w-6xl mx-auto w-full">
              <StudentMentorMappingView
                currentUser={currentUser}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* VIEW 3.6: FACULTY DIRECTORY */}
          {activeNav === 'Faculty Directory' && (
            <div className="max-w-6xl mx-auto w-full space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800/60 uppercase tracking-wider">
                      BIT Campus Directory • 331+ Members
                    </span>
                  </div>
                  <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Faculty & Staff Directory
                  </h1>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Official contact repository for professors, assistant professors, and mentors across all BIT engineering and science departments.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={fetchFacultyDirectory}
                    disabled={loadingFaculty}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDarkMode 
                        ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingFaculty ? 'animate-spin text-purple-500' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <div className={`text-xs font-semibold px-3 py-2 rounded-xl border flex items-center gap-1.5 ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}>
                    <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                    <span>Total: <strong className="font-mono text-purple-500 dark:text-purple-400">{facultyList.length || 331} Faculty</strong></span>
                  </div>
                </div>
              </div>

              {/* Dynamic Department Extraction & Filtering */}
              {(() => {
                // Extract unique departments & counts
                const deptCountMap = {};
                (facultyList || []).forEach(f => {
                  const d = (f.department || 'OTHER').trim().toUpperCase();
                  deptCountMap[d] = (deptCountMap[d] || 0) + 1;
                });

                const sortedDepts = Object.keys(deptCountMap).sort((a, b) => deptCountMap[b] - deptCountMap[a]);

                // Filter faculty list by search query and selected department
                const q = facultySearchQuery.toLowerCase().trim();
                const filteredFaculty = (facultyList || []).filter(f => {
                  const dept = (f.department || '').trim().toUpperCase();
                  if (selectedFacultyDept !== 'ALL' && dept !== selectedFacultyDept) {
                    return false;
                  }
                  if (!q) return true;
                  const nameMatch = (f.name || '').toLowerCase().includes(q);
                  const emailMatch = (f.email || '').toLowerCase().includes(q);
                  const phoneMatch = (f.phone || '').toLowerCase().includes(q);
                  const deptMatch = dept.toLowerCase().includes(q);
                  const titleMatch = (f.job_title || '').toLowerCase().includes(q);
                  return nameMatch || emailMatch || phoneMatch || deptMatch || titleMatch;
                });

                const getInitials = (name) => {
                  if (!name) return 'FC';
                  const parts = name.trim().split(/\s+/);
                  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
                };

                const copyToClipboard = (text, type, id) => {
                  if (!text) return;
                  if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(text);
                  }
                  setCopiedFacultyContact({ id, type });
                  setTimeout(() => {
                    setCopiedFacultyContact(null);
                  }, 2000);
                };

                return (
                  <div className="space-y-6">
                    {/* Top Highlight Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {/* Card 1: Total Faculty */}
                      <div className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                      }`}>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Verified BIT Faculty
                          </span>
                          <div className="text-2xl font-black font-mono mt-1 text-purple-600 dark:text-purple-400">
                            {facultyList.length || 331}
                          </div>
                          <span className={`text-[11px] font-medium mt-0.5 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Across all disciplines
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                          <Users className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Card 2: Total Departments */}
                      <div className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                      }`}>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Academic Departments
                          </span>
                          <div className="text-2xl font-black font-mono mt-1 text-indigo-600 dark:text-indigo-400">
                            {sortedDepts.length || 27}
                          </div>
                          <span className={`text-[11px] font-medium mt-0.5 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Engineering & Sciences
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                          <Building2 className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Card 3: Active Filter Results */}
                      <div className={`p-5 rounded-3xl border sm:col-span-2 lg:col-span-1 flex items-center justify-between transition-all ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                      }`}>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Matching Results
                          </span>
                          <div className="text-2xl font-black font-mono mt-1 text-emerald-600 dark:text-emerald-400">
                            {filteredFaculty.length}
                          </div>
                          <span className={`text-[11px] font-medium mt-0.5 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {selectedFacultyDept === 'ALL' ? 'In all departments' : `In ${selectedFacultyDept} department`}
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Search & Department Filters Bar */}
                    <div className={`p-3.5 sm:p-5 rounded-3xl border space-y-3 sm:space-y-3.5 transition-all ${
                      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      {/* Search Bar */}
                      <div className="relative w-full">
                        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                        <input
                          type="text"
                          value={facultySearchQuery}
                          onChange={(e) => setFacultySearchQuery(e.target.value)}
                          placeholder="Search by faculty name, dept, email..."
                          className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                            isDarkMode 
                              ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                        {facultySearchQuery && (
                          <button
                            onClick={() => setFacultySearchQuery('')}
                            className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-xs transition-all ${
                              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Professional Department Dropdown & Redesigned Reset Button Row */}
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex-1">
                          <Filter className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-500" />
                          <select
                            value={selectedFacultyDept}
                            onChange={(e) => setSelectedFacultyDept(e.target.value)}
                            className={`w-full appearance-none pl-9 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all outline-none cursor-pointer ${
                              isDarkMode 
                                ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30' 
                                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
                            }`}
                          >
                            <option value="ALL">All Departments ({facultyList.length || 331})</option>
                            {sortedDepts.map(dept => (
                              <option key={dept} value={dept}>
                                {dept} ({deptCountMap[dept] || 0} Faculty)
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                        </div>

                        {/* Professional Reset Button */}
                        <button
                          onClick={() => { setSelectedFacultyDept('ALL'); setFacultySearchQuery(''); }}
                          disabled={selectedFacultyDept === 'ALL' && !facultySearchQuery}
                          className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                            selectedFacultyDept !== 'ALL' || facultySearchQuery
                              ? 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-500 shadow-md shadow-purple-500/20 cursor-pointer active:scale-95'
                              : isDarkMode
                                ? 'border border-slate-800 bg-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
                                : 'border border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-50'
                          }`}
                          title="Reset search and filters"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>

                      {/* Department Chips with Left and Right Scroll Arrows */}
                      <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5">
                        {/* Left Scroll Arrow Button */}
                        <button
                          onClick={() => facultyChipsRef.current?.scrollBy({ left: -140, behavior: 'smooth' })}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer active:scale-95 ${
                            isDarkMode 
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-purple-600 hover:text-white hover:border-purple-600' 
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 shadow-2xs'
                          }`}
                          title="Scroll left"
                          aria-label="Scroll left"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Scrollable Department Chips Container */}
                        <div 
                          ref={facultyChipsRef}
                          className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 scroll-smooth scrollbar-none"
                        >
                          <button
                            onClick={() => setSelectedFacultyDept('ALL')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                              selectedFacultyDept === 'ALL'
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                                : isDarkMode
                                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            <span>All Departments</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                              selectedFacultyDept === 'ALL' ? 'bg-purple-800 text-purple-100' : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {facultyList.length || 331}
                            </span>
                          </button>

                          {sortedDepts.map(dept => {
                            const count = deptCountMap[dept] || 0;
                            const isSelected = selectedFacultyDept === dept;
                            return (
                              <button
                                key={dept}
                                onClick={() => setSelectedFacultyDept(dept)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                                  isSelected
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                                    : isDarkMode
                                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                                }`}
                              >
                                <span>{dept}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                                  isSelected ? 'bg-purple-800 text-purple-100' : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Right Scroll Arrow Button */}
                        <button
                          onClick={() => facultyChipsRef.current?.scrollBy({ left: 140, behavior: 'smooth' })}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer active:scale-95 ${
                            isDarkMode 
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-purple-600 hover:text-white hover:border-purple-600' 
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 shadow-2xs'
                          }`}
                          title="Scroll right"
                          aria-label="Scroll right"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Faculty Cards Grid */}
                    {loadingFaculty && facultyList.length === 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <div key={n} className={`p-5 rounded-3xl border animate-pulse space-y-4 ${
                            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-2xl bg-slate-700/50" />
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-slate-700/50 rounded-md w-3/4" />
                                <div className="h-3 bg-slate-700/30 rounded-md w-1/2" />
                              </div>
                            </div>
                            <div className="h-8 bg-slate-700/30 rounded-xl" />
                          </div>
                        ))}
                      </div>
                    ) : filteredFaculty.length === 0 ? (
                      <div className={`p-10 rounded-3xl border text-center space-y-3 ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                          <Users className="w-7 h-7" />
                        </div>
                        <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          No faculty members found
                        </h3>
                        <p className={`text-xs max-w-md mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          No staff members matched your current filter &quot;{facultySearchQuery || selectedFacultyDept}&quot;. Try resetting your search query or selecting All Departments.
                        </p>
                        <button
                          onClick={() => { setFacultySearchQuery(''); setSelectedFacultyDept('ALL'); }}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {filteredFaculty.map((f, idx) => {
                          const isCopiedEmail = copiedFacultyContact?.id === f.id && copiedFacultyContact?.type === 'email';
                          const isCopiedPhone = copiedFacultyContact?.id === f.id && copiedFacultyContact?.type === 'phone';

                          return (
                            <div 
                              key={f.id || idx}
                              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all hover:shadow-lg ${
                                isDarkMode 
                                  ? 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700' 
                                  : 'bg-white border-slate-200/90 hover:border-purple-200 shadow-xs'
                              }`}
                            >
                              <div>
                                {/* Top Avatar + Department Badge */}
                                <div className="flex items-start gap-3.5 mb-3.5">
                                  <div className="relative flex-shrink-0">
                                    {f.photo_url ? (
                                      <img
                                        src={f.photo_url}
                                        alt={f.name}
                                        className="w-13 h-13 rounded-2xl object-cover border border-purple-500/20 shadow-xs"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.style.display = 'none';
                                          if (e.target.nextSibling) {
                                            e.target.nextSibling.style.display = 'flex';
                                          }
                                        }}
                                      />
                                    ) : null}
                                    <div 
                                      className={`w-13 h-13 rounded-2xl items-center justify-center font-black text-sm text-purple-200 bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-500/30 ${
                                        f.photo_url ? 'hidden' : 'flex'
                                      }`}
                                    >
                                      {getInitials(f.name)}
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/25">
                                        {f.department || 'FACULTY'}
                                      </span>
                                      {f.job_title && (
                                        <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${
                                          isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                                        }`}>
                                          {f.job_title}
                                        </span>
                                      )}
                                    </div>
                                    <h4 className={`text-sm sm:text-base font-black tracking-tight leading-snug truncate ${
                                      isDarkMode ? 'text-white' : 'text-slate-900'
                                    }`} title={f.name}>
                                      {f.name}
                                    </h4>
                                    <span className={`text-[11px] font-medium block truncate ${
                                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                      Bannari Amman Institute of Technology
                                    </span>
                                  </div>
                                </div>

                                {/* Contact Information Items */}
                                <div className={`p-3 rounded-2xl border space-y-2 text-xs mb-3.5 ${
                                  isDarkMode ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50/70 border-slate-200/80'
                                }`}>
                                  {/* Official Email */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                                      <a 
                                        href={`mailto:${f.email}`}
                                        className={`font-mono text-[11px] truncate hover:underline ${
                                          isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-purple-600'
                                        }`}
                                        title={f.email}
                                      >
                                        {f.email || 'N/A'}
                                      </a>
                                    </div>
                                    {f.email && (
                                      <button
                                        onClick={() => copyToClipboard(f.email, 'email', f.id)}
                                        className={`p-1 rounded-md transition-all cursor-pointer ${
                                          isCopiedEmail 
                                            ? 'text-emerald-500 bg-emerald-500/10' 
                                            : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                                        }`}
                                        title="Copy Email"
                                      >
                                        {isCopiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                      </button>
                                    )}
                                  </div>

                                  {/* Phone / Mobile */}
                                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Phone className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                      <a 
                                        href={`tel:${f.phone}`}
                                        className={`font-mono text-[11px] truncate hover:underline ${
                                          isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-indigo-600'
                                        }`}
                                        title={f.phone}
                                      >
                                        {f.phone ? `+91 ${f.phone}` : 'N/A'}
                                      </a>
                                    </div>
                                    {f.phone && (
                                      <button
                                        onClick={() => copyToClipboard(f.phone, 'phone', f.id)}
                                        className={`p-1 rounded-md transition-all cursor-pointer ${
                                          isCopiedPhone 
                                            ? 'text-emerald-500 bg-emerald-500/10' 
                                            : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                                        }`}
                                        title="Copy Phone Number"
                                      >
                                        {isCopiedPhone ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <a
                                  href={`mailto:${f.email}`}
                                  className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer text-center"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Send Email</span>
                                </a>

                                <a
                                  href={`tel:${f.phone}`}
                                  className={`w-full py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                                    isDarkMode 
                                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200' 
                                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
                                  }`}
                                >
                                  <Phone className="w-3 h-3 text-indigo-500" />
                                  <span>Call Staff</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* VIEW 3.8: BIT MAP & CAMPUS VENUE LOCATOR */}
          {activeNav === 'GeoBITS' && (
            <div className="max-w-6xl mx-auto w-full space-y-4 animate-fadeIn">
              {/* Responsive Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider">
                      Interactive 3D / 2D GPS
                    </span>
                  </div>
                  <h1 className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    BIT Campus Map & Venue Locator
                  </h1>
                  <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Search any classroom, exam hall, lab, or academic block. Use the search bar inside the map to automatically hover and navigate.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <a
                    href="https://geobits.onrender.com"
                    target="_blank"
                    rel="noreferrer"
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      isDarkMode 
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4 text-indigo-500" />
                    <span>Open in Fullscreen</span>
                  </a>
                </div>
              </div>

              {/* Live Interactive Map Canvas */}
              <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden shadow-xl transition-all relative ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div className="relative w-full h-[72vh] sm:h-[760px] min-h-[520px] bg-slate-950">
                  <iframe
                    src="https://geobits.onrender.com"
                    title="BIT Campus Map"
                    className="w-full h-full border-0"
                    allow="geolocation; fullscreen"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3.9: BIT PLACEMENT & CAREER DESK */}
          {activeNav === 'BIT Placements' && (() => {
            const filteredTiers = BIT_DAILY_PLACEMENT_DATA.salaryTiers.filter(tier => {
              const matchesTier = placementSelectedTier === 'All' || tier.tier === placementSelectedTier;
              const q = placementSearchQuery.trim().toLowerCase();
              if (!q) return matchesTier;

              const matchesQuery =
                tier.tier.toLowerCase().includes(q) ||
                tier.tierCategory.toLowerCase().includes(q) ||
                tier.companies.some(c => c.toLowerCase().includes(q));

              return matchesTier && matchesQuery;
            });

            return (
              <div className="max-w-6xl mx-auto w-full space-y-5 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-1">
                  <div>
                    <h1 className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Placement Details Of {BIT_DAILY_PLACEMENT_DATA.targetBatch}
                    </h1>
                    <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                      <span><strong>Note:</strong> All data will be updated daily by evening by 5-6 PM.</span>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`text-xs font-semibold px-3.5 py-2 rounded-xl border flex items-center gap-2 ${
                      isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Updated: <strong className="text-emerald-500 font-mono">{BIT_DAILY_PLACEMENT_DATA.lastUpdated}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Featured Placement Hero Banner Slider (Matching Home Page Slider) */}
                <PlacementHeroSlider
                  placementData={BIT_DAILY_PLACEMENT_DATA}
                  setPlacementActiveTab={setPlacementActiveTab}
                  setPlacementSelectedTier={setPlacementSelectedTier}
                />

                {/* Sub-view Navigation Tabs with Left/Right Arrows */}
                <div className="relative flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('placement-nav-tabs');
                      if (el) el.scrollBy({ left: -150, behavior: 'smooth' });
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                      isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                    }`}
                    aria-label="Scroll Tabs Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div id="placement-nav-tabs" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth flex-1">
                    <button
                      type="button"
                      onClick={() => setPlacementActiveTab('insights')}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                        placementActiveTab === 'insights'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Placed Offers & Companies</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlacementActiveTab('drives')}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                        placementActiveTab === 'drives'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>Upcoming Drives & Contests</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('placement-nav-tabs');
                      if (el) el.scrollBy({ left: 150, behavior: 'smooth' });
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                      isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                    }`}
                    aria-label="Scroll Tabs Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* TAB 1: STRUCTURED PLACEMENT DIRECTORY */}
                {placementActiveTab === 'insights' && (
                  <div className="space-y-4">
                    {/* Search & Tier Filter Bar */}
                    <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border space-y-4 ${
                      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={placementSearchQuery}
                            onChange={(e) => setPlacementSearchQuery(e.target.value)}
                            placeholder="Search by company name (e.g. Zoho, Caterpillar, TCS, Soliton)..."
                            className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                              isDarkMode
                                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                          {placementSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setPlacementSearchQuery('')}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Salary Tier Selector Pills with Left/Right Arrows */}
                      <div className="relative flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('placement-tier-pills');
                            if (el) el.scrollBy({ left: -140, behavior: 'smooth' });
                          }}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          }`}
                          aria-label="Scroll Tiers Left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <div id="placement-tier-pills" className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth flex-1">
                          {['All', '10 LPA & Above', '7 - 10 LPA', '6 - 7 LPA', '5 - 6 LPA', '4 - 5 LPA', '3 - 4 LPA'].map((tierName, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPlacementSelectedTier(tierName)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                                placementSelectedTier === tierName
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : isDarkMode
                                    ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                              }`}
                            >
                              {tierName === 'All' ? 'All Salary Tiers' : tierName}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('placement-tier-pills');
                            if (el) el.scrollBy({ left: 140, behavior: 'smooth' });
                          }}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          }`}
                          aria-label="Scroll Tiers Right"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Salary Tier Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTiers.map((tier, idx) => (
                        <div
                          key={idx}
                          className={`p-5 sm:p-6 rounded-3xl border space-y-4 flex flex-col justify-between transition-all hover:shadow-lg ${
                            isDarkMode
                              ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                          }`}
                        >
                          <div>
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${tier.badgeColor}`}>
                                  {tier.tierCategory}
                                </span>
                                <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {tier.tier}
                                </h3>
                              </div>

                              <div className="text-right">
                                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-500">
                                  {tier.offerCount}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Offers
                                </span>
                              </div>
                            </div>

                            {/* Companies Visited in this Tier */}
                            <div className="space-y-2 pt-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Hiring Partners ({tier.companies.length} Companies):
                              </span>
                              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                                {tier.companies.map((company, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                                      isDarkMode
                                        ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                                        : 'bg-slate-100 border-slate-200 text-slate-800'
                                    }`}
                                  >
                                    {company}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                            <span>Range: {tier.range}</span>
                            <span className="text-emerald-500 font-bold">{tier.offerCount} Placed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: UPCOMING DRIVES & CONTESTS (PAGE 7 DATA) */}
                {placementActiveTab === 'drives' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Upcoming Placement Drive Card */}
                      {BIT_DAILY_PLACEMENT_DATA.upcomingDrives.map((drive, dIdx) => (
                        <div
                          key={dIdx}
                          className={`p-6 rounded-3xl border space-y-4 relative overflow-hidden ${
                            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider">
                                {drive.badge}
                              </span>
                              <h3 className={`text-xl font-extrabold tracking-tight mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {drive.company}
                              </h3>
                              <p className="text-xs text-slate-400 font-medium mt-0.5">{drive.role}</p>
                            </div>

                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping self-start mt-1" />
                          </div>

                          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                            isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-semibold">Target Batch:</span>
                              <strong className="text-slate-900 dark:text-white">{drive.targetBatch}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-semibold">Drive Window:</span>
                              <strong className="text-indigo-500 font-mono">{drive.startDate} – {drive.endDate}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-semibold">Eligibility:</span>
                              <strong className="text-emerald-500">{drive.eligibility}</strong>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Contests Card */}
                      {BIT_DAILY_PLACEMENT_DATA.upcomingContests.map((contest, cIdx) => (
                        <div
                          key={cIdx}
                          className={`p-6 rounded-3xl border space-y-4 relative overflow-hidden ${
                            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
                                Technical Contest & Hiring
                              </span>
                              <h3 className={`text-xl font-extrabold tracking-tight mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {contest.name}
                              </h3>
                              <p className="text-xs text-slate-400 font-medium mt-0.5">{contest.type}</p>
                            </div>

                            <Sparkles className="w-5 h-5 text-purple-500" />
                          </div>

                          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                            isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-semibold">Status:</span>
                              <strong className="text-emerald-500">{contest.status}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-semibold">Timeline:</span>
                              <strong className="text-purple-500 font-mono">{contest.endDate}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* VIEW 4: SETTINGS */}
          {activeNav === 'Settings' && (
            <div className="max-w-5xl mx-auto w-full space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    User Settings & Preferences
                  </h1>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Manage your account details, portal appearance, and session security.
                  </p>
                </div>
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border self-start sm:self-auto ${
                  isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  Student ID: <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">{currentUser?.id || currentUser?.roll_no || displayedStudent?.id || '7376232CT109'}</span>
                </div>
              </div>

              {/* 2-Column Responsive Card Grid on Desktop / Tablet */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card: Account & Department Profile (5 cols) */}
                <div className={`lg:col-span-5 rounded-3xl border p-6 sm:p-7 space-y-5 shadow-xl flex flex-col justify-between ${
                  isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-md'
                }`}>
                  <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span>Account Information</span>
                    </h3>

                    <div className={`p-4 rounded-2xl border flex items-center gap-4 mb-4 ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border-2 ${
                        isDarkMode ? 'border-slate-700' : 'border-slate-300'
                      }`}>
                        <AvatarImage
                          src={currentUser?.picture || currentUser?.photo_url || displayedStudent?.picture}
                          alt={currentUser?.name || displayedStudent?.name || 'Student'}
                          initials={currentUser?.initials || displayedStudent?.initials}
                          fallbackBg={currentUser?.avatarBg || displayedStudent?.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-bold text-base truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentUser?.name || displayedStudent?.name || 'DHARINEESH V'}</h4>
                        <p className={`text-xs font-mono truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{currentUser?.email || currentUser?.id || displayedStudent?.id || 'dharineesh.ct23@bitsathy.ac.in'}</p>
                        <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isDarkMode ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          Verified Student
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Department
                        </label>
                        <input
                          type="text"
                          disabled
                          value={currentUser?.department || displayedStudent?.department || 'COMPUTER TECHNOLOGY'}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-not-allowed ${
                            isDarkMode ? 'bg-slate-800/70 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Session Security
                        </label>
                        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          isDarkMode ? 'bg-slate-800/40 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Auto-logout Timeout</span>
                          </span>
                          <span className="font-bold text-emerald-500 dark:text-emerald-400">10 mins</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout Account</span>
                    </button>
                  </div>
                </div>

                {/* Right Card: Appearance & Theme Selector (7 cols) */}
                <div className={`lg:col-span-7 rounded-3xl border p-6 sm:p-7 space-y-6 shadow-xl flex flex-col justify-between ${
                  isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-md'
                }`}>
                  <div className="space-y-5">
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        <span>Display Theme & Appearance</span>
                      </h3>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Choose how Rewards Points site looks on your device.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setTheme('system')}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center font-bold text-xs transition-all cursor-pointer ${
                          themeMode === 'system'
                            ? isDarkMode
                              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400/40'
                              : 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/40'
                            : isDarkMode
                              ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <Monitor className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        <div>
                          <div className="font-extrabold">System Default</div>
                          <div className="text-[10px] font-normal opacity-75 mt-0.5">
                            {systemIsDark ? 'Currently Dark' : 'Currently Light'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center font-bold text-xs transition-all cursor-pointer ${
                          themeMode === 'dark'
                            ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400/40'
                            : isDarkMode
                              ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <Moon className="w-5 h-5 text-indigo-400" />
                        <div>
                          <div className="font-extrabold">Dark Theme</div>
                          <div className="text-[10px] font-normal opacity-75 mt-0.5">Midnight Slate</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center font-bold text-xs transition-all cursor-pointer ${
                          themeMode === 'light'
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/40'
                            : isDarkMode
                              ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <Sun className="w-5 h-5 text-amber-500" />
                        <div>
                          <div className="font-extrabold">Light Theme</div>
                          <div className="text-[10px] font-normal opacity-75 mt-0.5">White Screen</div>
                        </div>
                      </button>
                    </div>

                    {/* Quick Shortcuts & App Install */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${
                      isDarkMode ? 'bg-slate-800/50 border-slate-700/70' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Quick Shortcuts
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setActiveNav('Campus Circulars')}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Campus Circulars & Media →</span>
                        </button>
                        <button
                          onClick={() => setActiveNav('Leaderboard')}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all cursor-pointer"
                        >
                          View Leaderboards →
                        </button>
                        <button
                          onClick={() => setActiveNav('Dashboard')}
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                            isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Dashboard Overview
                        </button>
                        {isInstallable && (
                          <button
                            onClick={handleInstallClick}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
                          >
                            📲 Install App
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${
                    isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                  }`}>
                    <span>Bannari Amman Institute of Technology</span>
                    <span>Version 2.4.0 (2026)</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 5: ADMIN & DEVELOPER CONSOLE (Only accessible to Dharineesh) */}
          {activeNav === 'Admin Console' && isAdminUser && (
            <div className="max-w-6xl mx-auto w-full space-y-6 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Admin & Developer Console
                    </h1>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-400 dark:text-purple-300">
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Only Dharineesh and Kaushi can access the admin page</span>
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Real-time student login monitoring, roll number searches, and Google Sheets cloud analytics.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => fetchFirebaseLogs()}
                    className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDarkMode ? 'border-amber-700/80 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60' : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 shadow-xs'
                    }`}
                    title="Refresh live cloud records from Firebase"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${sheetSyncStatus === 'pinging' ? 'animate-spin' : ''}`} />
                    <span>Sync Cloud</span>
                  </button>
                  <button
                    onClick={handleExportLogsCSV}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                    title="Download Excel / CSV"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={handleClearLogs}
                    className={`p-2 rounded-xl border transition-all cursor-pointer text-xs ${
                      isDarkMode ? 'border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-900' : 'border-slate-300 text-slate-600 hover:text-rose-600 hover:bg-slate-100'
                    }`}
                    title="Clear activity logs"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>

              {/* 📄 OFFICIAL COLLEGE SCHEDULES & PDF DOCUMENT UPLOAD HUB */}
              <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl transition-all ${
                isDarkMode ? 'border-purple-900/40 bg-slate-900/90' : 'border-purple-200 bg-white'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        College Schedules & PDF Document Manager
                      </h2>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Upload official Leave Schedule, Boys Mess Menu, and Girls Mess Menu PDFs. Instant live updates for all students.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 w-fit">
                    ADMIN UPLOAD HUB
                  </span>
                </div>

                {/* 3 Upload Option Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Card 1: Leave Schedule PDF */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          adminSchedules?.leave_schedule ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-700 text-slate-400 border-slate-600'
                        }`}>
                          {adminSchedules?.leave_schedule ? '✓ Published' : 'Not Uploaded'}
                        </span>
                      </div>
                      <h3 className={`text-sm font-extrabold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Leave Schedule (PDF)
                      </h3>
                      <p className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Official college holiday & GP circular for students.
                      </p>

                      {adminSchedules?.leave_schedule && (
                        <div className="p-2.5 rounded-xl bg-black/20 text-[11px] font-medium space-y-1 mb-3 text-slate-300">
                          <p className="truncate font-semibold text-emerald-400">{adminSchedules.leave_schedule.fileName}</p>
                          <p className="text-[10px] text-slate-400">Size: {adminSchedules.leave_schedule.fileSize}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-950/20">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{adminSchedules?.leave_schedule ? 'Replace Leave PDF' : 'Upload Leave PDF'}</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handleAdminPdfUpload('leave_schedule', e.target.files?.[0])}
                        />
                      </label>
                      {adminSchedules?.leave_schedule && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingPdfModal(adminSchedules.leave_schedule)}
                            className={`flex-1 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                              isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleAdminPdfRemove('leave_schedule')}
                            className="px-3 py-1.5 rounded-xl border border-rose-900/50 bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Boys Hostel Menu PDF */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          adminSchedules?.boys_menu ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : 'bg-slate-700 text-slate-400 border-slate-600'
                        }`}>
                          {adminSchedules?.boys_menu ? '✓ Published' : 'Not Uploaded'}
                        </span>
                      </div>
                      <h3 className={`text-sm font-extrabold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Boys Mess Menu (PDF)
                      </h3>
                      <p className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Weekly dining schedule for all boys hostels.
                      </p>

                      {adminSchedules?.boys_menu && (
                        <div className="p-2.5 rounded-xl bg-black/20 text-[11px] font-medium space-y-1 mb-3 text-slate-300">
                          <p className="truncate font-semibold text-indigo-400">{adminSchedules.boys_menu.fileName}</p>
                          <p className="text-[10px] text-slate-400">Size: {adminSchedules.boys_menu.fileSize}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-950/20">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{adminSchedules?.boys_menu ? 'Replace Boys Menu' : 'Upload Boys Menu'}</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handleAdminPdfUpload('boys_menu', e.target.files?.[0])}
                        />
                      </label>
                      {adminSchedules?.boys_menu && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingPdfModal(adminSchedules.boys_menu)}
                            className={`flex-1 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                              isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleAdminPdfRemove('boys_menu')}
                            className="px-3 py-1.5 rounded-xl border border-rose-900/50 bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 3: Girls Hostel Menu PDF */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                          <UtensilsCrossed className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          adminSchedules?.girls_menu ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' : 'bg-slate-700 text-slate-400 border-slate-600'
                        }`}>
                          {adminSchedules?.girls_menu ? '✓ Published' : 'Not Uploaded'}
                        </span>
                      </div>
                      <h3 className={`text-sm font-extrabold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Girls Mess Menu (PDF)
                      </h3>
                      <p className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Weekly dining schedule for all girls hostels.
                      </p>

                      {adminSchedules?.girls_menu && (
                        <div className="p-2.5 rounded-xl bg-black/20 text-[11px] font-medium space-y-1 mb-3 text-slate-300">
                          <p className="truncate font-semibold text-purple-400">{adminSchedules.girls_menu.fileName}</p>
                          <p className="text-[10px] text-slate-400">Size: {adminSchedules.girls_menu.fileSize}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-purple-950/20">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{adminSchedules?.girls_menu ? 'Replace Girls Menu' : 'Upload Girls Menu'}</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handleAdminPdfUpload('girls_menu', e.target.files?.[0])}
                        />
                      </label>
                      {adminSchedules?.girls_menu && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingPdfModal(adminSchedules.girls_menu)}
                            className={`flex-1 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                              isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleAdminPdfRemove('girls_menu')}
                            className="px-3 py-1.5 rounded-xl border border-rose-900/50 bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* 4 KPI Top Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                
                {/* 1. Total Unique Users */}
                <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${
                  isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Total Students
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-indigo-500 dark:text-indigo-400 tracking-tight">
                      {adminMetrics.totalUniqueUsers.toLocaleString()}
                    </div>
                    <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Unique student roll numbers
                    </span>
                  </div>
                </div>

                {/* 2. Active Today */}
                <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${
                  isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Active Today
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 tracking-tight">
                      {adminMetrics.activeToday.toLocaleString()}
                    </div>
                    <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Live daily active sessions
                    </span>
                  </div>
                </div>

                {/* 3. Total Searches */}
                <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${
                  isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Searches Logged
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 tracking-tight">
                      {adminMetrics.totalSearches.toLocaleString()}
                    </div>
                    <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Student profile queries
                    </span>
                  </div>
                </div>

                {/* 4. Mobile vs Desktop */}
                <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${
                  isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Mobile vs Desktop
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xl sm:text-2xl font-black text-cyan-500 dark:text-cyan-400 tracking-tight">
                      {adminMetrics.mobilePercent}% <span className="text-xs font-bold text-slate-400">/ {adminMetrics.desktopPercent}%</span>
                    </div>
                    <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Phones vs PCs
                    </span>
                  </div>
                </div>

              </div>

              {/* Cloud Database Sync Card (Firebase Realtime DB / Google Sheets) */}
              <div className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 ${
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      cloudProvider === 'firebase' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {cloudProvider === 'firebase' ? <Database className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Cloud Database Live Sync
                      </h3>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Permanent multi-device student login monitoring across the college.
                      </p>
                    </div>
                  </div>

                  {/* Provider Selector Tabs & Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                      <button
                        onClick={() => { setCloudProvider('firebase'); localStorage.setItem('bit_cloud_provider', 'firebase'); }}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          cloudProvider === 'firebase'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-white'
                        }`}
                      >
                        🔥 Firebase DB
                      </button>
                      <button
                        onClick={() => { setCloudProvider('gsheet'); localStorage.setItem('bit_cloud_provider', 'gsheet'); }}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          cloudProvider === 'gsheet'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-white'
                        }`}
                      >
                        📊 Google Sheets
                      </button>
                    </div>

                    <button
                      onClick={() => setShowScriptCode(prev => !prev)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-indigo-400' : 'border-slate-300 hover:bg-slate-100 text-indigo-600'
                      }`}
                    >
                      {showScriptCode ? 'Hide Guide' : 'Setup Guide 📖'}
                    </button>
                  </div>
                </div>

                {/* FIREBASE INPUT & SYNC */}
                {cloudProvider === 'firebase' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="url"
                        value={firebaseInputUrl}
                        onChange={(e) => setFirebaseInputUrl(e.target.value)}
                        placeholder="Paste Firebase Realtime DB URL (e.g. https://myproject-default-rtdb.firebaseio.com)"
                        className={`flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm border font-mono transition-all outline-none ${
                          isDarkMode 
                            ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 shadow-xs'
                        }`}
                      />
                      <button
                        onClick={handleSaveFirebaseUrl}
                        className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                      >
                        Save & Sync Live
                      </button>
                      <button
                        onClick={handleTestFirebasePing}
                        className={`px-4 py-2.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-300 hover:bg-slate-100 text-slate-700 shadow-xs'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${sheetSyncStatus === 'pinging' ? 'animate-spin' : ''}`} />
                        <span>Test Ping</span>
                      </button>
                    </div>

                    {showScriptCode && (
                      <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-amber-50/50 border-amber-200 text-slate-800'
                      }`}>
                        <div className="font-extrabold text-amber-500 uppercase tracking-wider text-[11px]">
                          ⚡ 30-Second Firebase Realtime Database Setup (Free Forever)
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                          <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-500 underline font-bold">console.firebase.google.com</a> $\rightarrow$ Click <strong>Add Project</strong>.</li>
                          <li>In left sidebar, click <strong>Build $\rightarrow$ Realtime Database $\rightarrow$ Create Database</strong>.</li>
                          <li>Go to the <strong>Rules</strong> tab and set both <code className="font-mono font-bold">".read": true, ".write": true</code> $\rightarrow$ Click <strong>Publish</strong>.</li>
                          <li>Copy the Database URL at the top (e.g. <code className="font-mono text-amber-400">https://yourproject-default-rtdb.firebaseio.com</code>) and paste it above!</li>
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* GOOGLE SHEETS INPUT & SYNC */}
                {cloudProvider === 'gsheet' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="url"
                        value={sheetInputUrl}
                        onChange={(e) => setSheetInputUrl(e.target.value)}
                        placeholder="Paste Google Apps Script Webhook URL (https://script.google.com/macros/s/.../exec)"
                        className={`flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm border font-mono transition-all outline-none ${
                          isDarkMode 
                            ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 shadow-xs'
                        }`}
                      />
                      <button
                        onClick={handleSaveGoogleSheetUrl}
                        className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                      >
                        Save URL
                      </button>
                      <button
                        onClick={handleTestGoogleSheetPing}
                        className={`px-4 py-2.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-300 hover:bg-slate-100 text-slate-700 shadow-xs'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${sheetSyncStatus === 'pinging' ? 'animate-spin' : ''}`} />
                        <span>Test Ping</span>
                      </button>
                    </div>

                    {showScriptCode && (
                      <div className={`p-4 rounded-2xl border space-y-3 ${
                        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                            Google Apps Script Code (Copy & Deploy as Web App)
                          </h4>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.roll_no || '',
    data.department || '',
    data.email || '',
    data.action || 'Login',
    data.device || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}`);
                              setCopiedScript(true);
                              setTimeout(() => setCopiedScript(false), 2500);
                            }}
                            className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold cursor-pointer hover:bg-indigo-500"
                          >
                            {copiedScript ? '✅ Copied!' : 'Copy Script'}
                          </button>
                        </div>
                        <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] overflow-x-auto border border-slate-800">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.roll_no || '',
    data.department || '',
    data.email || '',
    data.action || 'Login',
    data.device || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}`}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BIT Central & PS Master Proxy Gateway Controller */}
              <div className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-5 ${
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          BIT Central & PS Master Proxy Gateway
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          LIVE PROXY
                        </span>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Bypasses CORS and automatically authenticates all students to fetch Reward Points, Profiles & Attendance with 0 friction.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      psSessionInfo?.active_token
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${psSessionInfo?.active_token ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{psSessionInfo?.active_token ? 'Master Token Active' : 'BIT Central Default'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left Column: Master Token Synchronizer */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/70'
                  }`}>
                    <div className="flex items-center justify-between">
                      <label className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <Lock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Master PS Session Token (Firebase Synced)</span>
                      </label>
                      {psSessionInfo?.updated_at && (
                        <span className="text-[10px] font-mono text-slate-400">
                          Updated: {new Date(psSessionInfo.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={psMasterTokenInput}
                        onChange={(e) => setPsMasterTokenInput(e.target.value)}
                        placeholder="Paste Bearer JWT token or PHPSESSID cookie value..."
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500 shadow-2xs'
                        }`}
                      />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">
                          Stored securely at <code className="text-indigo-400">/ps_session/active_token</code>
                        </span>
                        <button
                          onClick={handleSaveMasterPsToken}
                          disabled={psTokenSaveStatus === 'saving'}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {psTokenSaveStatus === 'saving' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : psTokenSaveStatus === 'success' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved to Cloud!</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Sync Token</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Proxy Tester */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/70'
                  }`}>
                    <div className="flex items-center justify-between">
                      <label className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Live Proxy Tester</span>
                      </label>
                      {proxyTestLatency !== null && (
                        <span className="text-[10px] font-bold text-emerald-400">
                          ⚡ {proxyTestLatency}ms latency
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={proxyTestRoll}
                        onChange={(e) => setProxyTestRoll(e.target.value)}
                        placeholder="Enter roll (e.g. 7376232CT109)"
                        className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase border transition-all ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500 shadow-2xs'
                        }`}
                      />
                      <button
                        onClick={handleTestProxyQuery}
                        disabled={proxyTestStatus === 'testing'}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        {proxyTestStatus === 'testing' ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5" />
                        )}
                        <span>Test Proxy</span>
                      </button>
                    </div>

                    {/* Result Preview */}
                    {proxyTestResult && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 max-h-24 overflow-y-auto">
                        {proxyTestResult.error ? (
                          <span className="text-rose-400">❌ {proxyTestResult.error}</span>
                        ) : (
                          <div>
                            <span className="text-indigo-300 font-bold">✅ Proxy OK:</span>{' '}
                            {proxyTestResult.data?.[0]?.name || proxyTestResult.name || 'Record found'} —{' '}
                            <span className="text-amber-300">
                              {proxyTestResult.data?.[0]?.balance_points ?? proxyTestResult.data?.[0]?.points ?? 'Points verified'} RP
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2-Column Section: Department Distribution & Live Activity Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Department Breakdown (4 cols) */}
                <div className={`lg:col-span-4 rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 ${
                  isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                    <h3 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Department Engagement
                    </h3>
                    <span className="text-[10px] font-bold text-indigo-400">
                      {adminMetrics.topDepts.length} Branches Active
                    </span>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {adminMetrics.topDepts.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No department activity logged yet.
                      </div>
                    ) : (
                      adminMetrics.topDepts.map((d, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className={`truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{d.name}</span>
                            <span className="text-indigo-400 font-mono font-bold flex-shrink-0">{d.count} ({d.percent}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                              style={{ width: `${Math.max(d.percent, 8)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Column: Live Activity Feed Table (8 cols) */}
                <div className={`lg:col-span-8 rounded-3xl border overflow-hidden shadow-xl ${
                  isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}>
                  {/* Table Header & Search Filter */}
                  <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          Live Student Activity Feed
                        </h3>
                        {(() => {
                          const onlineCount = activityLogs.filter(l => {
                            if (!l.timestamp) return false;
                            const diffMins = (Date.now() - new Date(l.timestamp).getTime()) / 60000;
                            return diffMins < 5 && l.action !== 'Logout' && l.action !== 'Session Expired';
                          }).length;
                          return (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              {onlineCount} Online
                            </span>
                          );
                        })()}
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {activityLogs.length} unique active students tracked in real time
                      </p>
                    </div>

                    {/* Filter Input */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                        <input
                          type="text"
                          value={logFilterQuery}
                          onChange={(e) => setLogFilterQuery(e.target.value)}
                          placeholder="Filter name, roll no, branch..."
                          className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border outline-none ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className={`text-[11px] uppercase tracking-wider sticky top-0 z-10 ${
                        isDarkMode ? 'bg-slate-800/90 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <tr>
                          <th className="py-2.5 px-3.5">Student</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3">Latest Action</th>
                          <th className="py-2.5 px-3">Device / OS</th>
                          <th className="py-2.5 px-3 text-right">Last Active</th>
                        </tr>
                      </thead>
                      <tbody className={`text-xs divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
                        {activityLogs.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-12 text-center text-xs text-slate-400">
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400">
                                <Users className="w-5 h-5" />
                              </div>
                              <p className="font-bold text-slate-400">No student sessions recorded yet.</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">Real-time logins and searches will automatically appear here.</p>
                            </td>
                          </tr>
                        ) : (
                          activityLogs
                            .filter(l => {
                              if (!logFilterQuery) return true;
                              const q = logFilterQuery.toLowerCase();
                              return (
                                (l.name && l.name.toLowerCase().includes(q)) ||
                                (l.roll_no && l.roll_no.toLowerCase().includes(q)) ||
                                (l.department && l.department.toLowerCase().includes(q)) ||
                                (l.action && l.action.toLowerCase().includes(q))
                              );
                            })
                            .map((log) => {
                              const diffMins = log.timestamp ? Math.floor((Date.now() - new Date(log.timestamp).getTime()) / 60000) : 999;
                              const isOnline = diffMins < 5 && log.action !== 'Logout' && log.action !== 'Session Expired';
                              const isIdle = diffMins >= 5 && diffMins < 20 && log.action !== 'Logout' && log.action !== 'Session Expired';

                              let actionBadge = 'bg-indigo-950/80 text-indigo-300 border-indigo-800';
                              if (log.action === 'Login') {
                                actionBadge = 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
                              } else if (log.action === 'Logout') {
                                actionBadge = 'bg-rose-950/80 text-rose-300 border-rose-800';
                              } else if (log.action === 'Session Expired') {
                                actionBadge = 'bg-amber-950/80 text-amber-300 border-amber-800';
                              } else if (log.action.startsWith('Search')) {
                                actionBadge = 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
                              }

                              return (
                                <tr key={log.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                                  <td className="py-3 px-3.5">
                                    <div className="font-bold truncate max-w-[140px] sm:max-w-[180px]">{log.name}</div>
                                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                      isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                                    }`}>
                                      {log.roll_no}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3">
                                    {isOnline ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Online
                                      </span>
                                    ) : isIdle ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                        Idle ({diffMins}m)
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded-full border border-slate-700/60">
                                        Offline
                                      </span>
                                    )}
                                  </td>
                                  <td className={`py-3 px-3 text-[11px] truncate max-w-[120px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {log.department}
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${actionBadge}`}>
                                      {log.action}
                                    </span>
                                  </td>
                                  <td className={`py-3 px-3 text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {log.device}
                                  </td>
                                  <td className={`py-3 px-3 text-right text-[10px] whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {diffMins === 0 ? 'Just now' : diffMins < 60 ? `${diffMins}m ago` : new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* 4. FOOTER */}
      <footer className={`w-full border-t py-3.5 px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs transition-colors duration-200 ${
        isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-600 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-center sm:text-left">
          <span>© 2026 Rewards Points Site</span>
          <span className={`hidden sm:inline ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>•</span>
          <span>Developed by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Dharineesh V</span> (Dept. of Computer Technology)</span>
        </div>
      </footer>

      {/* 5. "VIEW DETAILS" INTERACTIVE MODAL */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`relative w-full max-w-2xl rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border max-h-[90vh] overflow-y-auto overflow-x-hidden ${
            isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
          }`}>
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className={`flex items-start sm:items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b pr-8 ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 ${
                isDarkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <AvatarImage
                  src={selectedStudent.picture || selectedStudent.photo_url}
                  alt={selectedStudent.name}
                  initials={selectedStudent.initials}
                  fallbackBg={selectedStudent.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h3 className={`text-base sm:text-2xl font-black tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedStudent.name}
                  </h3>
                  <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full border flex-shrink-0 ${
                    isDarkMode ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {selectedStudent.year}
                  </span>
                </div>
                <p className={`text-[11px] sm:text-xs mt-0.5 font-medium truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedStudent.id} • {selectedStudent.department}
                </p>

                {/* Mentor & Email Info Badges without icons */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {selectedStudent.mentor_name && (
                    <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${
                      isDarkMode ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      <span>Mentor:</span>
                      <span className="font-bold">{selectedStudent.mentor_name}</span>
                    </span>
                  )}
                  {selectedStudent.email && (
                    <span className={`inline-flex items-center text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-lg border ${
                      isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <span className="truncate max-w-[220px]">{selectedStudent.email}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Points Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 my-4 sm:my-6">
              <div className={`p-3 sm:p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Cumulative RP</span>
                <div className="text-lg sm:text-2xl font-black text-cyan-500 dark:text-cyan-400 mt-0.5 truncate">{selectedStudent.cumulativePoints || selectedStudent.currentPoints} RP</div>
              </div>
              <div className={`p-3 sm:p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Redeemed RP</span>
                <div className="text-lg sm:text-2xl font-black text-amber-500 dark:text-amber-400 mt-0.5 truncate">{selectedStudent.redeemedPoints || '0'} RP</div>
              </div>
              <div className={`col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Balance</span>
                <div className="text-lg sm:text-2xl font-black text-emerald-500 dark:text-emerald-400 mt-0.5 truncate">{selectedStudent.currentPoints} RP</div>
              </div>
            </div>

            {/* 8-Category Official Activity Breakdown from Master Sheet */}
            {Array.isArray(selectedStudent.activityBreakdown) && selectedStudent.activityBreakdown.length > 0 && (
              <div className="mb-6">
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span>Reward Points Category Breakdown</span>
                  <span className="text-[10px] font-medium text-indigo-400">Official College Audit</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedStudent.activityBreakdown.map((act) => (
                    <div
                      key={act.id}
                      className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2 ${
                        isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-semibold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {act.label}
                        </div>
                        <div className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Count: <span className="font-bold">{act.count || 0}</span> events
                        </div>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 whitespace-nowrap">
                        {act.points || 0} RP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Reward Points Entry Sheet (Transaction-Level Log) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Reward Points Entry Sheet (Transaction Log)
                  </h4>
                  {loadingModalRewards && (
                    <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Fetching live logs...
                    </span>
                  )}
                </div>
                {/* PS Count Tag if available */}
                {(() => {
                  const studentLogs = modalRewardsData.length > 0 ? modalRewardsData : (selectedStudent.history || []);
                  const psEntries = studentLogs.filter(e => e.isPS || (e.activity_type || '').toUpperCase().includes('P SKILL') || (e.category || '').toUpperCase().includes('P SKILL'));
                  const psPoints = psEntries.reduce((sum, e) => sum + (parseFloat(String(e.reward_points || e.points || 0).replace(/[^0-9.]/g, '')) || 0), 0);
                  if (psEntries.length > 0) {
                    return (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        🎯 {psEntries.length} PS Modules • +{psPoints.toLocaleString()} RP
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Modal Category Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'PS', label: '🎯 PS Skill' },
                    { id: 'INITIATIVE', label: 'Initiatives' },
                    { id: 'TECHNICAL', label: 'Technical' },
                    { id: 'PENALTY', label: 'Penalties' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setModalCategoryFilter(tab.id)}
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all border cursor-pointer ${
                        modalCategoryFilter === tab.id
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                          : isDarkMode
                            ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-48">
                  <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    placeholder="Search logs..."
                    className={`w-full pl-7 pr-6 py-1 text-[11px] rounded-lg border transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDarkMode 
                        ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {modalSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setModalSearchQuery('')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Transaction Items List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
                {loadingModalRewards ? (
                  <div className={`p-6 text-center text-xs flex flex-col items-center justify-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading student's authentic reward logs...</span>
                  </div>
                ) : (() => {
                  const studentLogs = modalRewardsData.length > 0 ? modalRewardsData : (selectedStudent.history || []);
                  const q = modalSearchQuery.trim().toLowerCase();
                  
                  const filtered = studentLogs.filter(act => {
                    const t = (act.activity_type || act.category || '').toUpperCase();
                    const isPS = act.isPS || t.includes('P SKILL') || t.includes('PSKILL');
                    
                    if (modalCategoryFilter === 'PS' && !isPS) return false;
                    if (modalCategoryFilter === 'INITIATIVE' && !t.includes('INITIATIVE')) return false;
                    if (modalCategoryFilter === 'TECHNICAL' && !t.includes('TECHNICAL')) return false;
                    if (modalCategoryFilter === 'PENALTY' && act.type !== 'negative' && !t.includes('PENALTY')) return false;

                    if (q) {
                      const matchName = (act.activity_name || act.title || act.course_name || '').toLowerCase().includes(q);
                      const matchCode = (act.code || act.activity_code || '').toLowerCase().includes(q);
                      const matchOrg = (act.organizer || '').toLowerCase().includes(q);
                      if (!matchName && !matchCode && !matchOrg) return false;
                    }
                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className={`p-4 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        No matching transaction logs found for this student.
                      </div>
                    );
                  }

                  return filtered.map((act, index) => {
                    const rawPts = act.reward_points ? parseFloat(String(act.reward_points).replace(/,/g, '')) : (act.points ? Math.abs(parseFloat(String(act.points).replace(/[^0-9.-]/g, ''))) : 0);
                    const isPositive = act.type !== 'negative' && (act.points === undefined || act.points >= 0);
                    const t = (act.activity_type || act.category || '').toUpperCase();
                    const isPS = act.isPS || t.includes('P SKILL') || t.includes('PSKILL');
                    
                    let badgeStyle = isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-300';
                    if (isPS) {
                      badgeStyle = isDarkMode ? 'bg-indigo-950/90 text-indigo-300 border-indigo-700' : 'bg-indigo-50 text-indigo-800 border-indigo-300';
                    } else if (t.includes('TECHNICAL') || t.includes('EVENT')) {
                      badgeStyle = isDarkMode ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80' : 'bg-cyan-50 text-cyan-800 border-cyan-300';
                    } else if (t.includes('INITIATIVE') || t.includes('CHALLENGE')) {
                      badgeStyle = isDarkMode ? 'bg-amber-950/80 text-amber-300 border-amber-800/80' : 'bg-amber-50 text-amber-800 border-amber-300';
                    } else if (t.includes('PENALTY')) {
                      badgeStyle = isDarkMode ? 'bg-rose-950/80 text-rose-300 border-rose-800/80' : 'bg-rose-50 text-rose-800 border-rose-300';
                    }

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-2xl border transition-all space-y-1.5 ${
                          isDarkMode 
                            ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700' 
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
                              isPS
                                ? (isDarkMode ? 'bg-indigo-950 text-indigo-400 border-indigo-800' : 'bg-indigo-100 text-indigo-600 border-indigo-200')
                                : (isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200')
                            }`}>
                              {isPS ? <GraduationCap className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              {(act.code || act.activity_code) && (
                                <span className="inline-block font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700 mr-1.5 mb-1">
                                  {act.code || act.activity_code}
                                </span>
                              )}
                              <div className={`text-xs font-bold leading-snug ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                {act.activity_name || act.title || act.course_name}
                              </div>
                              {act.organizer && (
                                <div className={`text-[10px] font-medium mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                  Faculty: {act.organizer}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                            isPositive 
                              ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60' 
                              : 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800/60'
                          }`}>
                            {isPositive ? `+${rawPts.toLocaleString()}` : `-${rawPts.toLocaleString()}`} RP
                          </span>
                        </div>

                        <div className={`flex flex-wrap items-center justify-between gap-2 text-[10px] pt-1 border-t ${isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200/80 text-slate-500'}`}>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold border ${badgeStyle}`}>
                            {isPS ? '🎯 P-Skill' : (act.activity_type || act.category || 'Event')}
                          </span>
                          <span className="font-medium">
                            {act.date || 'Academic Year'}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Modal Bottom Button */}
            <div className="mt-6 sm:mt-8 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto bg-[#4f46e5] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#4338ca] transition-all shadow-md shadow-indigo-500/30 cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PDF DOCUMENT VIEWER MODAL */}
      {viewingPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden ${
            isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className={`px-5 py-3.5 border-b flex items-center justify-between flex-shrink-0 ${
              isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <div className="truncate">
                  <h3 className="font-extrabold text-sm sm:text-base truncate">{viewingPdfModal.title || 'Schedule Document'}</h3>
                  <p className="text-[11px] text-slate-400 truncate">{viewingPdfModal.fileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={viewingPdfModal.dataUrl}
                  download={viewingPdfModal.fileName || 'schedule.pdf'}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  onClick={() => setViewingPdfModal(null)}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: PDF Iframe */}
            <div className="flex-1 bg-slate-950 p-2 sm:p-4">
              <iframe
                src={viewingPdfModal.dataUrl}
                title={viewingPdfModal.title}
                className="w-full h-full rounded-2xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. INFORMATION MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border ${
            isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>About Rewards Site</h3>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)} 
                className={`cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className={`text-sm leading-relaxed mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Rewards Site is the official academic and extracurricular rewards management platform. It tracks student rewards point and leaderboards.
            </p>

            {/* Developer Details Box */}
            <div className={`p-4 rounded-2xl border mb-4 ${
              isDarkMode ? 'border-slate-700 bg-slate-800/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Developer Information</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Developed by:</span>
                  <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Dharineesh V</span>
                </div>
                <div className="flex justify-between">
                  <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Department:</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Computer Technology</span>
                </div>
                <div className="flex justify-between">
                  <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Contact No:</span>
                  <a href="tel:9715020320" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    9715020320
                  </a>
                </div>
              </div>
            </div>

            <div className={`text-[11px] space-y-0.5 pt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <div>Version 2.4.0 (2026 Edition)</div>
              <div>© 2026 Rewards Points Site</div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-5 w-full py-2.5 rounded-full bg-[#4f46e5] text-white font-semibold text-xs hover:bg-[#4338ca] transition-colors shadow-md shadow-indigo-500/30 cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* 6. LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className={`relative w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border transition-all transform scale-100 ${
              isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            {/* Close X Button */}
            <button
              onClick={() => setShowLogoutModal(false)}
              className={`absolute top-5 right-5 p-1.5 rounded-full transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Icon & Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center border border-rose-500/25 flex-shrink-0">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="flex-1 pr-4">
                <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Confirm Sign Out
                </h3>
                <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Are you sure you want to log out of <strong className="text-slate-800 dark:text-slate-200">{currentUser?.name || 'your account'}</strong>?
                </p>
              </div>
            </div>

            {/* Information Notice */}
            <div className={`mt-4 p-3.5 rounded-2xl border text-xs leading-relaxed ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              You will need to sign in again with your institutional Google account (<span className="font-mono text-indigo-500 dark:text-indigo-400 font-bold">{currentUser?.email}</span>) to access your points and dashboard.
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' 
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout(false);
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Toast Notification */}
      {activeToast && (
        <div 
          onClick={() => {
            if (activeToast.linkTab) setActiveNav(activeToast.linkTab);
            markNotificationAsRead(activeToast.id);
            setActiveToast(null);
          }}
          className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-[calc(100vw-40px)] p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl cursor-pointer transition-all hover:scale-[1.02] flex items-start gap-3 animate-fadeIn"
          role="alert"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            activeToast.type === 'points_credited'
              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
              : activeToast.type === 'points_debited'
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
                : activeToast.type === 'placement_update'
                  ? 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/20'
                  : 'bg-blue-500/15 text-blue-500 border border-blue-500/20'
          }`}>
            {activeToast.type === 'points_credited' ? (
              <Trophy className="w-5 h-5 text-emerald-500" />
            ) : activeToast.type === 'points_debited' ? (
              <TrendingDown className="w-5 h-5 text-rose-500" />
            ) : activeToast.type === 'placement_update' ? (
              <Briefcase className="w-5 h-5 text-indigo-500" />
            ) : (
              <BellRing className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                {activeToast.title}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold shrink-0">Just now</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {activeToast.description}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveToast(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Animated Robot Assistant & Portal Shortcuts */}
      <BitRobotChatAssistant
        currentUser={currentUser}
        student={displayedStudent || currentUser}
        yearlyAverages={yearlyAverages}
        leavesList={leavesList}
        placementData={BIT_DAILY_PLACEMENT_DATA}
        setActiveNav={setActiveNav}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}

