import React from 'react';
import { 
  BusFront, 
  WifiOff, 
  CloudRain, 
  RotateCcw, 
  SlidersHorizontal 
} from 'lucide-react';

interface RedTeamChaosPanelProps {
  isBusCancelled: boolean;
  isNetworkSevered: boolean;
  isUnderpassFlooded: boolean;
  onToggleBus: () => void;
  onToggleNetwork: () => void;
  onToggleFlood: () => void;
  onResetChaos: () => void;
}

export const RedTeamChaosPanel: React.FC<RedTeamChaosPanelProps> = ({
  isBusCancelled,
  isNetworkSevered,
  isUnderpassFlooded,
  onToggleBus,
  onToggleNetwork,
  onToggleFlood,
  onResetChaos
}) => {
  const activeCount = (isBusCancelled ? 1 : 0) + (isNetworkSevered ? 1 : 0) + (isUnderpassFlooded ? 1 : 0);

  return (
    <div className="ios-glass-card rounded-3xl p-5">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white/90">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Test Real-Life Disruptions
            </h3>
            <p className="text-[11px] text-white/50">
              Flip switches to see how the system protects you when things go wrong
            </p>
          </div>
        </div>

        {activeCount > 0 && (
          <button
            onClick={onResetChaos}
            className="flex items-center gap-1 text-[11px] font-medium text-[#007AFF] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 3 Human-Friendly Disruption Switches */}
      <div className="space-y-3">
        {/* Toggle 1: Cancel Bus */}
        <div 
          onClick={onToggleBus}
          className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              isBusCancelled ? 'bg-[#FF3B30]/20 text-[#FF3B30]' : 'bg-white/10 text-white/60'
            }`}>
              <BusFront className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">What if the 02:22 AM bus is cancelled?</div>
              <div className="text-[10px] text-white/50">Activates pre-planned auto backup so you aren't stranded</div>
            </div>
          </div>

          <div className={`w-11 h-6 rounded-full transition-colors duration-200 relative p-0.5 ${
            isBusCancelled ? 'bg-[#FF3B30]' : 'bg-white/20'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
              isBusCancelled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </div>

        {/* Toggle 2: Sever Network */}
        <div 
          onClick={onToggleNetwork}
          className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              isNetworkSevered ? 'bg-[#FF9500]/20 text-[#FF9500]' : 'bg-white/10 text-white/60'
            }`}>
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">What if mobile internet disconnects?</div>
              <div className="text-[10px] text-white/50">Relies entirely on verified offline map without failing</div>
            </div>
          </div>

          <div className={`w-11 h-6 rounded-full transition-colors duration-200 relative p-0.5 ${
            isNetworkSevered ? 'bg-[#FF9500]' : 'bg-white/20'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
              isNetworkSevered ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </div>

        {/* Toggle 3: Flood Underpass */}
        <div 
          onClick={onToggleFlood}
          className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              isUnderpassFlooded ? 'bg-[#007AFF]/20 text-[#38BDF8]' : 'bg-white/10 text-white/60'
            }`}>
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">What if the underpass floods with rain?</div>
              <div className="text-[10px] text-white/50">Automatically avoids flooded subways and routes via bypass</div>
            </div>
          </div>

          <div className={`w-11 h-6 rounded-full transition-colors duration-200 relative p-0.5 ${
            isUnderpassFlooded ? 'bg-[#007AFF]' : 'bg-white/20'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
              isUnderpassFlooded ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};
