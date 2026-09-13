/**
 * Google Sheets Reward Points Service
 * Direct client-side GViz and REST integration with the official BIT Reward Points Spreadsheet
 * Spreadsheet ID: 1t5uHtrRMSXQkxrFRUudDpwuN23A6K61PhdrjDNZFaV8
 * Chart URL: https://docs.google.com/spreadsheets/u/0/d/e/2CAIWO3eknhiehRfdG1oU224872XJO0ssr4C5WPbdG4Dn3VQWYjCwztko0jDtm41g5_SgzdfNVdiLjwAclZw/gviz/chartiframe?oid=1492100559&resourcekey
 */

export const SPREADSHEET_ID = '1t5uHtrRMSXQkxrFRUudDpwuN23A6K61PhdrjDNZFaV8';
export const AVERAGE_CHART_URL = 'https://docs.google.com/spreadsheets/u/0/d/e/2CAIWO3eknhiehRfdG1oU224872XJO0ssr4C5WPbdG4Dn3VQWYjCwztko0jDtm41g5_SgzdfNVdiLjwAclZw/gviz/chartiframe?oid=1492100559&resourcekey';

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

function cleanPointValue(raw) {
  if (raw === null || raw === undefined) return 0;
  const str = String(raw).replace(/,/g, '').trim();
  const val = parseFloat(str);
  return isNaN(val) ? 0 : Math.round(val);
}

/**
 * Fetch institutional averages across years directly from the official Google Sheet / stats
 */
