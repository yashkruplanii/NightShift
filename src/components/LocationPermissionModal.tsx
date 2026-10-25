import React from 'react';
import { Navigation2, ShieldCheck, X } from 'lucide-react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onRequestPermission: () => void;
  onDismiss: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onRequestPermission,
  onDismiss
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl ios-glass-card p-6 shadow-2xl border border-white/20 text-center relative">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Official Logo */}
        <div className="w-20 h-20 mx-auto mb-4 p-1 rounded-3xl bg-gradient-to-tr from-amber-500/30 to-blue-500/30 border border-amber-500/40 shadow-[0_8px_32px_rgba(245,158,11,0.25)] flex items-center justify-center">
          <img 
            src="/nightshift_logo.png" 
            alt="NightShift Logo" 
            className="w-full h-full object-cover rounded-2xl" 
          />
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight mb-2">
          Enable Live Location Access
        </h3>
        <p className="text-xs text-white/70 leading-relaxed mb-6 px-2">
          NightShift uses your exact real-time location to find brightly lit streets, active public transit, and 24/7 verified emergency sanctuaries near you.
        </p>

        {/* Direct Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onRequestPermission}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#007AFF] hover:bg-[#0066D6] active:scale-[0.98] text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Navigation2 className="w-4 h-4 fill-current" />
            <span>Allow Location Access (Enable GPS)</span>
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            I'll Search My Location Manually
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-center gap-1.5 text-[11px] text-white/40">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
          <span>100% Private · Coordinates never leave your browser</span>
        </div>
      </div>
    </div>
  );
};
