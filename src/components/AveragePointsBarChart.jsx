import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, Sparkles, LayoutGrid, CheckCircle2, Zap, Flame, Crown, Sprout } from 'lucide-react';

const YEAR_THEMES = {
  year_1: {
    name: 'Year I',
    shortLabel: '1st Yr',
    icon: Sprout,
    gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
    gradientHover: 'hover:from-emerald-500 hover:via-teal-400 hover:to-cyan-300',
    glow: 'rgba(20, 184, 166, 0.35)',
    border: 'border-teal-500/40',
    text: 'text-teal-400',
    lightText: 'text-teal-700',
    badgeBg: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    tooltipBg: 'from-teal-600 to-emerald-700',
    shadow: 'shadow-teal-500/20',
  },
  year_2: {
    name: 'Year II',
    shortLabel: '2nd Yr',
    icon: Zap,
    gradient: 'from-amber-600 via-orange-500 to-yellow-400',
    gradientHover: 'hover:from-amber-500 hover:via-orange-400 hover:to-yellow-300',
    glow: 'rgba(245, 158, 11, 0.35)',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    lightText: 'text-amber-700',
    badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    tooltipBg: 'from-amber-600 to-orange-700',
    shadow: 'shadow-amber-500/20',
  },
  year_3: {
    name: 'Year III',
    shortLabel: '3rd Yr',
    icon: Flame,
    gradient: 'from-blue-600 via-cyan-500 to-sky-400',
    gradientHover: 'hover:from-blue-500 hover:via-cyan-400 hover:to-sky-300',
    glow: 'rgba(56, 189, 248, 0.35)',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    lightText: 'text-cyan-700',
    badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    tooltipBg: 'from-blue-600 to-cyan-700',
    shadow: 'shadow-cyan-500/20',
  },
  year_4: {
    name: 'Year IV',
    shortLabel: 'Final Yr',
    icon: Crown,
    gradient: 'from-indigo-600 via-purple-500 to-pink-500',
    gradientHover: 'hover:from-indigo-500 hover:via-purple-400 hover:to-pink-400',
    glow: 'rgba(168, 85, 247, 0.45)',
    border: 'border-purple-500/50',
    text: 'text-purple-400',
    lightText: 'text-purple-700',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    tooltipBg: 'from-indigo-600 via-purple-600 to-pink-600',
    shadow: 'shadow-purple-500/30',
  }
};