export async function fetchInstitutionalAveragesFromSheet() {
  const cacheKey = 'bit_sheet_institutional_averages';
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Date.now() - parsed.timestamp < 10 * 60 * 1000) {
        return parsed.averages;
      }
    }
  } catch (e) {}

  // Official Institutional Chart Benchmark Values (from oid=1492100559)
  const defaultAverages = {
    year_1: 0,
    year_2: 216,
    year_3: 332,
    year_4: 192
  };

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=INDEX`;
    const res = await fetch(url, { credentials: 'include' });
    if (res.ok) {
      const rawText = await res.text();
      const jsonMatch = rawText.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
      if (jsonMatch && jsonMatch[1]) {
        const payload = JSON.parse(jsonMatch[1]);
        const rows = payload?.table?.rows || [];

        let y1Sum = 0, y1Count = 0;
        let y2Sum = 0, y2Count = 0;
        let y3Sum = 0, y3Count = 0;
        let y4Sum = 0, y4Count = 0;

        rows.forEach(r => {
          const cells = r.c || [];
          const year = String(cells[1]?.v || '').trim().toUpperCase();
          const pts = cleanPointValue(cells[cells.length - 1]?.v || cells[3]?.v);

          if (year === 'I' || year === '1') { y1Sum += pts; y1Count++; }
          else if (year === 'II' || year === '2') { y2Sum += pts; y2Count++; }
          else if (year === 'III' || year === '3') { y3Sum += pts; y3Count++; }
          else if (year === 'IV' || year === '4') { y4Sum += pts; y4Count++; }
        });

        const computed = {
          year_1: y1Count > 0 ? Math.round(y1Sum / y1Count) : defaultAverages.year_1,
          year_2: y2Count > 0 ? Math.round(y2Sum / y2Count) : defaultAverages.year_2,
          year_3: y3Count > 0 ? Math.round(y3Sum / y3Count) : defaultAverages.year_3,
          year_4: y4Count > 0 ? Math.round(y4Sum / y4Count) : defaultAverages.year_4,
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
  } catch (err) {
    console.warn('[GoogleSheetsService] Using official benchmark averages:', err);
  }

  return defaultAverages;
}

/**
 * Fetch and parse a department tab directly from the Google Sheet
 */
export async function fetchDepartmentSheetData(department = 'CT', useCache = true) {
  const tabName = getDepartmentTabName(department);
  const cacheKey = `bit_sheet_dept_${tabName}`;

  if (useCache) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.students) && Date.now() - parsed.timestamp < 10 * 60 * 1000) {
          return parsed.students;
        }
      }
    } catch (e) {}
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url, { credentials: 'include' });
    
    if (res.ok) {
      const rawText = await res.text();
      const jsonMatch = rawText.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
      if (jsonMatch && jsonMatch[1]) {
        const payload = JSON.parse(jsonMatch[1]);
        const rows = payload?.table?.rows || [];

        const students = [];
        rows.forEach((row) => {
          const cells = row.c || [];
          let rollNo = '';
          let name = '';
          let year = '';
          let mentor = '';
          let cumulativePoints = 0;
          let redeemedPoints = 0;
          let balancePoints = 0;

          for (let i = 0; i < Math.min(cells.length, 4); i++) {
            const val = String(cells[i]?.v || '').trim().toUpperCase();
            if (val.length >= 8 && /^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(val)) {
              rollNo = val;
              if (i === 2) {
                year = String(cells[1]?.v || '').trim();
                name = String(cells[3]?.v || '').trim();
                mentor = String(cells[6]?.v || '').trim();
                cumulativePoints = cleanPointValue(cells[7]?.v);
                redeemedPoints = cleanPointValue(cells[8]?.v);
                balancePoints = cleanPointValue(cells[9]?.v) || cumulativePoints;
              } else {
                name = String(cells[i + 1]?.v || '').trim();
                balancePoints = cleanPointValue(cells[i + 2]?.v);
                cumulativePoints = balancePoints;
              }
              break;
            }
          }

          if (rollNo) {
            students.push({
              id: rollNo,
              roll_no: rollNo,
              rollNo: rollNo,
              name: name || `Student (${rollNo})`,
              student_name: name || `Student (${rollNo})`,
              year: year || 'IV',
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
        });

        if (students.length > 0) {
          students.sort((a, b) => b.balance_points - a.balance_points);
          students.forEach((s, i) => { s.rank = i + 1; });

          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              timestamp: Date.now(),
              students
            }));
          } catch (e) {}

          return students;
        }
      }
    }
  } catch (err) {
    console.warn(`[GoogleSheetsService] Error fetching department "${tabName}":`, err);
  }

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.students)) {
        return parsed.students;
      }
    }
  } catch (e) {}

  return [];
}

/**
 * Fetch a specific student's live reward points from their department tab
 */
export async function fetchStudentRewardPointsFromSheet(rollNo, department = 'CT') {
  if (!rollNo) return null;
  const cleanRoll = String(rollNo).trim().toUpperCase();
  const students = await fetchDepartmentSheetData(department);
  if (!Array.isArray(students)) return null;
  const found = students.find(s => s && (s.roll_no === cleanRoll || s.id === cleanRoll));
  return found || null;
}

// Master Studentwise Reward Points Spreadsheet (revealed from Awesome Table settings)
export const MASTER_SPREADSHEET_ID = '1gHiOy41cpyg8dZxDWu-MsF8o0abLbL8MHbVK-GkMjqw';
export const MASTER_SHEET_TAB = 'Studentwise Reward Points';

/**
 * Fetch a student's full detailed record from the Master Spreadsheet API
 */
export async function fetchMasterStudentFromSheet(rollNo) {
  if (!rollNo) return null;
  const cleanRoll = String(rollNo).trim().toUpperCase();
  
  try {
    const tq = encodeURIComponent(`SELECT * WHERE B = '${cleanRoll}'`);
    const url = `https://docs.google.com/spreadsheets/d/${MASTER_SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(MASTER_SHEET_TAB)}&tq=${tq}`;
    const res = await fetch(url);
    if (res.ok) {
      const rawText = await res.text();
      const jsonMatch = rawText.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
      if (jsonMatch && jsonMatch[1]) {
        const payload = JSON.parse(jsonMatch[1]);
        const rows = payload?.table?.rows || [];
        if (rows.length > 0) {
          const cells = rows[0].c || [];
          return {
            rollNo: cleanRoll,
            name: String(cells[3]?.v || '').trim(),
            department: String(cells[6]?.v || '').trim(),
            year: String(cells[5]?.v || 'IV').trim(),
            mentor: String(cells[cells.length > 15 ? 105 : 6]?.v || '').trim(),
            email: String(cells[cells.length > 15 ? 106 : 7]?.v || '').trim(),
            rawCells: cells
          };
        }
      }
    }
  } catch (err) {
    console.warn('[MasterSheetAPI] Error fetching student record:', err);
  }
  return null;
}

