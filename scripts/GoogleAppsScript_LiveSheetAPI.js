/**
 * BIT Reward Points - Google Apps Script Dynamic Sheet Connector
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1t5uHtrRMSXQkxrFRUudDpwuN23A6K61PhdrjDNZFaV8/edit?gid=829636275#gid=829636275
 * 
 * -----------------------------------------------------------------------------------
 * INSTRUCTIONS TO UPDATE (Takes 30 seconds):
 * -----------------------------------------------------------------------------------
 * 1. Open https://script.google.com/ and open your "BIT Reward Points Live Sheet API" project.
 * 2. Replace the code with this updated version and click Save (Ctrl + S).
 * 3. Click "Deploy" (top right) -> "Manage deployments".
 * 4. Click the Edit (pencil) icon next to the active deployment.
 * 5. Under "Version", select "New version" and click "Deploy".
 * -----------------------------------------------------------------------------------
 */

const SPREADSHEET_ID = '1t5uHtrRMSXQkxrFRUudDpwuN23A6K61PhdrjDNZFaV8';

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = (params.action || '').trim().toLowerCase();
    const rollNo = (params.rollNo || params.roll || params.id || '').trim().toUpperCase();
    const email = (params.email || params.emailId || '').trim().toLowerCase();
    const query = (params.query || rollNo || email).trim();
    const department = (params.department || params.dept || params.tab || '').trim().toUpperCase();

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === 'debug_sheets' || action === 'tabs') {
      const sheetNames = ss.getSheets().map(s => ({
        name: s.getName(),
        gid: s.getSheetId(),
        rows: s.getLastRow(),
        cols: s.getLastColumn()
      }));
      return createJsonResponse({ success: true, sheets: sheetNames });
    }

    if (action === 'averages' || action === 'benchmarks' || (!query && !department)) {
      const sheetAverages = findAveragesTableInSheet(ss);
      if (sheetAverages) {
        return createJsonResponse({
          success: true,
          source: 'Google Sheet (Given in Sheet Table)',
          averages: sheetAverages.averages,
          foundIn: sheetAverages.foundIn,
          rawTable: sheetAverages.rawTable
        });
      }
    }

    if (query || rollNo || email) {
      const studentData = findStudentByRoll(ss, query || rollNo, department, email);
      if (studentData) {
        return createJsonResponse({
          success: true,
          source: 'Google Sheet (Dynamic Live Sync)',
          data: studentData
        });
      } else {
        return createJsonResponse({
          success: false,
          message: 'Student with identifier ' + (query || rollNo || email) + ' not found in sheet.',
          data: null
        });
      }
    }

    if (department) {
      const deptStudents = getDepartmentStudents(ss, department);
      return createJsonResponse({
        success: true,
        department: department,
        count: deptStudents.length,
        students: deptStudents
      });
    }

    const allData = getAllDepartmentsSummary(ss);
    return createJsonResponse({
      success: true,
      timestamp: new Date().toISOString(),
      ...allData
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

function findAveragesTableInSheet(ss) {
  // Priority 1: Direct extraction from the 'Details' sheet (gid: 847680829)
  const detailsSheet = ss.getSheetByName('Details') || 
    ss.getSheets().find(s => s.getSheetId() == 847680829 || String(s.getSheetId()) === '847680829') ||
    ss.getSheetByName('DETAILS') || 
    ss.getSheetByName('Details & Benchmarks');
  if (detailsSheet) {
    const data = detailsSheet.getDataRange().getValues();
    if (data && data.length > 0) {
      let yearICols = [];
      let yearIICols = [];
      let yearIIICols = [];
      let yearIVCols = [];

      // Detect column positions of I YEAR, II YEAR, III YEAR, IV YEAR
      for (let r = 0; r < Math.min(data.length, 12); r++) {
        const row = data[r];
        for (let c = 0; c < row.length; c++) {
          const cell = String(row[c] || '').trim().toUpperCase();
          if (cell === 'I YEAR' || cell === '1ST YEAR' || cell === 'YEAR I' || cell === 'I') {
            yearICols.push(c);
          } else if (cell === 'II YEAR' || cell === '2ND YEAR' || cell === 'YEAR II' || cell === 'II') {
            yearIICols.push(c);
          } else if (cell === 'III YEAR' || cell === '3RD YEAR' || cell === 'YEAR III' || cell === 'III') {
            yearIIICols.push(c);
          } else if (cell === 'IV YEAR' || cell === '4TH YEAR' || cell === 'FINAL YEAR' || cell === 'YEAR IV' || cell === 'IV') {
            yearIVCols.push(c);
          }
        }
      }

      // Find the row labeled "AVERAGE REWARD POINT" or "AVERAGE"
      for (let r = 0; r < data.length; r++) {
        const row = data[r];
        const rowText = row.map(c => String(c || '').trim().toUpperCase()).join(' ');
        
        if (rowText.includes('AVERAGE REWARD POINT') || rowText.includes('AVERAGE') || rowText.includes('AVG')) {
          let y1 = 0, y2 = 0, y3 = 0, y4 = 0;
          
          if (yearICols.length > 0) {
            for (const c of yearICols) {
              const v = parseNum(row[c]);
              if (v > 0) { y1 = v; break; }
            }
          }
          if (yearIICols.length > 0) {
            for (const c of yearIICols) {
              const v = parseNum(row[c]);
              if (v > 0) { y2 = v; break; }
            }
          }
          if (yearIIICols.length > 0) {
            for (const c of yearIIICols) {
              const v = parseNum(row[c]);
              if (v > 0) { y3 = v; break; }
            }
          }
          if (yearIVCols.length > 0) {
            for (const c of yearIVCols) {
              const v = parseNum(row[c]);
              if (v > 0) { y4 = v; break; }
            }
          }

          // Fallback if specific column indexes were merged
          if (!y1 && !y2 && !y3 && !y4) {
            const numbers = [];
            row.forEach((cell, idx) => {
              const num = parseNum(cell);
              if (num > 0) numbers.push({ col: idx, val: num });
            });
            if (numbers.length >= 4) {
              y1 = numbers[0].val;
              y2 = numbers[1].val;
              y3 = numbers[2].val;
              y4 = numbers[3].val;
            } else if (numbers.length > 0) {
              numbers.forEach((n, i) => {
                if (i === 0) y1 = n.val;
                if (i === 1) y2 = n.val;
                if (i === 2) y3 = n.val;
                if (i === 3) y4 = n.val;
              });
            }
          }

          if (y1 > 0 || y2 > 0 || y3 > 0 || y4 > 0) {
            return {
              foundIn: 'Details Sheet (Row ' + (r + 1) + ')',
              averages: {
                year_1: y1,
                year_2: y2,
                year_3: y3,
                year_4: y4
              },
              rawRow: row.filter(c => c !== '')
            };
          }
        }
      }
    }
  }

  // Priority 2: Inspect other tabs and embedded chart ranges
  const allSheets = ss.getSheets();
  for (let i = 0; i < allSheets.length; i++) {
    const sheet = allSheets[i];
    const sheetName = sheet.getName();
    if (sheetName === 'Details') continue;
    const data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) continue;

    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      const rowText = row.map(c => String(c || '').trim().toUpperCase()).join(' ');
      if (rowText.includes('AVERAGE REWARD POINT') || rowText.includes('AVERAGE')) {
        const numbers = [];
        row.forEach(cell => {
          const num = parseNum(cell);
          if (num > 0) numbers.push(num);
        });
        if (numbers.length >= 3) {
          return {
            foundIn: sheetName + ' (Row ' + (r + 1) + ')',
            averages: {
              year_1: numbers[0] || 0,
              year_2: numbers[1] || 0,
              year_3: numbers[2] || 0,
              year_4: numbers[3] || 0
            }
          };
        }
      }
    }
  }

  return null;
}

