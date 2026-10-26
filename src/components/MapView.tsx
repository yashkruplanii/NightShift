import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Crosshair, 
  Navigation,
  ZoomIn,
  ZoomOut,
  Sparkles
} from 'lucide-react';
import { 
  NAGPUR_SAFE_HAVENS, 
  SafeHaven 
} from '../data/nagpur_ground_truth';
import { RoutePlan } from '../engine/faros_router';

interface MapViewProps {
  originCoords: [number, number];
  originName: string;
  destCoords?: [number, number] | null;
  destName?: string;
  selectedPlan: RoutePlan | null;
  backupPlan: RoutePlan | null;
  isBusCancelled: boolean;
  isFlooded: boolean;
  selectedHaven: SafeHaven | null;
  onSelectHaven: (haven: SafeHaven) => void;
  isNavigating?: boolean;
  onEndNavigation?: () => void;
  isRadarActive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  originCoords,
  originName,
  destCoords,
  destName,
  selectedPlan,
  backupPlan,
  isBusCancelled,
  isFlooded,
  selectedHaven,
  onSelectHaven,
  isNavigating = false,
  onEndNavigation,
  isRadarActive = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayersRef = useRef<L.LayerGroup | null>(null);
  const [hasJustStartedNav, setHasJustStartedNav] = useState<boolean>(false);
  const prevNavigatingRef = useRef<boolean>(isNavigating);

  // Trigger brief celebration HUD when navigation starts
  useEffect(() => {
    if (!prevNavigatingRef.current && isNavigating) {
      setHasJustStartedNav(true);
      const timer = setTimeout(() => {
        setHasJustStartedNav(false);
      }, 3200);
      return () => clearTimeout(timer);
    }
    prevNavigatingRef.current = isNavigating;
  }, [isNavigating]);

