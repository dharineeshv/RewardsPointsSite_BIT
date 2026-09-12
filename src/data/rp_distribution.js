// Processed helper for Student Internal Mark Statements & CIE Distributions
import rawData from './rp_distribution_raw.json';

export const BIT_SPREADSHEET_CONFIG = {
  sheetId: '1gHiOy41cpyg8dZxDWu-MsF8o0abLbL8MHbVK-GkMjqw',
  sheetTab: 'Studentwise Reward Points',
  range: 'A1:ZZ10000',
  getEndpoint: (token) =>
    `https://sheets.googleapis.com/v4/spreadsheets/1gHiOy41cpyg8dZxDWu-MsF8o0abLbL8MHbVK-GkMjqw/values/${encodeURIComponent('Studentwise Reward Points')}!A1:ZZ10000`
};

// Reusable parser for event logs and penalty entries
export function parseEventLogs(raw) {
  const posEntries = raw?.sheets?.['Reward Points Entry'] || [];
  const negEntries = raw?.sheets?.['Negative Reward Points'] || [];
  const logsMap = {};

  // Positive entries (Row 2 onwards)
  for (let i = 2; i < posEntries.length; i++) {
    const row = posEntries[i];
    if (!row) continue;
    const roll = (row[3] || '').trim().toUpperCase();
    if (roll && /^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(roll)) {
      if (!logsMap[roll]) logsMap[roll] = [];
      const pts = parseFloat((row[7] || '0').replace(/,/g, '')) || 0;
      const rawType = (row[8] || 'P SKILL').trim();
      let actType = rawType;
      const isPS = rawType.toUpperCase().includes('P SKILL') || rawType.toUpperCase().includes('PSKILL') || rawType.toUpperCase().includes('SKILL');
      if (isPS) actType = 'P Skill';
      else if (rawType.toUpperCase().includes('INITIATIVE')) actType = 'Initiative';
      else if (rawType.toUpperCase().includes('TECHNICAL')) actType = 'Technical';
      else if (rawType.toUpperCase().includes('INTERVIEW')) actType = 'Interview';
      
      logsMap[roll].push({
        id: `pos-${i}`,
        sl_no: row[0] || String(i - 1),
        date: row[1] || 'Academic Year 2024-2025',
        code: row[2] || '',
        activity_code: row[2] || '',
        roll_no: roll,
        student_name: (row[4] || '').trim(),
        year: row[5] || '',
        department: row[6] || '',
        points: pts,
        activity_name: row[9] || 'P-Skill Activity',
        course_name: row[9] || 'P-Skill Activity',
        activity_type: actType,
        raw_type: rawType,
        reward_points: pts.toLocaleString(),
        organizer: row[10] || '',
        email: row[11] || '',
        type: 'positive',
        isPS
      });
    }
  }

  // External Reward Points entries (Competitions, Hackathons, Ideathons)
  const extEntries = raw?.sheets?.['EXTERNAL REWARD POINTS'] || [];
  const existingKeys = new Set();
  Object.keys(logsMap).forEach(r => {
    logsMap[r].forEach(e => {
      if (e.code) existingKeys.add(`${e.code}_${r}`);
    });
  });

  for (let i = 2; i < extEntries.length; i++) {
    const row = extEntries[i];
    if (!row) continue;
    const roll = (row[3] || '').trim().toUpperCase();
    const code = (row[2] || '').trim();
    if (roll && /^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(roll)) {
      if (code && existingKeys.has(`${code}_${roll}`)) continue; // avoid duplicates

      if (!logsMap[roll]) logsMap[roll] = [];
      const pts = Math.round(parseFloat((row[7] || '0').replace(/,/g, ''))) || 0;
      const rawType = (row[8] || 'EXTERNAL').trim();
      const detailedAct = (row[11] || '').trim();
      let actName = (row[9] || 'External Event').trim();
      if (detailedAct && detailedAct !== '#REF!') {
        const parts = detailedAct.split(' / ');
        if (parts.length >= 4) {
          actName = `${parts[4] || parts[3]} (${parts[1] || ''} - ${parts[3] || parts[2]})`;
        } else {
          actName = detailedAct;
        }
      }

      logsMap[roll].push({
        id: `ext-${i}`,
        sl_no: row[0] || String(i),
        date: row[1] || 'Academic Year 2024-2025',
        code: code,
        activity_code: code,
        roll_no: roll,
        student_name: (row[4] || '').trim(),
        year: row[5] || '',
        department: row[6] || '',
        points: pts,
        activity_name: actName,
        course_name: actName,
        activity_type: 'External',
        raw_type: rawType,
        reward_points: pts.toLocaleString(),
        organizer: row[10] || '',
        email: row[12] && row[12] !== '#REF!' ? row[12] : '',
        type: 'positive',
        isPS: false
      });
    }
  }

  // Negative penalty entries (Row 1 onwards)
  for (let i = 1; i < negEntries.length; i++) {
    const row = negEntries[i];
    if (!row) continue;
    const roll = (row[3] || '').trim().toUpperCase();
    if (roll && /^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(roll)) {
      if (!logsMap[roll]) logsMap[roll] = [];
      const pts = Math.round(parseFloat((row[7] || '0').replace(/,/g, ''))) || 0;
      logsMap[roll].push({
        id: `neg-${i}`,
        sl_no: row[0] || String(i),
        date: row[1] || 'Academic Year 2024-2025',
        code: row[2] || '',
        activity_code: row[2] || '',
        roll_no: roll,
        student_name: (row[4] || '').trim(),
        year: row[5] || '',
        department: row[6] || '',
        points: -Math.abs(pts),
        activity_name: row[9] || 'Penalty / Absent',
        course_name: row[9] || 'Penalty / Absent',
        activity_type: 'Penalty',
        raw_type: 'PENALTY',
        reward_points: (-Math.abs(pts)).toLocaleString(),
        organizer: row[10] || '',
        type: 'negative',
        isPS: false
      });
    }
  }

  return logsMap;
}

