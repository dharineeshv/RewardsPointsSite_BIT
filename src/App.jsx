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
  Medal
} from 'lucide-react';

const ALL_DEPARTMENTS = [
  { id: 'CT', name: 'Computer Technology', fullTitle: 'COMPUTER TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232CT', '7376242CT'], icon: '💻', color: 'from-blue-600 to-indigo-600', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  { id: 'CSE', name: 'Computer Science and Engineering', fullTitle: 'COMPUTER SCIENCE AND ENGINEERING', degree: 'B.E.', prefixes: ['7376231CS', '7376241CS', '7376251CS'], icon: '🖥️', color: 'from-indigo-600 to-violet-600', badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800' },
  { id: 'AI&DS', name: 'Artificial Intelligence & Data Science', fullTitle: 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE', degree: 'B.Tech.', prefixes: ['7376232AD', '7376242AD', '7376252AD'], icon: '🤖', color: 'from-cyan-600 to-blue-600', badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
  { id: 'AIML', name: 'AI & Machine Learning', fullTitle: 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING', degree: 'B.Tech.', prefixes: ['7376232AL', '7376242AL', '7376252AL'], icon: '🧠', color: 'from-purple-600 to-pink-600', badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800' },
  { id: 'IT', name: 'Information Technology', fullTitle: 'INFORMATION TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232IT', '7376242IT', '7376252IT'], icon: '🌐', color: 'from-sky-600 to-blue-600', badgeColor: 'bg-sky-950/80 text-sky-300 border-sky-800' },
  { id: 'ECE', name: 'Electronics & Communication Engineering', fullTitle: 'ELECTRONICS AND COMMUNICATION ENGINEERING', degree: 'B.E.', prefixes: ['7376231EC', '7376241EC', '7376251EC'], icon: '📡', color: 'from-teal-600 to-emerald-600', badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-800' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering', fullTitle: 'ELECTRICAL AND ELECTRONICS ENGINEERING', degree: 'B.E.', prefixes: ['7376231EE', '7376241EE', '7376251EE'], icon: '⚡', color: 'from-amber-600 to-orange-600', badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  { id: 'MECH', name: 'Mechanical Engineering', fullTitle: 'MECHANICAL ENGINEERING', degree: 'B.E.', prefixes: ['7376231ME', '7376241ME', '7376251ME'], icon: '⚙️', color: 'from-slate-600 to-zinc-600', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' },
  { id: 'EIE', name: 'Electronics & Instrumentation Engineering', fullTitle: 'ELECTRONICS AND INSTRUMENTATION ENGINEERING', degree: 'B.E.', prefixes: ['7376231EI', '7376241EI', '7376251EI'], icon: '🎛️', color: 'from-orange-600 to-amber-600', badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-800' },
  { id: 'CSBS', name: 'Computer Science & Business Systems', fullTitle: 'COMPUTER SCIENCE AND BUSINESS SYSTEMS', degree: 'B.Tech.', prefixes: ['7376232CB', '7376242CB', '7376252CB'], icon: '📊', color: 'from-emerald-600 to-green-600', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  { id: 'AGRI', name: 'Agricultural Engineering', fullTitle: 'AGRICULTURAL ENGINEERING', degree: 'B.E.', prefixes: ['7376232AG', '7376242AG', '7376252AG'], icon: '🌾', color: 'from-lime-600 to-emerald-600', badgeColor: 'bg-lime-950/80 text-lime-300 border-lime-800' },
  { id: 'BT', name: 'Biotechnology', fullTitle: 'BIOTECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232BT', '7376242BT', '7376252BT'], icon: '🧬', color: 'from-fuchsia-600 to-pink-600', badgeColor: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800' },
  { id: 'CSD', name: 'Computer Science & Design', fullTitle: 'COMPUTER SCIENCE AND DESIGN', degree: 'B.E.', prefixes: ['7376231CD', '7376241CD'], icon: '🎨', color: 'from-violet-600 to-purple-600', badgeColor: 'bg-violet-950/80 text-violet-300 border-violet-800' },
  { id: 'CIVIL', name: 'Civil Engineering', fullTitle: 'CIVIL ENGINEERING', degree: 'B.E.', prefixes: ['7376231CE', '7376241CE'], icon: '🏗️', color: 'from-yellow-600 to-amber-600', badgeColor: 'bg-yellow-950/80 text-yellow-300 border-yellow-800' },
  { id: 'BIOMEDICAL', name: 'Biomedical Engineering', fullTitle: 'BIOMEDICAL ENGINEERING', degree: 'B.E.', prefixes: ['7376231BM'], icon: '🩺', color: 'from-rose-600 to-pink-600', badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800' },
  { id: 'FD', name: 'Food Technology', fullTitle: 'FOOD TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232FD'], icon: '🍲', color: 'from-orange-600 to-yellow-600', badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-800' },
  { id: 'FT', name: 'Fashion Technology', fullTitle: 'FASHION TECHNOLOGY', degree: 'B.Tech.', prefixes: ['7376232FT', '7376242FT'], icon: '👗', color: 'from-pink-600 to-rose-600', badgeColor: 'bg-pink-950/80 text-pink-300 border-pink-800' },
  { id: 'ISE', name: 'Information Science & Engineering', fullTitle: 'INFORMATION SCIENCE AND ENGINEERING', degree: 'B.E.', prefixes: ['7376231IS', '7376241IS'], icon: '📚', color: 'from-blue-600 to-cyan-600', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  { id: 'MTRS', name: 'Mechatronics Engineering', fullTitle: 'MECHATRONICS ENGINEERING', degree: 'B.E.', prefixes: ['7376231MT', '7376231MC'], icon: '🦾', color: 'from-rose-600 to-red-600', badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800' }
];

const STUDENTS_DATABASE = [
  {
    id: "737623CT108",
    name: "DHARANI M",
    initials: "DM",
    department: "COMPUTER TECHNOLOGY",
    year: "IV Yr",
    currentPoints: "1,450",
    rawPoints: 1450,
    avatarBg: "from-[#38c4ee] to-[#0ea5e9]",
    badge: "Top 5% Performer",
    email: "dharani.ct23@bitsathy.ac.in",
    cgpa: "8.92",
    history: [
      { id: 1, title: "Smart India Hackathon - 1st Place", date: "Oct 24, 2024", points: "+500 RP", category: "Hackathon", icon: Trophy, color: "text-amber-500 bg-amber-50" },
      { id: 2, title: "Dean's Academic Excellence Award", date: "Sep 15, 2024", points: "+400 RP", category: "Academics", icon: Award, color: "text-indigo-500 bg-indigo-50" },
      { id: 3, title: "Open Source AI Project Contribution", date: "Aug 10, 2024", points: "+300 RP", category: "Innovation", icon: Code, color: "text-emerald-500 bg-emerald-50" },
      { id: 4, title: "Tech Symposium Lead Coordinator", date: "Jul 28, 2024", points: "+150 RP", category: "Leadership", icon: Users, color: "text-blue-500 bg-blue-50" },
      { id: 5, title: "Cloud Architecture Workshop Certification", date: "Jun 12, 2024", points: "+100 RP", category: "Workshop", icon: BookOpen, color: "text-purple-500 bg-purple-50" },
    ],
    breakdown: [
      { label: "Competitions & Hackathons", pts: 500, percent: 35, color: "bg-amber-500" },
      { label: "Academic Honors", pts: 400, percent: 28, color: "bg-indigo-500" },
      { label: "Technical Contributions", pts: 300, percent: 20, color: "bg-emerald-500" },
      { label: "Leadership & Events", pts: 250, percent: 17, color: "bg-sky-500" },
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

// Unified Bitcentral API proxy fetcher (CORS-safe on Vercel and local dev)
async function bitcentralFetch(pathAndQuery) {
  const cleanPath = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
  try {
    const proxyRes = await fetch(`/api/bitcentral${cleanPath}`);
    if (proxyRes.ok) return proxyRes;
  } catch (err) {
    console.warn(`Proxy fetch failed for ${cleanPath}, attempting direct connection:`, err);
  }
  return fetch(`https://bitcentral-api.onrender.com${cleanPath}`);
}

// Standalone Login Page Component
function LoginPage({ onLogin, isDarkMode }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const triggerGoogleLogin = useGoogleLogin({
    hosted_domain: 'bitsathy.ac.in',
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setAuthError('');
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleProfile = await res.json();
        
        const email = (googleProfile.email || '').toLowerCase().trim();
        const googleName = (googleProfile.name || 'BIT Student').toUpperCase();
        
        // Strict Domain Check: Only @bitsathy.ac.in is authorized
        if (!email.endsWith('@bitsathy.ac.in')) {
          setAuthError(`Access Restricted: "${email}" is not an authorized domain. Please sign in using your official @bitsathy.ac.in account.`);
          setGoogleLoading(false);
          return;
        }

        // Fetch v2/profile endpoint
        let profileApiData = null;
        try {
          const v2Res = await bitcentralFetch(`/v2/profile?email=${encodeURIComponent(email)}`);
          if (v2Res.ok) {
            const v2Json = await v2Res.json();
            if (v2Json && v2Json.data) profileApiData = v2Json.data;
          }
        } catch (e) {
          console.warn('v2/profile fetch error:', e);
        }

        // Fetch student points from search endpoint
        const rollId = profileApiData?.roll_no || profileApiData?.register_no || email.split('@')[0].toUpperCase();
        let searchApiData = null;
        try {
          const sRes = await bitcentralFetch(`/search?q=${encodeURIComponent(rollId)}`);
          if (sRes.ok) {
            const sJson = await sRes.json();
            if (sJson && sJson.data && sJson.data.length > 0) {
              searchApiData = sJson.data[0];
            }
          }
        } catch (e) {
          console.warn('search API fetch error:', e);
        }

        const name = (profileApiData?.name || searchApiData?.student_name || googleName).trim().toUpperCase();
        const initials = name.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2) || 'ST';
        const balanceRaw = searchApiData?.balance_points ? searchApiData.balance_points.replace(/,/g, '') : '0';
        const balancePts = parseFloat(balanceRaw).toLocaleString();
        const cumulativeRaw = searchApiData?.cumulative_reward_points ? searchApiData.cumulative_reward_points.replace(/,/g, '') : balanceRaw;
        const cumulativePts = parseFloat(cumulativeRaw).toLocaleString();
        const redeemedRaw = searchApiData?.redeemed_points ? searchApiData.redeemed_points.replace(/,/g, '') : '0';
        const redeemedPts = parseFloat(redeemedRaw).toLocaleString();
        const photoUrl = profileApiData?.photo_url || googleProfile.picture;

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
          history: [],
          breakdown: []
        });

      } catch (err) {
        console.error('Error fetching Google profile:', err);
        setAuthError('Failed to fetch profile from Google. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn('Google Login returned error:', errorResponse);
      setGoogleLoading(false);
      setAuthError('Google sign in was cancelled or requires http://localhost:5173 in Authorized JavaScript origins.');
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
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      
      {/* Top Navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <img 
            src="/bit-logo.png" 
            alt="Bannari Amman Institute of Technology" 
            className="h-10 sm:h-12 object-contain rounded-md bg-white p-1 shadow-xs"
          />
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-indigo-400">
              Reward Points Site
            </span>
            <span className="block text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wide">
              Bannari Amman Institute of Technology
            </span>
          </div>
        </div>

        {/* Top Right Developer Credit */}
        <div className="text-right text-xs text-slate-400 hidden sm:block">
          <div>Developed by <span className="font-bold text-indigo-400">Dharineesh V</span></div>
          <div className="text-[10px] text-slate-400">(Dept. of Computer Technology)</div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/60 border border-slate-800 bg-slate-900 text-slate-100 backdrop-blur-md">
          
          {/* Logo & Header Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4 p-2.5 rounded-2xl bg-white shadow-md border border-slate-200">
              <img 
                src="/bit-logo.png" 
                alt="BIT Logo" 
                className="h-16 sm:h-20 object-contain"
              />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Reward Points Site
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Bannari Amman Institute of Technology
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 text-[11px] font-bold border border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Student RP Portal</span>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-xs">
              Sign in with your official BIT Google account to access your reward points, activities, and achievements.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-950/50 border border-amber-800 text-amber-200 text-xs">
              <div className="font-semibold mb-1">Notice:</div>
              <div>{authError}</div>
              <button
                type="button"
                onClick={() => onLogin(STUDENTS_DATABASE[0])}
                className="mt-2 text-xs font-bold text-indigo-400 underline"
              >
                Click here for instant Demo Sign-In
              </button>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleLoginClick}
            disabled={googleLoading}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700/90 hover:border-slate-600 transition-all duration-150 cursor-pointer shadow-lg shadow-black/40 active:scale-98"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <GoogleIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Security / Help hint */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Use your <span className="font-semibold text-slate-200">@bitsathy.ac.in</span> institutional email
            </p>
          </div>

        </div>
      </div>

      {/* Login Footer */}
      <footer className="w-full py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-800/60 bg-slate-900/40">
        <div className="font-semibold text-slate-300">
          © 2026 Rewards Points Site
        </div>
        <div className="mt-1 text-[11px]">
          Developed by <span className="font-bold text-indigo-400">Dharineesh V</span> (Dept. of Computer Technology • Contact: 9715020320)
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(STUDENTS_DATABASE[0]);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Selected student currently displayed in dashboard
  const [displayedStudent, setDisplayedStudent] = useState(STUDENTS_DATABASE[0]);
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS_DATABASE[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
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

  // Leaderboard State
  const [selectedDeptLeaderboard, setSelectedDeptLeaderboard] = useState(null);
  const [deptLeaderboardList, setDeptLeaderboardList] = useState([]);
  const [loadingDeptLeaderboard, setLoadingDeptLeaderboard] = useState(false);
  const [deptFilterQuery, setDeptFilterQuery] = useState('');
  const [deptStudentSearch, setDeptStudentSearch] = useState('');
  const [selectedLeaderboardYear, setSelectedLeaderboardYear] = useState('ALL');

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

  // Fetch live rewards history from endpoint whenever displayed student changes
  useEffect(() => {
    if (!displayedStudent || !displayedStudent.id) return;
    async function fetchRewards() {
      setLoadingRewards(true);
      try {
        const res = await bitcentralFetch(`/rewards?roll_no=${encodeURIComponent(displayedStudent.id)}&page=1&limit=100`);
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.data)) {
            setRewardsData(json.data);
            setRewardsTotal(json.total || json.data.length);
          } else {
            setRewardsData([]);
            setRewardsTotal(0);
          }
        }
      } catch (err) {
        console.error('Error fetching rewards overview:', err);
      } finally {
        setLoadingRewards(false);
      }
    }
    fetchRewards();
  }, [displayedStudent.id]);

  // Initial load: fetch default logged-in user profile from v2/profile
  useEffect(() => {
    async function fetchInitialStudent() {
      const defaultEmail = 'dharineesh.ct23@bitsathy.ac.in';
      try {
        let profileApi = null;
        const v2Res = await bitcentralFetch(`/v2/profile?email=${encodeURIComponent(defaultEmail)}`);
        if (v2Res.ok) {
          const v2Json = await v2Res.json();
          if (v2Json && v2Json.data) profileApi = v2Json.data;
        }

        const roll = profileApi?.roll_no || '7376232CT109';
        let searchApi = null;
        const sRes = await bitcentralFetch(`/search?q=${encodeURIComponent(roll)}`);
        if (sRes.ok) {
          const sJson = await sRes.json();
          if (sJson && sJson.data && sJson.data.length > 0) {
            searchApi = sJson.data[0];
          }
        }

        const name = (profileApi?.name || searchApi?.student_name || 'DHARINEESH V').trim().toUpperCase();
        const initials = name.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2) || 'DV';
        const balanceRaw = searchApi?.balance_points ? searchApi.balance_points.replace(/,/g, '') : '1146';
        const balancePts = parseFloat(balanceRaw).toLocaleString();
        const cumulativeRaw = searchApi?.cumulative_reward_points ? searchApi.cumulative_reward_points.replace(/,/g, '') : balanceRaw;
        const cumulativePts = parseFloat(cumulativeRaw).toLocaleString();
        const redeemedRaw = searchApi?.redeemed_points ? searchApi.redeemed_points.replace(/,/g, '') : '0';
        const redeemedPts = parseFloat(redeemedRaw).toLocaleString();
        const photoUrl = profileApi?.photo_url || 'https://lh3.googleusercontent.com/a/ACg8ocJIU9hq3_RNCT28a9DKkIG8eCEG46j2vNeG6pC9A30RXNOfQg=s96-c';

        const userObj = {
          id: roll,
          name: name,
          initials: initials,
          department: profileApi?.department || searchApi?.department || "Computer Technology",
          course_code: searchApi?.course_code || "B. Tech.",
          batch: profileApi?.batch || "2023 - 2027",
          year: searchApi?.year ? `Year ${searchApi.year}` : "Year IV",
          phone: profileApi?.phone || "9715020320",
          mentor_name: searchApi?.mentor_name || "Dr. ANANDAKUMAR K ISE",
          picture: photoUrl,
          photo_url: photoUrl,
          avatarBg: "from-[#38c4ee] to-[#0ea5e9]",
          badge: "Verified BIT Student",
          email: defaultEmail,
          currentPoints: balancePts,
          cumulativePoints: cumulativePts,
          redeemedPoints: redeemedPts,
          history: [],
          breakdown: []
        };

        setDisplayedStudent(userObj);
        setCurrentUser(userObj);
      } catch (err) {
        console.error('Error fetching initial student from v2/profile:', err);
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
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // If user is not logged in, render the dedicated Login Page
  if (!isLoggedIn) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100">
      
      {/* 1. TOP HEADER & NAVBAR */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img 
              src="/bit-logo.png" 
              alt="Bannari Amman Institute of Technology" 
              className="h-8 sm:h-10 object-contain rounded-md bg-white p-0.5 shadow-xs flex-shrink-0"
            />
            <div>
              <span className="text-sm sm:text-base md:text-lg font-black text-indigo-400 tracking-tight block leading-tight">
                Reward Points Site
              </span>
              <span className="text-[10px] text-slate-400 font-semibold hidden sm:block">
                BIT Sathy
              </span>
            </div>
          </div>

          {/* Search Bar with Live API Autocomplete */}
          <div className="flex-1 min-w-[130px] max-w-xl mx-1 sm:mx-4 relative">
            <div className="relative flex items-center">
              {isSearching ? (
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin absolute left-3 sm:left-4"></div>
              ) : (
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 sm:left-4 pointer-events-none" />
              )}
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                placeholder="Search students..."
                className="w-full pl-8 sm:pl-11 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all outline-none border bg-slate-800/90 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-slate-800"
              />
              
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                  className="absolute right-2.5 sm:right-3.5 text-slate-400 hover:text-slate-200 text-xs font-semibold p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Floating Suggestions Dropdown from API */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl border border-slate-800 bg-slate-900 text-slate-100 divide-y divide-slate-800 max-h-80 overflow-y-auto z-50 animate-fadeIn">
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>API Results ({searchResults.length})</span>
                  <span className="normal-case font-normal text-slate-400">Click to select</span>
                </div>
                {searchResults.map((item, idx) => (
                  <div
                    key={`${item.roll_no}-${idx}`}
                    onClick={() => handleSelectStudent(item)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer flex items-center justify-between transition-colors hover:bg-slate-800/80"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#38c4ee] to-[#0ea5e9] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {(item.student_name || 'ST').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 truncate">
                          <span className="truncate">{item.student_name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-800 text-slate-400 border border-slate-700 flex-shrink-0">
                            {item.roll_no}
                          </span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                          {item.department} {item.year ? `• Year ${item.year}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs font-black text-emerald-400 block">
                        {item.balance_points ? parseFloat(item.balance_points.replace(/,/g, '')).toLocaleString() : '0'} RP
                      </span>
                      <span className="text-[9px] text-slate-400">Balance</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons & Developer Info */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Top Right Developer Details */}
            <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-800 mr-1">
              <span className="text-[11px] font-semibold text-slate-300">
                Developed by <span className="font-bold text-indigo-400">Dharineesh V</span>
              </span>
              <span className="text-[10px] text-slate-400">
                (Dept. of Computer Technology)
              </span>
            </div>

            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1.5 sm:p-2 rounded-full transition-colors hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Information & Help"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
            </button>

            <div 
              onClick={() => {
                setSelectedStudent(currentUser);
                setIsModalOpen(true);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-indigo-400 transition-all cursor-pointer border border-slate-700 shadow-xs flex-shrink-0"
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
              className="p-1.5 sm:p-2 rounded-full transition-colors hover:bg-slate-800 text-rose-400 hover:text-rose-300"
              title="Logout to Login Screen"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Sidebar (Desktop & Tablet) */}
        <aside className="w-60 lg:w-64 hidden md:flex flex-col py-6 px-4 border-r border-slate-800 bg-slate-900/60 transition-colors duration-200 flex-shrink-0">
          <nav className="space-y-1.5 flex-1">
            <button
              onClick={() => setActiveNav('Dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeNav === 'Dashboard'
                  ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <LayoutGrid className="w-5 h-5" strokeWidth={activeNav === 'Dashboard' ? 2.2 : 1.8} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveNav('Leaderboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeNav === 'Leaderboard'
                  ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <BarChart2 className="w-5 h-5" strokeWidth={1.8} />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveNav('Rewards History')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeNav === 'Rewards History'
                  ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-5 h-5" strokeWidth={1.8} />
              <span>Rewards History</span>
            </button>

            <button
              onClick={() => setActiveNav('Settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeNav === 'Settings'
                  ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-5 h-5" strokeWidth={1.8} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Quick Info Box in Sidebar */}
          <div className="mt-auto p-4 rounded-2xl border bg-slate-800/50 border-slate-700/60 text-slate-300">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About Rewards Site</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rewards Site is the official academic and extracurricular rewards management platform. It tracks student rewards point and leaderboards.
            </p>
          </div>
        </aside>

        {/* Main Content Area (Mobile-friendly padding and bottom offset) */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden pb-24 md:pb-10">
          
          {/* VIEW 1: DASHBOARD */}
          {activeNav === 'Dashboard' && (
            <>
              {/* Top Title & Subtitle */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Rewards Points Dashboard
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Showing logged in profile for <span className="text-indigo-400 font-bold">{currentUser.name}</span> ({currentUser.email}).
                </p>
              </div>

              {/* SECTION 1: SEARCH RESULTS */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                    STUDENT PROFILE & POINTS
                  </h2>
                  {student.email === currentUser.email && (
                    <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Current Logged In User</span>
                    </span>
                  )}
                </div>

                {/* Student Result Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 hover:border-slate-700 transition-all duration-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  {/* Left Student Info */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Photo / Avatar */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 border-slate-700">
                      <AvatarImage
                        src={student.picture || student.photo_url}
                        alt={student.name}
                        initials={student.initials}
                        fallbackBg={student.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                          {student.name}
                        </h3>
                        {student.batch && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            {student.batch}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <IdCard className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                          <span className="tracking-wide font-mono font-semibold text-slate-200">{student.id}</span>
                        </div>
                        <div className="flex items-center gap-1.5 uppercase">
                          <GraduationCap className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                          <span>{student.course_code ? `${student.course_code} - ` : ''}{student.department}</span>
                        </div>
                        {student.email && (
                          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{student.email}</span>
                          </div>
                        )}
                        {student.mentor_name && student.mentor_name !== 'N/A' && (
                          <div className="flex items-center gap-1.5 text-indigo-400">
                            <User className="w-3.5 h-3.5" />
                            <span>Mentor: {student.mentor_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Points and Action */}
                  <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 sm:gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800 flex-shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        ACTIVE BALANCE POINTS
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight leading-tight">
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
                  <h2 className="text-xs font-black text-slate-300 tracking-wider uppercase">
                    OVERVIEW
                  </h2>
                  {rewardsTotal > 0 && (
                    <span className="text-xs font-bold text-slate-400">
                      Total Activities: <span className="text-indigo-400 font-extrabold">{rewardsTotal}</span>
                    </span>
                  )}
                </div>

                {/* Overview Activity Table */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xs transition-all duration-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700 bg-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-200">
                          <th className="py-4 px-6 font-extrabold">COURSE NAME</th>
                          <th className="py-4 px-6 font-extrabold">COMPLETED DATE</th>
                          <th className="py-4 px-6 font-extrabold">ACTIVITY TYPE</th>
                          <th className="py-4 px-6 font-extrabold text-right">REWARD POINTS</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-slate-800">
                        {loadingRewards ? (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-slate-400 font-semibold">
                              <div className="inline-flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading activities for {student.id}...</span>
                              </div>
                            </td>
                          </tr>
                        ) : rewardsData.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-slate-500 font-semibold">
                              No reward activity records found for {student.id}.
                            </td>
                          </tr>
                        ) : (
                          rewardsData.map((act, index) => {
                            const rawPts = act.reward_points ? parseFloat(act.reward_points.replace(/,/g, '')) : 0;
                            const isPositive = act.type !== 'negative' && rawPts >= 0;
                            
                            // Badge color styles
                            const t = (act.activity_type || '').toUpperCase();
                            let badgeStyle = 'bg-slate-800 text-slate-200 border border-slate-700';
                            if (t.includes('TECHNICAL') || t.includes('EVENT')) {
                              badgeStyle = 'bg-cyan-950 text-cyan-200 border border-cyan-800';
                            } else if (t.includes('P SKILL') || t.includes('SKILL')) {
                              badgeStyle = 'bg-indigo-950 text-indigo-200 border border-indigo-800';
                            } else if (t.includes('INITIATIVE') || t.includes('CHALLENGE')) {
                              badgeStyle = 'bg-amber-950 text-amber-200 border border-amber-800';
                            } else if (t.includes('ACADEMIC')) {
                              badgeStyle = 'bg-emerald-950 text-emerald-200 border border-emerald-800';
                            }

                            return (
                              <tr key={index} className="transition-colors text-slate-200 hover:bg-slate-800/50">
                                <td className="py-4 px-6 font-bold text-sm text-white max-w-md">
                                  {act.activity_name || act.course_name || 'Academic Course Activity'}
                                </td>
                                <td className="py-4 px-6 font-semibold text-slate-300 whitespace-nowrap">
                                  {act.date || 'Recent'}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold shadow-xs ${badgeStyle}`}>
                                    {act.activity_type || 'General'}
                                  </span>
                                </td>
                                <td className={`py-4 px-6 text-right font-black text-sm whitespace-nowrap ${
                                  isPositive ? 'text-emerald-400' : 'text-rose-400'
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
                <h2 className="text-xs font-black text-slate-300 tracking-wider uppercase mb-3">
                  AVERAGE REWARD POINTS BY YEAR
                </h2>

                {/* 4 Year Cards Grid (Dynamic from API) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Year I */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xs overflow-hidden flex flex-col justify-between min-h-[115px] transition-all duration-200">
                    <div>
                      <span className="text-xs font-bold text-slate-300">Year I</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-white">
                          {loadingAverages ? '...' : Number(yearlyAverages.year_1).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400">RP</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="bg-[#4f46e5] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${getProgress(yearlyAverages.year_1)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Year II */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xs overflow-hidden flex flex-col justify-between min-h-[115px] transition-all duration-200">
                    <div>
                      <span className="text-xs font-bold text-slate-300">Year II</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-white">
                          {loadingAverages ? '...' : Number(yearlyAverages.year_2).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400">RP</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="bg-[#4f46e5] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${getProgress(yearlyAverages.year_2)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Year III */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xs overflow-hidden flex flex-col justify-between min-h-[115px] transition-all duration-200">
                    <div>
                      <span className="text-xs font-bold text-slate-300">Year III</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-white">
                          {loadingAverages ? '...' : Number(yearlyAverages.year_3).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400">RP</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="bg-[#4f46e5] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${getProgress(yearlyAverages.year_3)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Year IV (Highlighted Active Solid Indigo Card) */}
                  <div className="rounded-2xl p-5 shadow-xs bg-[#4f46e5] text-white overflow-hidden flex flex-col justify-between min-h-[115px]">
                    <div>
                      <span className="text-xs font-bold text-indigo-100">Year IV</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-white">
                          {loadingAverages ? '...' : Number(yearlyAverages.year_4).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-indigo-200">RP</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="bg-white h-full rounded-full transition-all duration-500" 
                        style={{ width: `${getProgress(yearlyAverages.year_4)}%` }}
                      ></div>
                    </div>
                  </div>

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
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                          Department Leaderboards
                        </h1>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">
                        Select any department to view live student rankings in descending order of Reward Points.
                      </p>
                    </div>

                    {/* Filter Department Search */}
                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={deptFilterQuery}
                        onChange={(e) => setDeptFilterQuery(e.target.value)}
                        placeholder="Filter department..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                          className="rounded-3xl border border-slate-800 bg-slate-900 hover:border-slate-700 shadow-lg shadow-black/30 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group"
                        >
                          <div>
                            {/* Card Top Header */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-3xl">{dept.icon}</span>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${dept.badgeColor}`}>
                                  {dept.id}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                  {dept.degree}
                                </span>
                              </div>
                            </div>

                            {/* Department Name */}
                            <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                              {dept.name}
                            </h3>

                            <p className="text-xs text-slate-400 mt-2 font-medium">
                              Bannari Amman Institute of Technology
                            </p>
                          </div>

                          {/* Card Action Button */}
                          <button
                            onClick={() => handleViewDepartmentLeaderboard(dept)}
                            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                          >
                            <span>View Leaderboard</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                /* SELECTED DEPARTMENT DETAILED LEADERBOARD VIEW */
                <div>
                  {/* Back Button & Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedDeptLeaderboard(null)}
                        className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>All Departments</span>
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{selectedDeptLeaderboard.icon}</span>
                          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                            {selectedDeptLeaderboard.name}
                          </h1>
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${selectedDeptLeaderboard.badgeColor}`}>
                            {selectedDeptLeaderboard.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Ranked in <span className="text-emerald-400 font-bold">descending order</span> of Reward Points • {selectedDeptLeaderboard.degree}
                        </p>
                      </div>
                    </div>

                    {/* Filter Within Department */}
                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={deptStudentSearch}
                        onChange={(e) => setDeptStudentSearch(e.target.value)}
                        placeholder="Search student in department..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Leaderboard Table / Content */}
                  {loadingDeptLeaderboard ? (
                    <div className="py-20 text-center">
                      <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm font-semibold text-slate-400">
                        Fetching {selectedDeptLeaderboard.name} student records & calculating year-wise ranks...
                      </p>
                    </div>
                  ) : deptLeaderboardList.length === 0 ? (
                    <div className="py-16 text-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
                      <p className="text-slate-400 text-sm">
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
                          <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit shadow-md shadow-black/20">
                            <button
                              onClick={() => setSelectedLeaderboardYear('ALL')}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                selectedLeaderboardYear === 'ALL'
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
                                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                  }`}
                                >
                                  <span>{yr}</span>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedLeaderboardYear === yr ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
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
                            <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg relative flex flex-col justify-between order-2 md:order-1">
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-black text-sm border border-slate-600">
                                  🥈 #2
                                </div>
                                <span className="text-[11px] font-mono text-slate-400">{filteredList[1].roll_no}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 inline-block mb-1">
                                  {filteredList[1].normalizedYear}
                                </span>
                                <h4 className="font-extrabold text-white text-base truncate">{filteredList[1].student_name}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">{filteredList[1].mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-medium">Points</span>
                                <span className="text-lg font-black text-emerald-400">+{filteredList[1].displayBalance} RP</span>
                              </div>
                            </div>

                            {/* Rank 1 (Gold - Elevated) */}
                            <div className="rounded-3xl border-2 border-amber-500/70 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900 p-6 shadow-xl relative flex flex-col justify-between order-1 md:order-2 md:-translate-y-2">
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-base border border-amber-500/60 shadow-md shadow-amber-500/20">
                                  🥇 #1
                                </div>
                                <span className="text-xs font-mono font-bold text-amber-300">{filteredList[0].roll_no}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                                    {selectedLeaderboardYear === 'ALL' ? 'Department Rank 1' : `${selectedLeaderboardYear} Rank 1`}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    {filteredList[0].normalizedYear}
                                  </span>
                                </div>
                                <h4 className="font-black text-white text-lg truncate">{filteredList[0].student_name}</h4>
                                <p className="text-xs text-slate-300 mt-0.5">{filteredList[0].mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Top Score</span>
                                <span className="text-xl font-black text-emerald-400">+{filteredList[0].displayBalance} RP</span>
                              </div>
                            </div>

                            {/* Rank 3 (Bronze) */}
                            <div className="rounded-3xl border border-amber-900/60 bg-slate-900/90 p-5 shadow-lg relative flex flex-col justify-between order-3">
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-2xl bg-amber-950/40 text-amber-400 flex items-center justify-center font-black text-sm border border-amber-800">
                                  🥉 #3
                                </div>
                                <span className="text-[11px] font-mono text-slate-400">{filteredList[2].roll_no}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 inline-block mb-1">
                                  {filteredList[2].normalizedYear}
                                </span>
                                <h4 className="font-extrabold text-white text-base truncate">{filteredList[2].student_name}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">{filteredList[2].mentor_name || 'BIT Faculty'}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-medium">Points</span>
                                <span className="text-lg font-black text-emerald-400">+{filteredList[2].displayBalance} RP</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Full Rankings Table */}
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
                          <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                                {selectedLeaderboardYear === 'ALL' ? 'All Years Leaderboard' : `${selectedLeaderboardYear} Leaderboard`}
                              </span>
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                                {filteredList.length} Students
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">
                              Sorted: Highest to Lowest RP
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/80 text-xs font-extrabold uppercase tracking-wider text-slate-200">
                                  <th className="py-4 px-6 text-center w-16">RANK</th>
                                  <th className="py-4 px-6">STUDENT NAME</th>
                                  <th className="py-4 px-6">ROLL NUMBER</th>
                                  <th className="py-4 px-6">ACADEMIC YEAR</th>
                                  <th className="py-4 px-6">FACULTY MENTOR</th>
                                  <th className="py-4 px-6 text-right">REWARD POINTS</th>
                                  <th className="py-4 px-6 text-center">ACTION</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs divide-y divide-slate-800">
                                {filteredList.length === 0 ? (
                                  <tr>
                                    <td colSpan="7" className="py-10 text-center text-slate-500 font-medium">
                                      No students matching the selected year and search criteria.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredList.map((st, index) => {
                                    const rank = index + 1;
                                    let rankBadge = (
                                      <span className="inline-block w-7 h-7 leading-7 text-center rounded-full font-extrabold text-xs bg-slate-800 text-slate-300 border border-slate-700">
                                        {rank}
                                      </span>
                                    );
                                    if (rank === 1) {
                                      rankBadge = <span className="inline-block px-2.5 py-1 rounded-full font-black text-xs bg-amber-500/20 text-amber-300 border border-amber-500/60">🥇 1</span>;
                                    } else if (rank === 2) {
                                      rankBadge = <span className="inline-block px-2.5 py-1 rounded-full font-black text-xs bg-slate-700 text-slate-200 border border-slate-500">🥈 2</span>;
                                    } else if (rank === 3) {
                                      rankBadge = <span className="inline-block px-2.5 py-1 rounded-full font-black text-xs bg-amber-950/60 text-amber-400 border border-amber-800">🥉 3</span>;
                                    }

                                    return (
                                      <tr 
                                        key={st.roll_no}
                                        className={`transition-colors hover:bg-slate-800/60 ${rank <= 3 ? 'bg-slate-900/40' : ''}`}
                                      >
                                        <td className="py-4 px-6 text-center font-bold">
                                          {rankBadge}
                                        </td>
                                        <td className="py-4 px-6 font-bold text-sm text-white whitespace-nowrap">
                                          {st.student_name}
                                        </td>
                                        <td className="py-4 px-6 font-mono font-semibold text-slate-300 whitespace-nowrap">
                                          {st.roll_no}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                            {st.normalizedYear}
                                          </span>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-slate-400 whitespace-nowrap">
                                          {st.mentor_name || 'N/A'}
                                        </td>
                                        <td className="py-4 px-6 text-right font-black text-sm text-emerald-400 whitespace-nowrap">
                                          +{st.displayBalance} RP
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                          <button
                                            onClick={() => {
                                              const transformed = transformApiStudent(st);
                                              setSelectedStudent(transformed);
                                              setIsModalOpen(true);
                                            }}
                                            className="px-3.5 py-1.5 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs"
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

          {/* VIEW 3: REWARDS HISTORY */}
          {activeNav === 'Rewards History' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Student Rewards History
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Complete chronological rewards activity logs for <span className="text-indigo-400 font-bold">{student.name} ({student.id})</span>.
                </p>
              </div>

              {/* History Table */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-200">
                        <th className="py-4 px-6">#</th>
                        <th className="py-4 px-6">COURSE / ACTIVITY NAME</th>
                        <th className="py-4 px-6">COMPLETED DATE</th>
                        <th className="py-4 px-6">CATEGORY TYPE</th>
                        <th className="py-4 px-6 text-right">POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-slate-800">
                      {rewardsData.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-10 text-center text-slate-500">
                            No activities logged yet.
                          </td>
                        </tr>
                      ) : (
                        rewardsData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-4 px-6 font-mono text-slate-500">{idx + 1}</td>
                            <td className="py-4 px-6 font-bold text-sm text-white">{item.activity_name || item.course_name}</td>
                            <td className="py-4 px-6 text-slate-400 font-medium">{item.date}</td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                {item.activity_type}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right font-black text-sm text-emerald-400">
                              +{item.reward_points} RP
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: SETTINGS */}
          {activeNav === 'Settings' && (
            <div className="max-w-2xl">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  User Settings
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage your portal preferences and account details.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Signed In As
                  </label>
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-slate-700">
                      <AvatarImage
                        src={currentUser.picture || currentUser.photo_url}
                        alt={currentUser.name}
                        initials={currentUser.initials}
                        fallbackBg={currentUser.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{currentUser.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{currentUser.email || currentUser.id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Default Department
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.department || 'COMPUTER TECHNOLOGY'}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30"
                  >
                    Logout Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Phones & Small Screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveNav('Dashboard')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeNav === 'Dashboard' ? 'text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5" strokeWidth={activeNav === 'Dashboard' ? 2.4 : 1.8} />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveNav('Leaderboard')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeNav === 'Leaderboard' ? 'text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-5 h-5" strokeWidth={activeNav === 'Leaderboard' ? 2.4 : 1.8} />
          <span className="text-[10px]">Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveNav('Rewards History')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeNav === 'Rewards History' ? 'text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-5 h-5" strokeWidth={activeNav === 'Rewards History' ? 2.4 : 1.8} />
          <span className="text-[10px]">History</span>
        </button>

        <button
          onClick={() => setActiveNav('Settings')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeNav === 'Settings' ? 'text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-5 h-5" strokeWidth={activeNav === 'Settings' ? 2.4 : 1.8} />
          <span className="text-[10px]">Settings</span>
        </button>
      </div>

      {/* 4. FOOTER */}
      <footer className="w-full border-t border-slate-800 bg-slate-900 py-3.5 px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 mb-14 md:mb-0">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-center sm:text-left">
          <span>© 2026 Rewards Points Site</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-slate-400">Developed by <span className="font-semibold text-indigo-400">Dharineesh V</span> (Dept. of Computer Technology)</span>
        </div>
      </footer>

      {/* 4. "VIEW DETAILS" INTERACTIVE MODAL */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 bg-slate-900 text-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 border-slate-700">
                <AvatarImage
                  src={selectedStudent.picture || selectedStudent.photo_url}
                  alt={selectedStudent.name}
                  initials={selectedStudent.initials}
                  fallbackBg={selectedStudent.avatarBg || "from-[#38c4ee] to-[#0ea5e9]"}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black tracking-tight text-white">{selectedStudent.name}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                    {selectedStudent.year}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {selectedStudent.id} • {selectedStudent.department}
                </p>
              </div>
            </div>

            {/* Modal Points Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              <div className="p-4 rounded-2xl border bg-slate-800/60 border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cumulative RP</span>
                <div className="text-2xl font-black text-cyan-400 mt-1">{selectedStudent.cumulativePoints || selectedStudent.currentPoints} RP</div>
              </div>
              <div className="p-4 rounded-2xl border bg-slate-800/60 border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Redeemed RP</span>
                <div className="text-2xl font-black text-amber-400 mt-1">{selectedStudent.redeemedPoints || '0'} RP</div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl border bg-slate-800/60 border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Balance</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">{selectedStudent.currentPoints} RP</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Points Distribution</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Active Balance RP</span>
                    <span className="text-emerald-400 font-bold">{selectedStudent.currentPoints} RP</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Cumulative Earned RP</span>
                    <span className="text-cyan-400 font-bold">{selectedStudent.cumulativePoints || selectedStudent.currentPoints} RP</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Redeemed RP</span>
                    <span className="text-amber-400 font-bold">{selectedStudent.redeemedPoints || '0'} RP</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: selectedStudent.redeemedPoints && parseFloat(selectedStudent.redeemedPoints) > 0 ? '25%' : '4%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent RP Activities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Recent Activity History</h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {rewardsData.length > 0 ? (
                  rewardsData.slice(0, 8).map((act, index) => {
                    const rawPts = act.reward_points ? parseFloat(act.reward_points.replace(/,/g, '')) : 0;
                    const isPositive = act.type !== 'negative' && rawPts >= 0;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-slate-800/40 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-950/70 text-indigo-400 border border-indigo-800/40">
                            <Trophy className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200 max-w-xs sm:max-w-sm truncate">{act.activity_name || act.course_name}</div>
                            <div className="text-[11px] text-slate-400">{act.date} • {act.activity_type}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full whitespace-nowrap ${
                          isPositive ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60' : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                        }`}>
                          {isPositive ? `+${rawPts.toLocaleString()}` : `-${rawPts.toLocaleString()}`} RP
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No activity logs available for this student.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#4f46e5] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#4338ca] transition-all shadow-md shadow-indigo-500/30"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. INFORMATION MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-800 bg-slate-900 text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">About Rewards Site</h3>
              </div>
              <button onClick={() => setShowInfoModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Rewards Site is the official academic and extracurricular rewards management platform. It tracks student rewards point and leaderboards.
            </p>

            {/* Developer Details Box */}
            <div className="p-4 rounded-2xl border border-slate-700 bg-slate-800/60 mb-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Developer Information</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Developed by:</span>
                  <span className="font-bold text-slate-200">Dharineesh V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Department:</span>
                  <span className="font-semibold text-slate-300">Computer Technology</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Contact No:</span>
                  <a href="tel:9715020320" className="font-bold text-indigo-400 hover:underline">
                    9715020320
                  </a>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
              <div>Version 2.4.0 (2026 Edition)</div>
              <div>© 2026 Rewards Points Site</div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-5 w-full py-2.5 rounded-full bg-[#4f46e5] text-white font-semibold text-xs hover:bg-[#4338ca] transition-colors shadow-md shadow-indigo-500/30"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

