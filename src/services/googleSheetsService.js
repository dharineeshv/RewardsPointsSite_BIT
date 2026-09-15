/**
 * Google Sheets Reward Points Service
 * Direct client-side GViz and REST integration with the official BIT Reward Points Spreadsheet
 * Spreadsheet ID: 1t5uHtrRMSXQkxrFRUudDpwuN23A6K61PhdrjDNZFaV8
 * Chart URL: https://docs.google.com/spreadsheets/u/0/d/e/2CAIWO3eknhiehRfdG1oU224872XJO0ssr4C5WPbdG4Dn3VQWYjCwztko0jDtm41g5_SgzdfNVdiLjwAclZw/gviz/chartiframe?oid=1492100559&resourcekey
 */

export const SPREADSHEET_ID = '1t5uHtrRMSXQkxrFRUudDpwuN23A6K61PhdrjDNZFaV8';
export const AVERAGE_CHART_URL = 'https://docs.google.com/spreadsheets/u/0/d/e/2CAIWO3eknhiehRfdG1oU224872XJO0ssr4C5WPbdG4Dn3VQWYjCwztko0jDtm41g5_SgzdfNVdiLjwAclZw/gviz/chartiframe?oid=1492100559&resourcekey';

// Google Apps Script Live Web App Connector for 1t5uHtrRMSXQkxrFRUudDpwuN23A6K61PhdrjDNZFaV8
export const APPS_SCRIPT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzAHx23UPhPZUjpy7nK-S-d-KyqaQpRH8ufctshUvk7IIEFm3A4bp5XBFvKwdr5Xhp3/exec';
export const APPS_SCRIPT_AVERAGES_URL = APPS_SCRIPT_SHEET_URL;

export const DEPARTMENT_SHEET_TABS = [
  'CT', 'CSE', 'ECE', 'IT', 'AI&DS', 'AIML', 'MECH', 'EEE',
  'CSD', 'CSBS', 'BT', 'BIOMEDICAL', 'AGRI', 'CIVIL', 'FD',
  'FT', 'EIE', 'ISE', 'MTRS', 'INDEX', 'Details'
];

// Department alias normalizer
export function getDepartmentTabName(deptInput = '') {
  const norm = String(deptInput || '').trim().toUpperCase();
  if (norm.includes('COMPUTER TECH') || norm === 'CT') return 'CT';
  if (norm.includes('COMPUTER SCI') || norm === 'CSE' || norm === 'CS') return 'CSE';
  if (norm.includes('ELECTRONICS & COMM') || norm.includes('ELECTRONICS AND COMM') || norm === 'ECE' || norm === 'EC') return 'ECE';
  if (norm.includes('INFORMATION TECH') || norm === 'IT') return 'IT';
  if (norm.includes('ARTIFICIAL INTELLIGENCE & DATA') || norm.includes('AI & DS') || norm.includes('AI&DS') || norm === 'AD') return 'AI&DS';
  if (norm.includes('ARTIFICIAL INTELLIGENCE & MACHINE') || norm.includes('AIML') || norm === 'AM') return 'AIML';
  if (norm.includes('MECHANICAL') || norm === 'MECH' || norm === 'ME') return 'MECH';
  if (norm.includes('ELECTRICAL & ELECTRONICS') || norm.includes('EEE') || norm === 'EE') return 'EEE';
  if (norm.includes('DESIGN') || norm === 'CSD') return 'CSD';
  if (norm.includes('BUSINESS') || norm === 'CSBS' || norm === 'CB') return 'CSBS';
  if (norm.includes('BIOTECH') || norm === 'BT') return 'BT';
  if (norm.includes('BIOMEDICAL') || norm === 'BM') return 'BIOMEDICAL';
  if (norm.includes('AGRICULTURE') || norm.includes('AGRI') || norm === 'AG') return 'AGRI';
  if (norm.includes('CIVIL') || norm === 'CE') return 'CIVIL';
  if (norm.includes('FASHION') || norm === 'FD') return 'FD';
  if (norm.includes('FOOD') || norm === 'FT') return 'FT';
  if (norm.includes('INSTRUMENTATION') || norm === 'EIE' || norm === 'EI') return 'EIE';
  if (norm.includes('INFORMATION SCI') || norm === 'ISE' || norm === 'IS') return 'ISE';
  if (norm.includes('MECHATRONICS') || norm === 'MTRS' || norm === 'MC') return 'MTRS';
  return 'CT';
}

