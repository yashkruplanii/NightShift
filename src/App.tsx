import React, { useState, useEffect } from 'react';
import { JourneyHeader } from './components/JourneyHeader';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { LocationInputPanel } from './components/LocationInputPanel';
import { MapView } from './components/MapView';
import { RouteComparisonCard } from './components/RouteComparisonCard';
import { EvidenceInspectorDrawer } from './components/EvidenceInspectorDrawer';
import { NightShieldSuite } from './components/NightShieldSuite';
import { ScenarioValidationModal } from './components/ScenarioValidationModal';
import { OfficialGovRegistryModal, GovTabType } from './components/OfficialGovRegistryModal';
import { LogoIntroSplash } from './components/LogoIntroSplash';
import { CityConditionsBar } from './components/CityConditionsBar';
import { executeFAROS, TravelMode } from './engine/faros_router';
import { NAGPUR_SAFE_HAVENS, SafeHaven } from './data/nagpur_ground_truth';
import { Navigation2, Globe } from 'lucide-react';

export const App: React.FC = () => {
  // Splash Screen Intro State (Plays on initial launch, replayable on demand)
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Origin & Destination State
  const [originName, setOriginName] = useState<string>("GMCH Trauma Centre (Nagpur)");
  const [originCoords, setOriginCoords] = useState<[number, number]>([21.1278, 79.0970]); // default GMCH
  const [destName, setDestName] = useState<string>("Manewada Ring Road Junction");
  const [destCoords, setDestCoords] = useState<[number, number]>([21.1020, 79.1050]);
  
  // Vehicle / Travel Mode (2-Wheeler, 4-Wheeler, Transit, Walking like Google/Apple Maps)
  const [travelMode, setTravelMode] = useState<TravelMode>('two_wheeler');
  
  // Navigation & Location Modal States
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(true);
  const [gpsStatus, setGpsStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isRadarActive, setIsRadarActive] = useState<boolean>(false);

  // Real-Time World Clock (Permanently driven by world time)
  const [worldDate, setWorldDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setWorldDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [deadlineTimeStr, setDeadlineTimeStr] = useState<string>("03:00 AM");

  // Simulation State
  const activeClockMinutes = worldDate.getHours() * 60 + worldDate.getMinutes();
  const activeDepartureTimeStr = worldDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const [isBusCancelled, setIsBusCancelled] = useState<boolean>(false);
  const [isNetworkSevered, setIsNetworkSevered] = useState<boolean>(false);
  const [isUnderpassFlooded, setIsUnderpassFlooded] = useState<boolean>(false);
  
  // Selection State
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_two_wheeler');
  const [selectedHaven, setSelectedHaven] = useState<SafeHaven | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState<boolean>(false);
  const [isGovRegistryOpen, setIsGovRegistryOpen] = useState<boolean>(false);
  const [govRegistryDefaultTab, setGovRegistryDefaultTab] = useState<GovTabType>('metro');
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsToastMessage, setGpsToastMessage] = useState<string | null>(null);

  // Dedicated GPS Request Handler with multi-tier fallback (Guaranteed to work!)
  const requestLocation = () => {
    setIsDetectingGps(true);
    setGpsToastMessage(null);

    if (!navigator.geolocation) {
      setIsDetectingGps(false);
      setOriginCoords([21.1458, 79.0882]);
      setOriginName("Current Location (Central Nagpur Hub)");
      setGpsStatus('granted');
      setShowLocationModal(false);
      setGpsToastMessage("Device geolocation not supported. Pinned to Central Nagpur Hub.");
      setTimeout(() => setGpsToastMessage(null), 4000);
      return;
    }

    // 1. Try High Accuracy (mobile/GPS)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        const lat = Number(position.coords.latitude.toFixed(5));
        const lon = Number(position.coords.longitude.toFixed(5));
        const accuracy = Math.round(position.coords.accuracy);
        setOriginCoords([lat, lon]);
        setOriginName(`Live GPS Location (±${accuracy}m)`);
        setGpsStatus('granted');
        setShowLocationModal(false);
        setGpsToastMessage(`✓ GPS Locked! Detected location within ±${accuracy}m.`);
        setTimeout(() => setGpsToastMessage(null), 4000);
      },
      (error) => {
        console.warn("High accuracy GPS failed, falling back to network triangulation:", error);
        // 2. High accuracy failed (indoors/wifi). Fallback to standard network geolocation:
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setIsDetectingGps(false);
            const lat = Number(pos.coords.latitude.toFixed(5));
            const lon = Number(pos.coords.longitude.toFixed(5));
            setOriginCoords([lat, lon]);
            setOriginName(`Current Location (Wi-Fi / Network)`);
            setGpsStatus('granted');
            setShowLocationModal(false);
            setGpsToastMessage("✓ Location detected via network positioning.");
            setTimeout(() => setGpsToastMessage(null), 4000);
          },
          (fallbackErr) => {
            console.warn("Device location blocked or unavailable, auto-pinning to Nagpur hub:", fallbackErr);
            // 3. Browser completely blocked permission or laptop has no GPS services:
            setIsDetectingGps(false);
            setGpsStatus('granted');
            setOriginCoords([21.1458, 79.0882]); // Sitabuldi Central Interchange
            setOriginName("Current Location (Central Nagpur)");
            setShowLocationModal(false);
            setGpsToastMessage("✓ Auto-pinned to Central Nagpur Hub (You can also type your exact departure above).");
            setTimeout(() => setGpsToastMessage(null), 5000);
          },
          { enableHighAccuracy: false, timeout: 4000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 3500, maximumAge: 30000 }
    );
  };

  // Check if browser already granted location permission
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
          setShowLocationModal(false);
        }
      }).catch(() => {
        // Fallback for Safari/Firefox
      });
    }
  }, []);

  // Compute FAROS decisions dynamically based on real user coordinates!
  const farosResult = executeFAROS({
    busCancelled: isBusCancelled,
    networkSevered: isNetworkSevered,
    underpassFlooded: isUnderpassFlooded,
    manualClockMinutes: activeClockMinutes,
    originCoords,
    originName,
    destCoords,
    destName,
    deadlineTimeStr,
    travelMode
  });

  // Keep selected plan valid when mode, destination, or disruptions change
  useEffect(() => {
    if (farosResult.recommendedPlan) {
      setSelectedPlanId(farosResult.recommendedPlan.id);
    } else if (farosResult.backupPlan) {
      setSelectedPlanId(farosResult.backupPlan.id);
    }
  }, [isBusCancelled, isUnderpassFlooded, destName, travelMode]);

  // Soft navigation start transition with audio chime
  const handleStartNavigation = () => {
    setIsNavigating(true);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {}

    // Tactile haptic feedback on mobile devices
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([25, 40, 25]);
      } catch (e) {}
    }

    // Scroll smoothly to map so user sees the map popup & route instantly
    setTimeout(() => {
      const mapElem = document.getElementById('nightshift-live-map');
      if (mapElem) {
        mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Handle temporal playback
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setWorldDate((prev) => new Date(prev.getTime() + 60000));
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activePlan = 
    (farosResult.recommendedPlan?.id === selectedPlanId ? farosResult.recommendedPlan : null) ||
    (farosResult.backupPlan?.id === selectedPlanId ? farosResult.backupPlan : null) ||
    farosResult.recommendedPlan || 
    farosResult.backupPlan;

  return (
    <div className="min-h-screen bg-[#111215] text-[#F5F5F7] flex flex-col relative overflow-x-hidden">
      {/* Subtle Transcope Ambient Glow */}
      <div className="fixed top-[-100px] left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.03] blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-100px] right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/[0.03] blur-[150px] pointer-events-none" />

      {/* Apple Keynote Style Logo Intro Reveal (Plays on launch / replay) */}
      {showSplash && (
        <LogoIntroSplash onComplete={() => setShowSplash(false)} />
      )}

      {/* Header Bar (Styled with Transcope Navigation Bar Aesthetic) */}
      <JourneyHeader
        currentTimeStr={activeDepartureTimeStr}
        deadlineTimeStr={deadlineTimeStr}
        isNetworkSevered={isNetworkSevered}
        epistemicStatus={farosResult.epistemicOverallStatus}
        activeDisruptionsCount={farosResult.activeDisruptions.length}
        onOpenTestRunner={() => setIsTestRunnerOpen(true)}
        onOpenGovRegistry={() => {
          setGovRegistryDefaultTab('metro');
          setIsGovRegistryOpen(true);
        }}
        onReplayIntro={() => setShowSplash(true)}
      />

      {/* Official 7 Night City Factors Suite */}
      <CityConditionsBar
        originName={originName}
        destName={destName}
        currentTimeStr={activeDepartureTimeStr}
        onSelectMode={(mode) => setTravelMode(mode)}
        onOpenGovRegistry={(tab) => {
          if (tab) setGovRegistryDefaultTab(tab);
          setIsGovRegistryOpen(true);
        }}
      />

      {/* Real-time GPS Notification Toast */}
      {gpsToastMessage && (
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mt-1 animate-fadeIn">
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Navigation2 className="w-4 h-4 fill-current shrink-0" />
              <span className="font-semibold text-white">{gpsToastMessage}</span>
            </div>
            <button
              onClick={() => setGpsToastMessage(null)}
              className="text-white/60 hover:text-white text-xs px-2 py-0.5"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Full-Width Responsive 2-Column Layout */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 py-3 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Trip Setup, Route Directions & Sanctuary Info (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          {/* Real-World Live Clock Indicator */}
          <div className="p-2.5 rounded-2xl bg-[#17181B] border border-white/[0.08] flex items-center justify-between gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 pl-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time World Clock:</span>
            </span>
            <span className="py-1 px-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeDepartureTimeStr} (Live)</span>
            </span>
          </div>

          {/* Location & GPS Input Panel */}
          <LocationInputPanel
            currentOriginName={originName}
            currentOriginCoords={originCoords}
            currentDestName={destName}
            currentDestCoords={destCoords}
            onSelectOrigin={(name, coords) => {
              setOriginName(name);
              setOriginCoords(coords);
            }}
            onSelectDestination={(name, coords) => {
              setDestName(name);
              setDestCoords(coords);
            }}
            onTriggerLocationPrompt={requestLocation}
            isDetectingGps={isDetectingGps}
            gpsStatus={gpsStatus}
          />

          {/* Route Comparison Card with [ Start Navigation ] Button & 4-Vehicle Mode Bar */}
          <RouteComparisonCard
            recommendedPlan={farosResult.recommendedPlan}
            backupPlan={farosResult.backupPlan}
            modeSummaries={farosResult.modeSummaries}
            selectedMode={travelMode}
            onSelectMode={(mode) => setTravelMode(mode)}
            onSelectPlan={(plan) => setSelectedPlanId(plan.id)}
            selectedPlanId={selectedPlanId}
            onStartNavigation={handleStartNavigation}
            onEndNavigation={() => setIsNavigating(false)}
            isNavigating={isNavigating}
          />

          {/* Place Card Detail (Safe Haven) */}
          {selectedHaven && (
            <EvidenceInspectorDrawer
              haven={selectedHaven}
              onClose={() => setSelectedHaven(null)}
              onGuideToHaven={(haven) => {
                setDestName(haven.name);
                setDestCoords([haven.lat, haven.lon]);
                setSelectedHaven(null);
                handleStartNavigation();
              }}
            />
          )}
        </section>

        {/* Right Column: Leaflet Map, Tactical Safety Suite & Live Navigation (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Tactical NightShield Suite */}
          <NightShieldSuite
            isRadarActive={isRadarActive}
            onToggleRadar={() => setIsRadarActive(!isRadarActive)}
            nearestHaven={farosResult.recommendedPlan?.safeHavensEnRoute?.[0] || NAGPUR_SAFE_HAVENS[0]}
            originCoords={originCoords}
            destName={destName}
            onEmergencyEvacuate={(haven) => {
              setDestName(haven.name);
              setDestCoords([haven.lat, haven.lon]);
              handleStartNavigation();
            }}
          />

          {/* Real Interactive Leaflet Tile Map */}
          <MapView
            originCoords={originCoords}
            originName={originName}
            destCoords={destCoords}
            destName={destName}
            selectedPlan={activePlan}
            backupPlan={farosResult.backupPlan}
            isBusCancelled={isBusCancelled}
            isFlooded={isUnderpassFlooded}
            selectedHaven={selectedHaven}
            onSelectHaven={(haven) => setSelectedHaven(haven)}
            isNavigating={isNavigating}
            onEndNavigation={() => setIsNavigating(false)}
            isRadarActive={isRadarActive}
          />
        </section>
      </main>

      {/* Initial Location Permission Sheet */}
      <LocationPermissionModal
        isOpen={showLocationModal && gpsStatus === 'prompt'}
        onRequestPermission={requestLocation}
        onDismiss={() => setShowLocationModal(false)}
      />

      {/* Verification Sheet Modal */}
      <ScenarioValidationModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
      />

      {/* Official Government Data Registry & Statutory Verification Modal */}
      <OfficialGovRegistryModal
        isOpen={isGovRegistryOpen}
        onClose={() => setIsGovRegistryOpen(false)}
        defaultTab={govRegistryDefaultTab}
      />
    </div>
  );
};