export function parseAllTransactions(raw) {
  const posEntries = raw?.sheets?.['Reward Points Entry'] || [];
  const extEntries = raw?.sheets?.['EXTERNAL REWARD POINTS'] || [];
  const negEntries = raw?.sheets?.['Negative Reward Points'] || [];
  const list = [];
  const existingKeys = new Set();

  for (let i = 2; i < posEntries.length; i++) {
    const row = posEntries[i];
    if (!row || !row[3]) continue;
    const roll = (row[3] || '').trim().toUpperCase();
    const code = (row[2] || '').trim();
    if (code) existingKeys.add(`${code}_${roll}`);
    const pts = Math.round(parseFloat((row[7] || '0').replace(/,/g, ''))) || 0;
    const rawType = (row[8] || 'P SKILL').trim();
    const isPS = rawType.toUpperCase().includes('P SKILL') || rawType.toUpperCase().includes('PSKILL') || rawType.toUpperCase().includes('SKILL');
    list.push({
      id: `pos-${i}`,
      slNo: row[0] || String(i - 1),
      date: row[1] || '',
      code: code,
      rollNo: roll,
      name: (row[4] || '').trim(),
      year: row[5] || '',
      department: row[6] || '',
      points: pts,
      reward_points: pts.toLocaleString(),
      activity_type: isPS ? 'P Skill' : (rawType.includes('INITIATIVE') ? 'Initiative' : (rawType.includes('TECHNICAL') ? 'Technical' : rawType)),
      raw_type: rawType,
      activity_name: row[9] || 'Activity',
      course_name: row[9] || 'Activity',
      organizer: row[10] || '',
      email: row[11] || '',
      type: 'positive',
      isPS
    });
  }

  for (let i = 2; i < extEntries.length; i++) {
    const row = extEntries[i];
    if (!row || !row[3]) continue;
    const roll = (row[3] || '').trim().toUpperCase();
    const code = (row[2] || '').trim();
    if (code && existingKeys.has(`${code}_${roll}`)) continue;
    const pts = Math.round(parseFloat((row[7] || '0').replace(/,/g, ''))) || 0;
    const detailedAct = (row[11] || '').trim();
    let actName = (row[9] || 'External Activity').trim();
    if (detailedAct && detailedAct !== '#REF!') {
      const parts = detailedAct.split(' / ');
      if (parts.length >= 4) {
        actName = `${parts[4] || parts[3]} (${parts[1] || ''} - ${parts[3] || parts[2]})`;
      } else {
        actName = detailedAct;
      }
    }

    list.push({
      id: `ext-${i}`,
      slNo: row[0] || String(i),
      date: row[1] || '',
      code: code,
      rollNo: roll,
      name: (row[4] || '').trim(),
      year: row[5] || '',
      department: row[6] || '',
      points: pts,
      reward_points: pts.toLocaleString(),
      activity_type: 'External',
      raw_type: (row[8] || 'EXTERNAL').trim(),
      activity_name: actName,
      course_name: actName,
      organizer: row[10] || '',
      email: row[12] && row[12] !== '#REF!' ? row[12] : '',
      type: 'positive',
      isPS: false
    });
  }

  for (let i = 1; i < negEntries.length; i++) {
    const row = negEntries[i];
    if (!row || !row[3]) continue;
    const roll = (row[3] || '').trim().toUpperCase();
    const pts = Math.round(parseFloat((row[7] || '0').replace(/,/g, ''))) || 0;
    list.push({
      id: `neg-${i}`,
      slNo: row[0] || String(i),
      date: row[1] || '',
      code: row[2] || '',
      rollNo: roll,
      name: (row[4] || '').trim(),
      year: row[5] || '',
      department: row[6] || '',
      points: -Math.abs(pts),
      reward_points: (-Math.abs(pts)).toLocaleString(),
      activity_type: 'Penalty',
      raw_type: 'PENALTY',
      activity_name: row[9] || 'Penalty',
      course_name: row[9] || 'Penalty',
      organizer: row[10] || '',
      email: '',
      type: 'negative',
      isPS: false
    });
  }

  return list;
}