export const DEPARTMENT_SHEET_CONFIGS = [
  { dept: 'ISE', name: 'Information Science & Engineering', gid: '829636275' },
  { dept: 'CT', name: 'Computer Technology', gid: '1090232826' },
  { dept: 'Details', name: 'Details & Benchmarks', gid: '847680829' },
  { dept: 'AIML', name: 'Artificial Intelligence & Machine Learning', gid: '212584501' },
  { dept: 'CSE', name: 'Computer Science & Engineering', gid: '1787666621' },
  { dept: 'IT', name: 'Information Technology', gid: '1356784534' },
  { dept: 'ECE', name: 'Electronics & Communication Engineering', gid: '2130761214' },
  { dept: 'EEE', name: 'Electrical & Electronics Engineering', gid: '938746123' },
  { dept: 'MECH', name: 'Mechanical Engineering', gid: '1245789632' },
  { dept: 'AI&DS', name: 'Artificial Intelligence & Data Science', gid: '1845729103' },
  { dept: 'CSBS', name: 'Computer Science & Business Systems', gid: '1567489201' },
  { dept: 'CSD', name: 'Computer Science & Design', gid: '1478523690' },
  { dept: 'BT', name: 'Biotechnology', gid: '1369852147' },
  { dept: 'BIOMEDICAL', name: 'Biomedical Engineering', gid: '1258963147' },
  { dept: 'AGRI', name: 'Agricultural Engineering', gid: '1456987231' },
  { dept: 'CIVIL', name: 'Civil Engineering', gid: '1589632147' },
  { dept: 'FD', name: 'Fashion Technology', gid: '1698521470' },
  { dept: 'FT', name: 'Food Technology', gid: '1789654123' },
  { dept: 'EIE', name: 'Electronics & Instrumentation Engineering', gid: '1896321457' },
  { dept: 'MTRS', name: 'Mechatronics Engineering', gid: '1987456321' }
];

/**
 * Fetch authenticated student's dynamic reward points directly from live Apps Script connector or backend
 */
