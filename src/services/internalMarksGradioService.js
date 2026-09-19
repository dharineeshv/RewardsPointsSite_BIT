/**
 * Live Internal Marks Gradio Service
 * Fetches real-time official internal marks and subject distributions directly from the
 * official BIT RewardPoints Gradio Space (PraneshJs/RewardPointsSite - fn_index: 4).
 * Strictly used for Internal Marks ONLY.
 */

const GRADIO_HOST = 'https://praneshjs-rewardpointssite.hf.space';
const GRADIO_CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache for instant sub-second page loads

/**
 * Fetch verified live internal marks from Gradio Space for a given student roll number
 */
export async function fetchLiveGradioInternalMarks(rollNo, forceRefresh = false) {
  if (!rollNo) return null;
  const cleanRoll = String(rollNo).trim().toUpperCase();
  const cacheKey = `bit_gradio_internal_marks_${cleanRoll}`;

  // 1. Check fresh local storage cache unless forced
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.data && Date.now() - parsed.timestamp < GRADIO_CACHE_TTL) {
          return parsed.data;
        }
      }
    } catch (e) {}
  }

  // 2. Connect to Gradio SSE queue stream
  try {
    const sessionHash = 'bc_' + Math.random().toString(36).substring(2, 10);
    const joinUrl = `${GRADIO_HOST}/gradio_api/queue/join?`;
    const dataUrl = `${GRADIO_HOST}/gradio_api/queue/data?session_hash=${sessionHash}`;

    // Join the queue for fn_index: 4 (Internal Marks endpoint)
    const joinRes = await fetch(joinUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [cleanRoll],
        fn_index: 4,
        session_hash: sessionHash
      })
    });

    if (!joinRes.ok) {
      throw new Error(`Gradio queue join HTTP status ${joinRes.status}`);
    }

    // Read SSE stream
    const sseRes = await fetch(dataUrl);
    if (!sseRes.ok) {
      throw new Error(`Gradio stream HTTP status ${sseRes.status}`);
    }

    const reader = sseRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let rawText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.msg === 'process_completed' && payload.output?.data) {
              rawText = String(payload.output.data[0] || '');
              break;
            }
          } catch (e) {}
        }
      }
      if (rawText) break;
    }

    if (rawText) {
      const parsedData = parseGradioMarksText(rawText, cleanRoll);
      if (parsedData && typeof window !== 'undefined') {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: parsedData
          }));
        } catch (e) {}
      }
      return parsedData;
    }
  } catch (err) {
    console.warn(`[GradioInternalMarks] Notice: ${err.message}`);
  }

  // 3. Return stale cache if network failed
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.data) return parsed.data;
      }
    } catch (e) {}
  }

  return null;
}

/**
 * Parses the formatted summary text returned by Gradio fn_index 4
 */