function findStudentByRoll(ss, targetRollOrQuery, targetDept = '', targetEmail = '') {
  const query = String(targetRollOrQuery || '').trim();
  const isEmailInput = query.includes('@') || String(targetEmail || '').includes('@');
  const cleanEmail = (targetEmail || (isEmailInput ? query : '')).toLowerCase().trim();
  const cleanEmailPrefix = cleanEmail ? cleanEmail.split('@')[0] : '';
  const cleanRoll = (!isEmailInput && query.length >= 6 ? query : '').toUpperCase().trim();
  
  // Deduce department code from roll or email e.g. 7376232CT142 -> CT, sanjay.m.ad23@bitsathy.ac.in -> AI&DS
  let deptHint = targetDept ? String(targetDept).trim().toUpperCase() : '';
  if (!deptHint || deptHint === 'ALL') {
    const hintSource = (cleanRoll || cleanEmailPrefix).toUpperCase();
    if (hintSource.includes('CT')) deptHint = 'CT';
    else if (hintSource.includes('CS') || hintSource.includes('CSE')) deptHint = 'CSE';
    else if (hintSource.includes('IT')) deptHint = 'IT';
    else if (hintSource.includes('AD') || hintSource.includes('AIDS')) deptHint = 'AI&DS';
    else if (hintSource.includes('AL') || hintSource.includes('AIML')) deptHint = 'AIML';
    else if (hintSource.includes('EC') || hintSource.includes('ECE')) deptHint = 'ECE';
    else if (hintSource.includes('EE') || hintSource.includes('EEE')) deptHint = 'EEE';
    else if (hintSource.includes('ME') || hintSource.includes('MECH')) deptHint = 'MECH';
    else if (hintSource.includes('BT')) deptHint = 'BT';
    else if (hintSource.includes('BM')) deptHint = 'BIOMEDICAL';
    else if (hintSource.includes('AG')) deptHint = 'AGRI';
    else if (hintSource.includes('CE')) deptHint = 'CIVIL';
    else if (hintSource.includes('FD')) deptHint = 'FD';
    else if (hintSource.includes('FT')) deptHint = 'FT';
    else if (hintSource.includes('EI')) deptHint = 'EIE';
    else if (hintSource.includes('IS') || hintSource.includes('SE')) deptHint = 'ISE';
    else if (hintSource.includes('MZ') || hintSource.includes('MT') || hintSource.includes('MC')) deptHint = 'MTRS';
  }

  // Build sheet list prioritizing department sheet first, then Studentwise Reward Points, then others
  const allSheets = ss.getSheets();
  const sortedSheets = [];
  
  // 1. Department tab first (e.g. 'CT', 'AI&DS', 'CSE')
  if (deptHint) {
    const deptSheet = ss.getSheetByName(deptHint) || allSheets.find(s => s.getName().toUpperCase() === deptHint);
    if (deptSheet) sortedSheets.push(deptSheet);
  }
  
  // 2. Master Studentwise Reward Points sheet second
  const masterSheet = ss.getSheetByName('Studentwise Reward Points') || ss.getSheetByName('Details');
  if (masterSheet && !sortedSheets.includes(masterSheet)) sortedSheets.push(masterSheet);
  
  // 3. Other sheets
  allSheets.forEach(s => {
    if (!sortedSheets.includes(s)) sortedSheets.push(s);
  });

  for (let i = 0; i < sortedSheets.length; i++) {
    const sheet = sortedSheets[i];
    const sheetName = sheet.getName();
    if (sheetName === 'INDEX' || sheetName === 'Statistics' || sheetName === 'Template' || sheetName === 'Mail' || sheetName === 'Dashboard') continue;

    const data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) continue;

    let headerIdx = -1;
    let rollCol = -1, nameCol = -1, yearCol = -1, deptCol = -1, mentorCol = -1, emailCol = -1;
    let balCol = -1, cumCol = -1, redCol = -1;

    // Detect header row and exact column indexes
    for (let r = 0; r < Math.min(data.length, 6); r++) {
      const row = data[r].map(c => String(c || '').trim().toUpperCase().replace(/\s+/g, ' '));
      const rIdx = row.findIndex(c => c.includes('ROLL') || c.includes('REGISTER'));
      const nIdx = row.findIndex(c => c.includes('NAME') || c.includes('STUDENT'));
      
      if (rIdx !== -1 && nIdx !== -1) {
        headerIdx = r;
        rollCol = rIdx;
        nameCol = nIdx;
        emailCol = row.findIndex(c => c.includes('EMAIL') || c.includes('MAIL') || c.includes('E-MAIL'));
        yearCol = row.findIndex(c => c === 'YEAR' || c.includes('YR') || c.includes('BATCH'));
        deptCol = row.findIndex(c => c.includes('DEPT') || c.includes('DEPARTMENT') || c.includes('BRANCH'));
        mentorCol = row.findIndex(c => c.includes('MENTOR') || c.includes('FACULTY'));
        
        // Match Cumulative (e.g. "CUMULATIVE REWARD POINTS")
        cumCol = row.findIndex(c => c.includes('CUMULATIVE') || c.includes('TOTAL REWARD') || c.includes('TOTAL POINT'));
        
        // Match Redeemed - note handles the sheet typo "REEDEMED POINTS" and "REDEEMED POINTS"
        redCol = row.findIndex(c => c.includes('REEDEM') || c.includes('REDEEM') || c.includes('UTILIZ') || c.includes('CLAIM'));
        
        // Match Balance - find the LAST/rightmost column with "BALANCE" (Col 9 in the sheet)
        let lastBalIdx = -1;
        for (let c = row.length - 1; c >= 0; c--) {
          if (row[c].includes('BALANCE') || row[c].includes('REMAINING') || row[c].includes('AVAILABLE')) {
            lastBalIdx = c;
            break;
          }
        }
        balCol = lastBalIdx !== -1 ? lastBalIdx : (row.length > 9 ? 9 : -1);

        // Fallbacks based on exact sheet layout: [SL, YEAR, ROLL, NAME, BAL_OPT, DEPT, MENTOR, CUMULATIVE, REEDEMED, BALANCE]
        if (rollCol === -1) rollCol = 2;
        if (nameCol === -1) nameCol = 3;
        if (yearCol === -1) yearCol = 1;
        if (deptCol === -1) deptCol = 5;
        if (mentorCol === -1) mentorCol = 6;
        if (cumCol === -1) cumCol = 7;
        if (redCol === -1) redCol = 8;
        if (balCol === -1) balCol = 9;
        break;
      }
    }

    const startRow = headerIdx !== -1 ? headerIdx + 1 : 1;

    for (let r = startRow; r < data.length; r++) {
      const row = data[r];
      let rowRoll = '';
      let rowName = '';
      let rowEmail = '';
      let rowYear = '';
      let rowDept = sheetName;
      let rowMentor = '';
      let rowBal = 0;
      let rowCum = 0;
      let rowRed = 0;

      if (headerIdx !== -1 && rollCol !== -1) {
        rowRoll = String(row[rollCol] || '').trim().toUpperCase();
        rowName = String(row[nameCol] || '').trim();
        rowEmail = emailCol !== -1 ? String(row[emailCol] || '').trim().toLowerCase() : '';
        rowYear = yearCol !== -1 ? String(row[yearCol] || '').trim() : '';
        rowDept = deptCol !== -1 && row[deptCol] ? String(row[deptCol]).trim() : sheetName;
        rowMentor = mentorCol !== -1 ? String(row[mentorCol] || '').trim() : '';
        
        // Exact values from columns: Col 7 = Cumulative, Col 8 = Redeemed, Col 9 = Balance
        rowCum = cumCol !== -1 ? parseNum(row[cumCol]) : parseNum(row[7]);
        rowRed = redCol !== -1 ? parseNum(row[redCol]) : parseNum(row[8]);
        
        // If Col 9 has a value, use it. Otherwise compute Cumulative - Redeemed
        const col9Val = balCol !== -1 ? row[balCol] : row[9];
        if (col9Val !== undefined && col9Val !== null && String(col9Val).trim() !== '') {
          rowBal = parseNum(col9Val);
        } else if (rowCum > 0 || rowRed > 0) {
          rowBal = Math.max(0, rowCum - rowRed);
        }
      } else {
        for (let c = 0; c < Math.min(row.length, 5); c++) {
          const val = String(row[c] || '').trim().toUpperCase();
          if (val.length >= 8 && /^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(val)) {
            rowRoll = val;
            if (c === 2) {
              rowYear = String(row[1] || '').trim();
              rowName = String(row[3] || '').trim();
              rowMentor = String(row[6] || '').trim();
              rowCum = parseNum(row[7]);
              rowRed = parseNum(row[8]);
              rowBal = parseNum(row[9]);
            } else {
              rowName = String(row[c + 1] || '').trim();
              rowBal = parseNum(row[c + 2]);
              rowCum = rowBal;
            }
            break;
          }
        }
      }

      // Check match:
      let isMatch = false;
      if (cleanRoll && rowRoll && (rowRoll === cleanRoll || rowRoll.includes(cleanRoll))) {
        isMatch = true;
      } else if (cleanEmail && rowEmail && (rowEmail === cleanEmail || rowEmail.includes(cleanEmail) || cleanEmail.includes(rowEmail))) {
        isMatch = true;
      } else if (cleanEmail) {
        // Check if any cell in this row matches the email
        for (let c = 0; c < Math.min(row.length, 12); c++) {
          const cellVal = String(row[c] || '').trim().toLowerCase();
          if (cellVal === cleanEmail || (cleanEmailPrefix && cellVal.includes(cleanEmailPrefix) && cellVal.includes('@bitsathy'))) {
            isMatch = true;
            rowEmail = cellVal;
            break;
          }
        }
      }

      if (isMatch) {
        // Extract live courses and marks if present in sheet
        const theoryCourses = [];
        const addonCourses = [];
        const labCourses = [];
        let ip1Total = '';
        let ip2Total = '';
        let grandTotal = '';

        if (headerIdx !== -1) {
          const headerRow = data[headerIdx].map(c => String(c || '').trim().toUpperCase());
          
          for (let i = 1; i <= 7; i++) {
            const tsIdx = headerRow.findIndex(h => h === 'TS' + i || h === 'TS ' + i);
            if (tsIdx !== -1 && row[tsIdx]) {
              const code = String(row[tsIdx]).trim();
              if (code && code !== '0') {
                const ip1Idx = headerRow.findIndex(h => h === 'IP1TS' + i + 'M' || h.includes('IP1TS' + i));
                const ip2Idx = headerRow.findIndex(h => h === 'IP2TS' + i + 'M' || h.includes('IP2TS' + i));
                const totIdx = headerRow.findIndex(h => h === 'TS' + i + 'M' || h === 'TS' + i + ' M');
                
                const ip1Val = ip1Idx !== -1 ? String(row[ip1Idx] || '').trim() : '';
                const ip2Val = ip2Idx !== -1 ? String(row[ip2Idx] || '').trim() : '';
                const totVal = totIdx !== -1 ? String(row[totIdx] || '').trim() : (ip1Val || '0.00');

                theoryCourses.push({
                  slot: 'TS' + i,
                  code: code,
                  ip1: ip1Val && ip1Val !== '0.00' ? ip1Val : (ip1Val === '0.00' ? '0.00' : ''),
                  ip2: ip2Val && ip2Val !== '0.00' ? ip2Val : '',
                  total: totVal || ip1Val || '0.00'
                });
              }
            }
          }

          for (let i = 8; i <= 9; i++) {
            const tsIdx = headerRow.findIndex(h => h === 'TS' + i || h === 'TS ' + i);
            if (tsIdx !== -1 && row[tsIdx]) {
              const code = String(row[tsIdx]).trim();
              if (code && code !== '0') {
                const ip1Idx = headerRow.findIndex(h => h === 'IP1TS' + i + 'M');
                const ip2Idx = headerRow.findIndex(h => h === 'IP2TS' + i + 'M');
                const totIdx = headerRow.findIndex(h => h === 'TS' + i + 'M');
                addonCourses.push({
                  slot: 'TS' + i,
                  code: code,
                  ip1: ip1Idx !== -1 ? String(row[ip1Idx] || '').trim() : '',
                  ip2: ip2Idx !== -1 ? String(row[ip2Idx] || '').trim() : '',
                  total: totIdx !== -1 ? String(row[totIdx] || '').trim() : '0.00'
                });
              }
            }
          }

          for (let i = 1; i <= 3; i++) {
            const lsIdx = headerRow.findIndex(h => h === 'LS' + i || h === 'LS ' + i);
            if (lsIdx !== -1 && row[lsIdx]) {
              const code = String(row[lsIdx]).trim();
              if (code && code !== '0') {
                const ip1Idx = headerRow.findIndex(h => h === 'IP1LS' + i + 'M');
                const ip2Idx = headerRow.findIndex(h => h === 'IP2LS' + i + 'M');
                const totIdx = headerRow.findIndex(h => h === 'LS' + i + 'M');
                labCourses.push({
                  slot: 'LS' + i,
                  code: code,
                  ip1: ip1Idx !== -1 ? String(row[ip1Idx] || '').trim() : '',
                  ip2: ip2Idx !== -1 ? String(row[ip2Idx] || '').trim() : '',
                  total: totIdx !== -1 ? String(row[totIdx] || '').trim() : '0.00'
                });
              }
            }
          }

          const ip1TotalIdx = headerRow.findIndex(h => h === 'IP1M' || h === 'IP1 TOTAL');
          const ip2TotalIdx = headerRow.findIndex(h => h === 'IP2M' || h === 'IP2 TOTAL');
          const grandTotalIdx = headerRow.findIndex(h => h === 'IPM' || h === 'GRAND TOTAL');

          if (ip1TotalIdx !== -1 && row[ip1TotalIdx]) ip1Total = String(row[ip1TotalIdx]).trim();
          if (ip2TotalIdx !== -1 && row[ip2TotalIdx]) ip2Total = String(row[ip2TotalIdx]).trim();
          if (grandTotalIdx !== -1 && row[grandTotalIdx]) grandTotal = String(row[grandTotalIdx]).trim();
          else if (ip1Total) grandTotal = ip1Total;
        }

        return {
          roll_no: rowRoll,
          rollNo: rowRoll,
          id: rowRoll,
          email: rowEmail || cleanEmail || '',
          name: rowName || ('Student (' + rowRoll + ')'),
          student_name: rowName || ('Student (' + rowRoll + ')'),
          year: rowYear || 'IV',
          department: rowDept || sheetName,
          mentor: rowMentor || '',
          mentor_name: rowMentor || '',
          balance_points: rowBal,
          currentPoints: String(rowBal),
          points: rowBal,
          cumulative_points: rowCum,
          cumulativePoints: String(rowCum),
          redeemed_points: rowRed,
          redeemedPoints: String(rowRed),
          theoryCourses: theoryCourses,
          addonCourses: addonCourses,
          labCourses: labCourses,
          ip1Total: ip1Total,
          ip2Total: ip2Total,
          grandTotal: grandTotal,
          sheetTab: sheetName,
          fetchedAt: new Date().toISOString()
        };
      }
    }
  }

  return null;
}