export const STUDENT_EVENT_LOGS_MAP = parseEventLogs(rawData);
export const ALL_REWARD_POINTS_ENTRIES = parseAllTransactions(rawData);
export const TOTAL_PS_COMPLETIONS_COUNT = ALL_REWARD_POINTS_ENTRIES.filter(e => e.isPS).length;

// Reusable parser for 2D array of rows from Google Sheets API
export function parseStudentRows(rows) {
  if (!rows || rows.length <= 2) return [];

  const headers = rows[0] || [];
  const colIdx = {};
  headers.forEach((h, i) => {
    if (h) colIdx[h] = i;
  });

  return rows.slice(2).map((r, idx) => {
    const rollNo = (r[colIdx['Roll No.']] || r[1] || '').trim().toUpperCase();
    let name = (r[colIdx['Student Name']] || r[3] || '').trim();
    const legend = (r[colIdx['Legend']] || r[2] || '').trim();

    // Fallback name extraction from Picture column if needed
    if (!name && (r[colIdx['Picture']] || r[7])) {
      const picStr = (r[colIdx['Picture']] || r[7] || '').trim();
      const parts = picStr.split(' - ');
      if (parts.length >= 2) {
        name = parts[1].trim();
      }
    }

    // Strip Mr. / Ms. / Mrs. prefix from name if present
    name = name.replace(/^(Mr\.|Ms\.|Mrs\.|Mr|Ms|Mrs)\s+/i, '').trim();

    const year = (r[colIdx['Year']] || r[5] || '').trim() || 'IV';
    const department = (r[colIdx['Department']] || r[6] || '').trim();
    const courseCode = (r[colIdx['Course Code']] || r[4] || '').trim() || 'B. E.';

    // Theory Courses (TS1..TS7)
    const theoryCourses = [];
    for (let i = 1; i <= 7; i++) {
      const code = (r[colIdx[`TS${i}`]] || '').trim();
      if (code && code !== '0') {
        const ip1 = (r[colIdx[`IP1TS${i}M`]] || '').trim();
        const ip2 = (r[colIdx[`IP2TS${i}M`]] || '').trim();
        const total = (r[colIdx[`TS${i}M`]] || '').trim();
        theoryCourses.push({
          slot: `TS${i}`,
          code,
          ip1: ip1 && ip1 !== '0.00' ? ip1 : (ip1 === '0.00' ? '0.00' : ''),
          ip2: ip2 && ip2 !== '0.00' ? ip2 : '',
          total: total || ip1 || '0.00'
        });
      }
    }

    // Add-on / Minor Courses (TS8, TS9)
    const addonCourses = [];
    for (let i = 8; i <= 9; i++) {
      const code = (r[colIdx[`TS${i}`]] || '').trim();
      if (code && code !== '0') {
        const ip1 = (r[colIdx[`IP1TS${i}M`]] || '').trim();
        const ip2 = (r[colIdx[`IP2TS${i}M`]] || '').trim();
        const total = (r[colIdx[`TS${i}M`]] || '').trim();
        addonCourses.push({
          slot: `TS${i}`,
          code,
          ip1: ip1 || '',
          ip2: ip2 || '',
          total: total || ip1 || '0.00'
        });
      }
    }

    // Lab Courses (LS1..LS3)
    const labCourses = [];
    for (let i = 1; i <= 3; i++) {
      const code = (r[colIdx[`LS${i}`]] || '').trim();
      if (code && code !== '0') {
        const ip1 = (r[colIdx[`IP1LS${i}M`]] || '').trim();
        const ip2 = (r[colIdx[`IP2LS${i}M`]] || '').trim();
        const total = (r[colIdx[`LS${i}M`]] || '').trim();
        labCourses.push({
          slot: `LS${i}`,
          code,
          ip1: ip1 || '',
          ip2: ip2 || '',
          total: total || ip1 || '0.00'
        });
      }
    }

    const totalTheoryCount = parseInt(r[colIdx['TOTAL THEORY']] || '0', 10) || theoryCourses.length;
    const totalLabCount = parseInt(r[colIdx['TOTAL LAB']] || '0', 10) || labCourses.length;
    const totalSubjectsCount = parseInt(r[colIdx['TOTAL SUBJECTS']] || '0', 10) || (theoryCourses.length + labCourses.length + addonCourses.length);

    const ip1Total = (r[colIdx['IP1M']] || (theoryCourses.length > 0 ? theoryCourses.reduce((sum, c) => sum + (parseFloat(c.ip1) || 0), 0).toFixed(2) : '0.00')).trim();
    const ip2Total = (r[colIdx['IP2M']] || '0.00').trim();
    const grandTotal = (r[colIdx['IPM']] || ip1Total || '0.00').trim();

    const mentor = (r[colIdx['MENTOR']] || '').trim();
    const email = (r[colIdx['E-Mail']] || '').trim();

    // 8 Activity Breakdown Categories from Google Sheets
    const pSkillPts = Math.round(parseFloat((r[colIdx['P Skill Points']] || '0').replace(/,/g, ''))) || 0;
    const pSkillCount = parseInt(r[colIdx['P Skill Count']] || '0', 10) || 0;

    const studentInitPts = Math.round(parseFloat((r[colIdx['STUDENT INITIATIVES POINTS']] || '0').replace(/,/g, ''))) || 0;
    const studentInitCount = parseInt(r[colIdx['STUDENT INITIATIVES COUNT']] || '0', 10) || 0;

    const tacPts = Math.round(parseFloat((r[colIdx['TAC Points']] || '0').replace(/,/g, ''))) || 0;
    const tacCount = parseInt(r[colIdx['TAC Count']] || '0', 10) || 0;

    const splLabPts = Math.round(parseFloat((r[colIdx['Special Lab Initiatives Points']] || '0').replace(/,/g, ''))) || 0;
    const splLabCount = parseInt(r[colIdx['Special Lab Initiatives Count']] || '0', 10) || 0;

    const techEventPts = Math.round(parseFloat((r[colIdx['Technical Events Points']] || '0').replace(/,/g, ''))) || 0;
    const techEventCount = parseInt(r[colIdx['Technical Events Count']] || '0', 10) || 0;

    const extEventPts = Math.round(parseFloat((r[colIdx['EXTERNAL EVENTS POINTS']] || '0').replace(/,/g, ''))) || 0;
    const extEventCount = parseInt(r[colIdx['EXTERNAL EVENTS COUNT']] || '0', 10) || 0;

    const techSocietyPts = Math.round(parseFloat((r[colIdx['TECHNICAL SOCIETY ACTIVITIES Points']] || '0').replace(/,/g, ''))) || 0;
    const techSocietyCount = parseInt(r[colIdx['TECHNICAL SOCIETY ACTIVITIES Count']] || '0', 10) || 0;

    const interviewPts = Math.round((parseFloat((r[colIdx['Interview Points']] || '0').replace(/,/g, '')) || 0) + (parseFloat((r[colIdx['EXTRA-CURRICULAR ACTIVITIES POINTS']] || '0').replace(/,/g, '')) || 0));
    const interviewCount = (parseInt(r[colIdx['Interview Count']] || '0', 10) || 0) + (parseInt(r[colIdx['EXTRA-CURRICULAR ACTIVITIES COUNT']] || '0', 10) || 0);

    const totalPoints = Math.round(parseFloat((r[colIdx['Total Points']] || '0').replace(/,/g, ''))) || 0;
    const cumulativePoints = Math.round(parseFloat((r[colIdx['Cumulative Points']] || '0').replace(/,/g, ''))) || totalPoints;
    const redeemedPoints = Math.round(parseFloat((r[colIdx['Redeemed Points']] || '0').replace(/,/g, ''))) || 0;
    const balancePoints = Math.round(parseFloat((r[colIdx['Balance Points']] || '0').replace(/,/g, ''))) || (cumulativePoints - redeemedPoints);

    const initialPoints = Math.round(parseFloat((r[colIdx['Initial Points']] || '0').replace(/,/g, ''))) || 0;

    const activityBreakdown = [
      ...(initialPoints > 0 ? [{ id: 'carry_in', label: 'Carry-In / Initial Balance', count: 1, points: initialPoints, iconType: 'Award', color: 'cyan', barColor: 'bg-cyan-600' }] : []),
      { id: 'pskill', label: 'P-Skill', count: pSkillCount, points: pSkillPts, iconType: 'Code', color: 'indigo', barColor: 'bg-indigo-600' },
      { id: 'initiatives', label: 'Student Initiatives', count: studentInitCount, points: studentInitPts, iconType: 'Award', color: 'emerald', barColor: 'bg-emerald-600' },
      { id: 'tac', label: 'Training & Assessment (TAC)', count: tacCount, points: tacPts, iconType: 'Cpu', color: 'blue', barColor: 'bg-blue-600' },
      { id: 'spl_lab', label: 'Special Lab Initiatives', count: splLabCount, points: splLabPts, iconType: 'Sparkles', color: 'purple', barColor: 'bg-purple-600' },
      { id: 'tech_events', label: 'Technical Events & Hackathons', count: techEventCount, points: techEventPts, iconType: 'Trophy', color: 'amber', barColor: 'bg-amber-500' },
      { id: 'ext_events', label: 'External Events & Symposia', count: extEventCount, points: extEventPts, iconType: 'Globe', color: 'sky', barColor: 'bg-sky-500' },
      { id: 'tech_soc', label: 'Technical Societies (IEEE/ACM)', count: techSocietyCount, points: techSocietyPts, iconType: 'Users', color: 'violet', barColor: 'bg-violet-600' },
      { id: 'interview_extra', label: 'Interviews & Extra-Curricular', count: interviewCount, points: interviewPts, iconType: 'Briefcase', color: 'rose', barColor: 'bg-rose-500' }
    ];

    const eventLogs = (STUDENT_EVENT_LOGS_MAP && STUDENT_EVENT_LOGS_MAP[rollNo]) || [];

    return {
      id: idx + 1,
      rollNo,
      legend: legend || '',
      name: name || rollNo,
      year,
      department,
      courseCode,
      mentor,
      email,
      activityBreakdown,
      initialPoints,
      eventLogs,
      totalPoints,
      cumulativePoints,
      redeemedPoints,
      balancePoints,
      theoryCourses,
      addonCourses,
      labCourses,
      totalTheoryCount,
      totalLabCount,
      totalSubjectsCount,
      ip1Total,
      ip2Total,
      grandTotal
    };
  }).filter(s => s.rollNo && s.name);
}

// Initial dataset parsed from local snapshot
const initialStudentRows = rawData.sheets?.['Studentwise Reward Points'] || [];
export const STUDENTS_INTERNAL_MARKS_LIST = parseStudentRows(initialStudentRows);

// Backward compatibility
export const STUDENTS_RP_DATA = STUDENTS_INTERNAL_MARKS_LIST;
export const INTERNAL_MARKS_STUDENTS = STUDENTS_INTERNAL_MARKS_LIST;
export const ALL_DEPARTMENTS = Array.from(new Set(STUDENTS_INTERNAL_MARKS_LIST.map(s => s.department).filter(Boolean))).sort();
