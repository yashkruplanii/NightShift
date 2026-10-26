import React from 'react';
import { 
  ArrowUpRight, 
  ArrowUp, 
  CornerUpLeft, 
  CornerUpRight, 
  LifeBuoy, 
  X, 
  Compass, 
  Volume2 
} from 'lucide-react';
import { RoutePlan } from '../engine/faros_router';

interface NavigationBannerProps {
  activePlan: RoutePlan;
  destName: string;
  onEndNavigation: () => void;
}

export const NavigationBanner: React.FC<NavigationBannerProps> = ({
  activePlan,
  destName,
  onEndNavigation
}) => {
  const turnStep = activePlan.turnSteps?.[0] || activePlan.turnSteps?.[1];
  const stepInstruction = turnStep ? turnStep.instruction : (activePlan.segments[0]?.name || "Proceed along illuminated arterial road");
  const stepDistance = turnStep ? turnStep.distanceMeters : (activePlan.segments[0]?.distanceMeters || 350);
  const nextStep = activePlan.turnSteps?.[1];

  const renderManeuverIcon = () => {
    const mod = turnStep?.modifier || '';
    if (mod.includes('left')) return <CornerUpLeft className="w-7 h-7 text-white" />;
    if (mod.includes('right')) return <CornerUpRight className="w-7 h-7 text-white" />;
    return <ArrowUp className="w-7 h-7 text-white" />;
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-1 animate-slideDown">
      <div className="rounded-3xl bg-[#007AFF] text-white p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,122,255,0.4)] border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Turn Direction & Street Name */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            {renderManeuverIcon()}
          </div>

          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-white/80 flex items-center flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[10px] tracking-wide">
                {activePlan.travelMode === 'two_wheeler' && '🛵 2-Wheeler'}
                {activePlan.travelMode === 'four_wheeler' && '🚗 4-Wheeler'}
                {activePlan.travelMode === 'walking' && '🚶 Walking'}
                {(!activePlan.travelMode || activePlan.travelMode === 'transit') && '🚌 Night Transit'}
              </span>
              <span>In {stepDistance} meters</span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span className="text-[#34C759] font-extrabold bg-black/20 px-2 py-0.5 rounded-full text-[10px]">
                ✓ 100% Illuminated
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
              {stepInstruction}
            </h2>
            <div className="text-xs text-white/80 mt-0.5 flex items-center gap-2">
              <span>Heading to: <strong className="text-white font-semibold">{destName.split(' (')[0]}</strong></span>
              {nextStep && (
                <span className="hidden sm:inline text-white/70">
                  • Next: {nextStep.instruction}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Nearest Emergency Sanctuary Alert */}
        <div className="px-3.5 py-2 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex items-center gap-2.5 text-xs">
          <LifeBuoy className="w-4 h-4 text-[#34C759] shrink-0 animate-spin" />
          <div>
            <span className="text-[10px] uppercase font-bold text-white/60 block">Nearest Night Sanctuary:</span>
            <span className="font-semibold text-white">Apollo 24/7 Pharmacy (280m walk)</span>
          </div>
        </div>

        {/* Right: ETA & End Navigation Button */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-white/10 md:border-t-0">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-white tracking-tight leading-none">
              {activePlan.arrivalTimeStr}
            </div>
            <div className="text-xs text-white/80 font-medium mt-1">
              {activePlan.durationHuman} remaining
            </div>
          </div>

          <button
            onClick={onEndNavigation}
            className="py-2.5 px-5 rounded-2xl bg-[#FF3B30] hover:bg-[#D32F2F] active:scale-95 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>End Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
