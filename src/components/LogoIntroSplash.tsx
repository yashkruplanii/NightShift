import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface LogoIntroSplashProps {
  onComplete: () => void;
}

export const LogoIntroSplash: React.FC<LogoIntroSplashProps> = ({ onComplete }) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [phase, setPhase] = useState<'enter' | 'float' | 'exit' | 'done'>('enter');
  const [progress, setProgress] = useState<number>(0);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. Ethereal Acoustic Spatial Chime (Warm, subtle Apple-style chord)
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime + 0.05;
        const freqs = [261.63, 392.0, 523.25, 659.25]; // C4, G4, C5, E5
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.032, now + 0.15 + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + 1.9);
        });
      }
    } catch (e) {}
  }, []);

  // 2. 3D Mouse Parallax Gyro Tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      setMouseOffset({ x: dx * 14, y: dy * 14 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Robust Animation Lifecycle (Uninterrupted by parent re-renders)
  useEffect(() => {
    // Stage 1: Float smoothly into focus
    const tEnter = setTimeout(() => {
      setPhase('float');
    }, 60);

    // Stage 2: Hairline progress bar (0 to 100% over 1.9s)
    const startTime = Date.now();
    const duration = 1900;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 25);

    // Stage 3: Smooth Aperture Fade Out
    const tExit = setTimeout(() => {
      setPhase('exit');
    }, 2200);

    // Stage 4: Unmount & Launch App
    const tDone = setTimeout(() => {
      setPhase('done');
      onCompleteRef.current();
    }, 2850);

    return () => {
      clearTimeout(tEnter);
      clearTimeout(tExit);
      clearTimeout(tDone);
      clearInterval(interval);
    };
  }, []);

  if (phase === 'done') return null;

  const tiltX = -mouseOffset.y;
  const tiltY = mouseOffset.x;

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-[#0A0B0D] flex flex-col items-center justify-center p-6 select-none overflow-hidden transition-all duration-700 ease-out ${
        phase === 'exit' 
          ? 'opacity-0 scale-105 filter blur-md pointer-events-none' 
          : 'opacity-100 scale-100 filter blur-0'
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* Ambient Volumetric Spatial Glow */}
      <div 
        className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-amber-500/10 to-indigo-500/10 blur-[150px] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 2}px, ${mouseOffset.y * 2}px, -100px)`
        }}
      />

      {/* Floating 3D Spatial Rings in Z-Depth */}
      <div 
        className="absolute w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] rounded-full border border-white/[0.04] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `rotateX(${tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg) translateZ(-80px)`
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full border border-cyan-500/[0.04] pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          transform: `rotateX(${tiltX * 0.3}deg) rotateY(${tiltY * 0.3}deg) translateZ(-160px)`
        }}
      />

      {/* Minimalist Skip Button */}
      <button
        onClick={() => {
          setPhase('done');
          onCompleteRef.current();
        }}
        className="absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-zinc-400 hover:text-white text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 border border-white/[0.06]"
      >
        <span>Skip</span>
        <ArrowRight className="w-3 h-3 text-zinc-400" />
      </button>

      {/* =========================================================================
          3D LOGO CONTAINER: ZERO BORDERS, NO BOXES, PURE SPATIAL 3D SUSPENSION
         ========================================================================= */}
      <div 
        className="relative z-10 flex flex-col items-center text-center transition-all duration-700 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) ${
            phase === 'enter' 
              ? 'translateZ(-120px) scale(0.85)' 
              : 'translateZ(0px) scale(1)'
          }`,
          opacity: phase === 'enter' ? 0 : 1
        }}
      >
        {/* Floating 3D Logo (No Box, No Borders, Natural Optical Glow) */}
        <div 
          className="relative mb-8 animate-levitate-3d transition-all duration-500"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Subtle Organic Radial Back-Bloom */}
          <div 
            className="absolute inset-0 -m-8 rounded-full bg-gradient-to-tr from-amber-500/20 via-cyan-500/15 to-transparent blur-3xl opacity-75 pointer-events-none animate-pulse"
            style={{ transform: 'translateZ(-20px)' }}
          />

          {/* Delicate Hairline Orbit Ring Behind Logo (Premium Ethereal Touch) */}
          <div 
            className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-cyan-400/[0.12] pointer-events-none -inset-6 sm:-inset-8 m-auto animate-[spin_24s_linear_infinite]"
            style={{ transform: 'translateZ(-10px)' }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38BDF8]" />
          </div>

          {/* Borderless Floating Logo Container */}
          <div className="relative">
            {/* Pure Transparent Logo Image */}
            <img 
              src="/nightshift_logo.png" 
              alt="NightShift Logo" 
              loading="eager"
              decoding="async"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-contain filter drop-shadow-[0_25px_45px_rgba(245,158,11,0.25)] select-none pointer-events-none"
              style={{
                transform: 'translateZ(30px)'
              }}
            />

            {/* Premium Sleek Shimmer Light Sweep Across Crest */}
            <div 
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
              style={{ transform: 'translateZ(34px)' }}
            >
              <div 
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.45) 48%, rgba(56, 189, 248, 0.6) 52%, transparent 70%)',
                  transform: phase === 'float' || phase === 'exit' ? 'translateX(240%)' : 'translateX(-240%)',
                  transition: 'transform 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
                  mixBlendMode: 'screen'
                }}
              />
            </div>

            {/* Subtle Interactive Cursor Light Glint */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${50 + mouseOffset.x * 2}% ${50 + mouseOffset.y * 2}%, rgba(255, 255, 255, 0.28) 0%, transparent 60%)`,
                mixBlendMode: 'screen',
                transform: 'translateZ(35px)'
              }}
            />
          </div>
        </div>

        {/* Clean Typographic Identity in 3D Space */}
        <div 
          className="flex flex-col items-center transition-all duration-700 delay-100"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(20px)'
          }}
        >
          {/* Brand Name */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.22em] text-white uppercase font-sans mb-1.5 flex items-center gap-1.5">
            <span>NIGHTSHIFT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#38BDF8]" />
          </h1>

          {/* Subtitle / Mission Tag */}
          <p className="text-[11px] sm:text-xs font-medium tracking-[0.16em] uppercase text-zinc-400 mb-8">
            Safe Night Navigation Engine
          </p>

          {/* Sleek Hairline Progress Line */}
          <div className="w-48 sm:w-56 flex flex-col gap-2">
            <div className="w-full h-[1.5px] bg-white/[0.08] rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              <span>Aligning Ground Truth</span>
              <span className="text-zinc-400 font-semibold">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