export async function fetchAuthenticatedStudentPoints(token = null, emailOrRoll = null, studentName = '') {
  const accessToken = token || (typeof window !== 'undefined' ? localStorage.getItem('bit_rp_access_token') : null);
  const cleanQuery = (emailOrRoll || '').trim();
  const rollOnly = cleanQuery.includes('@') ? cleanQuery.split('@')[0] : cleanQuery;

  // 1. Direct query to deployed Apps Script Live Connector
  if (APPS_SCRIPT_SHEET_URL && rollOnly) {
    try {
      const res = await fetch(`${APPS_SCRIPT_SHEET_URL}?rollNo=${encodeURIComponent(rollOnly)}`);
      if (res.ok) {
        const result = await res.json();
        if (result && result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {}
  }

  const params = new URLSearchParams();
  if (emailOrRoll) {
    if (String(emailOrRoll).includes('@')) params.append('email', String(emailOrRoll).trim());
    else params.append('roll', String(emailOrRoll).trim());
  }
  if (studentName) params.append('name', String(studentName).trim());

  const queryString = params.toString() ? `?${params.toString()}` : '';

  try {
    const headers = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const res = await fetch(`/api/points/me${queryString}`, { headers });
    if (res.ok) {
      const result = await res.json();
      if (result && result.success && result.data) {
        return result.data;
      }
    }
  } catch (err) {}
  return null;
}

function cleanPointValue(raw) {
  if (raw === null || raw === undefined) return 0;
  const str = String(raw).replace(/,/g, '').trim();
  const val = parseFloat(str);
  return isNaN(val) ? 0 : Math.round(val);
}

/**
 * JSONP loader for Google Sheets GViz endpoint
 * Automatically carries user's logged-in Google session cookies and bypasses CORS completely!
 */
export function fetchGVizJsonp(sheetId, sheetName = 'Details', gid = null) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('Browser environment required'));
  }
  
  return new Promise((resolve, reject) => {
    const callbackName = 'gviz_cb_' + Math.random().toString(36).substring(2, 9);
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Google Sheets GViz request timed out'));
    }, 10000);

    function cleanup() {
      clearTimeout(timeout);
      try {
        delete window[callbackName];
        const el = document.getElementById(callbackName);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      } catch (e) {}
    }

    window[callbackName] = function(payload) {
      cleanup();
      resolve(payload);
    };

    const script = document.createElement('script');
    script.id = callbackName;
    const param = gid ? `gid=${gid}` : `sheet=${encodeURIComponent(sheetName)}`;
    script.src = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=responseHandler:${callbackName}&${param}`;
    script.onerror = (err) => {
      cleanup();
      reject(err);
    };
    document.head.appendChild(script);
  });
}

/**
 * Fetch institutional averages across years directly from the official Google Sheet / stats
 */
export async function fetchInstitutionalAveragesFromSheet(forceRefresh = false) {
  const cacheKey = 'bit_sheet_institutional_averages_v2';
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Date.now() - parsed.timestamp < 3 * 60 * 1000) {
          return parsed.averages;
        }
      }
    } catch (e) {}
  }

  const defaultAverages = {
    year_1: 0,
    year_2: 0,
    year_3: 0,
    year_4: 0
  };

  // 1. Try Direct Apps Script Web App Connector
  if (APPS_SCRIPT_SHEET_URL) {
    try {
      const res = await fetch(`${APPS_SCRIPT_SHEET_URL}?action=averages`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.averages) {
          const y1 = Number(json.averages.year_1) || 0;
          const y2 = Number(json.averages.year_2) || 0;
          const y3 = Number(json.averages.year_3) || 0;
          const y4 = Number(json.averages.year_4) || 0;

          if (y1 > 0 || y2 > 0 || y3 > 0 || y4 > 0) {
            const computed = {
              year_1: y1,
              year_2: y2,
              year_3: y3,
              year_4: y4,
              totalStudents: json.totalStudents || 0,
              isLive: true,
              source: json.source || 'Google Sheet Live Connector',
              lastUpdated: json.timestamp || new Date().toISOString()
            };
            try {
              localStorage.setItem(cacheKey, JSON.stringify({
                timestamp: Date.now(),
                averages: computed
              }));
            } catch (e) {}
            return computed;
          }
        }
      }
    } catch (e) {}
  }

  // 2. Try Backend Proxy /api/points/averages
  try {
    const res = await fetch('/api/points/averages');
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.averages) {
        const y1 = Number(json.averages.year_1) || 0;
        const y2 = Number(json.averages.year_2) || 0;
        const y3 = Number(json.averages.year_3) || 0;
        const y4 = Number(json.averages.year_4) || 0;

        if (y1 > 0 || y2 > 0 || y3 > 0 || y4 > 0) {
          const computed = {
            year_1: y1,
            year_2: y2,
            year_3: y3,
            year_4: y4,
            totalStudents: json.averages.totalStudents || 0,
            isLive: true,
            source: json.averages.source || 'Backend Proxy',
            lastUpdated: json.averages.calculatedAt || new Date().toISOString()
          };
          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              timestamp: Date.now(),
              averages: computed
            }));
          } catch (e) {}
          return computed;
        }
      }
    }
  } catch (e) {}

  // 3. Direct JSONP Query to Details Tab (gid=847680829)
  try {
    const payload = await fetchGVizJsonp(SPREADSHEET_ID, 'Details', '847680829');
    if (payload && payload.table) {
      const cols = (payload.table.cols || []).map(c => String(c?.label || c?.id || '').trim().toUpperCase());
      const rows = payload.table.rows || [];

      for (const r of rows) {
        const cells = r.c || [];
        const rowText = cells.map(c => String(c?.v || '')).join(' ').toUpperCase();
        if (rowText.includes('AVERAGE REWARD POINT') || rowText.includes('AVERAGE')) {
          let y1 = 0, y2 = 0, y3 = 0, y4 = 0;
          cells.forEach((c, idx) => {
            const val = parseFloat(String(c?.v || '').replace(/,/g, ''));
            const colLabel = cols[idx] || '';
            if (!isNaN(val)) {
              if (colLabel === 'I' || idx === 1) y1 = val;
              else if (colLabel === 'II' || idx === 2) y2 = val;
              else if (colLabel === 'III' || idx === 4 || idx === 3) y3 = val;
              else if (colLabel === 'IV' || idx === 5 || idx === 4) y4 = val;
            }
          });

          if (y4 > 0 || y3 > 0 || y2 > 0) {
            const computed = {
              year_1: y1,
              year_2: y2,
              year_3: y3,
              year_4: y4,
              isLive: true,
              source: 'Google Sheet (Details Tab)',
              lastUpdated: new Date().toISOString()
            };
            try {
              localStorage.setItem(cacheKey, JSON.stringify({
                timestamp: Date.now(),
                averages: computed
              }));
            } catch (e) {}
            return computed;
          }
        }
      }
    }
  } catch (err) {}

  return defaultAverages;
}

/**
 * Fetch and parse a department tab directly from the Google Sheet by GID or Tab Name
 */
export async function fetchDepartmentSheetData(department = 'CT', useCache = true) {
  const tabName = getDepartmentTabName(department);
  const config = DEPARTMENT_SHEET_CONFIGS.find(c => c.dept === tabName || c.name === tabName) || { gid: '1090232826', dept: tabName };
  const targetGid = config.gid;
  const cacheKey = `bit_sheet_dept_${tabName}_${targetGid}`;

  if (useCache) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.students) && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return parsed.students;
        }
      }
    } catch (e) {}
  }

  // 1. Try Live Apps Script Web App Connector for complete department student list (0ms direct cloud connector)
  if (APPS_SCRIPT_SHEET_URL) {
    try {
      const url = `${APPS_SCRIPT_SHEET_URL}?department=${encodeURIComponent(tabName)}&_t=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && Array.isArray(json.students) && json.students.length > 0) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), students: json.students }));
          } catch (e) {}
          return json.students;
        }
      }
    } catch (e) {}
  }

  // 2. Try Backend Proxy /api/points/sheet-data
  try {
    const res = await fetch(`/api/points/sheet-data?tab=${encodeURIComponent(tabName)}&gid=${targetGid}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.students) && json.students.length > 0) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), students: json.students }));
        } catch (e) {}
        return json.students;
      }
    }
  } catch (e) {}

  // 3. Try Direct JSONP by GID (fast, no CORS, carries Google session cookies)
  try {
    const payload = await fetchGVizJsonp(SPREADSHEET_ID, null, targetGid);
    if (payload && payload.table) {
      const students = parseDepartmentSheetPayload(payload, tabName);
      if (students.length > 0) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), students }));
        } catch (e) {}
        return students;
      }
    }
  } catch (err) {}

  // 3. Try Direct JSONP by Tab Name
  try {
    const payload = await fetchGVizJsonp(SPREADSHEET_ID, tabName);
    if (payload && payload.table) {
      const students = parseDepartmentSheetPayload(payload, tabName);
      if (students.length > 0) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), students }));
        } catch (e) {}
        return students;
      }
    }
  } catch (err) {}

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.students)) return parsed.students;
    }
  } catch (e) {}

  return [];
}

function parseDepartmentSheetPayload(payload, tabName) {
  const rows = payload?.table?.rows || [];
  const students = [];
  
  // Detect header row index
  let headerRowIdx = -1;
  let colMap = { roll: -1, name: -1, year: -1, mentor: -1, balance: -1, cumulative: -1, redeemed: -1 };

  for (let r = 0; r < Math.min(rows.length, 6); r++) {
    const cells = rows[r]?.c || [];
    const textRow = cells.map(c => String(c?.v || '').trim().toUpperCase());
    
    const rollIdx = textRow.findIndex(t => t.includes('ROLL') || t.includes('REGISTER'));
    const nameIdx = textRow.findIndex(t => t.includes('NAME') || t.includes('STUDENT'));
    let lastBalIdx = -1;
    for (let c = textRow.length - 1; c >= 0; c--) {
      if (textRow[c].includes('BALANCE') || textRow[c].includes('REMAINING') || textRow[c].includes('AVAILABLE')) {
        lastBalIdx = c;
        break;
      }
    }
    const balIdx = lastBalIdx !== -1 ? lastBalIdx : 9;
    const cumIdx = textRow.findIndex(t => t.includes('CUMULATIVE') || t.includes('TOTAL'));
    const redIdx = textRow.findIndex(t => t.includes('REEDEM') || t.includes('REDEEM') || t.includes('UTILIZED') || t.includes('CLAIMED'));

    if (rollIdx !== -1 && nameIdx !== -1) {
      headerRowIdx = r;
      colMap.roll = rollIdx;
      colMap.name = nameIdx;
      colMap.year = textRow.findIndex(t => t === 'YEAR' || t.includes('YR') || t.includes('BATCH'));
      colMap.mentor = textRow.findIndex(t => t.includes('MENTOR') || t.includes('FACULTY'));
      colMap.balance = balIdx;
      colMap.cumulative = cumIdx !== -1 ? cumIdx : 7;
      colMap.redeemed = redIdx !== -1 ? redIdx : 8;
      break;
    }
  }

  const startRow = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r];
    const cells = row.c || [];
    let rollNo = '';
    let name = '';
    let year = '';
    let mentor = '';
    let cumulativePoints = 0;
    let redeemedPoints = 0;
    let balancePoints = 0;

    if (headerRowIdx !== -1 && colMap.roll !== -1) {
      rollNo = String(cells[colMap.roll]?.v || '').trim().toUpperCase();
      name = String(cells[colMap.name]?.v || '').trim();
      year = colMap.year !== -1 ? String(cells[colMap.year]?.v || '').trim() : '';
      mentor = colMap.mentor !== -1 ? String(cells[colMap.mentor]?.v || '').trim() : '';
      balancePoints = cleanPointValue(cells[colMap.balance]?.v);
      cumulativePoints = colMap.cumulative !== -1 ? cleanPointValue(cells[colMap.cumulative]?.v) : 0;
      redeemedPoints = colMap.redeemed !== -1 ? cleanPointValue(cells[colMap.redeemed]?.v) : 0;

      if (cumulativePoints === 0 && balancePoints > 0 && redeemedPoints > 0) {
        cumulativePoints = balancePoints + redeemedPoints;
      } else if (balancePoints === 0 && cumulativePoints > 0 && redeemedPoints > 0 && cumulativePoints > redeemedPoints) {
        balancePoints = cumulativePoints - redeemedPoints;
      }
    } else {
      // Automatic pattern search
      for (let i = 0; i < Math.min(cells.length, 5); i++) {
        const val = String(cells[i]?.v || '').trim().toUpperCase();
        if (val.length >= 8 && /^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(val)) {
          rollNo = val;
          if (i === 2) {
            year = String(cells[1]?.v || '').trim();
            name = String(cells[3]?.v || '').trim();
            mentor = String(cells[6]?.v || '').trim();
            cumulativePoints = cleanPointValue(cells[7]?.v);
            redeemedPoints = cleanPointValue(cells[8]?.v);
            balancePoints = cleanPointValue(cells[9]?.v);
          } else {
            name = String(cells[i + 1]?.v || '').trim();
            balancePoints = cleanPointValue(cells[i + 2]?.v);
            cumulativePoints = balancePoints;
          }
          break;
        }
      }
    }

    if (rollNo && /^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(rollNo)) {
      year = normalizeYear(year);

      students.push({
        id: rollNo,
        roll_no: rollNo,
        rollNo: rollNo,
        name: name || `Student (${rollNo})`,
        student_name: name || `Student (${rollNo})`,
        year: year,
        department: tabName,
        mentor: mentor || '',
        cumulative_points: cumulativePoints,
        cumulativePoints: cumulativePoints.toString(),
        redeemed_points: redeemedPoints,
        redeemedPoints: redeemedPoints.toString(),
        balance_points: balancePoints,
        currentPoints: balancePoints.toString(),
        points: balancePoints
      });
    }
  }

  students.sort((a, b) => b.balance_points - a.balance_points);
  students.forEach((s, i) => { s.rank = i + 1; });
  return students;
}

/**
 * Fetch all department sheets live from Google Sheets and calculate dynamic averages purely from the sheet
 */
export async function fetchAllLiveDepartmentsAndAverages() {
  const deptPromises = DEPARTMENT_SHEET_CONFIGS.filter(c => c.dept !== 'INDEX').map(config => fetchDepartmentSheetData(config.dept, false));
  const deptResults = await Promise.allSettled(deptPromises);
  
  let allStudents = [];
  deptResults.forEach(res => {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      allStudents = allStudents.concat(res.value);
    }
  });

  const averages = calculateDynamicAveragesFromStudents(allStudents);
  return {
    students: allStudents,
    averages,
    lastUpdated: new Date().toISOString()
  };
}

const STUDENT_LIVE_CACHE = new Map();
const STUDENT_CACHE_TTL = 2 * 60 * 1000; // 2 minutes fresh cache

export function getCachedStudentPoints(rollNo) {
  if (!rollNo) return null;
  const cleanRoll = String(rollNo).trim().toUpperCase();
  if (STUDENT_LIVE_CACHE.has(cleanRoll)) {
    const item = STUDENT_LIVE_CACHE.get(cleanRoll);
    if (Date.now() - item.timestamp < STUDENT_CACHE_TTL) {
      return item.data;
    }
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`bit_live_student_${cleanRoll}`);
      if (raw) {
        const item = JSON.parse(raw);
        if (item && item.data && Date.now() - item.timestamp < STUDENT_CACHE_TTL) {
          STUDENT_LIVE_CACHE.set(cleanRoll, item);
          return item.data;
        }
      }
    } catch (e) {}
  }
  return null;
}

export function cacheStudentPoints(rollNo, data) {
  if (!rollNo || !data) return;
  const cleanRoll = String(rollNo).trim().toUpperCase();
  const entry = { timestamp: Date.now(), data };
  STUDENT_LIVE_CACHE.set(cleanRoll, entry);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`bit_live_student_${cleanRoll}`, JSON.stringify(entry));
    } catch (e) {}
  }
}

/**
 * Fetch a specific student's live reward points from their department tab by roll number or email
 */
export async function fetchStudentRewardPointsFromSheet(rollNoOrEmail, department = '', useCache = true) {
  if (!rollNoOrEmail) return null;
  const rawInput = String(rollNoOrEmail).trim();
  const isEmail = rawInput.includes('@');
  const cleanRoll = isEmail ? '' : rawInput.toUpperCase();
  const cleanEmail = isEmail ? rawInput.toLowerCase() : '';
  const cacheKey = cleanEmail || cleanRoll;

  // 0. Return instant cached value if available (0ms delay)
  if (useCache && cacheKey) {
    const cached = getCachedStudentPoints(cacheKey);
    if (cached) return cached;
  }

  // Deduce department tab code from roll number or email (e.g. 7376232CT120 -> CT, sanjay.m.ad23@bitsathy.ac.in -> AI&DS)
  let targetDept = department;
  if (!targetDept) {
    if (cleanRoll) {
      const rollLetters = (cleanRoll.match(/[A-Z]+/g) || []).join('');
      targetDept = rollLetters || 'CT';
    } else if (cleanEmail) {
      const prefix = cleanEmail.split('@')[0];
      const match = prefix.match(/([a-z]+)\d{2}$/i);
      if (match) targetDept = match[1].toUpperCase();
    }
  }

  // 1. Query live Apps Script Web App Connector directly
  if (APPS_SCRIPT_SHEET_URL) {
    try {
      let queryParams = `_t=${Date.now()}`;
      if (cleanRoll) queryParams += `&rollNo=${encodeURIComponent(cleanRoll)}`;
      if (cleanEmail) queryParams += `&email=${encodeURIComponent(cleanEmail)}`;
      if (targetDept) queryParams += `&dept=${encodeURIComponent(targetDept)}`;

      const url = `${APPS_SCRIPT_SHEET_URL}?${queryParams}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const result = await res.json();
        if (result && result.success && result.data) {
          if (cacheKey) cacheStudentPoints(cacheKey, result.data);
          if (result.data.roll_no) cacheStudentPoints(result.data.roll_no.toUpperCase(), result.data);
          if (result.data.email) cacheStudentPoints(result.data.email.toLowerCase(), result.data);
          return result.data;
        }
      }
    } catch (e) {}
  }

  // 2. Query Backend Proxy /api/points/me?roll=... or /api/points/me?email=...
  try {
    const qParam = isEmail ? `email=${encodeURIComponent(cleanEmail)}` : `roll=${encodeURIComponent(cleanRoll)}`;
    const res = await fetch(`/api/points/me?${qParam}`);
    if (res.ok) {
      const result = await res.json();
      if (result && result.success && result.data) {
        if (cacheKey) cacheStudentPoints(cacheKey, result.data);
        return result.data;
      }
    }
  } catch (e) {}

  // 3. Query department sheet tab directly via JSONP / sheet-data
  try {
    const students = await fetchDepartmentSheetData(targetDept || 'CT');
    if (Array.isArray(students) && students.length > 0) {
      const found = students.find(s => {
        if (!s) return false;
        const sRoll = (s.roll_no || s.rollNo || s.id || '').toUpperCase();
        const sEmail = (s.email || '').toLowerCase();
        if (cleanRoll && sRoll === cleanRoll) return true;
        if (cleanEmail && sEmail === cleanEmail) return true;
        return false;
      });
      if (found) {
        if (cacheKey) cacheStudentPoints(cacheKey, found);
        return found;
      }
    }
  } catch (e) {}

  return null;
}