export default function AveragePointsBarChart({
  yearlyAverages = { year_1: 0, year_2: 216, year_3: 332, year_4: 192 },
  currentUser = null,
  student = null,
  userYearLabel = 'Year IV',
  isDarkMode = false,
  loading = false,
  mode = 'chart', // 'chart' | 'cards'
  allowToggle = false,
  title = "AVERAGE REWARD POINTS BY YEAR",
  subtitle = "Official College Benchmarks"
}) {
  const [viewMode, setViewMode] = useState(mode || 'chart');
  const [hoveredYear, setHoveredYear] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (mode) setViewMode(mode);
  }, [mode]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const activeStudent = student || currentUser;
  const studentPoints = Math.round(
    Number(
      activeStudent?.balancePoints ??
      activeStudent?.numBalance ??
      activeStudent?.currentPoints ??
      activeStudent?.cumulativePoints ??
      activeStudent?.totalPoints ??
      0
    )
  );

  const yearsData = [
    { key: 'year_1', label: 'Year I', theme: YEAR_THEMES.year_1, value: Math.round(Number(yearlyAverages.year_1) || 0) },
    { key: 'year_2', label: 'Year II', theme: YEAR_THEMES.year_2, value: Math.round(Number(yearlyAverages.year_2) || 0) },
    { key: 'year_3', label: 'Year III', theme: YEAR_THEMES.year_3, value: Math.round(Number(yearlyAverages.year_3) || 0) },
    { key: 'year_4', label: 'Year IV', theme: YEAR_THEMES.year_4, value: Math.round(Number(yearlyAverages.year_4) || 0) },
  ];

  // Dynamic max value ceiling for clean scaling
  const maxVal = Math.max(...yearsData.map(y => y.value), 100);
  const ceiling = Math.ceil((maxVal * 1.15) / 50) * 50;

  // Active target year benchmark (either selected on click or user's year)
  const targetYearKey = selectedYear || (yearsData.find(y => y.label === userYearLabel)?.key || 'year_4');
  const activeYearData = yearsData.find(y => y.key === targetYearKey) || yearsData[3];
  
  const diffFromAvg = studentPoints - activeYearData.value;
  const isAboveAvg = diffFromAvg >= 0;

  // Grid tick marks
  const ticks = [0, Math.round(ceiling * 0.25), Math.round(ceiling * 0.5), Math.round(ceiling * 0.75), ceiling];

  return (
    <div className={`rounded-2xl sm:rounded-3xl border transition-all p-3.5 sm:p-6 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-900/95 border-slate-800 shadow-2xl backdrop-blur-xl' 
        : 'bg-white border-slate-200 shadow-md'
    }`}>
      {/* Ambient background glow orbs for visual depth */}
      <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-bl from-purple-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-tr from-teal-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title, Live Badge and View Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${
              isDarkMode 
                ? 'bg-indigo-500/15 border-indigo-500/25 text-indigo-400 ring-1 ring-indigo-500/20' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className={`text-xs sm:text-sm font-black tracking-wider uppercase truncate ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {title}
                </h2>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live
                </span>
              </div>
              <span className={`text-[10px] sm:text-[11px] font-semibold block truncate ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle Buttons (Shown only when allowToggle is true) */}
        {allowToggle && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
            <div className={`flex items-center p-1 rounded-xl border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setViewMode('chart')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'chart'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bar Chart</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'cards'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student Comparison Insight Banner */}
      {activeStudent && (
        <div className={`relative z-10 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 transition-all duration-300 backdrop-blur-md ${
          isAboveAvg
            ? isDarkMode 
              ? 'bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/60 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5' 
              : 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
            : isDarkMode 
              ? 'bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-500/5' 
              : 'bg-indigo-50/90 border-indigo-300 text-indigo-900'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${
              isAboveAvg
                ? isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 ring-1 ring-emerald-500/20' : 'bg-emerald-200 text-emerald-800 border-emerald-300'
                : isDarkMode ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 ring-1 ring-indigo-500/20' : 'bg-indigo-200 text-indigo-800 border-indigo-300'
            }`}>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 flex-wrap leading-tight">
                <span>Score: <strong className="font-mono px-1 py-0.2 rounded bg-black/20 text-white dark:text-white">{studentPoints.toLocaleString()} RP</strong></span>
                <span className="opacity-50">•</span>
                <span>{activeYearData.label} Avg: <strong className="font-mono px-1 py-0.2 rounded bg-black/20 text-white dark:text-white">{activeYearData.value.toLocaleString()} RP</strong></span>
              </div>
              <p className={`text-[11px] sm:text-xs font-semibold mt-0.5 sm:mt-1 flex items-center gap-1 truncate ${
                isAboveAvg
                  ? isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                  : isDarkMode ? 'text-indigo-400' : 'text-indigo-700'
              }`}>
                {isAboveAvg
                  ? `🚀 You are ${Math.abs(diffFromAvg).toLocaleString()} RP higher than average RP`
                  : `🎯 You are ${Math.abs(diffFromAvg).toLocaleString()} RP below average RP`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black border font-mono tracking-tight shadow-md ${
              isAboveAvg
                ? isDarkMode ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-emerald-500/20' : 'bg-emerald-200 text-emerald-900 border-emerald-400'
                : isDarkMode ? 'bg-indigo-500/25 text-indigo-300 border-indigo-400/50 shadow-indigo-500/20' : 'bg-indigo-200 text-indigo-900 border-indigo-400'
            }`}>
              {isAboveAvg ? `+${diffFromAvg.toLocaleString()} RP` : `${diffFromAvg.toLocaleString()} RP`}
            </span>
          </div>
        </div>
      )}

      {/* 1. VIBRANT & INTERACTIVE COLORFUL BAR CHART (MOBILE RESPONSIVE) */}
      {viewMode === 'chart' ? (
        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="relative pt-6 sm:pt-8 pb-2">
            {/* Background horizontal grid lines & Y-Axis ticks */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
              {ticks.slice().reverse().map((t, i) => (
                <div key={i} className="flex items-center w-full">
                  <span className={`text-[8px] sm:text-[9px] font-mono font-bold w-7 sm:w-10 text-right pr-1.5 sm:pr-2.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {t}
                  </span>
                  <div className={`flex-1 border-b ${
                    isDarkMode ? 'border-slate-800 border-dashed' : 'border-slate-200 border-dashed'
                  }`} />
                </div>
              ))}
            </div>

            {/* Vertical Colorful Pillars Container */}
            <div className="relative pl-8 sm:pl-12 pr-1 sm:pr-4 h-64 sm:h-80 flex items-end justify-between gap-1.5 sm:gap-4 md:gap-6 z-10">
              {yearsData.map((item, idx) => {
                const isUserYear = item.label === userYearLabel;
                const isHovered = hoveredYear === item.key;
                const isSelected = selectedYear === item.key;
                // Height calculation with minimum visible height
                const targetHeight = Math.min(100, Math.max(6, (item.value / ceiling) * 100));
                const currentHeight = isMounted ? targetHeight : 0;

                return (
                  <div
                    key={item.key}
                    onClick={() => setSelectedYear(selectedYear === item.key ? null : item.key)}
                    onMouseEnter={() => setHoveredYear(item.key)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer select-none transition-transform duration-300 max-w-[70px] sm:max-w-[85px] mx-auto"
                  >
                    {/* Floating Top Tooltip Badge */}
                    <div className={`mb-1.5 sm:mb-2.5 transition-all duration-300 transform ${
                      isHovered || isUserYear || isSelected 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-90 translate-y-0.5 scale-95'
                    }`}>
                      <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black shadow-lg border flex items-center justify-center gap-1 whitespace-nowrap backdrop-blur-md ${
                        isUserYear
                          ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white border-purple-300/60 ring-1 sm:ring-2 ring-purple-400/40 shadow-purple-500/30'
                          : isDarkMode
                            ? `bg-slate-900/90 text-white ${item.theme.border} ${item.theme.shadow}`
                            : 'bg-white text-slate-900 border-slate-300 shadow-md'
                      }`}>
                        <span className="font-mono font-black tracking-tight text-[9px] sm:text-xs">
                          {loading ? '...' : item.value.toLocaleString()}
                        </span>
                        <span className="text-[8px] sm:text-[10px] font-bold opacity-80">RP</span>
                      </div>
                    </div>

                    {/* The Colorful Animated Pillar */}
                    <div className="w-full max-w-[40px] sm:max-w-[64px] md:max-w-[76px] h-full flex items-end">
                      <div
                        style={{
                          height: `${currentHeight}%`,
                          transitionDelay: `${idx * 100}ms`
                        }}
                        className={`w-full rounded-t-xl sm:rounded-t-2xl transition-all duration-1000 ease-out relative overflow-hidden shadow-xl flex flex-col items-center justify-start pt-1 sm:pt-2 ${
                          isUserYear
                            ? 'bg-gradient-to-t from-indigo-600 via-purple-500 to-pink-400 ring-2 ring-purple-400 shadow-purple-500/40'
                            : `bg-gradient-to-t ${item.theme.gradient} ${item.theme.shadow}`
                        }`}
                      >
                        {/* Acrylic Glass Top Cap Highlight */}
                        <div className="w-4/5 h-1 sm:h-1.5 rounded-full bg-white/60 mb-1 backdrop-blur-xs shadow-xs" />

                        {/* Continuous Animated Shimmer Wave on User's Year */}
                        {isUserYear && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse pointer-events-none" />
                        )}

                        {/* Inner Pillar Value for taller bars */}
                        {targetHeight > 28 && (
                          <span className="text-[9px] sm:text-[11px] font-black text-white font-mono drop-shadow-md tracking-tight">
                            {item.value}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* X-Axis Year Labels & Badges */}
                    <div className="mt-2 sm:mt-3 text-center flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <span className={`text-[11px] sm:text-sm font-extrabold transition-colors whitespace-nowrap ${
                          isUserYear
                            ? 'text-purple-400 dark:text-purple-300 font-black'
                            : isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-black'
                        }`}>
                          {item.label}
                        </span>
                      </div>

                      {/* Enrolled Badge or Theme Badge */}
                      {isUserYear ? (
                        <span className="inline-block mt-0.5 sm:mt-1 px-1 sm:px-2 py-0.2 sm:py-0.5 rounded-md bg-purple-500/25 text-purple-300 text-[8px] sm:text-[9px] font-black uppercase tracking-wider border border-purple-500/40 shadow-xs ring-1 ring-purple-400/30 whitespace-nowrap">
                          Your Year
                        </span>
                      ) : (
                        <span className={`inline-block mt-0.5 sm:mt-1 px-1 sm:px-1.5 py-0.2 rounded-md text-[8px] sm:text-[9px] font-bold border whitespace-nowrap ${item.theme.badgeBg}`}>
                          {item.theme.shortLabel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Legend & Benchmark Color Guide */}
          <div className={`mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs ${
            isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
          }`}>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {yearsData.map(y => (
                <div 
                  key={y.key} 
                  onClick={() => setSelectedYear(selectedYear === y.key ? null : y.key)}
                  className={`flex items-center gap-1.5 cursor-pointer px-1.5 py-0.5 rounded-md transition-colors ${
                    selectedYear === y.key ? 'bg-slate-800 ring-1 ring-white/20' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-r ${y.theme.gradient} inline-block shrink-0 shadow-xs`} />
                  <span className={`text-[10px] sm:text-[11px] font-bold ${selectedYear === y.key ? 'text-white' : ''}`}>{y.label}</span>
                  <span className="text-[9px] sm:text-[10px] font-mono opacity-80">({y.value} RP)</span>
                </div>
              ))}
            </div>

            <span className="text-[9px] sm:text-[10px] font-medium opacity-80 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Tap any year to inspect</span>
            </span>
          </div>
        </div>
      ) : (
        /* 2. COMPACT COLORFUL 4-CARD METRIC GRID (MOBILE RESPONSIVE) */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 relative z-10">
          {yearsData.map(card => {
            const isUserYear = card.label === userYearLabel;

            if (isUserYear) {
              return (
                <div 
                  key={card.key}
                  className="rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xl shadow-purple-600/20 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden flex flex-col justify-between transition-all duration-300 ring-2 ring-purple-400/60"
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-[11px] sm:text-xs font-black text-white">{card.label}</span>
                    <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-white/20 text-white backdrop-blur-xs">
                      Your Year
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1 sm:mt-2">
                    <span className="text-xl sm:text-3xl font-black text-white tracking-tight font-mono">
                      {loading ? '...' : card.value.toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-purple-200">RP</span>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={card.key}
                className={`rounded-xl sm:rounded-2xl border p-3.5 sm:p-5 shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-950/60 text-slate-100 hover:border-slate-700' 
                    : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className={`text-[11px] sm:text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {card.label}
                  </span>
                  <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${card.theme.badgeBg}`}>
                    {card.theme.shortLabel}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1 sm:mt-2">
                  <span className={`text-xl sm:text-3xl font-black tracking-tight font-mono ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {loading ? '...' : card.value.toLocaleString()}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-bold ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    RP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
