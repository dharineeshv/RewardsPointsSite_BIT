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

    return {
      id: idx + 1,
      rollNo,
      legend: legend || '',
      name: name || rollNo,
      year,
      department,
      courseCode,
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



