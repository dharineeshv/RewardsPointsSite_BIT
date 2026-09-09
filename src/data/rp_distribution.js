// Processed helper for Student Internal Mark Statements & CIE Distributions
import rawData from './rp_distribution_raw.json';

export const BIT_SPREADSHEET_CONFIG = {
  sheetId: '1gHiOy41cpyg8dZxDWu-MsF8o0abLbL8MHbVK-GkMjqw',
  sheetTab: 'Studentwise Reward Points',
  range: 'A1:ZZ10000',
  getEndpoint: (token) =>
    `https://sheets.googleapis.com/v4/spreadsheets/1gHiOy41cpyg8dZxDWu-MsF8o0abLbL8MHbVK-GkMjqw/values/${encodeURIComponent('Studentwise Reward Points')}!A1:ZZ10000`
};

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
    const pSkillPts = parseFloat((r[colIdx['P Skill Points']] || '0').replace(/,/g, '')) || 0;
    const pSkillCount = parseInt(r[colIdx['P Skill Count']] || '0', 10) || 0;

    const studentInitPts = parseFloat((r[colIdx['STUDENT INITIATIVES POINTS']] || '0').replace(/,/g, '')) || 0;
    const studentInitCount = parseInt(r[colIdx['STUDENT INITIATIVES COUNT']] || '0', 10) || 0;

    const tacPts = parseFloat((r[colIdx['TAC Points']] || '0').replace(/,/g, '')) || 0;
    const tacCount = parseInt(r[colIdx['TAC Count']] || '0', 10) || 0;

    const splLabPts = parseFloat((r[colIdx['Special Lab Initiatives Points']] || '0').replace(/,/g, '')) || 0;
    const splLabCount = parseInt(r[colIdx['Special Lab Initiatives Count']] || '0', 10) || 0;

    const techEventPts = parseFloat((r[colIdx['Technical Events Points']] || '0').replace(/,/g, '')) || 0;
    const techEventCount = parseInt(r[colIdx['Technical Events Count']] || '0', 10) || 0;

    const extEventPts = parseFloat((r[colIdx['EXTERNAL EVENTS POINTS']] || '0').replace(/,/g, '')) || 0;
    const extEventCount = parseInt(r[colIdx['EXTERNAL EVENTS COUNT']] || '0', 10) || 0;

    const techSocietyPts = parseFloat((r[colIdx['TECHNICAL SOCIETY ACTIVITIES Points']] || '0').replace(/,/g, '')) || 0;
    const techSocietyCount = parseInt(r[colIdx['TECHNICAL SOCIETY ACTIVITIES Count']] || '0', 10) || 0;

    const interviewPts = (parseFloat((r[colIdx['Interview Points']] || '0').replace(/,/g, '')) || 0) + (parseFloat((r[colIdx['EXTRA-CURRICULAR ACTIVITIES POINTS']] || '0').replace(/,/g, '')) || 0);
    const interviewCount = (parseInt(r[colIdx['Interview Count']] || '0', 10) || 0) + (parseInt(r[colIdx['EXTRA-CURRICULAR ACTIVITIES COUNT']] || '0', 10) || 0);

    const totalPoints = parseFloat((r[colIdx['Total Points']] || '0').replace(/,/g, '')) || 0;
    const cumulativePoints = parseFloat((r[colIdx['Cumulative Points']] || '0').replace(/,/g, '')) || totalPoints;
    const redeemedPoints = parseFloat((r[colIdx['Redeemed Points']] || '0').replace(/,/g, '')) || 0;
    const balancePoints = parseFloat((r[colIdx['Balance Points']] || '0').replace(/,/g, '')) || (cumulativePoints - redeemedPoints);

    const activityBreakdown = [
      { id: 'pskill', label: 'P-Skill Certifications', count: pSkillCount, points: pSkillPts, iconType: 'Code', color: 'indigo', barColor: 'bg-indigo-600' },
      { id: 'initiatives', label: 'Student Initiatives', count: studentInitCount, points: studentInitPts, iconType: 'Award', color: 'emerald', barColor: 'bg-emerald-600' },
      { id: 'tac', label: 'Training & Assessment (TAC)', count: tacCount, points: tacPts, iconType: 'Cpu', color: 'blue', barColor: 'bg-blue-600' },
      { id: 'spl_lab', label: 'Special Lab Initiatives', count: splLabCount, points: splLabPts, iconType: 'Sparkles', color: 'purple', barColor: 'bg-purple-600' },
      { id: 'tech_events', label: 'Technical Events & Hackathons', count: techEventCount, points: techEventPts, iconType: 'Trophy', color: 'amber', barColor: 'bg-amber-500' },
      { id: 'ext_events', label: 'External Events & Symposia', count: extEventCount, points: extEventPts, iconType: 'Globe', color: 'sky', barColor: 'bg-sky-500' },
      { id: 'tech_soc', label: 'Technical Societies (IEEE/ACM)', count: techSocietyCount, points: techSocietyPts, iconType: 'Users', color: 'violet', barColor: 'bg-violet-600' },
      { id: 'interview_extra', label: 'Interviews & Extra-Curricular', count: interviewCount, points: interviewPts, iconType: 'Briefcase', color: 'rose', barColor: 'bg-rose-500' }
    ];

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