function getDepartmentStudents(ss, deptInput) {
  let dept = String(deptInput || '').trim().toUpperCase();
  if (dept.includes('COMPUTER TECH') || dept === 'CT') dept = 'CT';
  else if (dept.includes('COMPUTER SCI') || dept === 'CSE' || dept === 'CS') dept = 'CSE';
  else if (dept.includes('ELECTRONICS & COMM') || dept.includes('ELECTRONICS AND COMM') || dept === 'ECE' || dept === 'EC') dept = 'ECE';
  else if (dept.includes('INFORMATION TECH') || dept === 'IT') dept = 'IT';
  else if (dept.includes('ARTIFICIAL INTELLIGENCE & DATA') || dept.includes('AI & DS') || dept.includes('AI&DS') || dept === 'AD') dept = 'AI&DS';
  else if (dept.includes('ARTIFICIAL INTELLIGENCE & MACHINE') || dept.includes('AIML') || dept === 'AM') dept = 'AIML';
  else if (dept.includes('MECHANICAL') || dept === 'MECH' || dept === 'ME') dept = 'MECH';
  else if (dept.includes('ELECTRICAL & ELECTRONICS') || dept.includes('EEE') || dept === 'EE') dept = 'EEE';
  else if (dept.includes('DESIGN') || dept === 'CSD') dept = 'CSD';
  else if (dept.includes('BUSINESS') || dept === 'CSBS' || dept === 'CB') dept = 'CSBS';
  else if (dept.includes('BIOTECH') || dept === 'BT') dept = 'BT';
  else if (dept.includes('BIOMEDICAL') || dept === 'BM') dept = 'BIOMEDICAL';
  else if (dept.includes('AGRICULTURE') || dept.includes('AGRI') || dept === 'AG') dept = 'AGRI';
  else if (dept.includes('CIVIL') || dept === 'CE') dept = 'CIVIL';
  else if (dept.includes('FASHION') || dept === 'FD') dept = 'FD';
  else if (dept.includes('FOOD') || dept === 'FT') dept = 'FT';
  else if (dept.includes('INSTRUMENTATION') || dept === 'EIE' || dept === 'EI') dept = 'EIE';
  else if (dept.includes('INFORMATION SCI') || dept === 'ISE' || dept === 'IS') dept = 'ISE';
  else if (dept.includes('MECHATRONICS') || dept === 'MTRS' || dept === 'MC') dept = 'MTRS';

  const allSheets = ss.getSheets();
  let sheet = ss.getSheetByName(dept) || allSheets.find(s => s.getName().toUpperCase() === dept || s.getName().toUpperCase().includes(dept));
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const students = [];

  let headerIdx = -1;
  let rollCol = -1, nameCol = -1, balCol = -1, cumCol = -1, redCol = -1, mentorCol = -1, yearCol = -1;

  for (let r = 0; r < Math.min(data.length, 6); r++) {
    const row = data[r].map(c => String(c || '').trim().toUpperCase().replace(/\s+/g, ' '));
    const rIdx = row.findIndex(c => c.includes('ROLL') || c.includes('REGISTER'));
    const nIdx = row.findIndex(c => c.includes('NAME') || c.includes('STUDENT'));
    if (rIdx !== -1 && nIdx !== -1) {
      headerIdx = r;
      rollCol = rIdx;
      nameCol = nIdx;
      yearCol = row.findIndex(c => c === 'YEAR' || c.includes('YR') || c.includes('BATCH'));
      mentorCol = row.findIndex(c => c.includes('MENTOR') || c.includes('FACULTY'));
      
      let lastBalIdx = -1;
      for (let c = row.length - 1; c >= 0; c--) {
        if (row[c].includes('BALANCE') || row[c].includes('REMAINING') || row[c].includes('AVAILABLE')) {
          lastBalIdx = c;
          break;
        }
      }
      balCol = lastBalIdx !== -1 ? lastBalIdx : 9;
      cumCol = row.findIndex(c => c.includes('CUMULATIVE') || c.includes('TOTAL'));
      if (cumCol === -1) cumCol = 7;
      redCol = row.findIndex(c => c.includes('REEDEM') || c.includes('REDEEM') || c.includes('UTILIZ') || c.includes('CLAIM'));
      if (redCol === -1) redCol = 8;
      break;
    }
  }

  const startRow = headerIdx !== -1 ? headerIdx + 1 : 1;

  for (let r = startRow; r < data.length; r++) {
    const row = data[r];
    const roll = String(row[rollCol !== -1 ? rollCol : 2] || '').trim().toUpperCase();
    if (!roll || !/^[0-9]{5,7}[A-Z]{2,4}[0-9]{2,4}/.test(roll)) continue;

    const name = String(row[nameCol !== -1 ? nameCol : 3] || '').trim();
    const bal = parseNum(row[balCol !== -1 ? balCol : 9]);
    const cum = parseNum(row[cumCol !== -1 ? cumCol : 7]);
    const red = parseNum(row[redCol !== -1 ? redCol : 8]);
    const mentor = mentorCol !== -1 && row[mentorCol] ? String(row[mentorCol]).trim() : '';
    const yr = yearCol !== -1 && row[yearCol] ? String(row[yearCol]).trim() : 'IV';

    students.push({
      roll_no: roll,
      rollNo: roll,
      id: roll,
      name: name,
      student_name: name,
      year: yr,
      department: dept,
      mentor: mentor,
      balance_points: bal,
      currentPoints: String(bal),
      points: bal,
      cumulative_points: cum,
      cumulativePoints: String(cum),
      redeemed_points: red,
      redeemedPoints: String(red)
    });
  }

  return students;
}