// Master Studentwise Reward Points Spreadsheet
export const MASTER_SPREADSHEET_ID = SPREADSHEET_ID;
export const MASTER_SHEET_TAB = 'Details';

/**
 * Fetch a student's full detailed record from the Backend API
 */
export async function fetchMasterStudentFromSheet(rollNo) {
  if (!rollNo) return null;
  const cleanRoll = String(rollNo).trim().toUpperCase();
  
  try {
    const res = await fetch(`/api/points/me?roll=${encodeURIComponent(cleanRoll)}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {}
  return null;
}

/**
 * Fetch live data for Master Spreadsheet tabs using Backend API
 */
export async function fetchLiveMasterSpreadsheet(token = null) {
  const accessToken = token || (typeof window !== 'undefined' ? localStorage.getItem('bit_rp_access_token') : null);

  const cacheKey = 'bit_master_sheet_live_cache';
  try {
    const headers = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const res = await fetch('/api/points/sheet-data', { headers });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem('bit_sheet_last_synced', new Date().toISOString());
          } catch (e) {}
        }
        return data;
      }
    }
  } catch (err) {
    // Suppress network or permission errors
  }
  return null;
}

/**
 * Google Apps Script Live P-Skills & Student Initiative Ledger URL
 */
export const APPS_SCRIPT_PSKILL_URL = 'https://script.google.com/a/macros/bitsathy.ac.in/s/AKfycbyRoy2c2L2A1zyQ1v_XFD_XCR7nc86kvoQhPyGHtyf0OWwO2n1L2ytSkcbakZ-qAjlcwg/exec';

/**
 * Fetch dynamic live P-Skill and Student Initiative completion records from the BIT Apps Script Web App
 */
export async function fetchLivePSkillLedgerFromAppsScript(rollNo = null, token = null, forceRefresh = false) {
  const accessToken = token || (typeof window !== 'undefined' ? localStorage.getItem('bit_rp_access_token') : null);
  const cacheKey = 'bit_apps_script_pskill_ledger';

  // 1. Check fresh cache (3 minutes TTL) unless forceRefresh is true
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.records) && Date.now() - parsed.timestamp < 3 * 60 * 1000) {
          return parsed.records;
        }
      }
    } catch (e) {}
  }

  // 2. Fetch live data via backend proxy to avoid browser CORS blocks
  try {
    const params = new URLSearchParams();
    if (rollNo) params.append('rollNo', rollNo);
    if (accessToken) params.append('token', accessToken);

    const res = await fetch(`/api/points/pskills?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      const rawRecords = data?.records || [];
      if (Array.isArray(rawRecords) && rawRecords.length > 0) {
        const records = rawRecords.map(r => ({
          date: r.date || '2025-2026',
          activity_code: r.activity_code || r.code || '',
          code: r.activity_code || r.code || '',
          roll_no: (r.roll_no || r.rollNo || '').toUpperCase(),
          student_name: r.student_name || r.name || '',
          year: r.year || '',
          department: r.department || '',
          reward_points: (r.points || cleanPointValue(r.reward_points)).toLocaleString(),
          points: r.points || cleanPointValue(r.reward_points),
          activity_type: r.activity_type || 'P Skill',
          activity_name: r.activity_name || r.course_name || 'P-Skill Activity',
          course_name: r.course_name || r.activity_name || 'P-Skill Activity',
          organizer: r.organizer || '',
          type: 'positive',
          isPS: true
        }));

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), records }));
            localStorage.setItem('bit_pskill_last_synced', new Date().toISOString());
          } catch (err) {}
        }
        return records;
      }
    }
  } catch (err) {}

  // 3. Fallback to existing cache if network was unavailable
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.records)) return parsed.records;
      }
    } catch (e) {}
  }

  return [];
}

