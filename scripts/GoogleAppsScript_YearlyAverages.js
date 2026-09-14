/**
 * BIT Reward Points - Google Apps Script Web App
 * Real-time Dynamic Institutional Yearly Average Points API
 * 
 * This script runs inside your @bitsathy.ac.in Google Workspace domain.
 * It reads the official Reward Points spreadsheet and returns live average RP per year as JSON.
 * 
 * -----------------------------------------------------------------------------------
 * INSTRUCTIONS FOR DEPLOYMENT (3 Easy Steps):
 * -----------------------------------------------------------------------------------
 * 1. Open https://script.google.com/ in your browser (signed in with @bitsathy.ac.in).
 * 2. Click "New project", paste this entire code, and name it "BIT RP Yearly Averages API".
 * 3. Deploy as Web App:
 *    - Click "Deploy" (top right) -> "New deployment"
 *    - Select type: "Web app"
 *    - Description: "Live Yearly Averages JSON API"
 *    - Execute as: "Me" (your account)
 *    - Who has access: "Anyone" (or "Anyone within Bannari Amman Institute of Technology")
 *    - Click "Deploy" and copy the Web App URL!
 * 4. Paste your Web App URL into `src/services/googleSheetsService.js` under `APPS_SCRIPT_AVERAGES_URL`.
 * -----------------------------------------------------------------------------------
 */

const SPREADSHEET_ID = '1t5uHtrRMSXQkxrFRUudDpwuN23A6K61PhdrjDNZFaV8';
const MASTER_SPREADSHEET_ID = '1gHiOy41cpyg8dZxDWu-MsF8o0abLbL8MHbVK-GkMjqw';

function doGet(e) {
  try {
    const data = getLiveYearlyAverages();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      timestamp: new Date().toISOString(),
      ...data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString(),
      fallbackAverages: {
        year_1: 0,
        year_2: 2172.20,
        year_3: 3332.10,
        year_4: 438.64
      }
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getLiveYearlyAverages() {
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  }

  const deptSheets = [
    'CT', 'CSE', 'ECE', 'IT', 'AI&DS', 'AIML', 'MECH', 'EEE',
    'CSD', 'CSBS', 'BT', 'BIOMEDICAL', 'AGRI', 'CIVIL', 'FD',
    'FT', 'EIE', 'ISE', 'MTRS'
  ];

  let year_1_sum = 0, year_1_count = 0;
  let year_2_sum = 0, year_2_count = 0;
  let year_3_sum = 0, year_3_count = 0;
  let year_4_sum = 0, year_4_count = 0;

  for (let i = 0; i < deptSheets.length; i++) {
    const sheet = ss.getSheetByName(deptSheets[i]);
    if (!sheet) continue;

    const data = sheet.getDataRange().getValues();
    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      const rollNo = String(row[0] || row[2] || '').trim().toUpperCase();
      if (!rollNo || rollNo.length < 8) continue;

      let year = String(row[1] || '').trim().toUpperCase();
      if (!year) {
        if (rollNo.includes('21')) year = 'IV';
        else if (rollNo.includes('22')) year = 'III';
        else if (rollNo.includes('23')) year = 'II';
        else if (rollNo.includes('24')) year = 'I';
      }

      const pts = parseFloat(String(row[9] || row[7] || row[3] || row[row.length - 1] || '0').replace(/,/g, '')) || 0;

      if (year === 'I' || year === '1' || year === 'YEAR I') {
        year_1_sum += pts;
        year_1_count++;
      } else if (year === 'II' || year === '2' || year === 'YEAR II') {
        year_2_sum += pts;
        year_2_count++;
      } else if (year === 'III' || year === '3' || year === 'YEAR III') {
        year_3_sum += pts;
        year_3_count++;
      } else if (year === 'IV' || year === '4' || year === 'YEAR IV') {
        year_4_sum += pts;
        year_4_count++;
      }
    }
  }

  const averages = {
    year_1: year_1_count > 0 ? parseFloat((year_1_sum / year_1_count).toFixed(2)) : 0,
    year_2: year_2_count > 0 ? parseFloat((year_2_sum / year_2_count).toFixed(2)) : 216,
    year_3: year_3_count > 0 ? parseFloat((year_3_sum / year_3_count).toFixed(2)) : 332,
    year_4: year_4_count > 0 ? parseFloat((year_4_sum / year_4_count).toFixed(2)) : 438.64
  };

  return {
    averages,
    counts: {
      year_1: year_1_count,
      year_2: year_2_count,
      year_3: year_3_count,
      year_4: year_4_count
    }
  };
}
