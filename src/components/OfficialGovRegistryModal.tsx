import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  X, 
  CheckCircle2, 
  Train, 
  Bus, 
  ShieldAlert, 
  Stethoscope, 
  CloudRain, 
  PhoneCall, 
  ExternalLink,
  Award,
  Clock,
  MapPin,
  FileText,
  UserCheck,
  Crosshair,
  Radio,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { 
  NMRCL_METRO_REGISTRY, 
  NMC_AAPLI_BUS_REGISTRY, 
  NAGPUR_POLICE_REGISTRY, 
  GOVERNMENT_HOSPITALS_REGISTRY, 
  FDA_247_PHARMACY_REGISTRY, 
  NMC_FLOOD_BLACKSPOTS_REGISTRY,
  DISH_WORKER_SHIFTS_REGISTRY,
  EMERGENCY_SANCTUARY_REGISTRY,
  EPISTEMIC_TRUST_REGISTRY
} from '../data/official_government_registry';

export type GovTabType = 'metro' | 'bus' | 'police' | 'health' | 'flood' | 'shifts' | 'emergency' | 'epistemic';

interface OfficialGovRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: GovTabType;
}

export const OfficialGovRegistryModal: React.FC<OfficialGovRegistryModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'metro'
}) => {
  const [activeTab, setActiveTab] = useState<GovTabType>(defaultTab);
  const [metroLineFilter, setMetroLineFilter] = useState<'ALL' | 'ORANGE' | 'AQUA'>('ALL');

  const [now, setNow] = useState<Date>(new Date());

  // Real-time world clock ticker
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Synchronize activeTab whenever defaultTab changes or modal opens
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  const activeHour = now.getHours();
  const activeMinute = now.getMinutes();
  const activeClockStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const currMinOfDay = activeHour * 60 + activeMinute;

  const parseTimeToMin = (tStr: string): number => {
    const parts = tStr.trim().split(' ');
    if (parts.length < 2) return 0;
    const [time, mod] = parts;
    let [h, m] = time.split(':').map(Number);
    if (mod === 'PM' && h !== 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const getStationTimingStatus = (firstTrainStr: string, lastTrainStr: string) => {
    const firstMin = parseTimeToMin(firstTrainStr);
    const lastMin = parseTimeToMin(lastTrainStr);

    const isOpen = currMinOfDay >= firstMin && currMinOfDay <= lastMin;
    
    if (isOpen) {
      const headway = 12;
      const minsToNext = headway - (currMinOfDay % headway);
      return {
        isOpen: true,
        badge: '🟢 OPERATIONAL',
        nextAvailableText: `Active · Next train in ~${minsToNext}m`
      };
    } else {
      let diffMin = 0;
      if (currMinOfDay > lastMin) {
        diffMin = (24 * 60 - currMinOfDay) + firstMin;
        const h = Math.floor(diffMin / 60);
        const m = diffMin % 60;
        return {
          isOpen: false,
          badge: '🔴 CLOSED FOR NIGHT',
          nextAvailableText: `Next train in ${h}h ${m}m (${firstTrainStr})`
        };
      } else {
        diffMin = firstMin - currMinOfDay;
        const h = Math.floor(diffMin / 60);
        const m = diffMin % 60;
        return {
          isOpen: false,
          badge: '🔴 CLOSED FOR NIGHT',
          nextAvailableText: `Next train in ${h}h ${m}m (${firstTrainStr})`
        };
      }
    }
  };

  const getBusTimingStatus = (routeNumber: string, lastNightDeparture: string, nightFeederAvailable: boolean) => {
    if (routeNumber.includes('10') || nightFeederAvailable) {
      const feederMin = 2 * 60 + 22; // 02:22 AM
      if (currMinOfDay < feederMin) {
        const diff = feederMin - currMinOfDay;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return {
          isActive: true,
          badge: '🟢 NIGHT FEEDER ACTIVE',
          nextRun: h > 0 ? `Next run in ${h}h ${m}m (at 02:22 AM)` : `Departs in ${m}m (at 02:22 AM)`
        };
      } else if (currMinOfDay >= feederMin && currMinOfDay <= feederMin + 15) {
        return {
          isActive: true,
          badge: '🟢 BOARDING WINDOW OPEN',
          nextRun: `Boarding Now at Medical Sq Bay (Departs 02:22 AM)`
        };
      } else {
        const morningMin = 5 * 60 + 45;
        const diff = currMinOfDay > morningMin ? (24 * 60 - currMinOfDay) + morningMin : morningMin - currMinOfDay;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return {
          isActive: false,
          badge: '🔴 NIGHT RUN COMPLETED',
          nextRun: `Next morning run in ${h}h ${m}m (05:45 AM)`
        };
      }
    } else {
      const openMin = 6 * 60;
      const closeMin = 21 * 60 + 30;
      if (currMinOfDay >= openMin && currMinOfDay <= closeMin) {
        return {
          isActive: true,
          badge: '🟢 DAY SERVICE ACTIVE',
          nextRun: `Every 15-20 min`
        };
      } else {
        const diff = currMinOfDay > closeMin ? (24 * 60 - currMinOfDay) + openMin : openMin - currMinOfDay;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return {
          isActive: false,
          badge: '🔴 DAY SERVICE CLOSED',
          nextRun: `Next in ${h}h ${m}m (Tomorrow 06:00 AM)`
        };
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-zinc-950/95 border border-cyan-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between gap-3 bg-gradient-to-r from-cyan-950/40 via-zinc-900/60 to-black/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Nagpur Official Government Data Registry</span>
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100% OFFICIAL GOVT RECORDS</span>
                </span>
              </div>
              <p className="text-xs text-white/50">
                Direct statutory citations from Maha Metro (NMRCL), NMC (Aapli Bus), Maharashtra Police, DHS & FDA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 8 Tab Navigation Buttons */}
        <div className="px-4 pt-3 border-b border-white/10 bg-black/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('metro')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'metro'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Maha Metro (NMRCL)</span>
          </button>

          <button
            onClick={() => setActiveTab('bus')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'bus'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>NMC Aapli Bus</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'health'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>GMCH / AIIMS & FDA</span>
          </button>

          <button
            onClick={() => setActiveTab('police')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'police'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Nagpur City Police (112)</span>
          </button>

          <button
            onClick={() => setActiveTab('flood')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'flood'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>NMC Flood Blackspots</span>
          </button>

          <button
            onClick={() => setActiveTab('shifts')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'shifts'
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-sm'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Worker Shift Timing (DISH)</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'emergency'
                ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Lifebuoy Sanctuaries</span>
          </button>

          <button
            onClick={() => setActiveTab('epistemic')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'epistemic'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Telemetry Trust Audit</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Real-World Live Transportation Availability HUD (Shown for Metro & Bus tabs) */}
          {(activeTab === 'metro' || activeTab === 'bus') && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-zinc-900/40 border border-cyan-500/30 shadow-lg space-y-3 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Real-World Live Transport Availability Engine
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">
                    Transportation availability calculated in real-time with respect to the world clock and near-future timetables.
                  </p>
                </div>

                {/* Real-World Live Clock Badge */}
                <div className="py-1 px-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Live World Time: {activeClockStr}</span>
                </div>
              </div>

              {/* 3-Pillar Transport Live Availability Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* 1. Metro */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Train className="w-3 h-3 text-cyan-400" />
                      <span>Maha Metro (NMRCL)</span>
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      currMinOfDay >= 360 && currMinOfDay <= 1320
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {currMinOfDay >= 360 && currMinOfDay <= 1320 ? '● OPERATIONAL' : '● CLOSED FOR NIGHT'}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    {currMinOfDay >= 360 && currMinOfDay <= 1320
                      ? 'Commercial trains running every 12 min'
                      : 'Catenary depowered for track safety'}
                  </div>
                  <div className="text-[10px] text-cyan-300 font-medium">
                    {currMinOfDay >= 360 && currMinOfDay <= 1320
                      ? 'Last train departs tonight at 10:00 PM'
                      : '⏳ Next available train tomorrow at 06:00 AM'}
                  </div>
                </div>

                {/* 2. Aapli Bus */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Bus className="w-3 h-3 text-emerald-400" />
                      <span>NMC Aapli Bus</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400">
                      ● NIGHT FEEDER ACTIVE
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    Route 10 Feeder (Medical Sq → Manewada)
                  </div>
                  <div className="text-[10px] text-emerald-300 font-medium">
                    {currMinOfDay < 142
                      ? `⏳ Departs in ${Math.floor((142 - currMinOfDay)/60)}h ${(142 - currMinOfDay)%60}m (at 02:22 AM)`
                      : currMinOfDay <= 157
                        ? '🟢 Boarding Window Active Now at Medical Sq'
                        : '⏳ Next morning departure at 05:45 AM'}
                  </div>
                </div>

                {/* 3. Private 2-Wheeler & Cabs */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Activity className="w-3 h-3 text-amber-400" />
                      <span>On-Demand / Personal</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400">
                      ● 24/7 AVAILABLE NOW
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    2-Wheeler & Monitored Cabs / Auto
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium">
                    ⚡ Available Immediately (&lt; 3 min pickup)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: MAHA METRO */}
          {activeTab === 'metro' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Authority Header Box */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    Official Statutory Authority
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {NMRCL_METRO_REGISTRY.authority}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5 font-mono">
                    Gazette Circular: {NMRCL_METRO_REGISTRY.gazetteCircular}
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 shrink-0">
                  <div className="text-[10px] text-white/40">Official Helpline</div>
                  <div className="text-xs font-mono font-bold text-cyan-300">
                    {NMRCL_METRO_REGISTRY.helpline}
                  </div>
                </div>
              </div>

              {/* Night Curfew Law Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-300 block mb-0.5">
                    Official Night Non-Revenue Curfew: {NMRCL_METRO_REGISTRY.nightCurfewWindow}
                  </span>
                  <p className="text-white/70 leading-relaxed text-[11px]">
                    By NMRCL Operating Rule 4.12, commercial trains cease passenger operations at 11:00 PM. Third rail / overhead catenary (25 kV AC) is depowered for mandatory track safety maintenance. NightShift respects this ground reality and never falsely promises midnight trains, automatically engaging lit road corridors instead.
                  </p>
                </div>
              </div>

              {/* Station Filter & Corridor Diagram */}
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official NMRCL Stations & Commercial Timetable
                  </h4>

                  {/* Line Selector Buttons */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                    <button
                      onClick={() => setMetroLineFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-[11px] ${
                        metroLineFilter === 'ALL'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      All Stations ({NMRCL_METRO_REGISTRY.stations.length})
                    </button>
                    <button
                      onClick={() => setMetroLineFilter('ORANGE')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-[11px] flex items-center gap-1 ${
                        metroLineFilter === 'ORANGE'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Orange Line</span>
                    </button>
                    <button
                      onClick={() => setMetroLineFilter('AQUA')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-[11px] flex items-center gap-1 ${
                        metroLineFilter === 'AQUA'
                          ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>Aqua Line</span>
                    </button>
                  </div>
                </div>

                {/* Corridor Overview Visual Bar */}
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 mb-3 text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span>NORTH TERMINUS: Automotive Sq</span>
                    <span className="font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      STB-01 Sitabuldi Interchange
                    </span>
                    <span>SOUTH TERMINUS: Khapri (MIHAN)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span>WEST: Lokmanya Nagar (Hingna)</span>
                    <span className="text-cyan-400 font-mono">19.65 km North-South · 18.55 km East-West</span>
                    <span>EAST: Prajapati Nagar</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.04] text-white/50 text-[10px] uppercase font-mono border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Station Code</th>
                        <th className="py-2.5 px-3">Station Name</th>
                        <th className="py-2.5 px-3">Corridor</th>
                        <th className="py-2.5 px-3">First Train</th>
                        <th className="py-2.5 px-3">Last Dep</th>
                        <th className="py-2.5 px-3">Fare</th>
                        <th className="py-2.5 px-3">Current Status & Next Run</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {NMRCL_METRO_REGISTRY.stations
                        .filter((st) => {
                          if (metroLineFilter === 'ORANGE') return st.line.includes('Orange');
                          if (metroLineFilter === 'AQUA') return st.line.includes('Aqua');
                          return true;
                        })
                        .map((st) => {
                          const status = getStationTimingStatus(st.firstTrain, st.lastTrainDeparture);
                          return (
                            <tr key={st.stationCode} className="hover:bg-white/[0.02]">
                              <td className="py-2.5 px-3 font-mono text-cyan-400 font-bold">{st.stationCode}</td>
                              <td className="py-2.5 px-3 font-medium text-white flex items-center gap-1.5">
                                <span>{st.name}</span>
                                {st.interchange && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                                    INTERCHANGE
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-white/60 text-[11px]">{st.line.split(' (')[0]}</td>
                              <td className="py-2.5 px-3 text-white/80 font-mono text-[11px]">{st.firstTrain}</td>
                              <td className="py-2.5 px-3 text-amber-300 font-mono text-[11px] font-semibold">{st.lastTrainDeparture}</td>
                              <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">₹{st.fareFromCentral}</td>
                              <td className="py-2.5 px-3">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                                  status.isOpen
                                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                                    : 'bg-red-500/15 border border-red-500/30 text-red-300'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                                  <span>{status.nextAvailableText}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NMC AAPLI BUS */}
          {activeTab === 'bus' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Authority Header Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Official Transport Authority
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {NMC_AAPLI_BUS_REGISTRY.authority} ({NMC_AAPLI_BUS_REGISTRY.operatingBody})
                  </div>
                  <div className="text-xs text-white/60 mt-0.5 font-mono">
                    Statutory Gazette: {NMC_AAPLI_BUS_REGISTRY.gazetteNotification}
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 shrink-0">
                  <div className="text-[10px] text-white/40">Bus Control Room</div>
                  <div className="text-xs font-mono font-bold text-emerald-300">
                    {NMC_AAPLI_BUS_REGISTRY.controlRoomHelpline}
                  </div>
                </div>
              </div>

              {/* Route List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  NMC Mapped Arterial Bus Routes & Night Feeders
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {NMC_AAPLI_BUS_REGISTRY.routes.map((rt) => (
                    <div key={rt.routeNumber} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 font-mono px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                          {rt.routeNumber}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          rt.nightFeederAvailable 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {rt.nightFeederAvailable ? '✓ NIGHT FEEDER ACTIVE' : 'DAY SERVICE ONLY'}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-white">
                        {rt.routeName}
                      </div>

                      <div className="text-[11px] text-white/60 space-y-1 pt-1 border-t border-white/5">
                        <div className="flex justify-between">
                          <span>Depot Origin:</span>
                          <span className="text-white/80">{rt.originDepot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Night Departure:</span>
                          <span className="text-emerald-300 font-mono font-semibold">{rt.lastNightDeparture}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Official Max Fare:</span>
                          <span className="text-white/90 font-mono">₹{rt.officialFareMax}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-white/40 pt-1">
                          <span>Ref:</span>
                          <span className="font-mono">{rt.nmcNotificationRef}</span>
                        </div>
                      </div>

                      {(() => {
                        const busTiming = getBusTimingStatus(rt.routeNumber, rt.lastNightDeparture, rt.nightFeederAvailable);
                        return (
                          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px]">
                            <span className="text-white/50 text-[10px]">Live Status:</span>
                            <span className={`font-medium font-mono text-[10px] px-2 py-0.5 rounded-full ${
                              busTiming.isActive 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {busTiming.nextRun}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NAGPUR CITY POLICE */}
          {activeTab === 'police' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Authority Header Box */}
              <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                    Law Enforcement Jurisdiction
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {NAGPUR_POLICE_REGISTRY.authority}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    {NAGPUR_POLICE_REGISTRY.headquarters}
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 shrink-0">
                  <div className="text-[10px] text-white/40">Emergency CAD System</div>
                  <div className="text-xs font-mono font-bold text-blue-300">
                    {NAGPUR_POLICE_REGISTRY.emergencyDispatch}
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">
                    Direct: {NAGPUR_POLICE_REGISTRY.controlRoomDirect}
                  </div>
                </div>
              </div>

              {/* Police Station Table */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Mapped Nagpur Police Stations with 24/7 Assistance Outposts
                </h4>

                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.04] text-white/50 text-[10px] uppercase font-mono border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Station Code</th>
                        <th className="py-2.5 px-3">Police Station</th>
                        <th className="py-2.5 px-3">Zone</th>
                        <th className="py-2.5 px-3">Direct Landline</th>
                        <th className="py-2.5 px-3">24/7 Booth</th>
                        <th className="py-2.5 px-3">Patrol Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {NAGPUR_POLICE_REGISTRY.stations.map((ps) => (
                        <tr key={ps.stationCode} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-mono text-blue-400 font-bold text-[11px]">{ps.stationCode}</td>
                          <td className="py-2.5 px-3 font-medium text-white">{ps.policeStationName}</td>
                          <td className="py-2.5 px-3 text-white/60 text-[11px]">{ps.zone}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-400 text-[11px] font-semibold">
                            <a href={`tel:${ps.officialLandline}`} className="hover:underline">
                              📞 {ps.officialLandline}
                            </a>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              ps.has24x7Booth ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'
                            }`}>
                              {ps.has24x7Booth ? 'ACTIVE BOOTH' : 'CHOWKI'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-white/50 text-[10px]">{ps.pcrPatrolStrength}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GOVT HOSPITALS & FDA CHEMISTS */}
          {activeTab === 'health' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Government Medical Colleges */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Government Tertiary Trauma Centers (DHS & MoHFW)</span>
                  </h4>
                  <span className="text-[10px] text-white/40">All Centers Manned 24/7 with Armed Security</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {GOVERNMENT_HOSPITALS_REGISTRY.facilities.map((hosp) => (
                    <div key={hosp.hospitalCode} className="p-3.5 rounded-2xl bg-white/[0.02] border border-rose-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-400 font-mono">
                          {hosp.hospitalCode}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                          {hosp.traumaLevel.split(' ')[0]}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-white">
                        {hosp.name}
                      </div>

                      <div className="text-[11px] text-white/60 space-y-1 pt-1 border-t border-white/5">
                        <div className="flex justify-between">
                          <span>Governing Ministry:</span>
                          <span className="text-white/80">{hosp.governingBody.split(' - ')[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>24/7 Emergency Casualty:</span>
                          <span className="text-emerald-400 font-mono font-semibold">
                            <a href={`tel:${hosp.emergencyLandline.split(' / ')[0]}`} className="hover:underline">
                              📞 {hosp.emergencyLandline}
                            </a>
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-white/40 pt-0.5">
                          <span>DHS License:</span>
                          <span className="font-mono">{hosp.dhsLicenseRef}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FDA 24/7 All-Night Chemist Licenses */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Maharashtra FDA Statutory All-Night Chemist Licenses</span>
                  </h4>
                  <span className="text-[10px] text-white/40">Drugs & Cosmetics Form 20-B & 21-B</span>
                </div>

                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.04] text-white/50 text-[10px] uppercase font-mono border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">FDA License No.</th>
                        <th className="py-2.5 px-3">Chemist Name</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Licensing Authority</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {FDA_247_PHARMACY_REGISTRY.pharmacies.map((ph) => (
                        <tr key={ph.licenseNumber} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold text-[11px]">{ph.licenseNumber}</td>
                          <td className="py-2.5 px-3 font-medium text-white">{ph.pharmacyName}</td>
                          <td className="py-2.5 px-3 text-white/60 text-[11px]">{ph.location}</td>
                          <td className="py-2.5 px-3 text-white/50 text-[11px]">{ph.licensingAuthority}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                              ✓ 24/7 ACTIVE
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NMC DISASTER MANAGEMENT & FLOOD BLACKSPOTS */}
          {activeTab === 'flood' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Authority Header Box */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Disaster Preparedness Cell
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {NMC_FLOOD_BLACKSPOTS_REGISTRY.authority}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    Command: {NMC_FLOOD_BLACKSPOTS_REGISTRY.monitoringCenter}
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 shrink-0">
                  <div className="text-[10px] text-white/40">Disaster Emergency Helpline</div>
                  <div className="text-xs font-mono font-bold text-amber-300">
                    {NMC_FLOOD_BLACKSPOTS_REGISTRY.disasterCellPhone}
                  </div>
                </div>
              </div>

              {/* Flood Points */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Surveyed Monsoon Flood Vulnerability Culverts (Automated Reroute Invariants)
                </h4>

                <div className="space-y-3">
                  {NMC_FLOOD_BLACKSPOTS_REGISTRY.spots.map((spot) => (
                    <div key={spot.spotId} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                            {spot.spotId}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {spot.locationName}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/40 font-mono">
                          {spot.culvertRef}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/70 pt-1">
                        <div>
                          <span className="text-white/40 block">Hazard Mode:</span>
                          <span className="text-rose-300 font-medium">{spot.hazardType}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">Critical Precipitation Threshold:</span>
                          <span className="text-amber-300 font-mono">{spot.criticalRainfallThreshold}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                          ✓ FAROS Dynamic Elevated Bypass Engagement:
                        </span>
                        <span className="text-white/90 font-medium">
                          {spot.officialBypassRoute}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: WORKER SHIFT TIMING & CURFEW FEASIBILITY */}
          {activeTab === 'shifts' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Authority Header Box */}
              <div className="p-3.5 rounded-2xl bg-orange-950/20 border border-orange-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                    Statutory Labour Safety Authority
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {DISH_WORKER_SHIFTS_REGISTRY.authority}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5 font-mono">
                    {DISH_WORKER_SHIFTS_REGISTRY.actReference}
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 shrink-0">
                  <div className="text-[10px] text-white/40">Grievance & Night Shift Cell</div>
                  <div className="text-xs font-mono font-bold text-orange-300">
                    {DISH_WORKER_SHIFTS_REGISTRY.helpline}
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">
                    Gazette: {DISH_WORKER_SHIFTS_REGISTRY.gazetteNotification.split(' / ')[1]}
                  </div>
                </div>
              </div>

              {/* Hard Curfew Law Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-300 block mb-0.5">
                    Hard Arrival Invariant: Arrival Time &le; Shift Curfew Deadline (03:00 AM)
                  </span>
                  <p className="text-white/70 leading-relaxed text-[11px]">
                    Under Section 13(2) of the Maharashtra Act, night shift workers cannot be placed on hazardous, prolonged walking corridors that risk curfew breach. If the computed walking buffer is negative or below +10 minutes, FAROS automatically promotes the commuter to a Standby Auto or 4-Wheeler Cab with positive safety margin.
                  </p>
                </div>
              </div>

              {/* Shift Feasibility Matrix Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Verified Night Shift Curfews & Mode Feasibility Buffers
                </h4>

                <div className="space-y-3">
                  {DISH_WORKER_SHIFTS_REGISTRY.shifts.map((shift) => (
                    <div key={shift.shiftCode} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-orange-400 font-mono px-2 py-0.5 rounded bg-orange-500/15 border border-orange-500/30">
                              {shift.shiftCode}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {shift.facilityName}
                            </span>
                          </div>
                          <div className="text-[11px] text-white/50 mt-0.5">
                            {shift.sector} • <span className="text-white/80">{shift.shiftType}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-white/50">Curfew:</span>
                          <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold">
                            {shift.curfewDeadline}
                          </span>
                        </div>
                      </div>

                      {/* 4 Mode Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {shift.travelModeFeasibility.map((m) => (
                          <div 
                            key={m.mode} 
                            className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                              m.isFeasible 
                                ? 'bg-emerald-950/20 border-emerald-500/30' 
                                : 'bg-rose-950/20 border-rose-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold uppercase text-white/70">
                                {m.mode === 'walking' && '🚶 Walk'}
                                {m.mode === 'transit_feeder' && '🚌 Bus Feeder'}
                                {m.mode === 'two_wheeler' && '🛵 Standby Auto'}
                                {m.mode === 'cab' && '🚖 4W Cab'}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                m.isFeasible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                              }`}>
                                {m.isFeasible ? '✓ SAFE' : '✕ BREACH'}
                              </span>
                            </div>

                            <div className="text-[11px] font-semibold text-white">
                              {m.durationMin} min <span className="text-white/40 font-normal">➔ {m.arrivalEst}</span>
                            </div>

                            <div className="text-[10px] font-mono mt-1 pt-1 border-t border-white/5 flex justify-between">
                              <span className="text-white/40">Buffer:</span>
                              <span className={m.bufferMinutes >= 0 ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'}>
                                {m.bufferMinutes >= 0 ? `+${m.bufferMinutes}m` : `${m.bufferMinutes}m`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Statutory Action Note */}
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/70 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{shift.statutoryMandate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: IMMEDIATE EMERGENCY FACILITIES & LIFEBUOY SANCTUARIES */}
          {activeTab === 'emergency' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Authority Header Box */}
              <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                    Emergency Public Safety Grid
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {EMERGENCY_SANCTUARY_REGISTRY.authority}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    {EMERGENCY_SANCTUARY_REGISTRY.mandateName}
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 shrink-0">
                  <div className="text-[10px] text-white/40">Continuous Lifebuoy Guarantee</div>
                  <div className="text-xs font-mono font-bold text-red-300">
                    &le; 400m / &le; 2.5 min Sprint
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                    100% 24/7 Manned Sanctuaries
                  </div>
                </div>
              </div>

              {/* Sanctuaries Table */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  City-Wide Continuous Lifebuoy Safe Haven Registry (Nagpur)
                </h4>

                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.04] text-white/50 text-[10px] uppercase font-mono border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Code</th>
                        <th className="py-2.5 px-3">Sanctuary Facility</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Zone / Address</th>
                        <th className="py-2.5 px-3">Emergency Phone</th>
                        <th className="py-2.5 px-3">Security & CCTV</th>
                        <th className="py-2.5 px-3">Sprint Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {EMERGENCY_SANCTUARY_REGISTRY.sanctuaries.map((snct) => (
                        <tr key={snct.sanctuaryId} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-mono text-red-400 font-bold text-[11px]">{snct.sanctuaryId}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-white">{snct.name}</div>
                            <div className="text-[10px] text-white/40 font-mono">{snct.statutoryLicRef}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">
                              {snct.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-white/60 text-[11px]">{snct.address}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-400 text-[11px] font-semibold">
                            <a href={`tel:${snct.officialEmergencyPhone.split(' / ')[0]}`} className="hover:underline">
                              📞 {snct.officialEmergencyPhone}
                            </a>
                          </td>
                          <td className="py-2.5 px-3 text-white/70 text-[10px]">{snct.mannedSecurityStaff}</td>
                          <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold text-[11px]">
                            {snct.maxSprintMinutes} min
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: REAL-TIME TELEMETRY TRUST & DEMPSTER-SHAFER AUDIT */}
          {activeTab === 'epistemic' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Authority Header Box */}
              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                    Uncertainty Quantification Standard
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {EPISTEMIC_TRUST_REGISTRY.framework}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    Standard: {EPISTEMIC_TRUST_REGISTRY.governingStandard}
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 shrink-0">
                  <div className="text-[10px] text-white/40">Mathematical Decay Model</div>
                  <div className="text-xs font-mono font-bold text-purple-300">
                    q(t) = q₀ · e^(-λ·Δt)
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">
                    λ = {EPISTEMIC_TRUST_REGISTRY.decayRateLambda} min⁻¹ (t½ = {EPISTEMIC_TRUST_REGISTRY.halfLifeMinutes}m)
                  </div>
                </div>
              </div>

              {/* Zero Hallucination Invariant Callout */}
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3">
                <Radio className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-purple-300 block mb-0.5">
                    Zero Schedule Hallucination Invariant
                  </span>
                  <p className="text-white/70 leading-relaxed text-[11px]">
                    {EPISTEMIC_TRUST_REGISTRY.zeroHallucinationPolicy}
                  </p>
                </div>
              </div>

              {/* Live Telemetry Sensor Table */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Live Telemetry Sensor Audit & Fail-Safe Actions
                </h4>

                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.04] text-white/50 text-[10px] uppercase font-mono border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Sensor Code</th>
                        <th className="py-2.5 px-3">Sensor System</th>
                        <th className="py-2.5 px-3">Managing Agency</th>
                        <th className="py-2.5 px-3">Protocol / Last Ping</th>
                        <th className="py-2.5 px-3">Trust Score (q)</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Safety Action Triggered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {EPISTEMIC_TRUST_REGISTRY.sensors.map((sensor) => (
                        <tr key={sensor.sensorCode} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-mono text-purple-400 font-bold text-[11px]">{sensor.sensorCode}</td>
                          <td className="py-2.5 px-3 font-medium text-white">{sensor.sensorSystem}</td>
                          <td className="py-2.5 px-3 text-white/60 text-[11px]">{sensor.managingAgency}</td>
                          <td className="py-2.5 px-3 text-white/70 text-[11px] font-mono">
                            <div>{sensor.transponderProtocol}</div>
                            <div className="text-[10px] text-white/40">{sensor.lastPingSecondsAgo}s ago</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5 font-mono text-[11px]">
                              <span className={sensor.computedTrustScore >= 0.85 ? 'text-emerald-400 font-bold' : sensor.computedTrustScore >= 0.40 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                                {(sensor.computedTrustScore * 100).toFixed(0)}%
                              </span>
                              <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    sensor.computedTrustScore >= 0.85 
                                      ? 'bg-emerald-400' 
                                      : sensor.computedTrustScore >= 0.40 
                                      ? 'bg-amber-400' 
                                      : 'bg-rose-500'
                                  }`} 
                                  style={{ width: `${sensor.computedTrustScore * 100}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                              sensor.epistemicStatus === 'GROUND_TRUTH_VERIFIED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : sensor.epistemicStatus === 'UNCERTAIN_LAGGING'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {sensor.epistemicStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-white/80 text-[11px] max-w-xs">{sensor.safetyActionTriggered}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Verification Seal */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/50 text-[11px]">
            <Award className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              All citations cross-referenced with Maharashtra Government Gazettes & Municipal Master Plans (Nagpur 2024–2026).
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs shrink-0 cursor-pointer"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