/**
 * Fetch a specific student's live transactional event logs directly from Google Sheets / Apps Script API
 */
export async function fetchLiveStudentEventLogs(rollNo, token = null) {
  if (!rollNo) return [];
  const cleanRoll = String(rollNo).trim().toUpperCase();
  const accessToken = token || (typeof window !== 'undefined' ? localStorage.getItem('bit_rp_access_token') : null);

  const events = [];

  // 1. First check live Apps Script P-Skill records
  try {
    const appsScriptLogs = await fetchLivePSkillLedgerFromAppsScript(cleanRoll, accessToken);
    if (Array.isArray(appsScriptLogs) && appsScriptLogs.length > 0) {
      const matched = appsScriptLogs.filter(r => (r.roll_no || r.rollNo || '').toUpperCase() === cleanRoll);
      matched.forEach((r, idx) => {
        events.push({
          id: `as-ps-${idx}`,
          date: r.date || '2025-2026',
          code: r.activity_code || r.code || '',
          activity_code: r.activity_code || r.code || '',
          points: r.points || cleanPointValue(r.reward_points),
          activity_name: r.activity_name || r.course_name || 'P-Skill Activity',
          course_name: r.course_name || r.activity_name || 'P-Skill Activity',
          activity_type: r.activity_type || 'P Skill',
          reward_points: (r.points || cleanPointValue(r.reward_points)).toLocaleString(),
          organizer: r.organizer || '',
          type: 'positive',
          isPS: r.isPS !== undefined ? r.isPS : true
        });
      });
    }
  } catch (asErr) {
    console.warn('[GoogleSheetsService] Apps Script fetch notice:', asErr);
  }

  // 2. Check in-memory/localStorage live cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('bit_master_sheet_live_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.posEntries)) {
          // Positive entries
          parsed.posEntries.forEach((row, idx) => {
            if (idx < 2 || !row) return;
            const r = String(row[3] || '').trim().toUpperCase();
            if (r === cleanRoll) {
              const code = row[2] || '';
              // Avoid duplicate if already pulled from Apps Script
              if (code && events.some(e => e.code === code)) return;

              const pts = parseFloat((row[7] || '0').replace(/,/g, '')) || 0;
              let actType = (row[8] || 'P SKILL').trim();
              if (actType.toUpperCase().includes('P SKILL') || actType.toUpperCase().includes('PSKILL')) actType = 'P Skill';
              else if (actType.toUpperCase().includes('INITIATIVE')) actType = 'Initiative';
              else if (actType.toUpperCase().includes('TECHNICAL')) actType = 'Technical';

              events.push({
                id: `live-pos-${idx}`,
                date: row[1] || 'Academic Year 2024-2025',
                code: code,
                points: pts,
                activity_name: row[9] || 'P-Skill Activity',
                course_name: row[9] || 'P-Skill Activity',
                activity_type: actType,
                reward_points: pts.toLocaleString(),
                organizer: row[10] || '',
                type: 'positive'
              });
            }
          });

          // Negative penalty entries
          if (Array.isArray(parsed.negEntries)) {
            parsed.negEntries.forEach((row, idx) => {
              if (idx < 1 || !row) return;
              const r = String(row[3] || '').trim().toUpperCase();
              if (r === cleanRoll) {
                const pts = parseFloat((row[7] || '0').replace(/,/g, '')) || 0;
                events.push({
                  id: `live-neg-${idx}`,
                  date: row[1] || 'Academic Year 2024-2025',
                  code: row[2] || '',
                  points: -Math.abs(pts),
                  activity_name: row[9] || 'Penalty / Absent',
                  reward_points: (-Math.abs(pts)).toLocaleString(),
                  organizer: row[10] || '',
                  type: 'negative'
                });
              }
            });
          }
        }
      }
    } catch (e) {}
  }

  if (events.length > 0) return events;

  // 3. If token is available and events is empty, trigger live fetch
  if (accessToken) {
    try {
      const freshData = await fetchLiveMasterSpreadsheet(accessToken);
      if (freshData && Array.isArray(freshData.posEntries)) {
        return fetchLiveStudentEventLogs(cleanRoll, accessToken);
      }
    } catch (err) {
      console.warn('[GoogleSheetsService] Error querying live student logs:', err);
    }
  }

  return events;
}

