import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Search, 
  Bell, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  Maximize2, 
  Calendar, 
  Filter, 
  Shield, 
  Zap, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation2, 
  Compass, 
  Bike, 
  Car, 
  Bus, 
  Train, 
  Footprints,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Building2,
  Activity,
  ArrowRight
} from 'lucide-react';
import { RoutePlan, TravelMode, FAROSDecisionOutput } from '../engine/faros_router';
import { SafeHaven } from '../data/nagpur_ground_truth';
import { MapView } from './MapView';

interface TranscopeFleetDashboardProps {
  originName: string;
  originCoords: [number, number];
  destName: string;
  destCoords: [number, number];
  travelMode: TravelMode;
  onSelectTravelMode: (mode: TravelMode) => void;
  farosResult: FAROSDecisionOutput;
  selectedPlanId: string;
  onSelectPlanId: (id: string) => void;
  selectedHaven: SafeHaven | null;
  onSelectHaven: (haven: SafeHaven | null) => void;
  isNavigating: boolean;
  onStartNavigation: () => void;
  onEndNavigation: () => void;
  isRadarActive: boolean;
  onToggleRadar: () => void;
  activeDepartureTimeStr: string;
  deadlineTimeStr: string;
  onOpenLocationSearch: () => void;
  onOpenGovRegistry: (tab?: string) => void;
  onOpenValidationModal: () => void;
  onTriggerGps: () => void;
  isDetectingGps: boolean;
  onReplaySplash: () => void;
}

