import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { RedTeamChaosPanel } from './RedTeamChaosPanel';
import { TimeScrubber } from './TimeScrubber';

interface DemoLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBusCancelled: boolean;
  isNetworkSevered: boolean;
  isUnderpassFlooded: boolean;
  onToggleBus: () => void;
  onToggleNetwork: () => void;
  onToggleFlood: () => void;
  onResetChaos: () => void;
  currentMinutes: number;
  onChangeMinutes: (m: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const DemoLabModal: React.FC<DemoLabModalProps> = ({
  isOpen,
  onClose,
  isBusCancelled,
  isNetworkSevered,
  isUnderpassFlooded,
  onToggleBus,
  onToggleNetwork,
  onToggleFlood,
  onResetChaos,
  currentMinutes,
  onChangeMinutes,
  isPlaying,
  onTogglePlay
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-3xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Mid-Evaluation Demo Lab & Edge-Case Simulator
              </h3>
              <p className="text-[11px] text-white/50">
                Flip disruptions live during evaluation to demonstrate FAROS dynamic contingency
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Disruptions & Time Simulation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RedTeamChaosPanel
            isBusCancelled={isBusCancelled}
            isNetworkSevered={isNetworkSevered}
            isUnderpassFlooded={isUnderpassFlooded}
            onToggleBus={onToggleBus}
            onToggleNetwork={onToggleNetwork}
            onToggleFlood={onToggleFlood}
            onResetChaos={onResetChaos}
          />

          <TimeScrubber
            currentMinutes={currentMinutes}
            onChangeMinutes={onChangeMinutes}
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
          />
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>All 8 Core Engine Invariants active in real-time</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close Lab View
          </button>
        </div>
      </div>
    </div>
  );
};
