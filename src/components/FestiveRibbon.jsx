import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Heart, ChevronDown } from 'lucide-react';
import { getTodaysFestival, getAllFestivals } from '../utils/festivals';

export default function FestiveRibbon({ studentName, previewKey = null }) {
  const [festival, setFestival] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activePreviewKey, setActivePreviewKey] = useState(previewKey);
  const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check if user previously dismissed today's festival in this session
    const current = getTodaysFestival(activePreviewKey);
    if (!current) {
      setFestival(null);
      return;
    }

    const dismissedKey = sessionStorage.getItem(`dismissed_fest_${current.key}`);
    if (dismissedKey && !activePreviewKey) {
      setIsDismissed(true);
    } else {
      setIsDismissed(false);
    }
    setFestival(current);
  }, [activePreviewKey]);

  const handleDismiss = () => {
    if (festival) {
      sessionStorage.setItem(`dismissed_fest_${festival.key}`, 'true');
    }
    setIsDismissed(true);
  };

  // Interactive Particle Confetti / Cracker Burst Emitter
  const triggerCelebration = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = festival?.key === 'republic_day' || festival?.key === 'independence_day'
      ? ['#FF9933', '#FFFFFF', '#138808', '#000080']
      : festival?.key === 'diwali' || festival?.key === 'ayudha_pooja'
      ? ['#F59E0B', '#EF4444', '#FCD34D', '#F97316', '#FFFFFF']
      : ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#FFFFFF'];

    const particles = [];
    const particleCount = window.innerWidth < 640 ? 60 : 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: window.innerWidth * (0.2 + Math.random() * 0.6),
        y: 40 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 10,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.98; // friction
        p.rotation += p.vRot;
        p.life++;
        p.opacity = Math.max(0, 1 - (p.life / p.maxLife));

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  };

  if (!festival || isDismissed) return null;

  const firstName = studentName ? studentName.split(' ')[0] : 'BIT Student';

  return (
    <>
      {/* Fullscreen Confetti Canvas (Pointer-events none) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />

      {/* Top Festive Ribbon Bar */}
      <div className={`relative w-full bg-gradient-to-r ${festival.theme} shadow-sm z-40 transition-all duration-300 py-1.5 px-3 sm:px-6 text-xs sm:text-sm font-medium border-b border-white/20 backdrop-blur-md`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
          
          {/* Left: Festival Badge & Greeting */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="text-base sm:text-lg animate-bounce drop-shadow-sm shrink-0">
              {festival.emoji}
            </span>
            
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
              <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-2xs ${festival.badgeBg}`}>
                {festival.name}
              </span>
              
              <span className="font-extrabold tracking-tight truncate">
                {festival.greeting.replace('!', `, ${firstName}!`)}
              </span>

              <span className="hidden md:inline text-[11px] opacity-90 truncate max-w-md">
                • {festival.subtext}
              </span>
            </div>
          </div>

          {/* Right: Interactive Celebrate Button & Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={triggerCelebration}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/25 hover:bg-white/40 active:scale-95 text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer border border-white/30 backdrop-blur-xs"
              title="Click to trigger festive sparkles"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Celebrate ✨</span>
            </button>

            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-black/20 active:scale-90 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Dismiss banner for this session"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