/**
 * Fetch live data for Master Spreadsheet tabs using Google Sheets REST API
 */
export async function fetchLiveMasterSpreadsheet(token = null) {
  const accessToken = token || (typeof window !== 'undefined' ? localStorage.getItem('bit_rp_access_token') : null);
  if (!accessToken) {
    return null;
  }

  const cacheKey = 'bit_master_sheet_live_cache';
  try {
    const ranges = [
      encodeURIComponent('Studentwise Reward Points!A1:ZZ10000'),
      encodeURIComponent('Reward Points Entry!A1:L40000'),
      encodeURIComponent('Negative Reward Points!A1:L2000')
    ].join('&ranges=');

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${MASTER_SPREADSHEET_ID}/values:batchGet?ranges=${ranges}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      const valueRanges = data.valueRanges || [];
      const studentRows = valueRanges[0]?.values || [];
      const posEntries = valueRanges[1]?.values || [];
      const negEntries = valueRanges[2]?.values || [];

      const result = {
        timestamp: Date.now(),
        studentRows,
        posEntries,
        negEntries
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(result));
          localStorage.setItem('bit_sheet_last_synced', new Date().toISOString());
        } catch (e) {}
      }

      return result;
    }
  } catch (err) {
    console.warn('[GoogleSheetsService] Live batch fetch error:', err);
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

  // 2. Fetch live data from Google Apps Script endpoint
  try {
    const url = new URL(APPS_SCRIPT_PSKILL_URL);
    if (accessToken) {
      url.searchParams.append('access_token', accessToken);
    }
    if (rollNo) {
      url.searchParams.append('rollNo', rollNo);
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    });

    if (res.ok) {
      const text = await res.text();
      let records = [];
      try {
        const json = JSON.parse(text);
        records = Array.isArray(json) ? json : (json.records || json.data || json.rows || []);
      } catch (e) {
        // If the script returns an HTML table, parse table rows directly
        if (typeof DOMParser !== 'undefined' && text.includes('<table')) {
          const doc = new DOMParser().parseFromString(text, 'text/html');
          const rows = doc.querySelectorAll('table tr');
          rows.forEach((tr, rIdx) => {
            if (rIdx === 0) return; // skip header row
            const cols = Array.from(tr.querySelectorAll('td, th')).map(c => c.textContent.trim());
            if (cols.length >= 7) {
              const pts = cleanPointValue(cols[6]);
              const rawType = cols[7] || 'P SKILL';
              const isPS = rawType.toUpperCase().includes('P SKILL') || rawType.toUpperCase().includes('PSKILL') || rawType.toUpperCase().includes('SKILL');
              records.push({
                date: cols[0],
                activity_code: cols[1],
                code: cols[1],
                roll_no: (cols[2] || '').toUpperCase(),
                student_name: cols[3],
                year: cols[4],
                department: cols[5],
                reward_points: pts.toLocaleString(),
                points: pts,
                activity_type: isPS ? 'P Skill' : (rawType.toUpperCase().includes('INITIATIVE') ? 'Initiative' : rawType),
                raw_type: rawType,
                activity_name: cols[8] || 'P-Skill Activity',
                course_name: cols[8] || 'P-Skill Activity',
                organizer: cols[9] || '',
                type: 'positive',
                isPS
              });
            }
          });
        }
      }

      if (Array.isArray(records) && records.length > 0) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              timestamp: Date.now(),
              records
            }));
            localStorage.setItem('bit_pskill_last_synced', new Date().toISOString());
          } catch (err) {}
        }
        return records;
      }
    }
  } catch (err) {
    console.warn('[AppsScript] Live P-Skill ledger fetch error:', err);
  }

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
                  course_name: row[9] || 'Penalty / Absent',
                  activity_type: 'Penalty',
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
