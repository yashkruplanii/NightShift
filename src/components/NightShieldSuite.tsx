import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Eye, 
  PhoneCall, 
  Share2, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  Zap,
  BatteryCharging
} from 'lucide-react';
import { SafeHaven } from '../data/nagpur_ground_truth';

interface NightShieldSuiteProps {
  isRadarActive?: boolean;
  onToggleRadar?: () => void;
  nearestHaven: SafeHaven | null;
  originCoords: [number, number];
  destName: string;
  onEmergencyEvacuate: (haven: SafeHaven) => void;
}

export const NightShieldSuite: React.FC<NightShieldSuiteProps> = ({
  isRadarActive,
  onToggleRadar,
  nearestHaven,
  originCoords,
  destName,
  onEmergencyEvacuate
}) => {
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [sirenOscillator, setSirenOscillator] = useState<any>(null);
  const [audioCtx, setAudioCtx] = useState<any>(null);

  // High decibel police alarm siren via Web Audio API
  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      setAudioCtx(ctx);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, ctx.currentTime);

      // Pitch sweep up and down like emergency vehicle siren
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(2.2, ctx.currentTime); // 2.2 Hz siren modulation
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(350, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setSirenOscillator({ osc, lfo, ctx, gain });
    } catch (e) {
      console.warn("Audio siren not supported:", e);
    }
  };

  const stopSiren = () => {
    if (sirenOscillator) {
      try {
        sirenOscillator.osc.stop();
        sirenOscillator.lfo.stop();
        sirenOscillator.ctx.close();
      } catch (e) {}
      setSirenOscillator(null);
    }
  };

  const handleTriggerSOS = () => {
    setIsSosActive(true);
    startSiren();

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([300, 150, 300, 150, 500]);
      } catch (e) {}
    }
  };

  const handleDismissSOS = () => {
    stopSiren();
    setIsSosActive(false);
  };

  useEffect(() => {
    return () => stopSiren();
  }, []);

  const whatsappSosLink = `https://wa.me/?text=${encodeURIComponent(
    `🚨 NIGHT EMERGENCY SOS ALERT!\nI am currently traveling late at night to ${destName}.\nMy live coordinates: https://maps.google.com/?q=${originCoords[0]},${originCoords[1]}\nNearest Safe Sanctuary: ${nearestHaven?.name || 'Apollo Medical Square'}.\nPlease check in on me immediately!`
  )}`;

  return (
    <>


      {/* FULL-SCREEN POLICE STROBE & SOS EMERGENCY RESCUE MODAL */}
      {isSosActive && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Pulsing Red & Blue Emergency Strobe Overlay */}
          <div className="absolute inset-0 animate-police-strobe pointer-events-none" />

          {/* Rescue Action Card */}
          <div className="relative z-10 w-full max-w-md p-6 rounded-3xl bg-zinc-950/95 border-2 border-red-500 text-white shadow-[0_0_80px_rgba(255,0,0,0.8)] backdrop-blur-3xl animate-scaleUp">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center animate-bounce">
                <ShieldAlert className="w-9 h-9 text-red-500" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                Emergency Panic Mode
              </h2>
              <p className="text-xs text-red-300 mt-1">
                Audible alarm sounding • Location telemetry locked
              </p>
            </div>

            {/* Quick Rescue Actions */}
            <div className="space-y-3 mb-5">
              {/* 1. Direct Call 112 */}
              <a
                href="tel:112"
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-98 font-black text-sm flex items-center justify-center gap-2 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-all cursor-pointer"
              >
                <PhoneCall className="w-5 h-5" />
                <span>DIAL POLICE (112) NOW</span>
              </a>

              {/* 2. WhatsApp Live SOS */}
              <a
                href={whatsappSosLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] active:scale-98 font-bold text-sm flex items-center justify-center gap-2 text-white shadow-lg transition-all cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
                <span>Send WhatsApp SOS + Live GPS</span>
              </a>

              {/* 3. Evacuate to Safe Sanctuary */}
              {nearestHaven && (
                <button
                  onClick={() => {
                    onEmergencyEvacuate(nearestHaven);
                    handleDismissSOS();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 font-bold text-sm flex items-center justify-center gap-2 text-white shadow-lg transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Evacuate to {nearestHaven.name.split(' (')[0]}</span>
                </button>
              )}
            </div>

            {/* Dismiss Safe Button */}
            <button
              onClick={handleDismissSOS}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/80 transition-all cursor-pointer"
            >
              I am Safe · Dismiss Emergency Alarm
            </button>
          </div>
        </div>
      )}
    </>
  );
};