/**
 * Calculate dynamic year-wise averages from the combined student population
 */
export function calculateDynamicAveragesFromStudents(studentsList = []) {
  if (!Array.isArray(studentsList) || studentsList.length === 0) {
    return { year_1: 0, year_2: 0, year_3: 0, year_4: 0 };
  }

  const yearStats = {
    year_1: { sum: 0, count: 0 },
    year_2: { sum: 0, count: 0 },
    year_3: { sum: 0, count: 0 },
    year_4: { sum: 0, count: 0 },
  };

  studentsList.forEach(s => {
    const yr = normalizeYear(s.year);
    const pts = parseFloat(s.balancePoints || s.points || s.currentPoints || s.cumulativePoints || 0) || 0;
    if (pts > 0) {
      if (yr === 'I') {
        yearStats.year_1.sum += pts;
        yearStats.year_1.count++;
      } else if (yr === 'II') {
        yearStats.year_2.sum += pts;
        yearStats.year_2.count++;
      } else if (yr === 'III') {
        yearStats.year_3.sum += pts;
        yearStats.year_3.count++;
      } else if (yr === 'IV') {
        yearStats.year_4.sum += pts;
        yearStats.year_4.count++;
      }
    }
  });

  return {
    year_1: yearStats.year_1.count > 0 ? parseFloat((yearStats.year_1.sum / yearStats.year_1.count).toFixed(2)) : 0,
    year_2: yearStats.year_2.count > 0 ? parseFloat((yearStats.year_2.sum / yearStats.year_2.count).toFixed(2)) : 0,
    year_3: yearStats.year_3.count > 0 ? parseFloat((yearStats.year_3.sum / yearStats.year_3.count).toFixed(2)) : 0,
    year_4: yearStats.year_4.count > 0 ? parseFloat((yearStats.year_4.sum / yearStats.year_4.count).toFixed(2)) : 0
  };
}

export function normalizeYear(raw) {
  const s = String(raw || '').trim().toUpperCase();
  if (s === 'I' || s === '1' || s === '1ST' || s.includes('YEAR 1') || s.includes('YEAR I') || s.includes('1ST YEAR') || s.includes('FIRST')) return 'I';
  if (s === 'II' || s === '2' || s === '2ND' || s.includes('YEAR 2') || s.includes('YEAR II') || s.includes('2ND YEAR') || s.includes('SECOND')) return 'II';
  if (s === 'III' || s === '3' || s === '3RD' || s.includes('YEAR 3') || s.includes('YEAR III') || s.includes('3RD YEAR') || s.includes('THIRD')) return 'III';
  if (s === 'IV' || s === '4' || s === '4TH' || s.includes('YEAR 4') || s.includes('YEAR IV') || s.includes('4TH YEAR') || s.includes('FINAL')) return 'IV';
  return s || 'IV';
}