export const TranscopeFleetDashboard: React.FC<TranscopeFleetDashboardProps> = ({
  originName,
  originCoords,
  destName,
  destCoords,
  travelMode,
  onSelectTravelMode,
  farosResult,
  selectedPlanId,
  onSelectPlanId,
  selectedHaven,
  onSelectHaven,
  isNavigating,
  onStartNavigation,
  onEndNavigation,
  isRadarActive,
  onToggleRadar,
  activeDepartureTimeStr,
  deadlineTimeStr,
  onOpenLocationSearch,
  onOpenGovRegistry,
  onOpenValidationModal,
  onTriggerGps,
  isDetectingGps,
  onReplaySplash
}) => {
  // Navigation tabs state
  const [activeNavTab, setActiveNavTab] = useState<'overview' | 'routes' | 'havens' | 'transit' | 'registry' | 'validation'>('overview');
  
  // Table category filter state
  const [tableFilter, setTableFilter] = useState<'all' | 'active' | 'standby' | 'havens' | 'transit'>('all');

  // Emergency Audio Siren state
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const sirenAudioRef = React.useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);

  const toggleEmergencySiren = () => {
    if (isSirenActive) {
      if (sirenAudioRef.current) {
        try {
          sirenAudioRef.current.osc.stop();
          sirenAudioRef.current.ctx.close();
        } catch (e) {}
        sirenAudioRef.current = null;
      }
      setIsSirenActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          
          // Modulated frequency siren 600Hz -> 1100Hz
          const now = ctx.currentTime;
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.linearRampToValueAtTime(1100, now + 0.4);
          osc.frequency.linearRampToValueAtTime(600, now + 0.8);
          osc.frequency.linearRampToValueAtTime(1100, now + 1.2);
          osc.frequency.linearRampToValueAtTime(600, now + 1.6);
          
          gain.gain.setValueAtTime(0.12, now);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          sirenAudioRef.current = { ctx, osc, gain };
          setIsSirenActive(true);
        }
      } catch (e) {
        setIsSirenActive(false);
      }
    }
  };

  const activePlan = 
    (farosResult.recommendedPlan?.id === selectedPlanId ? farosResult.recommendedPlan : null) ||
    (farosResult.backupPlan?.id === selectedPlanId ? farosResult.backupPlan : null) ||
    farosResult.recommendedPlan || 
    farosResult.backupPlan;

  // Segmented dashed bar generator helper
  const renderSegmentedBar = (filledCount: number, total: number = 10, activeColor: string = "bg-white") => {
    return (
      <div className="flex items-center gap-[3px] w-24 sm:w-28">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-[1.5px] transition-colors ${
              i < filledCount ? activeColor : "bg-white/10"
            }`}
          />
        ))}
      </div>
    );
  };

  // Dispatches / Orders Table items
  const tableItems = [
    {
      id: "#NS-45861",
      category: "primary",
      icon: <Bike className="w-3.5 h-3.5 text-emerald-400" />,
      name: "Primary Arterial Corridor",
      type: "Two-Wheeler (Direct)",
      origin: originName.split("(")[0].trim(),
      dest: destName.split("(")[0].trim(),
      buffer: "4.8 km (≤280m Haven)",
      eta: farosResult.modeSummaries.find(m => m.mode === 'two_wheeler')?.arrivalTimeStr || "02:46 AM",
      status: "In Transit / Safe",
      statusClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      planId: "plan_two_wheeler",
      isPlan: true
    },
    {
      id: "#NS-02234",
      category: "active",
      icon: <Car className="w-3.5 h-3.5 text-sky-400" />,
      name: "Monitored Cab Corridor",
      type: "Four-Wheeler (Wardha Rd)",
      origin: originName.split("(")[0].trim(),
      dest: destName.split("(")[0].trim(),
      buffer: "5.2 km (≤310m Haven)",
      eta: farosResult.modeSummaries.find(m => m.mode === 'four_wheeler')?.arrivalTimeStr || "02:49 AM",
      status: "Active / Monitored",
      statusClass: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      planId: "plan_four_wheeler",
      isPlan: true
    },
    {
      id: "#NS-99120",
      category: "standby",
      icon: <Shield className="w-3.5 h-3.5 text-amber-400" />,
      name: "Ajni Armed Contingency",
      type: "Police Booth Escort",
      origin: "Medical Square",
      dest: "Ajni Station Stand",
      buffer: "3.6 km (≤180m Haven)",
      eta: farosResult.backupPlan?.arrivalTimeStr || "02:54 AM",
      status: "Standby Armed",
      statusClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      planId: farosResult.backupPlan?.id || "plan_backup",
      isPlan: true
    },
    {
      id: "#TR-10408",
      category: "transit",
      icon: <Bus className="w-3.5 h-3.5 text-cyan-400" />,
      name: "Aapli Bus Route 104",
      type: "Municipal Night Feeder",
      origin: "Sitabuldi Interchange",
      dest: "Medical Chowk",
      buffer: "Continuous Lifebuoy",
      eta: "02:22 AM (Next)",
      status: "Live Freshness",
      statusClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      planId: "plan_transit",
      isPlan: true
    },
    {
      id: "#MT-00160",
      category: "transit",
      icon: <Train className="w-3.5 h-3.5 text-zinc-400" />,
      name: "Maha Metro Orange Line",
      type: "NMRCL Rapid Rail",
      origin: "Rahate Colony",
      dest: "Ajni Square",
      buffer: "Station Catenary",
      eta: "05:45 AM (Morning)",
      status: "Curfew Inactive",
      statusClass: "bg-zinc-800 text-zinc-400 border-zinc-700",
      planId: "plan_transit",
      isPlan: false
    },
    {
      id: "#SH-00101",
      category: "havens",
      icon: <Building2 className="w-3.5 h-3.5 text-rose-400" />,
      name: "GMCH 24/7 Trauma Centre",
      type: "Govt Level-1 Trauma Hospital",
      origin: "Medical Square",
      dest: "Casualty Ground Bay",
      buffer: "≤40m Immediate",
      eta: "Open 24/7",
      status: "Verified DHS",
      statusClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      planId: "haven_gmch",
      isPlan: false
    },
    {
      id: "#SH-00102",
      category: "havens",
      icon: <Shield className="w-3.5 h-3.5 text-indigo-400" />,
      name: "Medical Sq Police Beat Booth",
      type: "Nagpur Police Dial 112",
      origin: "Medical Square Junction",
      dest: "Manned 24/7 Post",
      buffer: "≤120m Immediate",
      eta: "Active Beat",
      status: "CAD Connected",
      statusClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      planId: "haven_police",
      isPlan: false
    }
  ];

  // Filter items based on selected tab
  const filteredItems = tableItems.filter(item => {
    if (tableFilter === 'all') return true;
    if (tableFilter === 'active') return item.category === 'active' || item.category === 'primary';
    if (tableFilter === 'standby') return item.category === 'standby';
    if (tableFilter === 'havens') return item.category === 'havens';
    if (tableFilter === 'transit') return item.category === 'transit';
    return true;
  });

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5 text-[#F5F5F7] select-none">
      
      {/* =========================================================================
          1. TOP NAVIGATION BAR (Matching "Transcope." Dribbble Reference)
         ========================================================================= */}
      <header className="w-full rounded-2xl bg-[#17181B] border border-white/[0.08] px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onReplaySplash}
            title="Click to replay launch animation"
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.4)] cursor-pointer hover:scale-105 transition-transform"
          >
            <Shield className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight text-white font-sans">
              NightShift.
            </span>
          </div>
        </div>

        {/* Center: Clean Horizontal Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101114] p-1 rounded-xl border border-white/[0.05]">
          <button
            onClick={() => setActiveNavTab('overview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeNavTab === 'overview'
                ? "bg-[#25272D] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setActiveNavTab('routes');
              onStartNavigation();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeNavTab === 'routes'
                ? "bg-[#25272D] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Active Patrol
          </button>
          <button
            onClick={() => {
              setActiveNavTab('havens');
              setTableFilter('havens');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeNavTab === 'havens'
                ? "bg-[#25272D] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Safe Havens
          </button>
          <button
            onClick={() => {
              setActiveNavTab('transit');
              onOpenGovRegistry('metro');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeNavTab === 'transit'
                ? "bg-[#25272D] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Transit Feeders
          </button>
          <button
            onClick={() => {
              setActiveNavTab('registry');
              onOpenGovRegistry();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeNavTab === 'registry'
                ? "bg-[#25272D] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Gov Registry
          </button>
          <button
            onClick={() => {
              setActiveNavTab('validation');
              onOpenValidationModal();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeNavTab === 'validation'
                ? "bg-[#25272D] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Validation
          </button>
        </nav>

        {/* Right: Search, Notification & Officer Profile Badge */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            onClick={onOpenLocationSearch}
            title="Search Corridors or Change Location"
            className="w-9 h-9 rounded-xl bg-[#202227] hover:bg-[#2A2C33] text-zinc-300 hover:text-white flex items-center justify-center transition-all border border-white/[0.05]"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Emergency Audio Siren Button */}
          <button
            onClick={toggleEmergencySiren}
            title={isSirenActive ? "Stop Emergency Siren" : "Sound Safety Siren"}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
              isSirenActive
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse"
                : "bg-[#202227] hover:bg-[#2A2C33] text-zinc-300 hover:text-white border-white/[0.05]"
            }`}
          >
            {isSirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* User Profile Card (Reference: Ethan Cole / Dispatch Officer) */}
          <div 
            onClick={onTriggerGps}
            title="Click to Lock Live GPS Coordinates"
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#202227] hover:bg-[#2A2C33] border border-white/[0.05] cursor-pointer transition-all"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {isDetectingGps ? (
                  <Compass className="w-4 h-4 animate-spin text-white" />
                ) : (
                  "EC"
                )}
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-[#202227]" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                Ethan Cole
              </span>
              <span className="text-[10px] text-zinc-400 leading-tight">
                Duty Officer (Nagpur)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN CONTENT GRID (Left Column 3 Cards + Right Column Map & Table)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* =======================================================================
            LEFT COLUMN: 3 TELEMETRY & DISTRIBUTION WIDGETS (~33% width / 4 cols)
           ======================================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* -------------------------------------------------------------
              CARD 1: Today's Delivery Progress -> Night Corridor Safety
             ------------------------------------------------------------- */}
          <div className="rounded-3xl bg-[#17181B] border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Night Corridor Safety Progress
              </h2>
              <button 
                onClick={onOpenValidationModal}
                title="View Invariant Verification"
                className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Frosted Badge Pills (Grid 2x2) */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <div className="p-2.5 rounded-2xl bg-[#202227] border border-white/[0.04] flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400">Illumination</span>
                  <span className="text-xs font-bold text-white">98% Lux Grid</span>
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#202227] border border-white/[0.04] flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400">Emergency</span>
                  <span className="text-xs font-bold text-white">24/7 Trauma</span>
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#202227] border border-white/[0.04] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400">Buffer Radius</span>
                  <span className="text-xs font-bold text-white">≤400m Sanctuary</span>
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#202227] border border-white/[0.04] flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400">CAD Desk</span>
                  <span className="text-xs font-bold text-white">Police 112 Active</span>
                </div>
              </div>
            </div>

            {/* Wave / Distribution Chart Representation */}
            <div className="relative pt-3 pb-1">
              {/* SVG Wave */}
              <svg viewBox="0 0 300 80" className="w-full h-20 overflow-visible">
                <defs>
                  <linearGradient id="waveGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,65 Q 75,55 150,25 T 300,45"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 0,65 Q 75,55 150,25 T 300,45 L 300,80 L 0,80 Z"
                  fill="url(#waveGlow)"
                />
                {/* Center marker dot */}
                <circle cx="150" cy="25" r="4.5" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2.5" />
              </svg>

              {/* Floating Percentage Badge Pill on top of curve */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-zinc-950 font-bold text-xs shadow-lg flex items-center gap-1">
                <span>94%</span>
              </div>

              {/* Range labels */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>0% Unlit</span>
                <span>4.8 km safe corridor goal (94%)</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              CARD 2: Fleet distribution by type -> Transit & Escort Modes
             ------------------------------------------------------------- */}
          <div className="rounded-3xl bg-[#17181B] border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Fleet distribution by type
              </h2>
              <button 
                onClick={() => onOpenGovRegistry('metro')}
                title="View Transit Registry"
                className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* List of Travel Modes with Segmented Bars */}
            <div className="flex flex-col gap-3">
              {/* 1. Two-Wheeler (Motorbike) */}
              <div 
                onClick={() => onSelectTravelMode('two_wheeler')}
                className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  travelMode === 'two_wheeler'
                    ? "bg-[#252830] border border-amber-500/40 shadow-sm"
                    : "bg-[#1E1F24] hover:bg-[#23252B] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-[100px]">
                  <Bike className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-medium text-white">Two-Wheeler</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">42</span>
                {renderSegmentedBar(8, 10, "bg-amber-400")}
                <span className="text-xs font-mono font-semibold text-white min-w-[32px] text-right">84%</span>
              </div>

              {/* 2. Four-Wheeler (Cab) */}
              <div 
                onClick={() => onSelectTravelMode('four_wheeler')}
                className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  travelMode === 'four_wheeler'
                    ? "bg-[#252830] border border-sky-500/40 shadow-sm"
                    : "bg-[#1E1F24] hover:bg-[#23252B] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-[100px]">
                  <Car className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-xs font-medium text-white">Van / Cab</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">23</span>
                {renderSegmentedBar(6, 10, "bg-sky-400")}
                <span className="text-xs font-mono font-semibold text-white min-w-[32px] text-right">60%</span>
              </div>

              {/* 3. Aapli Bus Feeder */}
              <div 
                onClick={() => onSelectTravelMode('transit')}
                className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  travelMode === 'transit'
                    ? "bg-[#252830] border border-cyan-500/40 shadow-sm"
                    : "bg-[#1E1F24] hover:bg-[#23252B] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-[100px]">
                  <Bus className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-medium text-white">Aapli Bus</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">15</span>
                {renderSegmentedBar(4, 10, "bg-cyan-400")}
                <span className="text-xs font-mono font-semibold text-white min-w-[32px] text-right">40%</span>
              </div>

              {/* 4. Metro Feeder */}
              <div 
                onClick={() => onOpenGovRegistry('metro')}
                className="p-2.5 rounded-2xl flex items-center justify-between gap-3 bg-[#1E1F24] hover:bg-[#23252B] border border-transparent cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-[100px]">
                  <Train className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="text-xs font-medium text-zinc-300">Metro Rail</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">9</span>
                {renderSegmentedBar(3, 10, "bg-zinc-400")}
                <span className="text-xs font-mono font-semibold text-zinc-400 min-w-[32px] text-right">30%</span>
              </div>

              {/* 5. Walking Patrol */}
              <div 
                onClick={() => onSelectTravelMode('walking')}
                className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  travelMode === 'walking'
                    ? "bg-[#252830] border border-emerald-500/40 shadow-sm"
                    : "bg-[#1E1F24] hover:bg-[#23252B] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-[100px]">
                  <Footprints className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-white">Walk Patrol</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">3</span>
                {renderSegmentedBar(1, 10, "bg-emerald-400")}
                <span className="text-xs font-mono font-semibold text-white min-w-[32px] text-right">10%</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              CARD 3: Fuel Usage & Cost -> Sanctuary Proximity & Response
             ------------------------------------------------------------- */}
          <div className="rounded-3xl bg-[#17181B] border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Sanctuary Proximity & Response
              </h2>
              <button 
                onClick={() => onOpenGovRegistry('hospitals')}
                title="View Verified Sanctuaries"
                className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Row (Left 78% stats, Center big 280m, Right 400m cap) */}
            <div className="flex items-baseline justify-between pt-1 pb-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400">98% Lit</span>
                <span className="text-xs font-mono text-zinc-300">2.1m Resp</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Avg Sanctuary Buffer</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-white font-mono tracking-tight">280</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">m</span>
                </div>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[10px] text-zinc-400">≤400m Cap</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">100% Safe</span>
              </div>
            </div>

            {/* Equalizer / Histogram Bars across Corridor Milestones */}
            <div className="pt-2">
              <div className="flex items-end justify-between gap-1.5 h-14 px-1">
                {[65, 80, 95, 88, 70, 92, 100, 85, 75, 90, 98, 82, 78, 94, 86, 92].map((height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-zinc-700 via-cyan-500 to-white rounded-t-[2px] transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                    title={`Milestone Sector ${idx + 1}: ${height}% Safe`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-2 px-1">
                <span>GMCH Trauma</span>
                <span>Medical Sq</span>
                <span>Ajni</span>
                <span>Manewada</span>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================================
            RIGHT COLUMN: HERO MAP CARD + ORDERS/DISPATCHES TABLE (~67% / 8 cols)
           ======================================================================= */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {/* -------------------------------------------------------------
              HERO MAP CARD WITH FLOATING SEARCH, CONTROLS & MARKERS
             ------------------------------------------------------------- */}
          <div className="relative rounded-3xl bg-[#17181B] border border-white/[0.08] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] h-[440px] sm:h-[480px]">
            
            {/* FLOATING TOP BAR OVER MAP */}
            <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
              
              {/* Floating Search Pill (Left) */}
              <div 
                onClick={onOpenLocationSearch}
                title="Click to change Origin or Destination"
                className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#141518]/90 hover:bg-[#1C1E23] backdrop-blur-xl border border-white/10 text-xs text-white shadow-xl cursor-pointer transition-all"
              >
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-medium truncate max-w-[200px] sm:max-w-[280px]">
                  {originName.split("(")[0]} ➔ {destName.split("(")[0]}
                </span>
              </div>

              {/* Floating Mode / Sort Pill (Center) */}
              <div className="pointer-events-auto flex items-center gap-2">
                <div 
                  onClick={() => {
                    const nextMode: TravelMode = 
                      travelMode === 'two_wheeler' ? 'four_wheeler' :
                      travelMode === 'four_wheeler' ? 'transit' :
                      travelMode === 'transit' ? 'walking' : 'two_wheeler';
                    onSelectTravelMode(nextMode);
                  }}
                  title="Toggle Travel Mode"
                  className="px-3 py-2 rounded-2xl bg-[#141518]/90 hover:bg-[#1C1E23] backdrop-blur-xl border border-white/10 text-xs text-zinc-300 font-medium shadow-xl cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <span className="text-zinc-500">Mode:</span>
                  <span className="text-white capitalize">
                    {travelMode === 'two_wheeler' ? '🛵 2-Wheeler' :
                     travelMode === 'four_wheeler' ? '🚗 Cab' :
                     travelMode === 'transit' ? '🚌 Transit' : '🚶 Walking'}
                  </span>
                  <span className="text-[10px] text-zinc-400">▾</span>
                </div>

                {/* Radar Toggle Pill */}
                <button
                  onClick={onToggleRadar}
                  title="Toggle Nocturnal Lux Radar Scanner"
                  className={`px-3 py-2 rounded-2xl backdrop-blur-xl border text-xs font-semibold shadow-xl flex items-center gap-1.5 transition-all ${
                    isRadarActive
                      ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-[#141518]/90 hover:bg-[#1C1E23] border-white/10 text-zinc-300"
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${isRadarActive ? "animate-pulse text-cyan-300" : ""}`} />
                  <span className="hidden sm:inline">Lux Radar</span>
                </button>

                {/* Navigation CTA Button */}
                <button
                  onClick={isNavigating ? onEndNavigation : onStartNavigation}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-1.5 transition-all ${
                    isNavigating
                      ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse"
                      : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  }`}
                >
                  <Navigation2 className="w-3.5 h-3.5 fill-current" />
                  <span>{isNavigating ? "End Navigation" : "Start Navigation"}</span>
                </button>
              </div>
            </div>

            {/* EMBEDDED LEAFLET MAP VIEW */}
            <div className="w-full h-full">
              <MapView
                originCoords={originCoords}
                originName={originName}
                destCoords={destCoords}
                destName={destName}
                selectedPlan={activePlan}
                backupPlan={farosResult.backupPlan}
                isBusCancelled={false}
                isFlooded={false}
                selectedHaven={selectedHaven}
                onSelectHaven={onSelectHaven}
                isNavigating={isNavigating}
                onEndNavigation={onEndNavigation}
                isRadarActive={isRadarActive}
              />
            </div>
          </div>

          {/* -------------------------------------------------------------
              CARD 5: Orders Table -> Active Night Corridors & Dispatches
             ------------------------------------------------------------- */}
          <div className="rounded-3xl bg-[#17181B] border border-white/[0.08] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col gap-4">
            
            {/* Table Header & Horizontal Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Orders & Active Night Corridors
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-400">
                  {filteredItems.length} Available
                </span>
              </div>

              {/* Filter Pills (All, Active, Standby, Havens, Transit) */}
              <div className="flex items-center gap-1 bg-[#101114] p-1 rounded-xl border border-white/[0.05]">
                <button
                  onClick={() => setTableFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    tableFilter === 'all'
                      ? "bg-[#D2C4B5] text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTableFilter('active')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    tableFilter === 'active'
                      ? "bg-[#D2C4B5] text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Active Routes
                </button>
                <button
                  onClick={() => setTableFilter('standby')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    tableFilter === 'standby'
                      ? "bg-[#D2C4B5] text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Standby
                </button>
                <button
                  onClick={() => setTableFilter('havens')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    tableFilter === 'havens'
                      ? "bg-[#D2C4B5] text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sanctuaries
                </button>
                <button
                  onClick={() => setTableFilter('transit')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    tableFilter === 'transit'
                      ? "bg-[#D2C4B5] text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Transit
                </button>
              </div>
            </div>

            {/* Interactive Data Table matching Transcope reference */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-500 font-mono border-b border-white/[0.06] text-[11px]">
                    <th className="pb-3 font-normal pl-2">ORDER / ID</th>
                    <th className="pb-3 font-normal">CORRIDOR / DESTINATION</th>
                    <th className="pb-3 font-normal">ROUTE</th>
                    <th className="pb-3 font-normal">BUFFER / DISTANCE</th>
                    <th className="pb-3 font-normal">ETA (MULTI-FACTOR)</th>
                    <th className="pb-3 font-normal pr-2 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredItems.map((item, idx) => {
                    const isSelected = selectedPlanId === item.planId;
                    return (
                      <tr 
                        key={idx}
                        onClick={() => {
                          if (item.isPlan) {
                            onSelectPlanId(item.planId);
                          }
                        }}
                        className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                          isSelected ? "bg-white/[0.04]" : ""
                        }`}
                      >
                        {/* ID + Icon */}
                        <td className="py-3.5 pl-2 font-mono text-zinc-300 flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-[#202227] border border-white/[0.05] group-hover:border-white/20 transition-colors">
                            {item.icon}
                          </span>
                          <span className="font-semibold text-white">{item.id}</span>
                        </td>

                        {/* Customer / Name */}
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{item.name}</span>
                            <span className="text-[10px] text-zinc-400">{item.type}</span>
                          </div>
                        </td>

                        {/* Route Endpoints */}
                        <td className="py-3.5 text-zinc-300">
                          <div className="flex flex-col gap-0.5 text-[11px]">
                            <span className="flex items-center gap-1 text-zinc-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              <span className="truncate max-w-[140px]">{item.origin}</span>
                            </span>
                            <span className="flex items-center gap-1 text-white">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span className="truncate max-w-[140px]">{item.dest}</span>
                            </span>
                          </div>
                        </td>

                        {/* Weight / Buffer */}
                        <td className="py-3.5 font-mono text-zinc-300">
                          {item.buffer}
                        </td>

                        {/* ETA */}
                        <td className="py-3.5 font-mono font-medium text-white">
                          {item.eta}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 pr-2 text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${item.statusClass}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Multi-Factor ETA Bar beneath Table */}
            <div className="p-3 rounded-2xl bg-[#121316] border border-white/[0.05] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>ETA Multi-Factor Factors:</span>
                <span className="text-white font-medium">Free-flow (0.98x)</span>
                <span>•</span>
                <span className="text-white font-medium">Signals (+15s)</span>
                <span>•</span>
                <span className="text-white font-medium">Curvature (1.25x)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Live Departure:</span>
                <span className="text-cyan-300 font-semibold">{activeDepartureTimeStr}</span>
                <span className="text-zinc-500">| Curfew Deadline:</span>
                <span className="text-amber-300 font-semibold">{deadlineTimeStr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
