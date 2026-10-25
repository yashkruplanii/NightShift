import React from 'react';
import { 
  ShieldCheck, 
  X, 
  MapPin, 
  PhoneCall, 
  Footprints, 
  Sun, 
  Users,
  Clock
} from 'lucide-react';
import { SafeHaven } from '../data/nagpur_ground_truth';

interface EvidenceInspectorDrawerProps {
  haven: SafeHaven | null;
  onClose: () => void;
  onGuideToHaven?: (haven: SafeHaven) => void;
  currentClockMinutes?: number;
  isNetworkSevered?: boolean;
}

export const EvidenceInspectorDrawer: React.FC<EvidenceInspectorDrawerProps> = ({
  haven,
  onClose,
  onGuideToHaven
}) => {
  if (!haven) return null;

  return (
    <div className="ios-glass-card rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-emerald-500/30 relative transition-all duration-300 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08] mb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(52,199,89,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-ping" />
              <span>24/7 Verified Safe Sanctuary</span>
            </span>
            <span className="text-[10px] font-medium text-white/40">Nagpur Ground Truth</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>{haven.name}</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#007AFF] shrink-0" />
            <span className="truncate">{haven.address}</span>
          </p>
        </div>

        <button 
          onClick={onClose}
          aria-label="Close"
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Physical Security Badges */}
      <div className="grid grid-cols-3 gap-2 mb-3.5">
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="flex items-center justify-center text-[#34C759] mb-1">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="text-[11px] font-bold text-white">Manned 24/7</div>
          <span className="text-[9px] text-white/40">Active Staff</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="flex items-center justify-center text-[#FF9500] mb-1">
            <Sun className="w-3.5 h-3.5" />
          </div>
          <div className="text-[11px] font-bold text-white">High Lux</div>
          <span className="text-[9px] text-white/40">CCTV & Canopy</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="flex items-center justify-center text-[#007AFF] mb-1">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-[11px] font-bold text-white">Zero Wait</div>
          <span className="text-[9px] text-white/40">Standby Auto</span>
        </div>
      </div>

      {/* Why this place protects you */}
      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-3">
        <span className="text-[10px] text-white/40 block font-semibold mb-1 uppercase tracking-wider">
          How This Sanctuary Protects You
        </span>
        <p className="text-xs text-white/80 leading-relaxed">
          {haven.simpleExplanation}
        </p>
      </div>

      {/* Official Government Provenance & Registry Verification */}
      {haven.governmentLicenseRef && (
        <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/25 mb-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏛️ Official Government Provenance</span>
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              100% VERIFIED
            </span>
          </div>

          <div className="text-[11px] text-white/85 flex items-center justify-between">
            <span className="text-white/50">Registry ID:</span>
            <span className="font-mono font-bold text-cyan-300">{haven.governmentLicenseRef}</span>
          </div>

          {haven.officialDepartment && (
            <div className="text-[10px] text-white/70 flex items-center justify-between">
              <span className="text-white/50">Authority:</span>
              <span className="truncate max-w-[210px] text-right font-medium">{haven.officialDepartment}</span>
            </div>
          )}

          {haven.officialEmergencyPhone && (
            <div className="text-[10px] text-white/70 flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-white/50">Direct Line:</span>
              <a 
                href={`tel:${haven.officialEmergencyPhone.split(' ')[0]}`}
                className="font-mono text-emerald-400 hover:underline font-semibold"
              >
                📞 {haven.officialEmergencyPhone}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons: Route Inside or Call */}
      <div className="flex items-center gap-2 pt-1">
        {onGuideToHaven && (
          <button
            onClick={() => onGuideToHaven(haven)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#34C759] hover:bg-[#2EB84E] active:scale-95 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(52,199,89,0.35)] transition-all cursor-pointer"
          >
            <Footprints className="w-4 h-4" />
            <span>Guide Me to Sanctuary</span>
          </button>
        )}

        <a
          href="tel:112"
          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Call 112 Help</span>
        </a>
      </div>
    </div>
  );
};