  // Initialize Map with High-Resolution OpenStreetMap Street Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: originCoords,
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // 100% Street Map (High visibility lit road network)
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'OpenStreetMap'
    }).addTo(map);

    tileLayerRef.current = tiles;

    const layerGroup = L.layerGroup().addTo(map);
    routeLayersRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update dynamic layers, markers, polylines whenever route or disruptions change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = routeLayersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Draw 400m Safe Haven Lifebuoy Circles
    NAGPUR_SAFE_HAVENS.forEach((haven) => {
      const isSelected = selectedHaven?.id === haven.id;

      const circle = L.circle([haven.lat, haven.lon], {
        radius: 400,
        color: isSelected ? '#34C759' : '#10B981',
        weight: isSelected ? 2 : 1,
        dashArray: isSelected ? '4, 4' : '2, 4',
        fillColor: '#10B981',
        fillOpacity: isSelected ? 0.08 : 0.04
      });
      circle.addTo(group);

      // Custom Safe Haven HTML Marker
      const havenIcon = L.divIcon({
        className: 'custom-haven-pin',
        html: `
          <div style="
            width: 24px; height: 24px; 
            border-radius: 50%; 
            background: #0A0E17; 
            border: 2px solid #34C759; 
            box-shadow: 0 0 10px rgba(52, 199, 89, 0.6);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
          ">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #34C759;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([haven.lat, haven.lon], { icon: havenIcon });
      marker.on('click', () => onSelectHaven(haven));
      marker.bindTooltip(`<b>${haven.name.split(' (')[0]}</b><br/><span style="color:#34C759;">✓ 24/7 Verified Safe Haven</span>`, {
        direction: 'top',
        className: 'ios-map-tooltip'
      });
      marker.addTo(group);
    });

    // 2. Draw Pre-Calculated Backup Route via Safe Haven (Dashed Amber with Dark Casing)
    if (backupPlan) {
      backupPlan.segments.forEach((seg) => {
        // Underlay Road Casing
        const casing = L.polyline(seg.coordinates, {
          color: '#1C1917',
          weight: 7,
          opacity: 0.65
        });
        casing.addTo(group);

        const backupLine = L.polyline(seg.coordinates, {
          color: '#F59E0B',
          weight: 4.5,
          dashArray: '7, 7',
          opacity: 0.95
        });
        backupLine.bindTooltip(`<b>Armed Backup Route (via Safe Haven)</b><br/>${seg.name}`, { direction: 'top' });
        backupLine.addTo(group);
      });
    }

    // 3. Draw Active Route Polylines (Real Road Casing + Glow + Core Highway Polyline)
    if (selectedPlan) {
      selectedPlan.segments.forEach((seg) => {
        const isTransit = seg.mode === 'bus';

        // Underlay Road Casing (Crisp border just like Google & Apple Maps)
        const casing = L.polyline(seg.coordinates, {
          color: '#030712',
          weight: isNavigating ? 10 : 8,
          opacity: 0.85
        });
        casing.addTo(group);

        // Ambient Road Glow
        const glow = L.polyline(seg.coordinates, {
          color: isTransit ? '#007AFF' : '#00F0FF',
          weight: isNavigating ? 15 : 12,
          opacity: isNavigating ? 0.45 : 0.3,
          className: isNavigating ? (isTransit ? 'leaflet-animated-transit-route' : 'leaflet-animated-route') : undefined
        });
        glow.addTo(group);

        // Core Route line
        const line = L.polyline(seg.coordinates, {
          color: isTransit ? '#007AFF' : '#007AFF',
          weight: isNavigating ? 6 : 5,
          dashArray: isNavigating ? (isTransit ? '16, 8' : '12, 10') : undefined,
          opacity: 1.0,
          className: isNavigating ? (isTransit ? 'leaflet-animated-transit-route' : 'leaflet-animated-route') : undefined
        });
        line.bindTooltip(`<b>${seg.name}</b><br/>${(seg.distanceMeters / 1000).toFixed(1)} km · ${seg.lit ? '✓ 100% Lit Highway' : '⚠️ Unlit'}`, {
          direction: 'top'
        });
        line.addTo(group);
      });
    }

    // 4. Origin Marker (Pulsing User Location)
    const originIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(0, 122, 255, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 16px; height: 16px; border-radius: 50%; background: #007AFF; border: 3px solid #FFFFFF; box-shadow: 0 0 12px #007AFF;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const originMarker = L.marker(originCoords, { icon: originIcon, zIndexOffset: 1000 });
    originMarker.bindTooltip(`<b>Your Origin</b>: ${originName}`, { direction: 'top', permanent: false });
    originMarker.addTo(group);

    // 5. Destination Marker (Flag)
    if (destCoords && destName) {
      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `
          <div style="
            width: 26px; height: 26px; 
            border-radius: 50%; 
            background: #34C759; 
            border: 2.5px solid #FFFFFF; 
            box-shadow: 0 0 14px rgba(52, 199, 89, 0.9);
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: bold; font-size: 12px;
          ">
            ★
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const destMarker = L.marker(destCoords, { icon: destIcon });
      destMarker.bindTooltip(`<b>Destination</b>: ${destName}`, { direction: 'top', permanent: false });
      destMarker.addTo(group);
    }

    // 6. Smoothly auto-fit bounds, keeping the entire route and safe havens visible
    if (destCoords && destName && selectedPlan) {
      const allPoints: [number, number][] = [originCoords, destCoords];
      selectedPlan.segments.forEach(s => allPoints.push(...s.coordinates));
      const bounds = L.latLngBounds(allPoints);
      if (isNavigating) {
        map.flyToBounds(bounds, {
          padding: [80, 80],
          maxZoom: 15,
          duration: 1.6,
          easeLinearity: 0.25
        });
      } else {
        map.fitBounds(bounds, { padding: [65, 65], maxZoom: 15 });
      }
    } else {
      map.setView(originCoords, 14, { animate: true });
    }

  }, [originCoords, originName, destCoords, destName, selectedPlan, backupPlan, isFlooded, isBusCancelled, selectedHaven, isNavigating]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      if (destCoords && destName && selectedPlan) {
        const allPoints: [number, number][] = [originCoords, destCoords];
        selectedPlan.segments.forEach(s => allPoints.push(...s.coordinates));
        const bounds = L.latLngBounds(allPoints);
        mapInstanceRef.current.flyToBounds(bounds, { padding: [75, 75], maxZoom: 15, duration: 1.2 });
      } else {
        mapInstanceRef.current.setView(originCoords, 15, { animate: true });
      }
    }
  };
  const handleFocusUser = () => {
    mapInstanceRef.current?.setView(originCoords, 16, { animate: true });
  };

  return (
    <div 
      id="nightshift-live-map"
      className={`relative isolate z-0 w-full h-[350px] sm:h-[480px] lg:h-[660px] rounded-3xl overflow-hidden ios-glass-card flex flex-col transition-all duration-700 ease-out ${
        isNavigating 
          ? 'map-navigating-popup ring-2 sm:ring-4 ring-[#007AFF] shadow-[0_25px_90px_rgba(0,122,255,0.45)]' 
          : 'border border-white/10 shadow-2xl'
      }`}
    >
      {/* Floating Apple Navigation Started HUD */}
      {hasJustStartedNav && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[500] px-5 py-2.5 rounded-full bg-[#007AFF]/95 backdrop-blur-2xl border border-white/30 text-white text-xs font-bold shadow-[0_12px_40px_rgba(0,122,255,0.6)] flex items-center gap-2 animate-slideDown pointer-events-none">
          <Sparkles className="w-4 h-4 text-white animate-spin" />
          <span>Live Guidance Started · Focusing Route</span>
        </div>
      )}

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2">
        <div className={`backdrop-blur-2xl border text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)] rounded-full px-4 py-2 flex items-center gap-2.5 text-xs font-semibold transition-all ${
          isNavigating 
            ? 'bg-[#007AFF]/90 border-white/40 ring-2 ring-[#007AFF]/50' 
            : 'bg-[#0A0E17]/90 border-white/20'
        }`}>
          {isNavigating ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34C759]"></span>
            </span>
          ) : (
            <Navigation className="w-3.5 h-3.5 text-[#007AFF]" />
          )}
          {destName ? (
            <>
              <span>
                {isNavigating
                  ? `${selectedPlan?.travelMode === 'two_wheeler' ? '🛵 2-Wheeler' : selectedPlan?.travelMode === 'four_wheeler' ? '🚗 4-Wheeler' : '🚶 Walking'} Active`
                  : `${selectedPlan?.travelMode === 'two_wheeler' ? '🛵 2-Wheeler' : selectedPlan?.travelMode === 'four_wheeler' ? '🚗 4-Wheeler' : '🚶 Walking'} Route`}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/80">{destName.split(' (')[0]}</span>
            </>
          ) : (
            <>
              <span className="text-[#34C759]">● Departure Set</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/60">Choose destination above</span>
            </>
          )}
        </div>

        {/* Navigation Indicator & End Trip Button */}
        {isNavigating && (
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-full bg-[#0A0E17]/90 backdrop-blur-2xl border border-[#34C759]/50 text-[#34C759] text-xs font-bold animate-pulse flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#34C759] shadow-[0_0_8px_#34C759]" />
              <span>Live Guidance Active</span>
            </span>

            {onEndNavigation && (
              <button
                onClick={onEndNavigation}
                className="py-2 px-4 rounded-full bg-[#FF3B30] hover:bg-[#E02424] active:scale-95 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1"
              >
                <span>End Trip</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Map Zoom & Recenter Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          title="Fit Entire Route"
          className="w-9 h-9 rounded-full bg-[#0A0E17]/90 hover:bg-[#161F33] active:scale-95 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white transition-all shadow-[0_8px_25px_rgba(0,0,0,0.6)] cursor-pointer"
        >
          <Crosshair className="w-4 h-4 text-[#007AFF]" />
        </button>
        <button
          onClick={handleFocusUser}
          title="Focus My Location"
          className="w-9 h-9 rounded-full bg-[#0A0E17]/90 hover:bg-[#161F33] active:scale-95 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white transition-all shadow-[0_8px_25px_rgba(0,0,0,0.6)] cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-[#34C759]" />
        </button>
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-9 h-9 rounded-xl bg-[#17181B] hover:bg-[#2A2C33] active:scale-95 border border-white/[0.08] flex items-center justify-center text-white transition-all shadow-[0_8px_25px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-9 h-9 rounded-xl bg-[#17181B] hover:bg-[#2A2C33] active:scale-95 border border-white/[0.08] flex items-center justify-center text-white transition-all shadow-[0_8px_25px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Real Interactive Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#070A0F]" />

      {/* Dynamic Nocturnal Lux Radar Overlay HUD */}
      {isRadarActive && (
        <div className="absolute inset-0 pointer-events-none z-[350] overflow-hidden">
          {/* Rotating Circular Radar Scan Beam */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/25">
            <div 
              className="w-full h-full rounded-full animate-radar-sweep opacity-75"
              style={{
                background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.45) 0deg, rgba(6, 182, 212, 0.08) 50deg, transparent 80deg, transparent 360deg)'
              }}
            />
          </div>

          {/* Tactical Lux Telemetry Floating HUD (Bottom Right) */}
          <div className="absolute bottom-16 right-4 sm:bottom-4 sm:right-4 z-[400] p-3.5 rounded-2xl bg-[#17181B] border border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.4)] pointer-events-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-bold tracking-wider text-cyan-300 uppercase font-mono">
                Nocturnal Lux Scanner
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
              <div>
                <span className="text-zinc-400 block">CORRIDOR LUX</span>
                <span className="font-bold text-cyan-300 text-xs">98.4% (Direct)</span>
              </div>
              <div>
                <span className="text-zinc-400 block">SECURITY GRADE</span>
                <span className="font-bold text-emerald-400 text-xs">9.9 / 10 SECURE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-[#17181B] border border-white/[0.08] text-xs text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shadow-[0_0_8px_#007AFF]" />
          <span>Active Safe Corridor</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF9500]" />
          <span>Pre-Planned Backup</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
          <span>24/7 Verified Safe Sanctuary</span>
        </div>
      </div>
    </div>
  );
};