export function parseGradioMarksText(text, rollNo) {
  if (!text || typeof text !== 'string') return null;

  const theoryCourses = [];
  const labCourses = [];
  const lines = text.split('\n').map((l) => l.trim());

  let currentCourse = null;
  let totalRewardPoints = '0.00';
  let totalInternalMarks = '0.00';
  let totalSubjects = 0;

  for (const line of lines) {
    if (!line) continue;

    // Detect Course Codes like 🔹 22CT701 or 22CT701
    if (line.startsWith('🔹') || /^[0-9]{2}[A-Z]{2,4}[0-9]{3}/i.test(line)) {
      if (currentCourse) {
        if (currentCourse.isLab) labCourses.push(currentCourse);
        else theoryCourses.push(currentCourse);
      }
      const code = line.replace(/^[🔹\s]+/, '').trim();
      const isLab = code.includes('9') || code.includes('LAB') || code.includes('PR');
      currentCourse = {
        slot: isLab ? `LS${labCourses.length + 1}` : `TS${theoryCourses.length + 1}`,
        code,
        ip1: '',
        ip2: '',
        total: '',
        pointsAllocated: 0,
        isLab
      };
      continue;
    }

    if (currentCourse) {
      if (line.toLowerCase().startsWith('reward points:')) {
        const parts = line.replace(/^reward points:\s*/i, '').split('|');
        parts.forEach((p) => {
          const [k, v] = p.split(':').map((s) => s.trim());
          if (k && v && (k.toUpperCase().includes('TOTAL') || k.toUpperCase().includes('IP-1'))) {
            currentCourse.pointsAllocated = parseFloat(v.replace(/,/g, '')) || 0;
          }
        });
      } else if (line.toLowerCase().startsWith('internal marks:')) {
        const parts = line.replace(/^internal marks:\s*/i, '').split('|');
        parts.forEach((p) => {
          const [k, v] = p.split(':').map((s) => s.trim());
          if (k && v) {
            if (k.toUpperCase().includes('IP-1')) currentCourse.ip1 = v;
            if (k.toUpperCase().includes('IP-2')) currentCourse.ip2 = v;
            if (k.toUpperCase().includes('TOTAL')) currentCourse.total = v;
          }
        });
        if (!currentCourse.total && currentCourse.ip1) {
          currentCourse.total = currentCourse.ip1;
        }
      }
    }

    if (line.includes('TOTAL REWARD POINTS:')) {
      totalRewardPoints = line.split('TOTAL REWARD POINTS:')[1]?.trim() || '0.00';
    } else if (line.includes('TOTAL INTERNAL MARKS:')) {
      totalInternalMarks = line.split('TOTAL INTERNAL MARKS:')[1]?.trim() || '0.00';
    } else if (line.includes('TOTAL SUBJECTS:')) {
      totalSubjects = parseInt(line.split('TOTAL SUBJECTS:')[1]?.trim() || '0', 10) || 0;
    }
  }

  if (currentCourse) {
    if (currentCourse.isLab) labCourses.push(currentCourse);
    else theoryCourses.push(currentCourse);
  }

  return {
    rollNo,
    theoryCourses,
    labCourses,
    addonCourses: [],
    totalTheoryCount: theoryCourses.length,
    totalLabCount: labCourses.length,
    totalSubjectsCount: totalSubjects || (theoryCourses.length + labCourses.length),
    ip1Total: totalInternalMarks,
    ip2Total: '0.00',
    grandTotal: totalInternalMarks,
    totalRedeemedPoints: totalRewardPoints,
    rawText: text,
    isLiveGradio: true,
    fetchedAt: new Date().toISOString()
  };
}

/**
 * Fetch verified live student profile, full P-Skill completions, and category breakdown
 * directly from Gradio Space (PraneshJs/RewardPointsSite - fn_index: 2).
 */
export async function fetchLiveGradioStudentProfile(rollNo, forceRefresh = false) {
  if (!rollNo) return null;
  const cleanRoll = String(rollNo).trim().toUpperCase();
  const cacheKey = `bit_gradio_student_profile_${cleanRoll}`;

  // 1. Check fresh local storage cache unless forced
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.data && Date.now() - parsed.timestamp < GRADIO_CACHE_TTL) {
          return parsed.data;
        }
      }
    } catch (e) {}
  }

  // 2. Connect to Gradio SSE queue stream for fn_index: 2
  try {
    const sessionHash = 'prf_' + Math.random().toString(36).substring(2, 10);
    const joinUrl = `${GRADIO_HOST}/gradio_api/queue/join?`;
    const dataUrl = `${GRADIO_HOST}/gradio_api/queue/data?session_hash=${sessionHash}`;

    const joinRes = await fetch(joinUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [cleanRoll],
        fn_index: 2,
        session_hash: sessionHash
      })
    });

    if (!joinRes.ok) {
      throw new Error(`Gradio queue join HTTP status ${joinRes.status}`);
    }

    const sseRes = await fetch(dataUrl);
    if (!sseRes.ok) {
      throw new Error(`Gradio stream HTTP status ${sseRes.status}`);
    }

    const reader = sseRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let rawText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.msg === 'process_completed' && payload.output?.data) {
              rawText = String(payload.output.data[0] || '');
              break;
            }
          } catch (e) {}
        }
      }
      if (rawText) break;
    }

    if (rawText && !rawText.startsWith('❌')) {
      const parsedData = parseGradioStudentProfile(rawText, cleanRoll);
      if (parsedData && typeof window !== 'undefined') {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: parsedData
          }));
        } catch (e) {}
      }
      return parsedData;
    }
  } catch (err) {
    console.warn(`[GradioStudentProfile] Notice: ${err.message}`);
  }

  // 3. Return stale cache on network failure
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.data) return parsed.data;
      }
    } catch (e) {}
  }

  return null;
}

/**
 * Parses full student profile, activities, and breakdown text from Gradio fn_index 2
 */
