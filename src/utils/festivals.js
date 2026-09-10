// Festival and Occasion Catalog for BIT Student Portal
export function getTodaysFestival(previewFestivalKey = null) {
  if (previewFestivalKey) {
    const list = getAllFestivals();
    return list.find(f => f.key === previewFestivalKey) || null;
  }

  const now = new Date();
  const m = now.getMonth() + 1; // 1 - 12
  const d = now.getDate();      // 1 - 31

  // 1. New Year (Dec 31 - Jan 2)
  if ((m === 12 && d >= 31) || (m === 1 && d <= 2)) {
    return {
      key: 'new_year',
      emoji: '🎉',
      name: 'New Year',
      greeting: 'Happy New Year!',
      subtext: 'Wishing you a prosperous year filled with academic excellence, high reward points & great placements!',
      theme: 'from-amber-500/90 via-purple-600/90 to-indigo-600/90 text-white',
      badgeBg: 'bg-amber-400 text-slate-950',
      sparkleType: 'fireworks'
    };
  }

  // 2. Pongal / Makar Sankranti / Bogi (Jan 13 - Jan 17)
  if (m === 1 && d >= 13 && d <= 17) {
    return {
      key: 'pongal',
      emoji: '🌾',
      name: 'Pongal',
      greeting: 'Iniya Pongal Nalvazhthukkal! 🌾',
      subtext: 'May the harvest festival bring abundant joy, prosperity and sweet success to your journey!',
      theme: 'from-amber-600 via-yellow-500 to-emerald-600 text-slate-950',
      badgeBg: 'bg-white/90 text-amber-950',
      sparkleType: 'harvest'
    };
  }

  // 3. Republic Day (Jan 26)
  if (m === 1 && d === 26) {
    return {
      key: 'republic_day',
      emoji: '🇮🇳',
      name: 'Republic Day',
      greeting: 'Happy Republic Day! 🇮🇳',
      subtext: 'Celebrating the sovereign spirit, democracy, and collective pride of our nation!',
      theme: 'from-orange-600 via-slate-900 to-emerald-700 text-white',
      badgeBg: 'bg-orange-500 text-white',
      sparkleType: 'tricolor'
    };
  }

  // 4. Tamil New Year / Puthandu & Vishu (Apr 13 - Apr 15)
  if (m === 4 && d >= 13 && d <= 15) {
    return {
      key: 'puthandu',
      emoji: '🥭',
      name: 'Tamil New Year',
      greeting: 'Iniya Puthandu Vazhthukkal! 🥭',
      subtext: 'Wishing you a joyful, vibrant and fruitful new beginning this Puthandu!',
      theme: 'from-emerald-600 via-yellow-500 to-amber-600 text-slate-950',
      badgeBg: 'bg-white text-emerald-950',
      sparkleType: 'harvest'
    };
  }

  // 5. Independence Day (Aug 15)
  if (m === 8 && d === 15) {
    return {
      key: 'independence_day',
      emoji: '🇮🇳',
      name: 'Independence Day',
      greeting: 'Happy Independence Day! 🇮🇳',
      subtext: 'Honoring our freedom, unity, and the innovators building the future of India at BIT!',
      theme: 'from-orange-600 via-indigo-950 to-emerald-600 text-white',
      badgeBg: 'bg-orange-500 text-white',
      sparkleType: 'tricolor'
    };
  }

  // 6. Teachers' Day (Sep 5)
  if (m === 9 && d === 5) {
    return {
      key: 'teachers_day',
      emoji: '📚',
      name: 'Teachers\' Day',
      greeting: 'Happy Teachers\' Day! 📚',
      subtext: 'Expressing gratitude to all professors, mentors, and guides shaping our future!',
      theme: 'from-blue-600 via-indigo-600 to-purple-600 text-white',
      badgeBg: 'bg-white/20 text-white',
      sparkleType: 'stars'
    };
  }

  // 7. Engineers' Day (Sep 15)
  if (m === 9 && d === 15) {
    return {
      key: 'engineers_day',
      emoji: '⚙️',
      name: 'Engineers\' Day',
      greeting: 'Happy Engineers\' Day! ⚙️',
      subtext: 'Celebrating the problem solvers, builders, and engineering minds of BIT!',
      theme: 'from-cyan-600 via-blue-700 to-indigo-800 text-white',
      badgeBg: 'bg-cyan-400 text-slate-950',
      sparkleType: 'sparks'
    };
  }

  // 8. Gandhi Jayanti (Oct 2)
  if (m === 10 && d === 2) {
    return {
      key: 'gandhi_jayanti',
      emoji: '🕊️',
      name: 'Gandhi Jayanti',
      greeting: 'Remembering Mahatma Gandhi 🕊️',
      subtext: 'Honoring peace, truth, perseverance, and sustainable progress.',
      theme: 'from-amber-600 via-stone-800 to-emerald-700 text-white',
      badgeBg: 'bg-amber-400 text-slate-950',
      sparkleType: 'stars'
    };
  }

  // 9. Ayudha Pooja / Dussehra / Navratri (Oct 10 - Oct 15)
  if (m === 10 && d >= 10 && d <= 15) {
    return {
      key: 'ayudha_pooja',
      emoji: '🪔',
      name: 'Ayudha Pooja & Dussehra',
      greeting: 'Happy Ayudha Pooja & Vijayadashami! 🪔',
      subtext: 'May knowledge, tools, technology, and learning empower all your ambitions!',
      theme: 'from-yellow-600 via-amber-700 to-red-700 text-white',
      badgeBg: 'bg-yellow-400 text-slate-950',
      sparkleType: 'diya'
    };
  }

  // 10. Diwali / Deepavali (Oct 20 - Nov 5)
  if ((m === 10 && d >= 20) || (m === 11 && d <= 5)) {
    return {
      key: 'diwali',
      emoji: '🪔',
      name: 'Diwali',
      greeting: 'Happy Diwali! 🪔✨',
      subtext: 'May the festival of lights illuminate your path with joy, wisdom, and sparkling success!',
      theme: 'from-amber-500 via-orange-600 to-rose-600 text-white',
      badgeBg: 'bg-yellow-300 text-slate-950',
      sparkleType: 'diya'
    };
  }

  // 11. Christmas (Dec 23 - Dec 26)
  if (m === 12 && d >= 23 && d <= 26) {
    return {
      key: 'christmas',
      emoji: '🎄',
      name: 'Christmas',
      greeting: 'Merry Christmas & Happy Holidays! 🎄',
      subtext: 'Wishing you warmth, peace, cheerful celebrations, and good tidings!',
      theme: 'from-red-600 via-rose-700 to-emerald-700 text-white',
      badgeBg: 'bg-emerald-400 text-slate-950',
      sparkleType: 'snow'
    };
  }

  return null;
}

export function getAllFestivals() {
  return [
    { key: 'diwali', name: 'Diwali 🪔', dateStr: 'Oct / Nov' },
    { key: 'pongal', name: 'Pongal 🌾', dateStr: 'Jan 14-16' },
    { key: 'new_year', name: 'New Year 🎉', dateStr: 'Jan 1' },
    { key: 'independence_day', name: 'Independence Day 🇮🇳', dateStr: 'Aug 15' },
    { key: 'republic_day', name: 'Republic Day 🇮🇳', dateStr: 'Jan 26' },
    { key: 'engineers_day', name: 'Engineers\' Day ⚙️', dateStr: 'Sep 15' },
    { key: 'teachers_day', name: 'Teachers\' Day 📚', dateStr: 'Sep 5' },
    { key: 'ayudha_pooja', name: 'Ayudha Pooja 🪔', dateStr: 'October' },
    { key: 'christmas', name: 'Christmas 🎄', dateStr: 'Dec 25' }
  ];
}
