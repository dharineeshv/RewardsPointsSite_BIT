/**
 * Live Student-Faculty Mentor Mapping Service
 * Fetches real-time student mentor assignments from BIT Cloud / Google Apps Script / Firebase
 * with 0ms SWR (Stale-While-Revalidate) local caching.
 */

import seedMentorData from '../data/studentMentorMapping.json';

const MENTOR_CACHE_KEY = 'bit_live_student_mentor_data_v1';
const MENTOR_CACHE_TIME_KEY = 'bit_live_student_mentor_time_v1';
const APPS_SCRIPT_MENTOR_URL = 'https://script.google.com/macros/s/AKfycbzAHx23UPhPZUjpy7nK-S-d-KyqaQpRH8ufctshUvk7IIEFm3A4bp5XBFvKwdr5Xhp3/exec?action=getMentorMapping';
const FIREBASE_MENTOR_URL = 'https://rewards-site-7a5a8-default-rtdb.firebaseio.com/mappings/student_mentor.json';

/**
 * 0ms Synchronous Getter (SWR Cache-First with seed data fallback)
 */
export function getInstantStudentMentorData() {
  if (typeof window === 'undefined') return seedMentorData;
  try {
    const cached = localStorage.getItem(MENTOR_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return seedMentorData;
}

/**
 * Fetch live student-mentor assignments dynamically from cloud
 */
export async function fetchLiveStudentMentorData(forceRefresh = false) {
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cachedTime = localStorage.getItem(MENTOR_CACHE_TIME_KEY);
      const cached = localStorage.getItem(MENTOR_CACHE_KEY);
      if (cachedTime && cached && Date.now() - parseInt(cachedTime, 10) < 15 * 60 * 1000) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { data: parsed, source: 'cache', isLive: true };
        }
      }
    } catch (e) {}
  }

  let liveData = null;

  // 1. Fetch from Google Apps Script Web App
  try {
    const url = `${APPS_SCRIPT_MENTOR_URL}&_cb=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const result = await res.json();
      if (result && Array.isArray(result) && result.length > 0) {
        liveData = result;
      } else if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
        liveData = result.data;
      }
    }
  } catch (e) {}

  // 2. Fetch from Firebase RTDB fallback
  if (!liveData) {
    try {
      const url = `${FIREBASE_MENTOR_URL}?_cb=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          liveData = data;
        } else if (data && typeof data === 'object') {
          liveData = Object.values(data);
        }
      }
    } catch (e) {}
  }

  // If live data successfully retrieved, update cache
  if (Array.isArray(liveData) && liveData.length > 0) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MENTOR_CACHE_KEY, JSON.stringify(liveData));
        localStorage.setItem(MENTOR_CACHE_TIME_KEY, Date.now().toString());
      } catch (e) {}
    }
    return { data: liveData, source: 'cloud', isLive: true };
  }

  const fallback = getInstantStudentMentorData();
  return { data: fallback, source: 'seed', isLive: false };
}

/**
 * Get mentor mapping by student roll number
 */
export function getStudentMentorByRoll(rollNo, customDataset = null) {
  if (!rollNo) return null;
  const dataset = customDataset || getInstantStudentMentorData();
  const cleanRoll = String(rollNo).trim().toUpperCase();
  return dataset.find(item => (item.rollNo || '').toUpperCase() === cleanRoll) || null;
}

/**
 * Helper to resolve user department code from roll number or profile
 */
export function resolveUserDeptCode(user, customDataset = null) {
  if (!user) return 'ALL';
  const userRoll = (user.id || user.roll_no || user.rollNo || user.roll || '').toUpperCase().trim();
  const dataset = customDataset || getInstantStudentMentorData();

  if (userRoll && Array.isArray(dataset)) {
    const record = dataset.find(item => (item.rollNo || '').toUpperCase() === userRoll);
    if (record?.deptCode) return record.deptCode;
  }

  const letters = (userRoll.match(/[A-Z]+/g) || []).join('');
  const ROLL_CODE_MAP = {
    'CT': 'CT', 'IT': 'IT', 'CS': 'CSE', 'CSE': 'CSE', 'EC': 'ECE', 'ECE': 'ECE',
    'EE': 'EEE', 'EEE': 'EEE', 'AD': 'AI&DS', 'AIDS': 'AI&DS', 'AM': 'AIML', 'AIML': 'AIML',
    'BT': 'BT', 'BM': 'BM', 'BME': 'BM', 'CE': 'CIVIL', 'CIVIL': 'CIVIL', 'ME': 'MECH',
    'MECH': 'MECH', 'MC': 'MTRS', 'MTRS': 'MTRS', 'EI': 'EIE', 'EIE': 'EIE', 'CB': 'CSBS',
    'CSBS': 'CSBS', 'CD': 'CSD', 'CSD': 'CSD', 'IS': 'ISE', 'ISE': 'ISE', 'AG': 'AGRI',
    'AGRI': 'AGRI', 'FT': 'FT', 'FD': 'FT'
  };
  if (letters && ROLL_CODE_MAP[letters]) {
    return ROLL_CODE_MAP[letters];
  }

  const deptStr = (user.department || user.dept || '').toUpperCase().trim();
  if (deptStr.includes('COMPUTER TECH') || deptStr === 'CT') return 'CT';
  if (deptStr.includes('COMPUTER SCI') || deptStr === 'CSE' || deptStr === 'CS') return 'CSE';
  if (deptStr.includes('ELECTRONICS & COMM') || deptStr.includes('ELECTRONICS AND COMM') || deptStr === 'ECE') return 'ECE';
  if (deptStr.includes('INFORMATION TECH') || deptStr === 'IT') return 'IT';
  if (deptStr.includes('ARTIFICIAL INTELLIGENCE & DATA') || deptStr.includes('AI & DS') || deptStr.includes('AI&DS')) return 'AI&DS';
  if (deptStr.includes('ARTIFICIAL INTELLIGENCE & MACHINE') || deptStr.includes('AIML')) return 'AIML';
  if (deptStr.includes('MECHANICAL') || deptStr === 'MECH') return 'MECH';
  if (deptStr.includes('ELECTRICAL') || deptStr === 'EEE') return 'EEE';
  if (deptStr.includes('BIOTECH') || deptStr === 'BT') return 'BT';
  if (deptStr.includes('BIOMEDICAL') || deptStr === 'BM') return 'BM';
  if (deptStr.includes('AGRICULTURE') || deptStr.includes('AGRI')) return 'AGRI';
  if (deptStr.includes('CIVIL')) return 'CIVIL';
  if (deptStr.includes('FASHION') || deptStr.includes('FOOD')) return 'FT';
  if (deptStr.includes('INSTRUMENTATION') || deptStr === 'EIE') return 'EIE';
  if (deptStr.includes('INFORMATION SCI') || deptStr === 'ISE') return 'ISE';
  if (deptStr.includes('MECHATRONICS') || deptStr === 'MTRS') return 'MTRS';
  if (deptStr.includes('BUSINESS') || deptStr === 'CSBS') return 'CSBS';
  if (deptStr.includes('DESIGN') || deptStr === 'CSD') return 'CSD';

  return 'ALL';
}
