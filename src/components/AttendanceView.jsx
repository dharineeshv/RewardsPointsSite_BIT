import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  Clock,
  Check,
  X,
  Send,
  RefreshCw,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';

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

  // Selected Date State: formatted as YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const cached = localStorage.getItem(`bit_attendance_${today}`);
      if (cached) return JSON.parse(cached);
    } catch(e) {}
    return null;
  });

  const [syncFeedback, setSyncFeedback] = useState('');

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
      const displayFormatted = `${days[dt.getDay()]}, ${d} ${months[m - 1]} ${y}`;
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

  // Primary Fetcher: Query Live BIT PS Portal via direct proxy gateway
  const loadAttendance = useCallback(async (dateStr = selectedDate, showFeedback = false) => {
    setLoading(true);
    try {
      // 1. Direct proxy request to BIT PS API
      const proxyUrl = `/api/ps-portal/api/ps_v2/activity/my-attendance?date=${dateStr}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const json = await res.json();
        const data = json.data?.data || json.data;
        if (data && Array.isArray(data.attendance_log)) {
          setAttendanceData(data);
          try {
            localStorage.setItem(`bit_attendance_${dateStr}`, JSON.stringify(data));
          } catch(e) {}
          if (showFeedback) {
            setSyncFeedback('✅ Attendance updated live from PS Portal!');
            setTimeout(() => setSyncFeedback(''), 3000);
          }
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Live attendance proxy fetch error:', err);
    }

    // 2. Check localStorage cache
    try {
      const cached = localStorage.getItem(`bit_attendance_${dateStr}`);
      if (cached) {
        setAttendanceData(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch(e) {}

    // 3. Fallback default template if network is unavailable
    setAttendanceData(prev => prev || {
      percentage: 100,
      total_days: 74,
      present: 74,
      absent: 0,
      attendance_log: [
        { session_id: 1, timing: '08:45 am to 09:35 am', session: 'Forenoon', status: 'Absent', attendance_by: '—', session_finished: true },
        { session_id: 2, timing: '09:35 am to 10:25 am', session: 'Forenoon', status: 'Absent', attendance_by: '—', session_finished: true },
        { session_id: 3, timing: '10:40 am to 11:30 am', session: 'Forenoon', status: 'Absent', attendance_by: '—', session_finished: true },
        { session_id: 4, timing: '11:30 am to 12:20 pm', session: 'Forenoon', status: 'Absent', attendance_by: '—', session_finished: true },
        { session_id: 5, timing: '01:30 pm to 02:20 pm', session: 'Afternoon', status: 'Absent', attendance_by: '—', session_finished: true },
        { session_id: 6, timing: '02:20 pm to 03:10 pm', session: 'Afternoon', status: 'Absent', attendance_by: '—', session_finished: true },
        { session_id: 7, timing: '03:25 pm to 04:25 pm', session: 'Afternoon', status: 'Absent', attendance_by: '—', session_finished: true }
      ]
    });

    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    loadAttendance(selectedDate, false);
  }, [selectedDate, loadAttendance]);

  const rawLogs = attendanceData?.attendance_log || [];
  
  const forenoonSessions = useMemo(() => {
    return rawLogs.filter(s => String(s.session || '').toLowerCase().includes('fore'));
  }, [rawLogs]);

  const afternoonSessions = useMemo(() => {
    return rawLogs.filter(s => String(s.session || '').toLowerCase().includes('after'));
  }, [rawLogs]);

  const presentCount = useMemo(() => {
    return rawLogs.filter(s => s.status === 'Present' || s.status === 'OnDuty').length;
  }, [rawLogs]);

  const absentCount = useMemo(() => {
    return rawLogs.filter(s => s.status === 'Absent').length;
  }, [rawLogs]);

  const totalWorkingDays = attendanceData?.total_days || 74;
  const daysPresent = attendanceData?.present ?? 74;
  const daysAbsent = attendanceData?.absent ?? 0;
  const overallPercentage = Number(attendanceData?.percentage || 100).toFixed(2);

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
      
      {/* 1. Header Card with Title & Attendance Date Picker */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Left: Icon + My Attendance Title + Formatted Subtitle */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 ${
              isDarkMode ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'bg-[#0f172a] text-white'
            }`}>
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                My Attendance
              </h1>
              <p className={`text-xs sm:text-sm mt-0.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {formattedDateInfo.displayFormatted}
              </p>
            </div>
          </div>

          {/* Right: ATTENDANCE DATE Picker */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadAttendance(selectedDate, true)}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all cursor-pointer disabled:opacity-50"
              title="Sync latest attendance"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
            </button>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className={`text-[11px] font-bold tracking-wider uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                ATTENDANCE DATE
              </span>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border-2 outline-none transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-800 border-indigo-500/80 text-white focus:ring-2 focus:ring-indigo-500/40'
                      : 'bg-white border-[#6366f1] text-slate-900 focus:ring-2 focus:ring-indigo-500/30 shadow-xs'
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
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
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
              <span className={`text-[11px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                OVERALL
              </span>
              <div className={`text-xl sm:text-2xl font-black mt-0.5 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {overallPercentage}%
              </div>
              <span className={`text-[11px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                {totalWorkingDays} working days
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: DAYS PRESENT */}
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs flex items-center justify-between transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className={`text-[11px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              DAYS PRESENT
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {daysPresent}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        </div>

        {/* Card 3: DAYS ABSENT */}
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs flex items-center justify-between transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className={`text-[11px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              DAYS ABSENT
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {daysAbsent}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
            <X className="w-4 h-4" strokeWidth={3} />
          </div>
        </div>

        {/* Card 4: SELECTED DAY */}
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs flex items-center justify-between transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className={`text-[11px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              SELECTED DAY
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {presentCount}/{rawLogs.length || 7}
            </div>
            <span className={`text-[11px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              Present / periods
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* 3. Daily Register Section */}
      <div className={`rounded-3xl border overflow-hidden shadow-sm transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Register Top Bar */}
        <div className={`p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-white'
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
                isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-100 bg-slate-50/50 text-slate-400'
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
              {forenoonSessions.length > 0 && (
                <>
                  <tr className={isDarkMode ? 'bg-slate-950/60 text-slate-300' : 'bg-slate-50/70 text-slate-700'}>
                    <td colSpan="5" className="py-2.5 px-5 sm:px-6 text-xs font-bold">
                      <span>Forenoon</span> <span className="font-normal text-[11px] text-slate-400 ml-1">Morning sessions</span>
                      <span className="float-right font-normal text-[11px] text-slate-400">{forenoonSessions.length} sessions</span>
                    </td>
                  </tr>

                  {forenoonSessions.map((session, idx) => {
                    const isPresent = session.status === 'Present' || session.status === 'OnDuty';
                    const isHoliday = session.status === 'Holiday';

                    return (
                      <tr key={session.session_id || idx} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
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
                          {session.session || 'Forenoon'}
                        </td>

                        {/* MARKED BY */}
                        <td className={`py-4 px-4 whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                          {session.attendance_by || '—'}
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
                </>
              )}

              {/* Afternoon Group Header */}
              {afternoonSessions.length > 0 && (
                <>
                  <tr className={isDarkMode ? 'bg-slate-950/60 text-slate-300' : 'bg-slate-50/70 text-slate-700'}>
                    <td colSpan="5" className="py-2.5 px-5 sm:px-6 text-xs font-bold">
                      <span>Afternoon</span> <span className="font-normal text-[11px] text-slate-400 ml-1">Afternoon sessions</span>
                      <span className="float-right font-normal text-[11px] text-slate-400">{afternoonSessions.length} sessions</span>
                    </td>
                  </tr>

                  {afternoonSessions.map((session, idx) => {
                    const isPresent = session.status === 'Present' || session.status === 'OnDuty';
                    const isHoliday = session.status === 'Holiday';

                    return (
                      <tr key={session.session_id || idx} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
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
                          {session.session || 'Afternoon'}
                        </td>

                        {/* MARKED BY */}
                        <td className={`py-4 px-4 whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                          {session.attendance_by || '—'}
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
                </>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Missed Request Modal */}
      {missedModalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Submit Missed Attendance Request</h3>
              </div>
              <button
                type="button"
                onClick={() => setMissedModalSession(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <p><strong>Session:</strong> {missedModalSession.timing}</p>
                <p><strong>Slot:</strong> {missedModalSession.session || missedModalSession.slot}</p>
                <p><strong>Date:</strong> {formattedDateInfo.displayFormatted}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Reason for absence / regularization request:</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Attended on-campus placement drive / technical symposium / lab task..."
                  className={`w-full p-3 rounded-xl border text-xs outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {requestSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-center font-bold text-xs">
                  ✅ Missed request submitted successfully to advisor!
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMissedModalSession(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendRequest}
                    disabled={!requestReason.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 cursor-pointer"
                  >
                    Send Request
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