function getAllDepartmentsSummary(ss) {
  const sheets = ss.getSheets();
  let totalStudents = 0;
  const yearStats = {
    year_1: { sum: 0, count: 0 },
    year_2: { sum: 0, count: 0 },
    year_3: { sum: 0, count: 0 },
    year_4: { sum: 0, count: 0 }
  };

  sheets.forEach(sheet => {
    const name = sheet.getName();
    if (name === 'INDEX' || name === 'Statistics') return;

    const data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) return;

    let balCol = -1;
    let yrCol = -1;
    for (let r = 0; r < Math.min(data.length, 5); r++) {
      const row = data[r].map(c => String(c || '').trim().toUpperCase());
      for (let c = row.length - 1; c >= 0; c--) {
        if (row[c].includes('BALANCE') || row[c].includes('REMAINING')) {
          balCol = c;
          break;
        }
      }
      yrCol = row.findIndex(c => c === 'YEAR' || c.includes('YR') || c.includes('BATCH'));
      if (balCol !== -1 && yrCol !== -1) break;
    }
    if (balCol === -1) balCol = 9;
    if (yrCol === -1) yrCol = 1;

    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      const roll = String(row[2] || row[0] || '').trim().toUpperCase();
      if (!roll || roll.length < 8) continue;

      totalStudents++;
      // Read YEAR directly from the sheet's YEAR column
      const sheetYear = normalizeYear(row[yrCol]);

      const pts = parseNum(row[balCol] || row[9] || 0);
      if (pts > 0) {
        if (sheetYear === 'I') { yearStats.year_1.sum += pts; yearStats.year_1.count++; }
        else if (sheetYear === 'II') { yearStats.year_2.sum += pts; yearStats.year_2.count++; }
        else if (sheetYear === 'III') { yearStats.year_3.sum += pts; yearStats.year_3.count++; }
        else if (sheetYear === 'IV') { yearStats.year_4.sum += pts; yearStats.year_4.count++; }
      }
    }
  });

  return {
    totalStudents: totalStudents,
    averages: {
      year_1: yearStats.year_1.count > 0 ? parseFloat((yearStats.year_1.sum / yearStats.year_1.count).toFixed(2)) : 0,
      year_2: yearStats.year_2.count > 0 ? parseFloat((yearStats.year_2.sum / yearStats.year_2.count).toFixed(2)) : 0,
      year_3: yearStats.year_3.count > 0 ? parseFloat((yearStats.year_3.sum / yearStats.year_3.count).toFixed(2)) : 0,
      year_4: yearStats.year_4.count > 0 ? parseFloat((yearStats.year_4.sum / yearStats.year_4.count).toFixed(2)) : 0
    }
  };
}

function normalizeYear(raw) {
  const s = String(raw || '').trim().toUpperCase();
  if (s === 'I' || s === '1' || s === '1ST' || s.includes('YEAR 1') || s.includes('YEAR I') || s.includes('1ST YEAR') || s.includes('FIRST')) return 'I';
  if (s === 'II' || s === '2' || s === '2ND' || s.includes('YEAR 2') || s.includes('YEAR II') || s.includes('2ND YEAR') || s.includes('SECOND')) return 'II';
  if (s === 'III' || s === '3' || s === '3RD' || s.includes('YEAR 3') || s.includes('YEAR III') || s.includes('3RD YEAR') || s.includes('THIRD')) return 'III';
  if (s === 'IV' || s === '4' || s === '4TH' || s.includes('YEAR 4') || s.includes('YEAR IV') || s.includes('4TH YEAR') || s.includes('FINAL')) return 'IV';
  return s || 'IV';
}

function parseNum(val) {
  if (val === null || val === undefined || val === '') return 0;
  const clean = String(val).replace(/,/g, '').trim();
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : Math.round(n);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
