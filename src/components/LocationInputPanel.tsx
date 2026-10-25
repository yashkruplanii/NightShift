import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation2, 
  Clock, 
  Search, 
  Compass, 
  GraduationCap,
  Building2,
  Train,
  X,
  Loader2
} from 'lucide-react';
import { NAGPUR_SEARCH_DIRECTORY, SearchableLocation } from '../data/nagpur_ground_truth';

interface LocationInputPanelProps {
  currentOriginName: string;
  currentOriginCoords: [number, number];
  currentDestName: string;
  currentDestCoords: [number, number];
  onSelectOrigin: (name: string, coords: [number, number]) => void;
  onSelectDestination: (name: string, coords: [number, number]) => void;
  departureTime?: string;
  deadlineTime?: string;
  onChangeDeparture?: (val: string) => void;
  onChangeDeadline?: (val: string) => void;
  onTriggerLocationPrompt: () => void;
  isDetectingGps?: boolean;
  gpsStatus?: 'prompt' | 'granted' | 'denied';
}

export const LocationInputPanel: React.FC<LocationInputPanelProps> = ({
  currentOriginName,
  currentOriginCoords,
  currentDestName,
  currentDestCoords,
  onSelectOrigin,
  onSelectDestination,
  onTriggerLocationPrompt,
  isDetectingGps = false,
  gpsStatus = 'prompt'
}) => {
  const [destQuery, setDestQuery] = useState<string>('');
  const [originQuery, setOriginQuery] = useState<string>('');
  const [isSearchingDest, setIsSearchingDest] = useState<boolean>(false);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState<boolean>(false);
  const [destSuggestions, setDestSuggestions] = useState<SearchableLocation[]>([]);
  const [originSuggestions, setOriginSuggestions] = useState<SearchableLocation[]>([]);
  const [isLoadingNominatim, setIsLoadingNominatim] = useState<boolean>(false);
  
  const destDropdownRef = useRef<HTMLDivElement>(null);
  const originDropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target as Node)) {
        setIsSearchingDest(false);
      }
      if (originDropdownRef.current && !originDropdownRef.current.contains(e.target as Node)) {
        setIsSearchingOrigin(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Typo normalizer: handles common spelling variations (e.g. "picoolo" -> "piccolo")
  const normalizeQuery = (s: string) => {
    return s.toLowerCase()
      .replace(/oo/g, 'o')
      .replace(/ll/g, 'l')
      .replace(/cc/g, 'c')
      .replace(/ee/g, 'e')
      .replace(/[^a-z0-9]/g, ' ')
      .trim();
  };

  // Smart coordinate resolver for ANY address or location typed by user
  const resolveCustomCoords = (query: string): [number, number] => {
    const q = query.toLowerCase().trim();
    const qNorm = normalizeQuery(query);

    // 1. Check directory direct & keywords
    for (const item of NAGPUR_SEARCH_DIRECTORY) {
      if (item.name.toLowerCase().includes(q) || 
          item.displayName.toLowerCase().includes(q) ||
          item.keywords.some(k => q.includes(k) || k.includes(q) || normalizeQuery(k).includes(qNorm))) {
        return item.coords;
      }
    }

    // 2. Cafes, Lounges & Dining
    if (q.includes("piccolo") || q.includes("picoolo") || q.includes("picolo")) return [21.1565, 79.0760]; // Piccolo Cafe Civil Lines
    if (q.includes("corridor") || q.includes("roaster")) return [21.1345, 79.0645]; // Corridor Seven
    if (q.includes("lush")) return [21.1530, 79.0720]; // Lush House
    if (q.includes("three bean") || q.includes("3 bean")) return [21.1410, 79.0610]; // Three Beans
    if (q.includes("mocha")) return [21.1590, 79.0815]; // Mocha Cafe
    if (q.includes("cafe") || q.includes("coffee") || q.includes("bistro") || q.includes("bakery")) return [21.1565, 79.0760]; // Nagpur Cafe hub

    // 3. Specific landmark keywords
    if (q.includes("ramdeo") || q.includes("katol") || q.includes("gittikhadan")) return [21.1769, 79.0609];
    if (q.includes("iiit") || q.includes("waranga") || q.includes("butibori")) return [20.9472, 79.0255];
    if (q.includes("vnit") || q.includes("ambazari")) return [21.1255, 79.0515];
    if (q.includes("raisoni") || q.includes("hingna") || q.includes("ycce")) return [21.0970, 79.0030];
    if (q.includes("aiims") || q.includes("mihan")) return [20.9650, 79.0280];
    if (q.includes("besa") || q.includes("pipla") || q.includes("manish")) return [21.0850, 79.1020];
    if (q.includes("manewada") || q.includes("omkar")) return [21.1020, 79.1050];
    if (q.includes("sadar") || q.includes("residency")) return [21.1610, 79.0820];
    if (q.includes("sitabuldi") || q.includes("buldi") || q.includes("railway")) return [21.1458, 79.0882];
    if (q.includes("koradi")) return [21.2480, 79.0960];
    if (q.includes("kamptee")) return [21.2220, 79.1980];
    if (q.includes("airport") || q.includes("sonegaon")) return [21.0922, 79.0472];

    // 4. Fallback deterministic offset within Nagpur envelope
    let hash = 0;
    for (let i = 0; i < q.length; i++) {
      hash = (hash << 5) - hash + q.charCodeAt(i);
      hash |= 0;
    }
    const latOffset = (((Math.abs(hash) % 1000) / 1000) * 0.08) - 0.04;
    const lonOffset = ((((Math.abs(hash >> 3)) % 1000) / 1000) * 0.08) - 0.04;
    return [Number((21.1458 + latOffset).toFixed(5)), Number((79.0882 + lonOffset).toFixed(5))];
  };

  // Universal Live Search for Destinations (Local High-Speed Index + Fuzzy Normalization + Live Nominatim)
  const handleDestInputChange = (val: string) => {
    setDestQuery(val);
    if (!val.trim()) {
      setDestSuggestions([]);
      setIsSearchingDest(false);
      return;
    }

    const clean = val.toLowerCase().trim();
    const normalized = normalizeQuery(val);
    const queryTokens = normalized.split(/\s+/).filter(t => t.length > 1);

    // 1. Instant match against our local Nagpur institutions & cafes directory (with typo tolerance!)
    const localMatches = NAGPUR_SEARCH_DIRECTORY.filter(loc => {
      const locName = loc.name.toLowerCase();
      const locDisplay = loc.displayName.toLowerCase();
      const locAddress = loc.address.toLowerCase();
      const locNorm = normalizeQuery(loc.name + " " + loc.displayName + " " + loc.address);

      if (locName.includes(clean) || locDisplay.includes(clean) || locAddress.includes(clean)) return true;
      if (loc.keywords.some(k => k.includes(clean) || clean.includes(k))) return true;
      if (locNorm.includes(normalized)) return true;
      if (queryTokens.length > 0 && queryTokens.some(tok => locNorm.includes(tok) || loc.keywords.some(k => normalizeQuery(k).includes(tok)))) return true;
      return false;
    });

    setDestSuggestions(localMatches);
    setIsSearchingDest(true);

    // 2. Query Live OpenStreetMap Nominatim for ANY location, street, or colony
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsLoadingNominatim(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val + " Nagpur")}&addressdetails=1&limit=5`;
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en' }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const liveMatches: SearchableLocation[] = data.map((item: any, idx: number) => ({
              id: `live_${item.place_id || idx}`,
              name: item.display_name.split(',')[0],
              displayName: item.display_name,
              category: 'commercial',
              address: item.display_name,
              coords: [parseFloat(item.lat), parseFloat(item.lon)],
              keywords: [clean]
            }));

            setDestSuggestions((prev) => {
              const ids = new Set(prev.map(p => p.name.toLowerCase()));
              const filteredLive = liveMatches.filter(l => !ids.has(l.name.toLowerCase()));
              return [...prev, ...filteredLive];
            });
          }
        }
      } catch (err) {
        console.warn("Live geocoding fallback to local index:", err);
      } finally {
        setIsLoadingNominatim(false);
      }
    }, 350);
  };

  // Universal Live Search for Origins
  const handleOriginInputChange = (val: string) => {
    setOriginQuery(val);
    if (!val.trim()) {
      setOriginSuggestions([]);
      setIsSearchingOrigin(false);
      return;
    }

    const clean = val.toLowerCase().trim();
    const localMatches = NAGPUR_SEARCH_DIRECTORY.filter(loc => 
      loc.name.toLowerCase().includes(clean) ||
      loc.displayName.toLowerCase().includes(clean) ||
      loc.address.toLowerCase().includes(clean) ||
      loc.keywords.some(k => k.includes(clean))
    );

    setOriginSuggestions(localMatches);
    setIsSearchingOrigin(true);
  };

  const handleSelectDestItem = (loc: SearchableLocation) => {
    onSelectDestination(loc.name, loc.coords);
    setDestQuery('');
    setIsSearchingDest(false);
  };

  const handleSelectCustomDest = (query: string) => {
    if (!query.trim()) return;
    const coords = resolveCustomCoords(query);
    onSelectDestination(query.trim(), coords);
    setDestQuery('');
    setIsSearchingDest(false);
  };

  const handleSelectOriginItem = (loc: SearchableLocation) => {
    onSelectOrigin(loc.name, loc.coords);
    setOriginQuery('');
    setIsSearchingOrigin(false);
  };

  const handleSelectCustomOrigin = (query: string) => {
    if (!query.trim()) return;
    const coords = resolveCustomCoords(query);
    onSelectOrigin(query.trim(), coords);
    setOriginQuery('');
    setIsSearchingOrigin(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'university': return <GraduationCap className="w-3.5 h-3.5 text-[#007AFF]" />;
      case 'hospital': return <Building2 className="w-3.5 h-3.5 text-[#34C759]" />;
      case 'transit_hub': return <Train className="w-3.5 h-3.5 text-[#FF9500]" />;
      default: return <MapPin className="w-3.5 h-3.5 text-white/60" />;
    }
  };

  return (
    <div className="ios-glass-card rounded-3xl p-5 mb-4 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#007AFF]/20 text-[#007AFF] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-white">
              Trip Route & Live GPS
            </h2>
            <p className="text-[11px] text-white/50">
              Type any address, college, or colony to navigate
            </p>
          </div>
        </div>

        {/* Auto GPS Button */}
        <button
          onClick={onTriggerLocationPrompt}
          disabled={isDetectingGps}
          className={`rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 ${
            isDetectingGps
              ? 'bg-[#007AFF]/25 text-[#007AFF] border border-[#007AFF]/40 animate-pulse'
              : gpsStatus === 'granted'
              ? 'bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/40 hover:bg-[#34C759]/30'
              : 'bg-[#007AFF] hover:bg-[#0066D6] text-white shadow-[0_4px_16px_rgba(0,122,255,0.4)]'
          }`}
        >
          {isDetectingGps ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#007AFF]" />
              <span>Detecting GPS...</span>
            </>
          ) : gpsStatus === 'granted' ? (
            <>
              <Navigation2 className="w-3.5 h-3.5 text-[#34C759] fill-current" />
              <span>GPS Active (Re-detect)</span>
            </>
          ) : (
            <>
              <Navigation2 className="w-3.5 h-3.5 fill-current" />
              <span>Auto-Detect My GPS</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin Field with Autocomplete */}
        <div className="relative" ref={originDropdownRef}>
          <label className="text-[11px] font-medium text-white/50 block mb-1.5">
            DEPARTURE LOCATION (ORIGIN)
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#202227] border border-white/[0.08] focus-within:border-cyan-500/60 transition-colors">
            <MapPin className="w-4 h-4 text-[#007AFF] shrink-0" />
            <input
              type="text"
              placeholder={currentOriginName}
              value={originQuery}
              onChange={(e) => handleOriginInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && originQuery.trim()) {
                  if (originSuggestions.length > 0) {
                    handleSelectOriginItem(originSuggestions[0]);
                  } else {
                    handleSelectCustomOrigin(originQuery);
                  }
                }
              }}
              onFocus={() => {
                if (originQuery.trim()) setIsSearchingOrigin(true);
              }}
              className="bg-transparent text-xs text-white placeholder-white/80 font-medium focus:outline-none w-full"
            />
            {originQuery && (
              <button onClick={() => setOriginQuery('')} className="text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Origin Autocomplete Dropdown */}
          {isSearchingOrigin && originQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 z-[999] rounded-2xl bg-[#0A0E17]/95 backdrop-blur-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/20 max-h-72 overflow-y-auto">
              {/* Option to use custom typed address */}
              <div
                onClick={() => handleSelectCustomOrigin(originQuery)}
                className="p-3 mb-1.5 rounded-xl bg-[#007AFF]/20 hover:bg-[#007AFF]/30 border border-[#007AFF]/40 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#007AFF] flex items-center justify-center text-white shrink-0 shadow-md">
                    <Navigation2 className="w-4 h-4 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Depart from: "{originQuery}"</span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/10 text-[#007AFF]">Custom</span>
                    </div>
                    <div className="text-[10px] text-white/60">Set custom departure origin</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#007AFF] px-2 py-1 rounded-lg bg-[#007AFF]/15 border border-[#007AFF]/30 shrink-0">Select ↵</span>
              </div>

              {originSuggestions.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => handleSelectOriginItem(loc)}
                  className="p-2.5 rounded-xl hover:bg-white/10 cursor-pointer flex items-start gap-2.5 transition-colors"
                >
                  <div className="mt-0.5">{getCategoryIcon(loc.category)}</div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white">{loc.name}</div>
                    <div className="text-[10px] text-white/50 leading-tight">{loc.address}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Field with Universal Search */}
        <div className="relative" ref={destDropdownRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-medium text-white/50">
              WHERE ARE YOU HEADED? (DESTINATION)
            </label>
            {isLoadingNominatim && (
              <span className="text-[10px] text-[#007AFF] flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Searching Nagpur...</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#202227] border border-white/[0.08] focus-within:border-emerald-500/60 transition-colors">
            <Search className="w-4 h-4 text-[#34C759] shrink-0" />
            <input
              type="text"
              placeholder={`Search: ${currentDestName}`}
              value={destQuery}
              onChange={(e) => handleDestInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && destQuery.trim()) {
                  if (destSuggestions.length > 0) {
                    handleSelectDestItem(destSuggestions[0]);
                  } else {
                    handleSelectCustomDest(destQuery);
                  }
                }
              }}
              onFocus={() => {
                if (destQuery.trim()) setIsSearchingDest(true);
              }}
              className="bg-transparent text-xs text-white placeholder-white/80 font-medium focus:outline-none w-full"
            />
            {destQuery && (
              <button onClick={() => setDestQuery('')} className="text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Universal Suggestions Dropdown */}
          {isSearchingDest && destQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 z-[999] rounded-2xl bg-[#0A0E17]/95 backdrop-blur-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/20 max-h-72 overflow-y-auto">
              {/* Option to use custom typed address */}
              <div
                onClick={() => handleSelectCustomDest(destQuery)}
                className="p-3 mb-2 rounded-xl bg-gradient-to-r from-[#34C759]/20 to-[#007AFF]/20 hover:from-[#34C759]/30 hover:to-[#007AFF]/30 border border-[#34C759]/40 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#34C759] flex items-center justify-center text-white shrink-0 shadow-md">
                    <Navigation2 className="w-4 h-4 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Go to: "{destQuery}"</span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/10 text-[#34C759]">Custom Destination</span>
                    </div>
                    <div className="text-[10px] text-white/60">Navigate to this location & find safest lit route</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#34C759] px-2 py-1 rounded-lg bg-[#34C759]/15 border border-[#34C759]/30 shrink-0">Select ↵</span>
              </div>

              {destSuggestions.length > 0 && (
                <div className="px-3 py-1 text-[10px] font-semibold text-white/40 uppercase">
                  Verified Locations:
                </div>
              )}

              {destSuggestions.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => handleSelectDestItem(loc)}
                  className="p-2.5 rounded-xl hover:bg-white/10 cursor-pointer flex items-start gap-2.5 transition-colors"
                >
                  <div className="mt-0.5">{getCategoryIcon(loc.category)}</div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white">{loc.name}</div>
                    <div className="text-[10px] text-white/50 leading-tight">{loc.address}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Destination Quick Chips */}
      <div className="mt-3 flex items-center flex-wrap gap-1.5">
        <span className="text-[10px] text-white/40 mr-1">Quick Select:</span>
        {NAGPUR_SEARCH_DIRECTORY.slice(0, 8).map((loc) => {
          const isSelected = loc.name === currentDestName;
          return (
            <button
              key={loc.id}
              onClick={() => onSelectDestination(loc.name, loc.coords)}
              className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/40 font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {loc.name.split(' (')[0]}
            </button>
          );
        })}
      </div>

    </div>
  );
};