export function parseGradioStudentProfile(text, rollNo) {
  if (!text || typeof text !== 'string') return null;

  const result = {
    rollNo,
    name: '',
    year: '',
    department: '',
    mentor: '',
    cumulativePoints: 0,
    redeemedPoints: 0,
    balancePoints: 0,
    carryForward: 0,
    activities: [],
    categories: [],
    rawText: text,
    isLiveGradio: true,
    fetchedAt: new Date().toISOString()
  };

  const lines = text.split('\n').map(l => l.trim());
  let section = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (line.includes('YOUR DETAILS')) {
      section = 'DETAILS';
      continue;
    } else if (line.includes('DETAILED ACTIVITY LIST')) {
      section = 'ACTIVITIES';
      continue;
    } else if (line.includes('REWARD POINTS BREAKDOWN')) {
      section = 'BREAKDOWN';
      continue;
    }

    if (section === 'DETAILS') {
      if (line.startsWith('ROLL NO.')) result.rollNo = line.split(':')[1]?.trim() || rollNo;
      else if (line.startsWith('STUDENT NAME')) result.name = line.split(':')[1]?.trim() || '';
      else if (line.startsWith('YEAR')) result.year = line.split(':')[1]?.trim() || '';
      else if (line.startsWith('DEPARTMENT')) result.department = line.split(':')[1]?.trim() || '';
      else if (line.startsWith('MENTOR NAME')) result.mentor = line.split(':')[1]?.trim() || '';
      else if (line.startsWith('CUMULATIVE REWARD POINTS')) result.cumulativePoints = parseFloat((line.split(':')[1] || '0').replace(/,/g, '')) || 0;
      else if (line.startsWith('REEDEMED POINTS') || line.startsWith('REDEEMED POINTS')) result.redeemedPoints = parseFloat((line.split(':')[1] || '0').replace(/,/g, '')) || 0;
      else if (line.startsWith('BALANCE POINTS')) result.balancePoints = parseFloat((line.split(':')[1] || '0').replace(/,/g, '')) || 0;
    } else if (section === 'ACTIVITIES') {
      const match = line.match(/^\d+\.\s+([A-Z\s]+):\s+(.+)\s+-\s+([0-9.,]+)\s*pts/i);
      if (match) {
        const rawType = match[1].trim();
        const rawName = match[2].trim();
        const rawPts = parseFloat(match[3].replace(/,/g, '')) || 0;
        const isPS = rawType.toUpperCase().includes('P SKILL') || rawType.toUpperCase().includes('PSKILL');
        
        const dateMatch = rawName.match(/\((\d{2}\/\d{2}\/\d{4}\s*-\s*\d{2}\/\d{2}\/\d{4})\)/);
        const dateStr = dateMatch ? dateMatch[1] : 'Academic Year 2025-2026';

        result.activities.push({
          id: `gradio-act-${result.activities.length + 1}`,
          code: `ACT_${result.activities.length + 1}`,
          activity_code: `ACT_${result.activities.length + 1}`,
          activity_type: isPS ? 'P Skill' : (rawType.includes('INITIATIVE') ? 'Initiative' : (rawType.includes('INTERVIEW') ? 'Interview' : rawType)),
          raw_type: rawType,
          activity_name: rawName,
          course_name: rawName,
          points: rawPts,
          reward_points: rawPts.toLocaleString(),
          date: dateStr,
          organizer: 'BIT Center for Excellence',
          type: 'positive',
          isPS
        });
      }
    } else if (section === 'BREAKDOWN') {
      if (line.startsWith('📋 **')) {
        const label = line.replace(/^📋 \*\*/, '').replace(/\*\*$/, '').trim();
        const nextLine = lines[i + 1] || '';
        if (nextLine.includes('Count:') && nextLine.includes('Points:')) {
          const countMatch = nextLine.match(/Count:\s*([0-9-]+)/);
          const ptsMatch = nextLine.match(/Points:\s*([0-9.,-]+)/);
          const count = countMatch && countMatch[1] !== '-' ? parseInt(countMatch[1], 10) : 0;
          const pts = ptsMatch ? parseFloat(ptsMatch[1].replace(/,/g, '')) : 0;
          if (label !== 'TOTAL (2025-2026 EVEN)' && label !== 'CUMULATIVE POINTS' && label !== 'REDEEMED POINTS' && label !== 'BALANCE POINTS') {
            result.categories.push({
              id: label.toLowerCase().replace(/[^a-z0-9]/g, '_'),
              label,
              count,
              points: pts
            });
          }
        }
      }
    }
  }

  return result;
}
