import React from 'react';
import { AlertCircle } from 'lucide-react';
import { EpistemicStatus } from '../engine/evidence_decay';

interface JourneyHeaderProps {
  currentTimeStr?: string;
  deadlineTimeStr?: string;
  isNetworkSevered?: boolean;
  epistemicStatus?: EpistemicStatus;
  activeDisruptionsCount?: number;
  onOpenTestRunner?: () => void;
  onOpenGovRegistry?: () => void;
  onReplayIntro?: () => void;
}

export const JourneyHeader: React.FC<JourneyHeaderProps> = ({
  currentTimeStr = "02:15 AM",
  deadlineTimeStr = "03:00 AM",
  isNetworkSevered = false,
  epistemicStatus = 'fresh',
  activeDisruptionsCount = 0,
  onOpenTestRunner,
  onOpenGovRegistry,
  onReplayIntro
}) => {
  return (
    <header className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-2">
      <div className="ios-glass rounded-3xl px-5 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Official NightShift Logo & Identity */}
        <div className="flex items-center gap-3">
          <img 
            src="/nightshift_logo.png" 
            alt="NightShift" 
            className="w-10 h-10 rounded-2xl object-cover shadow-[0_4px_20px_rgba(245,158,11,0.35)] border border-amber-500/30 shrink-0 cursor-pointer hover:scale-105 transition-transform" 
            onClick={onReplayIntro}
            title="Click to replay intro animation"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-white uppercase font-sans">
                NightShift
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Safe Night Navigation
              </span>
            </div>
            <div className="text-[11px] text-white/50 tracking-normal">
              Don't just find a route. Find a way home.
            </div>
          </div>
        </div>

        {/* Right: Live Status Pill with Blinking Green Dot */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101114] border border-white/10 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34C759]"></span>
          </span>
          <span className="text-xs font-bold text-white tracking-wide uppercase">Live</span>
        </div>

      </div>

      {/* Disruption Alert Pill if active */}
      {activeDisruptionsCount > 0 && (
        <div className="mt-2.5 max-w-lg mx-auto py-1 px-4 rounded-full bg-[#FF3B30]/15 border border-[#FF3B30]/30 backdrop-blur-xl flex items-center justify-between text-xs text-[#FF3B30] shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium text-[11px]">
              {activeDisruptionsCount} simulated disruption active — backup plan automatically armed
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/60">Active</span>
        </div>
      )}
    </header>
  );
};
