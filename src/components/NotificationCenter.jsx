import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Briefcase,
  Trophy,
  Calendar,
  Sparkles,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import placementData from '../data/placementData.json';

export default function NotificationCenter({ isDarkMode, setActiveNav }) {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState('default');
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bit_read_notifications') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const dropdownRef = useRef(null);

  // Check initial browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate notifications list from dynamic placement & campus activities
  const notifications = useMemo(() => {
    const list = [];
    const dateStr = placementData.editionDate || 'Today';

    // 1. Placement Daily Count Notification
    if (placementData.totalStudentsPlaced) {
      list.push({
        id: `placement_daily_${dateStr}`,
        title: '🎉 Daily BIT Placement Update!',
        description: `${placementData.totalStudentsPlaced} students placed across ${placementData.totalCompaniesVisited} companies (${placementData.targetBatch}).`,
        category: 'Placement',
        icon: Briefcase,
        iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        timestamp: 'Today',
        targetNav: 'Dashboard'
      });
    }

    // 2. Active Placement Drive
    if (placementData.upcomingDrives && placementData.upcomingDrives.length > 0) {
      const drive = placementData.upcomingDrives[0];
      list.push({
        id: `drive_${drive.company.replace(/\s+/g, '_')}_${dateStr}`,
        title: `🏢 Active Drive: ${drive.company}`,
        description: `${drive.role} • ${drive.startDate} – ${drive.endDate} (${drive.targetBatch})`,
        category: 'Recruitment',
        icon: Sparkles,
        iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        timestamp: 'Active Drive',
        targetNav: 'Dashboard'
      });
    }

    // 3. Contests / Competitions
    if (placementData.upcomingContests && placementData.upcomingContests.length > 0) {
      const contest = placementData.upcomingContests[0];
      list.push({
        id: `contest_${contest.name.replace(/\s+/g, '_')}`,
        title: `🏆 Contest Live: ${contest.name}`,
        description: `${contest.type} • Status: ${contest.status}`,
        category: 'Hackathon',
        icon: Trophy,
        iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        timestamp: 'Ongoing',
        targetNav: 'Leaderboard'
      });
    }

    return list;
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  // Request native OS notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermission(res);
        if (res === 'granted') {
          // Send a test welcome notification
          new Notification('🔔 BIT Placement Alerts Enabled!', {
            body: `You will automatically receive daily placement updates at ${placementData.editionDate || '5:00 PM'}!`,
            icon: '/favicon.ico'
          });
          setToastMessage('✅ Push notifications enabled! You will get daily 5:00 PM updates.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
  };

  // Trigger OS Notification when a new update is detected
  useEffect(() => {
    if (permission === 'granted' && unreadCount > 0 && notifications.length > 0) {
      const latest = notifications[0];
      const lastNotifiedId = localStorage.getItem('bit_last_notified_placement');
      if (lastNotifiedId !== latest.id) {
        try {
          new Notification(latest.title, {
            body: latest.description,
            icon: '/favicon.ico',
            tag: latest.id
          });
          localStorage.setItem('bit_last_notified_placement', latest.id);
        } catch (e) {
          console.warn('Native notification failed:', e);
        }
      }
    }
  }, [permission, unreadCount, notifications]);

  // Mark specific notification as read
  const markAsRead = (id, targetNav) => {
    const updated = Array.from(new Set([...readIds, id]));
    setReadIds(updated);
    localStorage.setItem('bit_read_notifications', JSON.stringify(updated));
    if (targetNav && setActiveNav) {
      setActiveNav(targetNav);
      setIsOpen(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem('bit_read_notifications', JSON.stringify(allIds));
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
            : isDarkMode
              ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
        }`}
        title="Placement & Campus Notifications"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-amber-500 animate-bounce'}`} />
        ) : (
          <Bell className="w-5 h-5" />
        )}

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl shadow-2xl border z-50 overflow-hidden animate-fadeIn ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          
          {/* Header */}
          <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-bold text-indigo-500 hover:text-indigo-400 cursor-pointer flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Push Notification Permission Banner */}
          {permission !== 'granted' && (
            <div className={`p-3.5 mx-3 mt-3 rounded-2xl border flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-indigo-950/40 border-indigo-800/40 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}>
              <div className="flex items-center gap-2.5">
                <BellRing className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-xs font-bold">
                  Enable Notifications
                </span>
              </div>
              <button
                type="button"
                onClick={requestNotificationPermission}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex-shrink-0 cursor-pointer shadow-xs active:scale-95"
              >
                Enable
              </button>
            </div>
          )}

          {/* Notifications Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => {
                const isRead = readIds.includes(n.id);
                const IconComponent = n.icon;

                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id, n.targetNav)}
                    className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                      !isRead
                        ? isDarkMode
                          ? 'bg-indigo-950/20 hover:bg-indigo-950/30'
                          : 'bg-indigo-50/50 hover:bg-indigo-50/80'
                        : isDarkMode
                          ? 'hover:bg-slate-800/40'
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${n.iconColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs font-bold truncate ${
                          !isRead 
                            ? isDarkMode ? 'text-white' : 'text-slate-900' 
                            : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">
                          {n.timestamp}
                        </span>
                      </div>

                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {n.description}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                          {n.category}
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className={`p-3 border-t text-center ${
            isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
          }`}>
            <span className="text-[10px] font-semibold text-slate-400">
              Synced with daily BIT Newspaper updates
            </span>
          </div>

        </div>
      )}

      {/* Floating Toast Message */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-2xl animate-fadeIn">
          <ShieldCheck className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
