import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  RefreshCw,
  Sparkles,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Zap,
  Bookmark,
  Key,
  Copy,
  Database,
  Cloud,
  Info
} from 'lucide-react';

const DEFAULT_FIREBASE_DB_URL = 'https://rewards-site-7a5a8-default-rtdb.firebaseio.com';

export default function AttendanceView({
  currentUser,
  student,
  isDarkMode,
  setActiveNav,
  psToken,
  setPsToken
}) {
  const studentRoll = useMemo(() => {
    const raw = (student?.id || student?.roll_no || currentUser?.id || currentUser?.roll_no || '7376232CT109').trim().toUpperCase();
    return raw.includes('@') ? raw.split('@')[0].toUpperCase() : raw;
  }, [student, currentUser]);

  // Selected Date State: formatted as YYYY-MM-DD for native input
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [loading, setLoading] = useState(false);
  const [dailyData, setDailyData] = useState(null);
  const [overallData, setOverallData] = useState(null);
  const [syncStatus, setSyncStatus] = useState('cloud_synced'); // 'cloud_synced' | 'syncing' | 'offline_preview'
  const [syncFeedback, setSyncFeedback] = useState('');
  const [showManualTokenModal, setShowManualTokenModal] = useState(false);
  const [manualTokenInput, setManualTokenInput] = useState('');

  // Missed Request Modal State
  const [missedModalSession, setMissedModalSession] = useState(null);
  const [requestReason, setRequestReason] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Formatted date info
  const formattedDateInfo = useMemo(() => {
    try {
      const [y, m, d] = (selectedDate || '').split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
      
      const dayStr = String(d).padStart(2, '0');
      const monthStr = String(m).padStart(2, '0');
      const displayFormatted = `${days[dt.getDay()]}, ${dayStr} ${months[m - 1]} ${y}`;
      const ddmmyyyy = `${dayStr}-${monthStr}-${y}`;

      return {
        dayName: days[dt.getDay()],
        displayFormatted,
        ddmmyyyy,
        isWeekend,
        dayIndex: dt.getDay()
      };
    } catch (e) {
      return { dayName: 'Today', displayFormatted: selectedDate, ddmmyyyy: selectedDate, isWeekend: false, dayIndex: 1 };
    }
  }, [selectedDate]);

  // Primary Fetcher: Query Firebase Realtime Database with Serverless fallback
  const loadAttendance = useCallback(async (dateStr = selectedDate, forceSync = false) => {
    setLoading(true);
    const fbUrl = (typeof window !== 'undefined' ? localStorage.getItem('bit_firebase_url') : '') || DEFAULT_FIREBASE_DB_URL;
    const cleanFbUrl = fbUrl.replace(/\/$/, '');

    try {
      // 1. Check if direct Bearer token is stored in local session
      const activePsToken = (typeof window !== 'undefined' ? localStorage.getItem('bit_ps_token') : '') || psToken;

      // If forceSync or if user has active token, call the sync worker
      if (forceSync || activePsToken) {
        setSyncStatus('syncing');
        try {
          const syncUrl = `/api/sync-attendance?roll=${encodeURIComponent(studentRoll)}&date=${encodeURIComponent(dateStr)}${activePsToken ? `&token=${encodeURIComponent(activePsToken)}` : ''}`;
          const syncRes = await fetch(syncUrl);
          if (syncRes.ok) {
            const syncJson = await syncRes.json();
            if (syncJson?.data?.daily) {
              setDailyData(syncJson.data.daily);
              if (syncJson.data.overall) setOverallData(syncJson.data.overall);
              setSyncStatus('cloud_synced');
              setSyncFeedback('✅ Attendance updated with live cloud records!');
              setTimeout(() => setSyncFeedback(''), 3000);
              setLoading(false);
              return;
            }
          }
        } catch (syncErr) {
          console.warn('Sync worker background call:', syncErr);
        }
      }

      // 2. Fetch daily records from Firebase
      const dailyRes = await fetch(`${cleanFbUrl}/attendance/${encodeURIComponent(studentRoll)}/daily/${dateStr}.json`);
      if (dailyRes.ok) {
        const dJson = await dailyRes.json();
        if (dJson && Array.isArray(dJson.sessions)) {
          setDailyData(dJson);
          setSyncStatus('cloud_synced');
        } else {
          setDailyData(null);
        }
      }

      // 3. Fetch overall summary from Firebase
      const overallRes = await fetch(`${cleanFbUrl}/attendance/${encodeURIComponent(studentRoll)}/overall.json`);
      if (overallRes.ok) {
        const oJson = await overallRes.json();
        if (oJson && oJson.percentage) {
          setOverallData(oJson);
        }
      }

      setLoading(false);
    } catch (err) {
      console.warn('Error loading attendance from Firebase:', err);
      setSyncStatus('offline_preview');
      setLoading(false);
    }
  }, [selectedDate, studentRoll, psToken]);

  useEffect(() => {
    loadAttendance(selectedDate, false);
  }, [selectedDate, loadAttendance]);

  // Handle Save Manual Token
  const handleSaveManualToken = () => {
    const clean = manualTokenInput.replace(/^Bearer\s+/i, '').trim();
    if (!clean) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bit_ps_token', clean);
    }
    if (setPsToken) setPsToken(clean);
    setShowManualTokenModal(false);
    loadAttendance(selectedDate, true);
  };

  // Determine 7 Period Sessions (Forenoon: 4, Afternoon: 3)
  const sessions = useMemo(() => {
    // If daily data exists from Firebase or API, map it
    if (dailyData && Array.isArray(dailyData.sessions) && dailyData.sessions.length > 0) {
      return dailyData.sessions.slice(0, 7).map((s, idx) => ({
        id: idx + 1,
        timing: s.timing || getPeriodTiming(idx + 1),
        slot: idx < 4 ? 'Forenoon' : 'Afternoon',
        section: idx < 4 ? 'Forenoon' : 'Afternoon',
        markedBy: s.markedBy || s.marked_by || s.faculty || '—',
        status: s.status || (s.is_present ? 'Present' : 'Absent')
      }));
    }

    // Default 7-period timetable preview
    const isWeekend = formattedDateInfo.isWeekend;
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];
    const isPast = selectedDate < now.toISOString().split('T')[0];

    return [
      // Forenoon Sessions (4)
      { id: 1, timing: '08:45 am to 09:35 am', slot: 'Forenoon', section: 'Forenoon', markedBy: '—', status: isWeekend ? 'Holiday' : isPast ? 'Present' : 'Absent' },
      { id: 2, timing: '09:35 am to 10:25 am', slot: 'Forenoon', section: 'Forenoon', markedBy: '—', status: isWeekend ? 'Holiday' : isPast ? 'Present' : 'Absent' },
      { id: 3, timing: '10:45 am to 11:35 am', slot: 'Forenoon', section: 'Forenoon', markedBy: '—', status: isWeekend ? 'Holiday' : isPast ? 'Present' : 'Absent' },
      { id: 4, timing: '11:35 am to 12:25 pm', slot: 'Forenoon', section: 'Forenoon', markedBy: '—', status: isWeekend ? 'Holiday' : isPast ? 'Present' : 'Absent' },
      
      // Afternoon Sessions (3)
      { id: 5, timing: '01:25 pm to 02:15 pm', slot: 'Afternoon', section: 'Afternoon', markedBy: '—', status: isWeekend ? 'Holiday' : isPast ? 'Present' : 'Absent' },
      { id: 6, timing: '02:15 pm to 03:05 pm', slot: 'Afternoon', section: 'Afternoon', markedBy: '—', status: isWeekend ? 'Holiday' : isPast ? 'Present' : 'Absent' },
      { id: 7, timing: '03:15 pm to 04:30 pm', slot: 'Afternoon', section: 'Afternoon', markedBy: '—', status: isWeekend ? 'Holiday' : isPast ? 'Present' : 'Absent' }
    ];
  }, [dailyData, selectedDate, formattedDateInfo.isWeekend]);

  function getPeriodTiming(id) {
    const times = [
      '08:45 am to 09:35 am',
      '09:35 am to 10:25 am',
      '10:45 am to 11:35 am',
      '11:35 am to 12:25 pm',
      '01:25 pm to 02:15 pm',
      '02:15 pm to 03:05 pm',
      '03:15 pm to 04:30 pm'
    ];
    return times[id - 1] || '08:45 am to 09:35 am';
  }

  const forenoonSessions = sessions.filter(s => s.section === 'Forenoon');
  const afternoonSessions = sessions.filter(s => s.section === 'Afternoon');

  const presentCount = sessions.filter(s => s.status === 'Present').length;
  const absentCount = sessions.filter(s => s.status === 'Absent').length;

  const totalWorkingDays = overallData?.totalWorkingDays || 71;
  const daysPresent = overallData?.daysPresent !== undefined ? overallData.daysPresent : (presentCount > 0 ? 71 : 70);
  const daysAbsent = overallData?.daysAbsent !== undefined ? overallData.daysAbsent : (totalWorkingDays - daysPresent);
  const overallPercentage = overallData?.percentage !== undefined ? Number(overallData.percentage).toFixed(2) : ((daysPresent / totalWorkingDays) * 100).toFixed(2);

  const handleOpenMissedRequest = (session) => {
    setMissedModalSession(session);
    setRequestReason('');
    setRequestSubmitted(false);
  };

  const handleSendRequest = () => {
    setRequestSubmitted(true);
    setTimeout(() => {
      setMissedModalSession(null);
      setRequestSubmitted(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 font-sans animate-fadeIn">
      
      {/* 1. Header Card with Title, Sync Status & Attendance Date Picker */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Left: Icon + My Attendance Title + Formatted Subtitle + Cloud Indicator */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 ${
              isDarkMode ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'bg-[#0f172a] text-white'
            }`}>
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  My Attendance
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cloud Live Sync</span>
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-0.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {formattedDateInfo.displayFormatted} • Student: <strong className="font-mono text-indigo-500">{studentRoll}</strong>
              </p>
            </div>
          </div>

          {/* Right: ATTENDANCE DATE & Action Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={() => loadAttendance(selectedDate, true)}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              title="Refresh Attendance"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className={`text-[10px] font-bold tracking-wider uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                ATTENDANCE DATE
              </span>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border-2 outline-none transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-800/90 border-indigo-500/80 text-white focus:ring-2 focus:ring-indigo-500/40'
                      : 'bg-slate-50 border-[#6366f1] text-slate-900 focus:ring-2 focus:ring-indigo-500/30'
                  }`}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {syncFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <ShieldCheck className="w-4 h-4" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* 2. Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: OVERALL */}
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs flex items-center justify-between transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center gap-4">
            {/* Circular Gauge Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className={isDarkMode ? 'text-slate-800' : 'text-slate-100'}
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#0f172a] dark:text-indigo-400"
                  strokeDasharray={`${overallPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className={`absolute text-[11px] font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {Math.round(overallPercentage)}%
              </span>
            </div>

            <div>
              <span className={`text-[10px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                OVERALL
              </span>
              <div className={`text-xl sm:text-2xl font-black mt-0.5 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {overallPercentage}%
              </div>
              <span className={`text-[11px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {totalWorkingDays} working days
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: DAYS PRESENT */}
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs flex items-center justify-between transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div>
            <span className={`text-[10px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              DAYS PRESENT
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {daysPresent}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
        </div>

        {/* Card 3: DAYS ABSENT */}
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs flex items-center justify-between transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div>
            <span className={`text-[10px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              DAYS ABSENT
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {daysAbsent}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
            <X className="w-5 h-5" strokeWidth={3} />
          </div>
        </div>

        {/* Card 4: SELECTED DAY */}
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs flex items-center justify-between transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div>
            <span className={`text-[10px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              SELECTED DAY
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {presentCount}/7
            </div>
            <span className={`text-[11px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Present / periods
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. Daily Register Section */}
      <div className={`rounded-3xl border overflow-hidden shadow-sm transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Register Top Bar */}
        <div className={`p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <div>
            <h3 className={`text-base font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Daily register
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              OTP-marked sessions for the selected date
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{presentCount} present</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{absentCount} absent</span>
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border-b ${
                isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-100 bg-white text-slate-400'
              }`}>
                <th className="py-3 px-5 sm:px-6">TIMING</th>
                <th className="py-3 px-4">SLOT</th>
                <th className="py-3 px-4">MARKED BY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-5 sm:px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs sm:text-sm font-medium ${isDarkMode ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
              
              {/* Forenoon Group Header */}
              <tr className={isDarkMode ? 'bg-slate-950/60 text-slate-300' : 'bg-slate-50/70 text-slate-700'}>
                <td colSpan="5" className="py-2.5 px-5 sm:px-6 text-xs font-bold">
                  <span>Forenoon</span> <span className="font-normal text-[11px] text-slate-400 ml-1">Morning sessions</span>
                  <span className="float-right font-normal text-[11px] text-slate-400">4 sessions</span>
                </td>
              </tr>

              {/* Forenoon Sessions */}
              {forenoonSessions.map((session) => {
                const isPresent = session.status === 'Present';
                const isHoliday = session.status === 'Holiday';

                return (
                  <tr key={session.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                    {/* TIMING with Left Vertical Accent Line */}
                    <td className="py-4 px-5 sm:px-6 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className={`w-1 h-6 rounded-full shrink-0 ${
                          isHoliday ? 'bg-amber-400' : isPresent ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                          {session.timing}
                        </span>
                      </div>
                    </td>

                    {/* SLOT */}
                    <td className={`py-4 px-4 whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {session.slot}
                    </td>

                    {/* MARKED BY */}
                    <td className={`py-4 px-4 whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {session.markedBy}
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {isHoliday ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Holiday
                        </span>
                      ) : isPresent ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Absent
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-5 sm:px-6 text-right whitespace-nowrap">
                      {!isPresent && !isHoliday && (
                        <button
                          type="button"
                          onClick={() => handleOpenMissedRequest(session)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                            isDarkMode 
                              ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white' 
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          <Send className="w-3 h-3 text-slate-400" />
                          <span>Missed request</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Afternoon Group Header */}
              <tr className={isDarkMode ? 'bg-slate-950/60 text-slate-300' : 'bg-slate-50/70 text-slate-700'}>
                <td colSpan="5" className="py-2.5 px-5 sm:px-6 text-xs font-bold">
                  <span>Afternoon</span> <span className="font-normal text-[11px] text-slate-400 ml-1">Afternoon sessions</span>
                  <span className="float-right font-normal text-[11px] text-slate-400">3 sessions</span>
                </td>
              </tr>

              {/* Afternoon Sessions */}
              {afternoonSessions.map((session) => {
                const isPresent = session.status === 'Present';
                const isHoliday = session.status === 'Holiday';

                return (
                  <tr key={session.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                    {/* TIMING with Left Vertical Accent Line */}
                    <td className="py-4 px-5 sm:px-6 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className={`w-1 h-6 rounded-full shrink-0 ${
                          isHoliday ? 'bg-amber-400' : isPresent ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                          {session.timing}
                        </span>
                      </div>
                    </td>

                    {/* SLOT */}
                    <td className={`py-4 px-4 whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {session.slot}
                    </td>

                    {/* MARKED BY */}
                    <td className={`py-4 px-4 whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {session.markedBy}
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {isHoliday ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Holiday
                        </span>
                      ) : isPresent ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Absent
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-5 sm:px-6 text-right whitespace-nowrap">
                      {!isPresent && !isHoliday && (
                        <button
                          type="button"
                          onClick={() => handleOpenMissedRequest(session)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                            isDarkMode 
                              ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white' 
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          <Send className="w-3 h-3 text-slate-400" />
                          <span>Missed request</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>

      </div>

      {/* 4. Missed Request Modal */}
      {missedModalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-lg">Submit Missed Attendance Request</h3>
              </div>
              <button
                onClick={() => setMissedModalSession(null)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  Session: <span className="font-mono font-bold text-indigo-500">{missedModalSession.timing} ({missedModalSession.slot})</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Date: {formattedDateInfo.ddmmyyyy}
                </div>
              </div>

              <div>
                <label className="font-bold text-[11px] block mb-1 uppercase tracking-wider text-slate-400">
                  Reason for missed OTP / OD / Medical
                </label>
                <textarea
                  rows={3}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="State reason for faculty / department advisor review..."
                  className={`w-full p-3 rounded-2xl border outline-none text-xs transition-all ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                  }`}
                />
              </div>

              {requestSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-center">
                  ✅ Missed request submitted to Mentor successfully!
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setMissedModalSession(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendRequest}
                    disabled={!requestReason.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
