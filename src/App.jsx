import React, { useState, useMemo, useEffect } from 'react';
import {
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
  FileSpreadsheet,
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
  Sprout,
  Dna,
  Palette,
  HeartPulse,
  Utensils,
  UtensilsCrossed,
  Calendar,
  CalendarCheck,
  Clock,
  Coffee,
  Scissors,
  Library,
  Bot
} from 'lucide-react';

const ALL_DEPARTMENTS = [
  { id: 'CT', name: 'Computer Technology', fullTitle: 'COMPUTER TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232CT', '7376242CT'], Icon: Terminal, color: 'from-blue-600 to-indigo-600', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  { id: 'CSE', name: 'Computer Science and Engineering', fullTitle: 'COMPUTER SCIENCE AND ENGINEERING', degree: 'B.E.', prefixes: ['7376231CS', '7376241CS', '7376251CS'], Icon: Cpu, color: 'from-indigo-600 to-violet-600', badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800' },
  { id: 'AI&DS', name: 'Artificial Intelligence & Data Science', fullTitle: 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE', degree: 'B.Tech.', prefixes: ['7376232AD', '7376242AD', '7376252AD'], Icon: Database, color: 'from-cyan-600 to-blue-600', badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
  { id: 'AIML', name: 'AI & Machine Learning', fullTitle: 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING', degree: 'B.Tech.', prefixes: ['7376232AL', '7376242AL', '7376252AL'], Icon: Brain, color: 'from-purple-600 to-pink-600', badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800' },
  { id: 'IT', name: 'Information Technology', fullTitle: 'INFORMATION TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232IT', '7376242IT', '7376252IT'], Icon: Globe, color: 'from-sky-600 to-blue-600', badgeColor: 'bg-sky-950/80 text-sky-300 border-sky-800' },
  { id: 'ECE', name: 'Electronics & Communication Engineering', fullTitle: 'ELECTRONICS AND COMMUNICATION ENGINEERING', degree: 'B.E.', prefixes: ['7376231EC', '7376241EC', '7376251EC'], Icon: Radio, color: 'from-teal-600 to-emerald-600', badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-800' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering', fullTitle: 'ELECTRICAL AND ELECTRONICS ENGINEERING', degree: 'B.E.', prefixes: ['7376231EE', '7376241EE', '7376251EE'], Icon: Zap, color: 'from-amber-600 to-orange-600', badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  { id: 'MECH', name: 'Mechanical Engineering', fullTitle: 'MECHANICAL ENGINEERING', degree: 'B.E.', prefixes: ['7376231ME', '7376241ME', '7376251ME'], Icon: Cog, color: 'from-slate-600 to-zinc-600', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' },
  { id: 'EIE', name: 'Electronics & Instrumentation Engineering', fullTitle: 'ELECTRONICS AND INSTRUMENTATION ENGINEERING', degree: 'B.E.', prefixes: ['7376231EI', '7376241EI', '7376251EI'], Icon: Gauge, color: 'from-orange-600 to-amber-600', badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-800' },
  { id: 'CSBS', name: 'Computer Science & Business Systems', fullTitle: 'COMPUTER SCIENCE AND BUSINESS SYSTEMS', degree: 'B.Tech.', prefixes: ['7376232CB', '7376242CB', '7376252CB'], Icon: LineChart, color: 'from-emerald-600 to-green-600', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  { id: 'AGRI', name: 'Agricultural Engineering', fullTitle: 'AGRICULTURAL ENGINEERING', degree: 'B.E.', prefixes: ['7376232AG', '7376242AG', '7376252AG'], Icon: Sprout, color: 'from-lime-600 to-emerald-600', badgeColor: 'bg-lime-950/80 text-lime-300 border-lime-800' },
  { id: 'BT', name: 'Biotechnology', fullTitle: 'BIOTECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232BT', '7376242BT', '7376252BT'], Icon: Dna, color: 'from-fuchsia-600 to-pink-600', badgeColor: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800' },
  { id: 'CSD', name: 'Computer Science & Design', fullTitle: 'COMPUTER SCIENCE AND DESIGN', degree: 'B.E.', prefixes: ['7376231CD', '7376241CD'], Icon: Palette, color: 'from-violet-600 to-purple-600', badgeColor: 'bg-violet-950/80 text-violet-300 border-violet-800' },
  { id: 'CIVIL', name: 'Civil Engineering', fullTitle: 'CIVIL ENGINEERING', degree: 'B.E.', prefixes: ['7376231CE', '7376241CE'], Icon: Building2, color: 'from-yellow-600 to-amber-600', badgeColor: 'bg-yellow-950/80 text-yellow-300 border-yellow-800' },
  { id: 'BIOMEDICAL', name: 'Biomedical Engineering', fullTitle: 'BIOMEDICAL ENGINEERING', degree: 'B.E.', prefixes: ['7376231BM'], Icon: HeartPulse, color: 'from-rose-600 to-pink-600', badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800' },
  { id: 'FD', name: 'Food Technology', fullTitle: 'FOOD TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232FD'], Icon: Utensils, color: 'from-orange-600 to-yellow-600', badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-800' },
  { id: 'FT', name: 'Fashion Technology', fullTitle: 'FASHION TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232FT', '7376242FT'], Icon: Scissors, color: 'from-pink-600 to-rose-600', badgeColor: 'bg-pink-950/80 text-pink-300 border-pink-800' },
  { id: 'ISE', name: 'Information Science & Engineering', fullTitle: 'INFORMATION SCIENCE AND ENGINEERING', degree: 'B.E.', prefixes: ['7376231SE', '7376241SE', '7376251SE', '7376231IS', '7376241IS'], Icon: Library, color: 'from-blue-600 to-cyan-600', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  { id: 'MTRS', name: 'Mechatronics Engineering', fullTitle: 'MECHATRONICS ENGINEERING', degree: 'B.E.', prefixes: ['7376231MZ', '7376241MZ', '7376251MZ', '7376231MT', '7376231MC'], Icon: Bot, color: 'from-rose-600 to-red-600', badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800' }
];

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
async function resolveStudentRollAndProfile(emailOrRoll, googleName = '') {
  const cleanInput = (emailOrRoll || '').toLowerCase().trim();
  const isEmail = cleanInput.includes('@');
  const emailPrefix = isEmail ? cleanInput.split('@')[0] : cleanInput;

  // 1. Try v2/profile if email
  let profileApiData = null;
  if (isEmail) {
    try {
      const v2Res = await bitcentralFetch(`/v2/profile?email=${encodeURIComponent(cleanInput)}`);
      if (v2Res && v2Res.ok) {
        const v2Json = await v2Res.json();
        if (v2Json && v2Json.data) profileApiData = v2Json.data;
      }
    } catch (e) {}
  }

  let rollId = profileApiData?.roll_no || profileApiData?.register_no;

  // 2. If already a standard roll number format (e.g. 7376232CT109, 7376231EE150)
  if (!rollId && /^7376\d{2,3}[A-Z]{2,3}\d{2,3}$/i.test(emailPrefix)) {
    rollId = emailPrefix.toUpperCase();
  }

  // 3. If rollId is still not resolved, query /search with name or prefix parts
  let searchApiData = null;
  if (!rollId) {
    const dotParts = emailPrefix.split('.');
    const namePart = dotParts[0] || '';
    const deptYrPart = dotParts[1] || '';
    const deptMatch = deptYrPart.match(/^([a-z]+)(\d{2})$/i);
    const deptCode = deptMatch ? deptMatch[1].toUpperCase() : '';
    const batchYr = deptMatch ? deptMatch[2] : '';

    let candidates = [];
    if (googleName) {
      try {
        const sRes = await bitcentralFetch(`/search?q=${encodeURIComponent(googleName)}`);
        if (sRes && sRes.ok) {
          const sJson = await sRes.json();
          if (sJson && Array.isArray(sJson.data)) candidates = sJson.data;
        }
      } catch (e) {}
    }

    if (candidates.length === 0 && namePart) {
      try {
        const sRes = await bitcentralFetch(`/search?q=${encodeURIComponent(namePart)}`);
        if (sRes && sRes.ok) {
          const sJson = await sRes.json();
          if (sJson && Array.isArray(sJson.data)) candidates = sJson.data;
        }
      } catch (e) {}
    }

    if (candidates.length > 0) {
      if (deptCode) {
        const exactMatch = candidates.find(st => 
          (st.roll_no || '').includes(deptCode) && 
          (!batchYr || (st.roll_no || '').includes(batchYr))
        );
        if (exactMatch) {
          rollId = exactMatch.roll_no;
          searchApiData = exactMatch;
        }
      }
      if (!rollId) {
        rollId = candidates[0].roll_no;
        searchApiData = candidates[0];
      }
    }
  }

  if (!rollId) {
    rollId = emailPrefix.toUpperCase();
  }

  // 4. Fetch searchApiData with resolved rollId if not already present
  if (!searchApiData) {
    try {
      const sRes = await bitcentralFetch(`/search?q=${encodeURIComponent(rollId)}`);
      if (sRes && sRes.ok) {
        const sJson = await sRes.json();
        if (sJson && Array.isArray(sJson.data) && sJson.data.length > 0) {
          searchApiData = sJson.data[0];
        }
      }
    } catch (e) {}
  }

  return { rollId, profileApiData, searchApiData };
}

// Standalone Login Page Component
function LoginPage({ onLogin, isDarkMode, initialNotice = '' }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(initialNotice);

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setAuthError('');
      try {
        const accessToken = tokenResponse?.access_token;
        if (!accessToken) {
          throw new Error('Google did not provide a valid access token. Please try again.');
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
          } else {
            console.warn('Google userinfo HTTP status:', res.status);
          }
        } catch (fetchErr) {
          console.warn('Failed to reach Google userinfo endpoint:', fetchErr);
        }

        if (!googleProfile || !googleProfile.email) {
          throw new Error('Could not retrieve email from Google. Please check your network connection and try again.');
        }
        
        const email = (googleProfile.email || '').toLowerCase().trim();
        const googleName = (googleProfile.name || 'BIT Student').toUpperCase();
        
        // Strict Domain Check: Only @bitsathy.ac.in is authorized
        if (!email.endsWith('@bitsathy.ac.in')) {
          setAuthError(`Access Restricted: "${email}" is not an authorized domain. Please sign in using your official @bitsathy.ac.in account.`);
          setGoogleLoading(false);
          return;
        }

        // Robust student roll & profile resolution
        const { rollId, profileApiData, searchApiData } = await resolveStudentRollAndProfile(email, googleName);

        const name = (profileApiData?.name || searchApiData?.student_name || googleName).trim().toUpperCase();
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
        const photoUrl = profileApiData?.photo_url || googleProfile.picture || null;

        onLogin({
          id: rollId,
          name: name,
          initials: initials,
          department: profileApiData?.department || searchApiData?.department || "Computer Technology",
          course_code: searchApiData?.course_code || "B. Tech.",
          batch: profileApiData?.batch || "2023 - 2027",
          year: searchApiData?.year ? `Year ${searchApiData.year}` : "Year IV",
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

      } catch (err) {
        console.error('Error in Google profile handling:', err);
        setAuthError(err.message || 'Failed to complete sign in. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn('Google Login returned error:', errorResponse);
      setGoogleLoading(false);
      const detail = errorResponse?.error_description || errorResponse?.error || '';
      setAuthError(detail ? `Google sign in error: ${detail}` : 'Google sign in was cancelled or requires http://localhost:5173 in Authorized JavaScript origins.');
    }
  });

  const handleLoginClick = () => {
    setAuthError('');
    setGoogleLoading(true);
    try {
      triggerGoogleLogin();
    } catch (err) {
      console.error(err);
      setGoogleLoading(false);
    }
  };

  return (
    <div className={`h-screen max-h-screen overflow-y-auto sm:overflow-hidden flex flex-col justify-between transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <header className={`w-full px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b flex-shrink-0 transition-colors duration-200 ${
        isDarkMode ? 'border-slate-800/60 bg-slate-900/40 text-slate-100' : 'border-slate-200 bg-white/80 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <img 
            src="/bit-logo.png" 
            alt="Bannari Amman Institute of Technology" 
            className="h-9 sm:h-10 object-contain rounded-md bg-white p-1 shadow-xs"
          />
          <div>
            <span className="text-sm sm:text-base font-black tracking-tight text-indigo-600 dark:text-indigo-400">
              Reward Points Site
            </span>
            <span className={`block text-[10px] font-semibold tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Bannari Amman Institute of Technology
            </span>
          </div>
        </div>

        {/* Top Right Developer Credit */}
        <div className={`text-right text-xs hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <div>Developed by <span className="font-bold text-indigo-600 dark:text-indigo-400">Dharineesh V</span></div>
          <div className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>(Dept. of Computer Technology)</div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border backdrop-blur-md transition-all duration-200 ${
          isDarkMode 
            ? 'shadow-2xl shadow-black/60 border-slate-800 bg-slate-900 text-slate-100' 
            : 'shadow-2xl shadow-slate-300/60 border-slate-200 bg-white text-slate-900'
        }`}>
          
          {/* Logo & Header Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3 p-2 rounded-2xl bg-white shadow-md border border-slate-200">
              <img 
                src="/bit-logo.png" 
                alt="BIT Logo" 
                className="h-12 sm:h-14 object-contain"
              />
            </div>
            
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Reward Points Site
            </h1>
            <p className={`text-[11px] sm:text-xs mt-0.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Bannari Amman Institute of Technology
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-[11px] font-bold border border-indigo-200 dark:border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Student RP Portal</span>
            </div>
            
            <p className={`text-xs mt-3 leading-relaxed max-w-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Sign in with your official BIT Google account to access your reward points, activities, and achievements.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
              <div className="font-semibold mb-1">Notice:</div>
              <div>{authError}</div>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleLoginClick}
            disabled={googleLoading}
            className={`w-full py-3 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 border transition-all duration-150 cursor-pointer active:scale-98 ${
              isDarkMode 
                ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700/90 hover:border-slate-600 shadow-lg shadow-black/40' 
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 shadow-md'
            }`}
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <GoogleIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Security / Help hint */}
          <div className={`mt-5 pt-4 border-t text-center ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Use your <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>@bitsathy.ac.in</span> institutional email
            </p>
          </div>

        </div>
      </div>

      {/* Login Footer */}
      <footer className={`w-full py-2.5 sm:py-3 px-6 text-center text-xs border-t flex-shrink-0 transition-colors duration-200 ${
        isDarkMode ? 'border-slate-800/60 bg-slate-900/40 text-slate-400' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className={`font-semibold text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          © 2026 Rewards Points Site
        </div>
        <div className={`mt-0.5 text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Developed by <span className="font-bold text-indigo-600 dark:text-indigo-400">Dharineesh V</span> (Dept. of Computer Technology)
        </div>
      </footer>
    </div>
  );
}

// Transform API response item to standard student model
function transformApiStudent(apiItem) {
  if (!apiItem) return null;
  const name = (apiItem.student_name || 'STUDENT').toUpperCase();
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0, 2) || 'ST';
  const balanceRaw = apiItem.balance_points ? apiItem.balance_points.replace(/,/g, '') : '0';
  const balancePts = parseFloat(balanceRaw).toLocaleString();
  const cumulativePts = apiItem.cumulative_reward_points ? parseFloat(apiItem.cumulative_reward_points.replace(/,/g, '')).toLocaleString() : balancePts;
  const redeemedPts = apiItem.redeemed_points ? parseFloat(apiItem.redeemed_points.replace(/,/g, '')).toLocaleString() : '0';

  return {
    id: apiItem.roll_no || "7376232CT108",
    name: name,
    initials: initials,
    department: apiItem.department || "COMPUTER TECHNOLOGY",
    course_code: apiItem.course_code || "B. Tech.",
    year: apiItem.year ? (apiItem.year.startsWith('Year') ? apiItem.year : `Year ${apiItem.year}`) : "Year IV",
    mentor_name: apiItem.mentor_name || "Dr. ANANDAKUMAR K ISE",
    currentPoints: balancePts,
    cumulativePoints: cumulativePts,
    redeemedPoints: redeemedPts,
    avatarBg: "from-[#38c4ee] to-[#0ea5e9]",
    badge: "Verified BIT Student",
    email: `${(apiItem.roll_no || 'student').toLowerCase()}@bitsathy.ac.in`,
    cgpa: "8.92",
    history: [
      { id: 1, title: "Cumulative RP Earned", date: "Academic Year 2024-2025", points: `+${cumulativePts} RP`, category: "Activities", icon: Trophy, color: "text-amber-500 bg-amber-50" },
      { id: 2, title: "Redeemed Points", date: "Benefits & Vouchers", points: `-${redeemedPts} RP`, category: "Redemption", icon: Gift, color: "text-indigo-500 bg-indigo-50" },
      { id: 3, title: "Net Active Balance", date: "Current Academic Standing", points: `${balancePts} RP`, category: "Balance", icon: Award, color: "text-emerald-500 bg-emerald-50" },
    ],
    breakdown: [
      { label: "Active Net Balance", pts: parseFloat(balanceRaw) || 0, percent: 65, color: "bg-[#4f46e5]" },
      { label: "Cumulative Points", pts: parseFloat(apiItem.cumulative_reward_points?.replace(/,/g, '') || balanceRaw) || 0, percent: 100, color: "bg-[#22d3ee]" },
      { label: "Redeemed Points", pts: parseFloat(apiItem.redeemed_points?.replace(/,/g, '') || 0), percent: 15, color: "bg-amber-500" },
    ]
  };
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
      const saved = localStorage.getItem('bit_rp_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return STUDENTS_DATABASE[0];
  });

  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Selected student currently displayed in dashboard
  const [displayedStudent, setDisplayedStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('bit_rp_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return STUDENTS_DATABASE[0];
  });

  const [selectedStudent, setSelectedStudent] = useState(STUDENTS_DATABASE[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  
  // Dynamic API state for yearly averages
  const [yearlyAverages, setYearlyAverages] = useState({
    year_1: 0,
    year_2: 1698,
    year_3: 2143,
    year_4: 1027
  });
  const [loadingAverages, setLoadingAverages] = useState(true);

  // Dynamic API state for rewards overview
  const [rewardsData, setRewardsData] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [rewardsTotal, setRewardsTotal] = useState(0);
  const [rewardsPage, setRewardsPage] = useState(1);

  // Dynamic API state for Student Detail Modal
  const [modalRewardsData, setModalRewardsData] = useState([]);
  const [loadingModalRewards, setLoadingModalRewards] = useState(false);

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

  // Restricted Admin Permission: Only Dharineesh V (dharineesh.ct23@bitsathy.ac.in / 7376232CT109)
  const isAdminUser = useMemo(() => {
    if (!currentUser) return false;
    const email = (currentUser.email || '').toLowerCase().trim();
    const id = (currentUser.id || '').toUpperCase().trim();
    return email === 'dharineesh.ct23@bitsathy.ac.in' || id === '7376232CT109';
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
    if (s === 'IV' || s === '4' || s.includes('IV') || s.includes('4')) return 'Year IV';
    if (s === 'III' || s === '3' || s.includes('III') || s.includes('3')) return 'Year III';
    if (s === 'II' || s === '2' || s.includes('II') || s.includes('2')) return 'Year II';
    if (s === 'I' || s === '1' || s.includes('I') || s.includes('1')) return 'Year I';

    const roll = String(rollNo || '');
    if (roll.startsWith('737623')) return 'Year IV';
    if (roll.startsWith('737624')) return 'Year III';
    if (roll.startsWith('737625')) return 'Year II';
    if (roll.startsWith('737626')) return 'Year I';
    return 'Year IV';
  };

  const handleViewDepartmentLeaderboard = async (dept) => {
    setSelectedDeptLeaderboard(dept);
    setLoadingDeptLeaderboard(true);
    setDeptLeaderboardList([]);
    setDeptStudentSearch('');
    setSelectedLeaderboardYear('ALL');

    try {
      const studentMap = new Map();
      for (const prefix of dept.prefixes) {
        const res = await bitcentralFetch(`/search?q=${prefix}`);
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.data)) {
            json.data.forEach(item => {
              if (item.roll_no && !studentMap.has(item.roll_no)) {
                const balanceRaw = item.balance_points ? item.balance_points.replace(/,/g, '') : '0';
                const cumulativeRaw = item.cumulative_reward_points ? item.cumulative_reward_points.replace(/,/g, '') : balanceRaw;
                const numericPts = parseFloat(balanceRaw) || parseFloat(cumulativeRaw) || 0;
                const normYear = normalizeStudentYear(item.year, item.roll_no);
                
                studentMap.set(item.roll_no, {
                  ...item,
                  numPoints: numericPts,
                  normalizedYear: normYear,
                  displayBalance: parseFloat(balanceRaw).toLocaleString(),
                  displayCumulative: parseFloat(cumulativeRaw).toLocaleString(),
                  displayRedeemed: item.redeemed_points ? parseFloat(item.redeemed_points.replace(/,/g, '')).toLocaleString() : '0'
                });
              }
            });
          }
        }
      }

      // Sort in descending order (highest RP points first)
      const sorted = Array.from(studentMap.values()).sort((a, b) => b.numPoints - a.numPoints);
      setDeptLeaderboardList(sorted);
    } catch (err) {
      console.error('Error fetching department leaderboard:', err);
    } finally {
      setLoadingDeptLeaderboard(false);
    }
  };

  // Fetch live campus hostel mess menu with date support
  const fetchMessMenu = async (hostel = messHostel, date = selectedMessDate) => {
    setLoadingMess(true);
    setMessError('');
    try {
      const url = date 
        ? `/mess?hostel=${encodeURIComponent(hostel)}&date=${encodeURIComponent(date)}`
        : `/mess?hostel=${encodeURIComponent(hostel)}`;
      const res = await bitcentralFetch(url);
      if (res.ok) {
        const data = await res.json();
        setMessData(data);
      } else {
        setMessError('Unable to load mess menu for the selected date & hostel.');
      }
    } catch (e) {
      console.warn('Mess menu fetch error:', e);
      setMessError('Network error while fetching campus mess menu.');
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

  // Fetch live rewards history from endpoint whenever displayed student changes
  useEffect(() => {
    if (!displayedStudent || !displayedStudent.id) return;
    async function fetchRewards() {
      setLoadingRewards(true);
      try {
        let roll = displayedStudent.id;
        if (roll.includes('.') || roll.includes('@')) {
          const { rollId } = await resolveStudentRollAndProfile(roll, displayedStudent.name || '');
          if (rollId) roll = rollId;
        }
        const res = await bitcentralFetch(`/rewards?roll_no=${encodeURIComponent(roll)}&page=1&limit=100`);
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
          setRewardsData(list);
          setRewardsTotal(json?.total || list.length);
        } else {
          setRewardsData([]);
          setRewardsTotal(0);
        }
      } catch (err) {
        console.error('Error fetching rewards overview:', err);
        setRewardsData([]);
        setRewardsTotal(0);
      } finally {
        setLoadingRewards(false);
      }
    }
    fetchRewards();
  }, [displayedStudent.id]);

  // Fetch live rewards specifically for selectedStudent in the Detail Modal
  useEffect(() => {
    if (!isModalOpen || !selectedStudent?.id) return;
    let isMounted = true;
    async function fetchModalRewards() {
      setLoadingModalRewards(true);
      try {
        const res = await bitcentralFetch(`/rewards?roll_no=${encodeURIComponent(selectedStudent.id)}&page=1&limit=50`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            if (json && Array.isArray(json.data)) {
              setModalRewardsData(json.data);
            } else if (Array.isArray(json)) {
              setModalRewardsData(json);
            } else {
              setModalRewardsData([]);
            }
          }
        } else {
          if (isMounted) setModalRewardsData([]);
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

  // Initial load: fetch profile from v2/profile (uses logged-in user email or default)
  useEffect(() => {
    async function fetchInitialStudent() {
      let savedUser = null;
      try {
        const saved = localStorage.getItem('bit_rp_user');
        if (saved) savedUser = JSON.parse(saved);
      } catch (e) {}

      const targetEmail = savedUser?.email || 'dharineesh.ct23@bitsathy.ac.in';

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

  // Fetch averages from endpoint
  useEffect(() => {
    async function fetchAverages() {
      try {
        const res = await bitcentralFetch('/averages');
        if (res.ok) {
          const data = await res.json();
          if (data && data.averages) {
            setYearlyAverages({
              year_1: Number(data.averages.year_1) || 0,
              year_2: Number(data.averages.year_2) || 0,
              year_3: Number(data.averages.year_3) || 0,
              year_4: Number(data.averages.year_4) || 0,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching averages:', err);
      } finally {
        setLoadingAverages(false);
      }
    }
    fetchAverages();
  }, []);

  // Live API Search on searchQuery change (with debouncing)
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await bitcentralFetch(`/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.data)) {
            setSearchResults(json.data);
            setShowDropdown(true);

            // If exact roll number match, also auto-update the display card
            if (json.data.length === 1) {
              setDisplayedStudent(transformApiStudent(json.data[0]));
            }
          } else {
            setSearchResults([]);
          }
        }
      } catch (err) {
        console.error('Search API error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSelectStudent = (apiItem) => {
    const transformed = transformApiStudent(apiItem);
    setDisplayedStudent(transformed);
    setShowDropdown(false);
    setSearchQuery(apiItem.roll_no || apiItem.student_name);
    logActivity(transformed, 'Search');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectStudent(searchResults[0]);
    }
  };

  const student = displayedStudent;

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
          
          {/* Hamburger Menu Toggle Button & Logo Section (Hamburger hidden on mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={`hidden md:flex p-2 rounded-xl transition-all cursor-pointer items-center justify-center ${
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
              <span className={`text-[10px] font-semibold hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                BIT Sathy
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Search Bar (Hidden on Mobile) */}
          <div className="hidden sm:block flex-1 max-w-xl mx-4 relative">
            <div className="relative flex items-center">
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin absolute left-4"></div>
              ) : (
                <Search className={`w-4 h-4 absolute left-4 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              )}
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                placeholder="Search by rollno eg. CT109, CT120..."
                className={`w-full pl-11 pr-10 py-2 rounded-full text-xs sm:text-sm font-medium transition-all outline-none border ${
                  isDarkMode 
                    ? 'bg-slate-800/90 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-slate-800' 
                    : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:bg-white shadow-xs'
                }`}
              />
              
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                  className={`absolute right-3.5 text-xs font-semibold p-1 ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
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
            {/* Top Right Developer Details */}
            <div className={`hidden lg:flex flex-col text-right pr-2 border-r mr-1 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Developed by <span className="font-bold text-indigo-600 dark:text-indigo-400">Dharineesh V</span>
              </span>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                (Dept. of Computer Technology)
              </span>
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

            <button
              onClick={() => setShowInfoModal(true)}
              className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title="Information & Help"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
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
              onClick={handleLogout}
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
          isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <div className="relative flex items-center max-w-md mx-auto">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin absolute left-3.5 z-10"></div>
            ) : (
              <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none transition-colors z-10 ${
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
              className={`w-full h-9 pl-10 pr-9 rounded-full text-xs font-semibold transition-all outline-none border ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-slate-900' 
                  : 'bg-slate-100/90 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:bg-white'
              }`}
            />
            
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                className={`absolute right-2.5 p-1 rounded-full transition-colors z-10 ${
                  isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
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
                BIT Rewards
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

          {/* Admin & Developer Console (Only visible to Dharineesh) */}
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
              className="mt-3 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>📲 Install Web App</span>
            </button>
          )}
        </nav>

        {/* Quick Info & Theme Box in Drawer */}
        <div className={`mt-auto p-3 rounded-2xl border transition-colors duration-200 ${
          isDarkMode ? 'bg-slate-800/50 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BIT Rewards Site</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-1 rounded-lg transition-colors cursor-pointer text-xs ${
                isDarkMode ? 'bg-slate-700 text-amber-400 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className={`text-[10px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Official academic & extracurricular rewards management platform.
          </p>
        </div>
      </aside>

      {/* 3. BODY LAYOUT: MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden pb-24 md:pb-10">
          
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
                        const rawPts = act.reward_points ? parseFloat(act.reward_points.replace(/,/g, '')) : 0;
                        const isPositive = act.type !== 'negative' && rawPts >= 0;
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
                            const rawPts = act.reward_points ? parseFloat(act.reward_points.replace(/,/g, '')) : 0;
                            const isPositive = act.type !== 'negative' && rawPts >= 0;
                            
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
                <h2 className={`text-xs font-black tracking-wider uppercase mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  AVERAGE REWARD POINTS BY YEAR
                </h2>

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

                    if (isHighlighted) {
                      return (
                        <div 
                          key={card.key}
                          className="rounded-2xl p-5 sm:p-6 shadow-lg shadow-indigo-600/25 bg-[#4f46e5] text-white overflow-hidden flex flex-col justify-between transition-all duration-200 ring-2 ring-indigo-400/50"
                        >
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
                      );
                    }

                    return (
                      <div 
                        key={card.key}
                        className={`rounded-2xl border p-5 sm:p-6 shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                          isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900 shadow-sm'
                        }`}
                      >
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

                  {/* 19 Department Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {ALL_DEPARTMENTS
                      .filter(d => 
                        !deptFilterQuery || 
                        d.name.toLowerCase().includes(deptFilterQuery.toLowerCase()) || 
                        d.id.toLowerCase().includes(deptFilterQuery.toLowerCase())
                      )
                      .map((dept) => (
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
                                <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${dept.color} opacity-40 blur-sm group-hover:opacity-75 group-hover:blur-md transition-all duration-300`} />
                                
                                {/* 3D Glass Capsule */}
                                <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${dept.color} p-[1.5px] shadow-lg shadow-black/25 group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300 flex items-center justify-center`}>
                                  <div className="w-full h-full rounded-[14px] bg-white/15 backdrop-blur-xs flex items-center justify-center border-t border-l border-white/40 border-b border-r border-black/20">
                                    <dept.Icon className="w-6 h-6 text-white drop-shadow-md" strokeWidth={2.2} />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${dept.badgeColor}`}>
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
                      ))}
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
                        {selectedDeptLeaderboard.Icon && (
                          <div className="relative flex-shrink-0">
                            <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-br ${selectedDeptLeaderboard.color} opacity-50 blur-xs`} />
                            <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${selectedDeptLeaderboard.color} p-[1.5px] flex items-center justify-center shadow-md`}>
                              <div className="w-full h-full rounded-[10px] bg-white/15 backdrop-blur-xs flex items-center justify-center border-t border-l border-white/40">
                                <selectedDeptLeaderboard.Icon className="w-5 h-5 text-white drop-shadow-sm" strokeWidth={2.2} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h1 className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {selectedDeptLeaderboard.name}
                            </h1>
                            <span className={`text-[10px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full border ${selectedDeptLeaderboard.badgeColor}`}>
                              {selectedDeptLeaderboard.id}
                            </span>
                          </div>
                          <p className={`text-[11px] sm:text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Ranked in <span className="text-emerald-500 dark:text-emerald-400 font-bold">descending order</span> of Reward Points • {selectedDeptLeaderboard.degree}
                          </p>
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
                        {filteredList.length >= 3 && !deptStudentSearch && (
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
                                <span className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{filteredList[1].roll_no}</span>
                              </div>
                              <div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1 ${
                                  isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}>
                                  {filteredList[1].normalizedYear}
                                </span>
                                <h4 className={`font-extrabold text-base truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filteredList[1].student_name}</h4>
                                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{filteredList[1].mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Points</span>
                                <span className="text-lg font-black text-emerald-500 dark:text-emerald-400">+{filteredList[1].displayBalance} RP</span>
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
                                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300">{filteredList[0].roll_no}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                    {selectedLeaderboardYear === 'ALL' ? 'Department Rank 1' : `${selectedLeaderboardYear} Rank 1`}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                                    {filteredList[0].normalizedYear}
                                  </span>
                                </div>
                                <h4 className={`font-black text-lg truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filteredList[0].student_name}</h4>
                                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{filteredList[0].mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                <span className="text-xs text-amber-600 dark:text-amber-300 font-bold uppercase tracking-wider">Top Score</span>
                                <span className="text-xl font-black text-emerald-500 dark:text-emerald-400">+{filteredList[0].displayBalance} RP</span>
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
                                <span className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{filteredList[2].roll_no}</span>
                              </div>
                              <div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1 ${
                                  isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}>
                                  {filteredList[2].normalizedYear}
                                </span>
                                <h4 className={`font-extrabold text-base truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filteredList[2].student_name}</h4>
                                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{filteredList[2].mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Points</span>
                                <span className="text-lg font-black text-emerald-500 dark:text-emerald-400">+{filteredList[2].displayBalance} RP</span>
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
                              Sorted: Highest to Lowest RP
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

                                    <div className="flex flex-col items-end justify-center gap-1.5 flex-shrink-0 pl-1">
                                      <span className="text-xs font-black text-emerald-500 dark:text-emerald-400 whitespace-nowrap">
                                        +{st.displayBalance} RP
                                      </span>
                                      <button
                                        onClick={() => {
                                          const transformed = transformApiStudent(st);
                                          setSelectedStudent(transformed);
                                          setIsModalOpen(true);
                                        }}
                                        className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
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
                                  <th className="py-3.5 px-3 lg:px-4 text-right">REWARD POINTS</th>
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
                                        <td className="py-3.5 px-3 lg:px-4 text-right font-black text-xs lg:text-sm text-emerald-500 dark:text-emerald-400 whitespace-nowrap">
                                          +{st.displayBalance} RP
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

          {/* VIEW 3: MENU DETAILS (CAMPUS MESS & DINING) */}
          {activeNav === 'Menu Details' && (
            <div className="max-w-6xl mx-auto w-full space-y-6">
              {/* Header & Hostel Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Campus Dining & Mess Menu
                  </h1>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Live daily meal schedule, hostel dining items, and current meal details.
                  </p>
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
                <div className="flex items-center gap-2">
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
                  Student ID: <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">{currentUser.id || '7376232CT109'}</span>
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
                          src={currentUser.picture || currentUser.photo_url}
                          alt={currentUser.name}
                          initials={currentUser.initials}
                          fallbackBg={currentUser.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-bold text-base truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</h4>
                        <p className={`text-xs font-mono truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{currentUser.email || currentUser.id}</p>
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
                          value={currentUser.department || 'COMPUTER TECHNOLOGY'}
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
                      onClick={handleLogout}
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
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Admin & Developer Console
                    </h1>
                  </div>
                  <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Phones & Small Screens) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-4 py-2 flex items-center justify-around shadow-2xl transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950/95 border-slate-800/80' : 'bg-white/95 border-slate-200 shadow-lg'
      }`}>
        <button
          onClick={() => setActiveNav('Dashboard')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeNav === 'Dashboard' 
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' 
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-5 h-5" strokeWidth={activeNav === 'Dashboard' ? 2.4 : 1.8} />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveNav('Leaderboard')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeNav === 'Leaderboard' 
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' 
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-5 h-5" strokeWidth={activeNav === 'Leaderboard' ? 2.4 : 1.8} />
          <span className="text-[10px]">Rankings</span>
        </button>

        <button
          onClick={() => setActiveNav('Menu Details')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeNav === 'Menu Details' 
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' 
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" strokeWidth={activeNav === 'Menu Details' ? 2.4 : 1.8} />
          <span className="text-[10px]">Menu</span>
        </button>

        <button
          onClick={() => setActiveNav('Settings')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeNav === 'Settings' 
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' 
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-5 h-5" strokeWidth={activeNav === 'Settings' ? 2.4 : 1.8} />
          <span className="text-[10px]">Settings</span>
        </button>

        {isAdminUser && (
          <button
            onClick={() => setActiveNav('Admin Console')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeNav === 'Admin Console' 
                ? 'text-purple-600 dark:text-purple-400 font-extrabold' 
                : isDarkMode ? 'text-purple-400/70 hover:text-purple-300' : 'text-purple-600/70 hover:text-purple-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5" strokeWidth={activeNav === 'Admin Console' ? 2.4 : 1.8} />
            <span className="text-[10px]">Admin</span>
          </button>
        )}
      </div>

      {/* 4. FOOTER */}
      <footer className={`w-full border-t py-3.5 px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs mb-14 md:mb-0 transition-colors duration-200 ${
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
            <div className={`flex items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b pr-8 ${
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
                  <h3 className={`text-base sm:text-2xl font-black tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedStudent.name}</h3>
                  <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full border flex-shrink-0 ${
                    isDarkMode ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {selectedStudent.year}
                  </span>
                </div>
                <p className={`text-[11px] sm:text-xs mt-0.5 font-medium truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedStudent.id} • {selectedStudent.department}
                </p>
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

            {/* Recent RP Activities */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Recent Activity History</h4>
                {loadingModalRewards && (
                  <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Fetching live RP logs...
                  </span>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
                {loadingModalRewards ? (
                  <div className={`p-6 text-center text-xs flex flex-col items-center justify-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading student's authentic reward logs...</span>
                  </div>
                ) : modalRewardsData.length > 0 ? (
                  modalRewardsData.slice(0, 8).map((act, index) => {
                    const rawPts = act.reward_points ? parseFloat(act.reward_points.replace(/,/g, '')) : 0;
                    const isPositive = act.type !== 'negative' && rawPts >= 0;
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all gap-2 ${
                          isDarkMode 
                            ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700' 
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                            isDarkMode ? 'bg-indigo-950/70 text-indigo-400 border-indigo-800/40' : 'bg-indigo-100 text-indigo-600 border-indigo-200'
                          }`}>
                            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{act.activity_name || act.course_name}</div>
                            <div className={`text-[10px] sm:text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{act.date} • {act.activity_type}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                          isPositive 
                            ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60' 
                            : 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800/60'
                        }`}>
                          {isPositive ? `+${rawPts.toLocaleString()}` : `-${rawPts.toLocaleString()}`} RP
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className={`p-4 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    No activity logs recorded yet for this student.
                  </div>
                )}
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

    </div>
  );
}

