import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatMinutesToTime } from '../engine/time_expanded_graph';

interface TimeScrubberProps {
  currentMinutes: number;
  onChangeMinutes: (mins: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TimeScrubber: React.FC<TimeScrubberProps> = ({
  currentMinutes,
  onChangeMinutes,
  isPlaying,
  onTogglePlay
}) => {
  const minSlider = 100; // 01:40 AM
  const maxSlider = 200; // 03:20 AM

  return (
    <div className="ios-glass-card rounded-3xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
            )}
          </button>

          <div>
            <span className="text-[10px] uppercase font-semibold text-white/40 block">
              Time Simulation
            </span>
            <span className="text-sm font-bold text-white">
              {formatMinutesToTime(currentMinutes)}
            </span>
          </div>
        </div>

        <button
          onClick={() => onChangeMinutes(135)}
          className="text-xs text-white/50 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          title="Reset to 02:15 AM"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to 02:15 AM</span>
        </button>
      </div>

      {/* Apple Style Slider Track */}
      <div className="relative py-1">
        <input
          type="range"
          min={minSlider}
          max={maxSlider}
          step={1}
          value={currentMinutes}
          onChange={(e) => onChangeMinutes(Number(e.target.value))}
          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
        />

        {/* Milestone Labels */}
        <div className="flex justify-between text-[11px] text-white/40 mt-2 font-medium">
          <span>01:40 AM</span>
          <span className="text-[#38BDF8]">02:15 AM (Shift End)</span>
          <span className="text-white">02:22 AM (Target Bus)</span>
          <span className="text-[#FF9500]">03:00 AM (Deadline)</span>
          <span>03:20 AM</span>
        </div>
      </div>
    </div>
  );
};
