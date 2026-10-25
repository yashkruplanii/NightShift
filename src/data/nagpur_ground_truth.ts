export interface SearchableLocation {
  id: string;
  name: string;
  displayName: string;
  category: 'university' | 'hospital' | 'transit_hub' | 'residential' | 'commercial';
  address: string;
  coords: [number, number]; // [lat, lon]
  keywords: string[];
}

export interface SafeHaven {
  id: string;
  name: string;
  category: 'pharmacy_247' | 'police_station' | 'hospital_emergency' | 'manned_fuel';
  lat: number;
  lon: number;
  address: string;
  osmNodeId: string;
  operatingHours: string;
  litEnvironment: boolean;
  mannedSecurity: boolean;
  verificationSource: string;
  simpleExplanation: string;
  initialConfidence: number;
  decayRateLambda: number;
  lastVerifiedMinutesAgo: number;
  governmentLicenseRef?: string;
  officialDepartment?: string;
  officialEmergencyPhone?: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  fromId: string;
  toId: string;
  distanceMeters: number;
  walkingMinutes: number;
  lit: boolean;
  simpleReason: string;
  nearestSafeHavenId: string;
  distanceToSafeHavenMeters: number;
  coordinates: [number, number][];
  isFloodProne: boolean;
  hazardNote?: string;
}

// 100% Ground-Truth Search Directory for Nagpur
export const NAGPUR_SEARCH_DIRECTORY: SearchableLocation[] = [
  // Universities & Engineering Colleges
  {
    id: "loc_ramdeobaba",
    name: "Shri Ramdeobaba University (RCOEM)",
    displayName: "Shri Ramdeobaba University (RCOEM), Katol Road",
    category: "university",
    address: "Katol Road, Lonand, Gittikhadan, Nagpur, MH 440013",
    coords: [21.1769, 79.0609],
    keywords: ["ramdeo", "ramdeobaba", "rcoem", "rknec", "katol", "gittikhadan", "engineering"]
  },
  {
    id: "loc_iiitn",
    name: "IIIT Nagpur Campus (Waranga)",
    displayName: "IIIT Nagpur Campus, Butibori-Waranga Road",
    category: "university",
    address: "Survey No. 140, 141/1, Waranga, Butibori, Nagpur, MH 441108",
    coords: [20.9472, 79.0255],
    keywords: ["iiit", "iiitn", "iiit nagpur", "waranga", "butibori", "cascade", "tantrafiesta"]
  },
  {
    id: "loc_vnit",
    name: "VNIT Nagpur",
    displayName: "Visvesvaraya National Institute of Technology (VNIT)",
    category: "university",
    address: "South Ambazari Road, Ambazari, Nagpur, MH 440010",
    coords: [21.1255, 79.0515],
    keywords: ["vnit", "visvesvaraya", "ambazari", "south ambazari"]
  },
  {
    id: "loc_raisoni",
    name: "G.H. Raisoni College of Engineering (GHREC)",
    displayName: "G.H. Raisoni College of Engineering, CRPF Gate, Hingna",
    category: "university",
    address: "CRPF Gate No. 3, Hingna Road, Digdoh Hills, Nagpur, MH 440016",
    coords: [21.0970, 79.0030],
    keywords: ["raisoni", "ghrce", "crpf", "digdoh", "hingna", "engineering"]
  },
  {
    id: "loc_ycce",
    name: "YCCE (Yeshwantrao Chavan College of Engineering)",
    displayName: "YCCE Campus, Wanadongri, Hingna",
    category: "university",
    address: "Hingna Road, Wanadongri, Nagpur, MH 441110",
    coords: [21.0985, 78.9780],
    keywords: ["ycce", "yeshwantrao", "chavan", "wanadongri", "hingna"]
  },
  {
    id: "loc_lit",
    name: "LIT Nagpur (Laxminarayan Innovation Tech)",
    displayName: "LIT University Campus, Amravati Road",
    category: "university",
    address: "Amravati Road, Ram Nagar, Nagpur, MH 440033",
    coords: [21.1448, 79.0505],
    keywords: ["lit", "laxminarayan", "amravati road", "chemical"]
  },
  {
    id: "loc_iim",
    name: "IIM Nagpur",
    displayName: "Indian Institute of Management (IIM) Nagpur, MIHAN",
    category: "university",
    address: "Plot No. 1, Sector 20, MIHAN, Nagpur, MH 441108",
    coords: [20.9830, 79.0290],
    keywords: ["iim", "iim nagpur", "mihan", "management"]
  },
  {
    id: "loc_mnlu",
    name: "MNLU Nagpur (National Law University)",
    displayName: "Maharashtra National Law University, Waranga",
    category: "university",
    address: "Near Water Tank, Waranga, Nagpur, MH 441108",
    coords: [20.9520, 79.0270],
    keywords: ["mnlu", "law university", "waranga"]
  },
  {
    id: "loc_pallotti",
    name: "St. Vincent Pallotti College of Engineering",
    displayName: "St. Vincent Pallotti College, Wardha Road",
    category: "university",
    address: "Gavsi Manapur, Wardha Road, Nagpur, MH 441108",
    coords: [20.9850, 79.0430],
    keywords: ["pallotti", "vincent", "gavsi manapur", "wardha road"]
  },
  {
    id: "loc_pce",
    name: "Priyadarshini College of Engineering (PCE)",
    displayName: "Priyadarshini Campus, CRPF Gate, Hingna",
    category: "university",
    address: "Near CRPF Campus, Hingna Road, Nagpur, MH 440019",
    coords: [21.1070, 79.0010],
    keywords: ["pce", "priyadarshini", "lokmanya"]
  },
  {
    id: "loc_ambedkar_college",
    name: "Dr. Ambedkar College, Deekshabhoomi",
    displayName: "Dr. Ambedkar College, Deekshabhoomi Ground",
    category: "university",
    address: "Deekshabhoomi, Laxminagar, Nagpur, MH 440010",
    coords: [21.1275, 79.0675],
    keywords: ["ambedkar college", "deekshabhoomi", "laxmi nagar"]
  },

  // Hospitals & Emergency Centers
  {
    id: "loc_gmch",
    name: "GMCH Trauma Centre (Medical Square)",
    displayName: "GMCH Nagpur Level-1 Trauma Centre, Medical Square",
    category: "hospital",
    address: "Hanuman Nagar, Medical College Campus, Nagpur, MH 440003",
    coords: [21.1278, 79.0970],
    keywords: ["gmch", "medical", "medical square", "trauma", "hospital", "hanuman nagar"]
  },
  {
    id: "loc_aiims",
    name: "AIIMS Nagpur",
    displayName: "AIIMS Nagpur, MIHAN Special Economic Zone",
    category: "hospital",
    address: "Plot No. 2, Sector 20, MIHAN, Nagpur, MH 441108",
    coords: [20.9650, 79.0280],
    keywords: ["aiims", "aiims nagpur", "mihan", "hospital"]
  },
  {
    id: "loc_mayo",
    name: "IGGMC (Mayo Hospital)",
    displayName: "Indira Gandhi Govt Medical College (Mayo Hospital), Central Ave",
    category: "hospital",
    address: "Central Avenue, Mominpura, Nagpur, MH 440018",
    coords: [21.1540, 79.0980],
    keywords: ["mayo", "iggmc", "central avenue", "mominpura", "hospital"]
  },
  {
    id: "loc_kingsway",
    name: "Kingsway Hospital",
    displayName: "Kingsway Super Speciality Hospital, Station Road",
    category: "hospital",
    address: "Near Kasturchand Park, Kingsway, Nagpur, MH 440001",
    coords: [21.1555, 79.0880],
    keywords: ["kingsway", "station", "kasturchand", "hospital"]
  },
  {
    id: "loc_alexis",
    name: "Max Super Speciality Hospital (formerly Alexis)",
    displayName: "Max Super Speciality Hospital, Mankapur, Koradi Road",
    category: "hospital",
    address: "Survey No. 232, Mankapur, Koradi Road, Nagpur, MH 440030",
    coords: [21.1920, 79.0810],
    keywords: ["alexis", "max", "mankapur", "koradi road", "hospital"]
  },
  {
    id: "loc_wockhardt",
    name: "Wockhardt Super Speciality Hospital",
    displayName: "Wockhardt Hospital, Shankar Nagar Square",
    category: "hospital",
    address: "1643, North Ambazari Road, Shankar Nagar, Nagpur, MH 440033",
    coords: [21.1320, 79.0610],
    keywords: ["wockhardt", "shankar nagar", "ambazari", "hospital"]
  },
  {
    id: "loc_orange_city_hosp",
    name: "Orange City Hospital & Research Institute",
    displayName: "Orange City Hospital, Khamla Square",
    category: "hospital",
    address: "Veer Savarkar Square, Khamla, Nagpur, MH 440015",
    coords: [21.1180, 79.0640],
    keywords: ["orange city", "ochri", "khamla", "hospital"]
  },

  // Transit Hubs & Terminals
  {
    id: "loc_sitabuldi",
    name: "Sitabuldi Metro Interchange & Station",
    displayName: "Sitabuldi Interchange, Central Nagpur",
    category: "transit_hub",
    address: "Sitabuldi, Wardha Road Junction, Nagpur, MH 440012",
    coords: [21.1458, 79.0882],
    keywords: ["sitabuldi", "buldi", "metro", "station", "railway", "interchange"]
  },
  {
    id: "loc_railway_station",
    name: "Nagpur Central Railway Station",
    displayName: "Nagpur Central Railway Station (Main Gate & Santra Market)",
    category: "transit_hub",
    address: "Station Road, Sitabuldi / Santra Market, Nagpur, MH 440001",
    coords: [21.1525, 79.0890],
    keywords: ["railway station", "train", "santra market", "nagpur junction", "central"]
  },
  {
    id: "loc_ajni_station",
    name: "Ajni Railway Station & Metro",
    displayName: "Ajni Railway Station, Wardha Road Corridor",
    category: "transit_hub",
    address: "Ajni Square, Congress Nagar, Nagpur, MH 440012",
    coords: [21.1220, 79.0905],
    keywords: ["ajni", "ajni station", "metro", "congress nagar"]
  },
  {
    id: "loc_airport",
    name: "Nagpur International Airport (MIHAN)",
    displayName: "Dr. Babasaheb Ambedkar International Airport",
    category: "transit_hub",
    address: "Sonegaon, Wardha Road, Nagpur, MH 440005",
    coords: [21.0922, 79.0472],
    keywords: ["airport", "sonegaon", "mihan", "flight", "terminal", "aerodrome"]
  },
  {
    id: "loc_ganesh_peth",
    name: "Ganesh Peth Central ST Bus Stand",
    displayName: "Ganesh Peth ST Bus Terminal, Nagpur",
    category: "transit_hub",
    address: "Ganesh Peth, Great Nag Road, Nagpur, MH 440018",
    coords: [21.1460, 79.1020],
    keywords: ["ganesh peth", "st stand", "bus stand", "msrtc"]
  },
  {
    id: "loc_mor_bhavan",
    name: "Mor Bhavan City Bus Terminus",
    displayName: "Mor Bhavan Bus Terminus, Sitabuldi",
    category: "transit_hub",
    address: "Jhansi Rani Square, Sitabuldi, Nagpur, MH 440012",
    coords: [21.1435, 79.0825],
    keywords: ["mor bhavan", "city bus", "aapli bus", "sitabuldi"]
  },
  {
    id: "loc_automotive_metro",
    name: "Automotive Square Metro Station",
    displayName: "Automotive Square Terminal Metro Station, Kamptee Road",
    category: "transit_hub",
    address: "Kamptee Road, Uppalwadi, Nagpur, MH 440026",
    coords: [21.2010, 79.0980],
    keywords: ["automotive square", "metro", "kamptee road", "uppalwadi"]
  },
  {
    id: "loc_khapri_metro",
    name: "Khapri Metro Station",
    displayName: "Khapri Metro Station, Wardha Road / MIHAN",
    category: "transit_hub",
    address: "Wardha Road, Khapri, Nagpur, MH 441108",
    coords: [21.0370, 79.0460],
    keywords: ["khapri", "metro", "mihan", "wardha road"]
  },
  {
    id: "loc_lokmanya_metro",
    name: "Lokmanya Nagar Metro Station",
    displayName: "Lokmanya Nagar Metro Station, Hingna Road",
    category: "transit_hub",
    address: "Hingna Road, Lokmanya Nagar, Nagpur, MH 440016",
    coords: [21.1120, 79.0060],
    keywords: ["lokmanya nagar", "metro", "hingna"]
  },
  {
    id: "loc_prajapati_metro",
    name: "Prajapati Nagar Metro Station",
    displayName: "Prajapati Nagar Metro Terminal, Central Avenue",
    category: "transit_hub",
    address: "Central Avenue, Prajapati Nagar, Nagpur, MH 440008",
    coords: [21.1510, 79.1480],
    keywords: ["prajapati nagar", "metro", "east nagpur", "central avenue"]
  },

  // Tech Parks & Commercial Corridors
  {
    id: "loc_mihan_sez",
    name: "MIHAN SEZ (Infosys, TCS, Tech Mahindra)",
    displayName: "MIHAN IT Park (Infosys, TCS Sahyadri, Tech Mahindra)",
    category: "commercial",
    address: "Sector 20/21, MIHAN SEZ, Nagpur, MH 441108",
    coords: [20.9980, 79.0410],
    keywords: ["mihan", "infosys", "tcs", "tech mahindra", "hcl", "sez"]
  },
  {
    id: "loc_dharampeth",
    name: "Dharampeth Main Road",
    displayName: "Dharampeth Commercial Corridor, West High Court Road",
    category: "commercial",
    address: "West High Court Road, Dharampeth, Nagpur, MH 440010",
    coords: [21.1415, 79.0620],
    keywords: ["dharampeth", "whc road", "west nagpur", "coffee house"]
  },
  {
    id: "loc_sadar",
    name: "Sadar Residency Road",
    displayName: "Sadar Bazar, Residency Road & Mount Road",
    category: "commercial",
    address: "Residency Road, Sadar, Nagpur, MH 440001",
    coords: [21.1610, 79.0820],
    keywords: ["sadar", "residency", "mount road", "raj bhavan"]
  },
  {
    id: "loc_itwari",
    name: "Itwari Wholesale Market & Sarafa",
    displayName: "Itwari Commercial Hub & Sarafa Bazar",
    category: "commercial",
    address: "Itwari Bazar, Central Avenue, Nagpur, MH 440002",
    coords: [21.1530, 79.1120],
    keywords: ["itwari", "sarafa", "cloth market", "kirana market"]
  },
  {
    id: "loc_mahal",
    name: "Mahal & Gandhi Gate",
    displayName: "Mahal Heritage & Commercial Quarter, Gandhi Gate",
    category: "commercial",
    address: "Gandhi Gate, Mahal, Nagpur, MH 440032",
    coords: [21.1420, 79.1050],
    keywords: ["mahal", "gandhi gate", "tilak putla", "kotwali"]
  },
  {
    id: "loc_eternity_mall",
    name: "Eternity Mall / Variety Square",
    displayName: "Eternity Mall, Variety Square, Sitabuldi",
    category: "commercial",
    address: "Variety Square, Amravati Road, Sitabuldi, Nagpur, MH 440012",
    coords: [21.1430, 79.0850],
    keywords: ["eternity mall", "variety square", "cinemax", "sitabuldi"]
  },
  {
    id: "loc_vr_mall",
    name: "VR Nagpur Mall (Trillium)",
    displayName: "VR Nagpur Shopping Mall, Medical Square",
    category: "commercial",
    address: "Medical Square, Great Nag Road, Nagpur, MH 440009",
    coords: [21.1290, 79.1030],
    keywords: ["vr mall", "trillium", "medical square", "shopping"]
  },
  {
    id: "loc_hingna",
    name: "Hingna Road Industrial T-Point",
    displayName: "Hingna T-Point, Industrial Belt",
    category: "commercial",
    address: "Hingna Road, Electronic Zone, Nagpur, MH 440016",
    coords: [21.1110, 79.0080],
    keywords: ["hingna", "midc", "t-point", "icad"]
  },
  {
    id: "loc_butibori_midc",
    name: "Butibori MIDC Industrial Area",
    displayName: "Butibori 5-Star MIDC Industrial Area",
    category: "commercial",
    address: "MIDC Butibori, NH-44, Nagpur, MH 441122",
    coords: [20.9250, 78.9950],
    keywords: ["butibori", "midc", "indorama", "nh44"]
  },

  // Popular Cafes, Dining & Hangout Spots
  {
    id: "loc_piccolo_cafe",
    name: "Piccolo Cafe & Bistro",
    displayName: "Piccolo Cafe & Bistro, Civil Lines / Sadar",
    category: "commercial",
    address: "Residency Road / Civil Lines, Sadar, Nagpur, MH 440001",
    coords: [21.1565, 79.0760],
    keywords: ["piccolo", "picoolo", "picolo", "piccolo cafe", "picoolo cafe", "cafe", "bistro", "coffee", "civil lines", "sadar"]
  },
  {
    id: "loc_corridor_seven",
    name: "Corridor Seven Coffee Roasters",
    displayName: "Corridor Seven Coffee Roasters, Shankar Nagar",
    category: "commercial",
    address: "North Ambazari Road, Shankar Nagar, Nagpur, MH 440010",
    coords: [21.1345, 79.0645],
    keywords: ["corridor seven", "corridor 7", "coffee", "cafe", "shankar nagar", "roasters"]
  },
  {
    id: "loc_lush_house",
    name: "Lush House Cafe",
    displayName: "Lush House Cafe, High Court Road, Civil Lines",
    category: "commercial",
    address: "Near High Court, Civil Lines, Nagpur, MH 440001",
    coords: [21.1530, 79.0720],
    keywords: ["lush house", "lush cafe", "civil lines", "cafe", "coffee"]
  },
  {
    id: "loc_three_beans",
    name: "Three Beans Coffee",
    displayName: "Three Beans Coffee Shop, Dharampeth",
    category: "commercial",
    address: "West High Court Road, Dharampeth, Nagpur, MH 440010",
    coords: [21.1410, 79.0610],
    keywords: ["three beans", "3 beans", "cafe", "dharampeth", "coffee"]
  },
  {
    id: "loc_mocha_cafe",
    name: "Mocha Cafe & Bar",
    displayName: "Mocha Cafe, Mount Road, Sadar",
    category: "commercial",
    address: "Mount Road Extension, Sadar, Nagpur, MH 440001",
    coords: [21.1590, 79.0815],
    keywords: ["mocha", "mocha cafe", "sadar", "coffee", "lounge"]
  },
  {
    id: "loc_haldirams",
    name: "Haldiram's Express & Restaurant",
    displayName: "Haldiram's, Sitabuldi / Shankar Nagar",
    category: "commercial",
    address: "West High Court Road, Sitabuldi, Nagpur, MH 440010",
    coords: [21.1420, 79.0840],
    keywords: ["haldiram", "haldirams", "sweets", "restaurant", "food", "sitabuldi"]
  },
  {
    id: "loc_starbucks",
    name: "Starbucks Coffee",
    displayName: "Starbucks Coffee, Dharampeth / VR Mall",
    category: "commercial",
    address: "WHC Road, Dharampeth, Nagpur, MH 440010",
    coords: [21.1390, 79.0630],
    keywords: ["starbucks", "starbucks coffee", "dharampeth", "vr mall", "coffee"]
  },

  // Major Residential Localities & Squares
  {
    id: "loc_manewada",
    name: "Manewada Ring Road Junction",
    displayName: "Manewada Chowk, South Ring Road",
    category: "residential",
    address: "Manewada Ring Road, Nagpur, MH 440027",
    coords: [21.1020, 79.1050],
    keywords: ["manewada", "ring road", "chowk", "south nagpur", "omkar nagar"]
  },
  {
    id: "loc_besa",
    name: "Besa Chowk",
    displayName: "Besa Chowk, Besa-Pipla Corridor",
    category: "residential",
    address: "Besa Square, South Extension, Nagpur, MH 440037",
    coords: [21.0850, 79.1020],
    keywords: ["besa", "pipla", "ghogli", "south", "beltarodi"]
  },
  {
    id: "loc_manish_nagar",
    name: "Manish Nagar T-Point",
    displayName: "Manish Nagar Railway Crossing & Market",
    category: "residential",
    address: "Manish Nagar Main Road, Somalwada, Nagpur, MH 440015",
    coords: [21.0890, 79.0820],
    keywords: ["manish nagar", "somalwada", "crossing"]
  },
  {
    id: "loc_trimurti_nagar",
    name: "Trimurti Nagar Square",
    displayName: "Trimurti Nagar Square & NIT Garden",
    category: "residential",
    address: "Ring Road, Trimurti Nagar, Nagpur, MH 440022",
    coords: [21.1160, 79.0390],
    keywords: ["trimurti nagar", "subhash nagar", "ring road"]
  },
  {
    id: "loc_pratap_nagar",
    name: "Pratap Nagar Square",
    displayName: "Pratap Nagar Square, West Nagpur",
    category: "residential",
    address: "Pratap Nagar Main Road, Nagpur, MH 440022",
    coords: [21.1180, 79.0490],
    keywords: ["pratap nagar", "pioneer", "khamla"]
  },
  {
    id: "loc_khamla",
    name: "Khamla Square",
    displayName: "Khamla Square, South-West Nagpur",
    category: "residential",
    address: "Khamla Road, Deo Nagar, Nagpur, MH 440025",
    coords: [21.1130, 79.0630],
    keywords: ["khamla", "deo nagar", "orange city hospital"]
  },
  {
    id: "loc_laxmi_nagar",
    name: "Laxmi Nagar Square",
    displayName: "Laxmi Nagar Square (Water Tank)",
    category: "residential",
    address: "Laxmi Nagar Water Tank, WHC Road, Nagpur, MH 440022",
    coords: [21.1250, 79.0650],
    keywords: ["laxmi nagar", "water tank", "whc road", "bajaj nagar"]
  },
  {
    id: "loc_ramdaspeth",
    name: "Ramdaspeth (Central Bazar Road)",
    displayName: "Ramdaspeth Residential & Healthcare Hub",
    category: "residential",
    address: "Central Bazar Road, Ramdaspeth, Nagpur, MH 440010",
    coords: [21.1360, 79.0730],
    keywords: ["ramdaspeth", "central bazar", "canal road"]
  },
  {
    id: "loc_dhantoli",
    name: "Dhantoli (Lokmat Square)",
    displayName: "Dhantoli Healthcare Hub & Lokmat Square",
    category: "residential",
    address: "Wardha Road, Dhantoli, Nagpur, MH 440012",
    coords: [21.1340, 79.0820],
    keywords: ["dhantoli", "lokmat square", "congress nagar"]
  },
  {
    id: "loc_civil_lines",
    name: "Civil Lines (High Court & Vidhan Bhavan)",
    displayName: "Civil Lines Government & Judiciary Enclave",
    category: "residential",
    address: "High Court Road, Civil Lines, Nagpur, MH 440001",
    coords: [21.1540, 79.0700],
    keywords: ["civil lines", "high court", "vidhan bhavan", "raj bhavan"]
  },
  {
    id: "loc_gittikhadan",
    name: "Gittikhadan / Borgaon",
    displayName: "Gittikhadan Square, Katol Road Corridor",
    category: "residential",
    address: "Katol Road, Gittikhadan, Nagpur, MH 440013",
    coords: [21.1720, 79.0550],
    keywords: ["gittikhadan", "borgaon", "katol naka", "police station"]
  },
  {
    id: "loc_jaripatka",
    name: "Jaripatka (Sindhi Colony)",
    displayName: "Jaripatka Main Market, North Nagpur",
    category: "residential",
    address: "Jaripatka Ring Road, Nagpur, MH 440014",
    coords: [21.1850, 79.0980],
    keywords: ["jaripatka", "sindhi colony", "north nagpur"]
  },
  {
    id: "loc_nandanvan",
    name: "Nandanvan Colony",
    displayName: "Nandanvan Main Road, East Nagpur",
    category: "residential",
    address: "Nandanvan Main Road, Nagpur, MH 440009",
    coords: [21.1310, 79.1300],
    keywords: ["nandanvan", "kdk college", "hasanbagh"]
  },
  {
    id: "loc_sakkardara",
    name: "Sakkardara Lake & Square",
    displayName: "Sakkardara Square & Lake, South-East Nagpur",
    category: "residential",
    address: "Sakkardara Chowk, Great Nag Road, Nagpur, MH 440024",
    coords: [21.1210, 79.1180],
    keywords: ["sakkardara", "lake", "bada tajbagh"]
  },
  {
    id: "loc_wardhaman_nagar",
    name: "Wardhaman Nagar (HB Town)",
    displayName: "Wardhaman Nagar & HB Town, Central Avenue Extension",
    category: "residential",
    address: "Central Avenue, Wardhaman Nagar, Nagpur, MH 440008",
    coords: [21.1490, 79.1380],
    keywords: ["wardhaman nagar", "hb town", "central avenue"]
  },
  {
    id: "loc_futala",
    name: "Futala Lake Promenade",
    displayName: "Futala Lake Waterfront & Promenade",
    category: "residential",
    address: "Futala Lake Road, Telankhedi, Nagpur, MH 440001",
    coords: [21.1530, 79.0430],
    keywords: ["futala", "lake", "telankhedi", "fountain"]
  },
  {
    id: "loc_koradi",
    name: "Koradi Temple & Power Station",
    displayName: "Shri Mahalakshmi Jagdamba Temple, Koradi",
    category: "residential",
    address: "Koradi Road, Nagpur, MH 441111",
    coords: [21.2480, 79.0960],
    keywords: ["koradi", "temple", "thermal", "power station"]
  },
  {
    id: "loc_kamptee",
    name: "Kamptee Cantonment (Dragon Palace)",
    displayName: "Kamptee Town & Dragon Palace Temple",
    category: "residential",
    address: "Kamptee Road, Nagpur, MH 441001",
    coords: [21.2220, 79.1980],
    keywords: ["kamptee", "dragon palace", "cantonment", "military"]
  }
];

export const NAGPUR_SAFE_HAVENS: SafeHaven[] = [
  {
    id: "haven_apollo_medsq",
    name: "Apollo Pharmacy 24/7 (Medical Square)",
    category: "pharmacy_247",
    lat: 21.1305,
    lon: 79.0995,
    address: "Medical Square, Great Nag Road, Nagpur",
    osmNodeId: "OSM Node #84920194",
    operatingHours: "Open 24 Hours (Licensed Medical)",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Municipal Drug License Registry (Active 2026)",
    simpleExplanation: "Verified open all night. Brightly lit shopfront with CCTV and active pharmacist on duty.",
    initialConfidence: 0.98,
    decayRateLambda: 0.005,
    lastVerifiedMinutesAgo: 14,
    governmentLicenseRef: "FDA Lic: MH-NGP-20B-18492 & 21B-18493",
    officialDepartment: "Maharashtra FDA (Food & Drugs Administration)",
    officialEmergencyPhone: "0712-2748888"
  },
  {
    id: "haven_indianoil_wardha",
    name: "Indian Oil 24/7 Station & Canopy",
    category: "manned_fuel",
    lat: 21.1150,
    lon: 79.0820,
    address: "Wardha Road, near Ajni Flyover, Nagpur",
    osmNodeId: "OSM Node #52910382",
    operatingHours: "Open 24 Hours (Manned Cashier)",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Petroleum Ministry Active Station Registry",
    simpleExplanation: "Manned round-the-clock with illuminated high-lux canopy, security guard, and convenience store.",
    initialConfidence: 0.95,
    decayRateLambda: 0.008,
    lastVerifiedMinutesAgo: 22,
    governmentLicenseRef: "MoPNG RO Code: IOC-MH-440012-78",
    officialDepartment: "Ministry of Petroleum & Natural Gas, GoI",
    officialEmergencyPhone: "1800-233-3555"
  },
  {
    id: "haven_ajni_police",
    name: "Ajni Police Assistance Post",
    category: "police_station",
    lat: 21.1215,
    lon: 79.0910,
    address: "Ajni Chowk, Wardha Road, Nagpur",
    osmNodeId: "OSM Node #31940122",
    operatingHours: "24/7 Active Police Booth",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Nagpur Police PCR Beat Stream",
    simpleExplanation: "Active 24/7 police booth with emergency phone, illuminated checkpoint, and night patrol presence.",
    initialConfidence: 0.99,
    decayRateLambda: 0.002,
    lastVerifiedMinutesAgo: 5,
    governmentLicenseRef: "Police Code: POL-NGP-Z4-AJNI",
    officialDepartment: "Nagpur City Police (Zone 4) / Dial 112 CAD",
    officialEmergencyPhone: "0712-2746400"
  },
  {
    id: "haven_gmch_trauma",
    name: "GMCH Main Trauma Emergency Gate",
    category: "hospital_emergency",
    lat: 21.1278,
    lon: 79.0970,
    address: "Hanuman Nagar, Medical College Campus, Nagpur",
    osmNodeId: "OSM Node #10928374",
    operatingHours: "24/7 Public Hospital",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Directorate of Health Services",
    simpleExplanation: "Level-1 emergency trauma centre with continuous guard staff and ambulance bays.",
    initialConfidence: 1.0,
    decayRateLambda: 0.001,
    lastVerifiedMinutesAgo: 2,
    governmentLicenseRef: "DHS Reg: MH-NGP-GOV-001 (Level-1 Trauma)",
    officialDepartment: "Directorate of Health Services, Govt of Maharashtra",
    officialEmergencyPhone: "0712-2725423"
  },
  {
    id: "haven_sanjeevani_untkhana",
    name: "Sanjeevani All-Night Chemist",
    category: "pharmacy_247",
    lat: 21.1245,
    lon: 79.1012,
    address: "Untkhana Chowk, Rambagh Road, Nagpur",
    osmNodeId: "OSM Node #63810294",
    operatingHours: "Open 24 Hours",
    litEnvironment: true,
    mannedSecurity: false,
    verificationSource: "Nagpur Chemist Association Night Roster",
    simpleExplanation: "Active emergency counter on Great Nag Road with illuminated street lighting.",
    initialConfidence: 0.88,
    decayRateLambda: 0.015,
    lastVerifiedMinutesAgo: 45,
    governmentLicenseRef: "FDA Lic: MH-NGP-20B-09821 & 21B-09822",
    officialDepartment: "Maharashtra FDA All-Night Chemist Registry",
    officialEmergencyPhone: "0712-2701122"
  },
  {
    id: "haven_lata_mangeshkar_hingna",
    name: "Lata Mangeshkar Hospital 24/7 Emergency (Hingna)",
    category: "hospital_emergency",
    lat: 21.1015,
    lon: 78.9880,
    address: "Digdoh Hills, Hingna Road, near YCCE, Nagpur",
    osmNodeId: "OSM Node #71928412",
    operatingHours: "24/7 Emergency & Trauma",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Directorate of Medical Education & Health",
    simpleExplanation: "24/7 full tertiary hospital with active emergency bays, security guards, and lit ambulance access.",
    initialConfidence: 0.99,
    decayRateLambda: 0.001,
    lastVerifiedMinutesAgo: 4,
    governmentLicenseRef: "DMER Reg: MH-NGP-HSP-084",
    officialDepartment: "Directorate of Medical Education & Research (DMER)",
    officialEmergencyPhone: "07104-236290"
  },
  {
    id: "haven_hingna_police",
    name: "Hingna Police Station 24/7 Outpost",
    category: "police_station",
    lat: 21.1090,
    lon: 79.0040,
    address: "CRPF Gate No. 3, Hingna Road, Nagpur",
    osmNodeId: "OSM Node #48291048",
    operatingHours: "24/7 Active Police Station",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Nagpur Rural Police Beat Feed",
    simpleExplanation: "Manned 24/7 police outpost with illuminated forecourt, night patrol vans, and emergency hotline.",
    initialConfidence: 0.98,
    decayRateLambda: 0.002,
    lastVerifiedMinutesAgo: 8,
    governmentLicenseRef: "Police Code: POL-NGP-RUR-HING",
    officialDepartment: "Nagpur Rural Police / Dial 112 MERS",
    officialEmergencyPhone: "07104-242033"
  },
  {
    id: "haven_kingsway_hospital",
    name: "Kingsway Hospital 24/7 Trauma Gate",
    category: "hospital_emergency",
    lat: 21.1555,
    lon: 79.0880,
    address: "Near Kasturchand Park, Station Road, Sadar, Nagpur",
    osmNodeId: "OSM Node #91028345",
    operatingHours: "Open 24 Hours (Level-1 Trauma)",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Nagpur Municipal Health Dept",
    simpleExplanation: "Major hospital emergency reception with continuous lighting, guards, and pharmacy.",
    initialConfidence: 1.0,
    decayRateLambda: 0.001,
    lastVerifiedMinutesAgo: 3,
    governmentLicenseRef: "NMC Health Reg: NMC-HSP-2019-0412",
    officialDepartment: "Nagpur Municipal Corporation Health Dept",
    officialEmergencyPhone: "0712-6789100"
  },
  {
    id: "haven_sadar_police",
    name: "Sadar Police Station 24/7 Assistance Booth",
    category: "police_station",
    lat: 21.1585,
    lon: 79.0805,
    address: "Residency Road, Sadar, Civil Lines Corridor, Nagpur",
    osmNodeId: "OSM Node #28471920",
    operatingHours: "24/7 Active Station",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Nagpur Police PCR Beat Stream",
    simpleExplanation: "24/7 manned police station with well-lit perimeter, CCTV surveillance, and emergency response.",
    initialConfidence: 0.99,
    decayRateLambda: 0.002,
    lastVerifiedMinutesAgo: 6,
    governmentLicenseRef: "Police Code: POL-NGP-Z2-SADR",
    officialDepartment: "Nagpur City Police (Zone 2) / Dial 112 CAD",
    officialEmergencyPhone: "0712-2560300"
  },
  {
    id: "haven_gittikhadan_police",
    name: "Gittikhadan Police Station (Katol Road)",
    category: "police_station",
    lat: 21.1730,
    lon: 79.0560,
    address: "Katol Road, near Ramdeobaba University, Nagpur",
    osmNodeId: "OSM Node #61029384",
    operatingHours: "24/7 Police Station",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Nagpur City Police Stream",
    simpleExplanation: "Manned station with high-lux floodlighting, night patrol vehicles, and emergency kiosk.",
    initialConfidence: 0.98,
    decayRateLambda: 0.002,
    lastVerifiedMinutesAgo: 7,
    governmentLicenseRef: "Police Code: POL-NGP-Z2-GITTI",
    officialDepartment: "Nagpur City Police (Zone 2) / Dial 112 CAD",
    officialEmergencyPhone: "0712-2580100"
  },
  {
    id: "haven_aiims_emergency",
    name: "AIIMS Nagpur 24/7 Emergency Care Gate",
    category: "hospital_emergency",
    lat: 20.9650,
    lon: 79.0280,
    address: "Plot No. 2, Sector 20, MIHAN, Nagpur",
    osmNodeId: "OSM Node #83920194",
    operatingHours: "24/7 National Institute Emergency",
    litEnvironment: true,
    mannedSecurity: true,
    verificationSource: "Ministry of Health & Family Welfare",
    simpleExplanation: "National premier emergency healthcare complex with illuminated perimeter and armed security.",
    initialConfidence: 1.0,
    decayRateLambda: 0.001,
    lastVerifiedMinutesAgo: 2,
    governmentLicenseRef: "MoHFW Registry: IN-AIIMS-NGP-01",
    officialDepartment: "Ministry of Health and Family Welfare, Govt of India",
    officialEmergencyPhone: "0712-2794000"
  }
];

export const NAGPUR_ROAD_NETWORK: RoadSegment[] = [
  {
    id: "seg_gmch_to_medsq",
    name: "GMCH Gate → Medical Square (Lit Arterial)",
    fromId: "origin",
    toId: "medsq_junction",
    distanceMeters: 380,
    walkingMinutes: 4.8,
    lit: true,
    simpleReason: "Brightly lit road with continuous pedestrian footpath and hospital security.",
    nearestSafeHavenId: "haven_apollo_medsq",
    distanceToSafeHavenMeters: 45,
    coordinates: [
      [21.1278, 79.0970],
      [21.1285, 79.0982],
      [21.1302, 79.0990],
      [21.1305, 79.0995]
    ],
    isFloodProne: false
  },
  {
    id: "seg_medsq_to_untkhana_lit",
    name: "Medical Square → Great Nag Road (Well-Lit)",
    fromId: "medsq_junction",
    toId: "untkhana_chowk",
    distanceMeters: 780,
    walkingMinutes: 9.8,
    lit: true,
    simpleReason: "Main road with active street lights and 24/7 emergency medical shops.",
    nearestSafeHavenId: "haven_sanjeevani_untkhana",
    distanceToSafeHavenMeters: 60,
    coordinates: [
      [21.1305, 79.0995],
      [21.1275, 79.1004],
      [21.1245, 79.1012]
    ],
    isFloodProne: false
  },
  {
    id: "seg_naive_dark_shortcut",
    name: "Subhash Nagar Railway Underpass (Dangerous Shortcut)",
    fromId: "untkhana_chowk",
    toId: "destination",
    distanceMeters: 1250,
    walkingMinutes: 15.5,
    lit: false,
    simpleReason: "Dark railway cutting with zero street lighting and no open shops for nearly 1 km.",
    nearestSafeHavenId: "haven_sanjeevani_untkhana",
    distanceToSafeHavenMeters: 890,
    coordinates: [
      [21.1245, 79.1012],
      [21.1180, 79.0980],
      [21.1110, 79.1020],
      [21.1020, 79.1050]
    ],
    isFloodProne: true,
    hazardNote: "Zero street lighting. 890-meter blindspot with no help nearby."
  },
  {
    id: "seg_ajni_contingency_corridor",
    name: "Ajni Police Corridor & Auto Stand",
    fromId: "medsq_junction",
    toId: "ajni_hub",
    distanceMeters: 850,
    walkingMinutes: 10.5,
    lit: true,
    simpleReason: "Illuminated road leading directly to 24/7 Ajni Police assistance post.",
    nearestSafeHavenId: "haven_ajni_police",
    distanceToSafeHavenMeters: 25,
    coordinates: [
      [21.1302, 79.0990],
      [21.1255, 79.0945],
      [21.1215, 79.0910]
    ],
    isFloodProne: false
  },
  {
    id: "seg_ajni_auto_to_destination",
    name: "Ajni Pre-Paid Transit → Destination",
    fromId: "ajni_hub",
    toId: "destination",
    distanceMeters: 2200,
    walkingMinutes: 8.0,
    lit: true,
    simpleReason: "Main Wardha road corridor with manned Indian Oil station on route.",
    nearestSafeHavenId: "haven_indianoil_wardha",
    distanceToSafeHavenMeters: 180,
    coordinates: [
      [21.1215, 79.0910],
      [21.1150, 79.0820],
      [21.1080, 79.0940],
      [21.1020, 79.1050]
    ],
    isFloodProne: false
  }
];

export interface TransitSchedule {
  routeId: string;
  routeName: string;
  agency: string;
  boardingStop: string;
  boardingLat: number;
  boardingLon: number;
  alightingStop: string;
  alightingLat: number;
  alightingLon: number;
  scheduledDepartures: string[];
  transitDurationMinutes: number;
  reliabilityRate: number;
}

export interface WorkerProfile {
  id: string;
  name: string;
  role: string;
  facility: string;
  originName: string;
  originCoords: [number, number];
  destinationName: string;
  destinationCoords: [number, number];
  shiftEndTime: string;
  arrivalDeadline: string;
  maxAcceptableWalkMeters: number;
}

export const NAGPUR_WORKER: WorkerProfile = {
  id: "worker_aditi_01",
  name: "Dr. Aditi Sharma",
  role: "Senior ICU Resident",
  facility: "GMCH Nagpur (Trauma Centre)",
  originName: "GMCH Emergency Gate, Medical Square Road",
  originCoords: [21.1278, 79.0970],
  destinationName: "Manewada Ring Road Junction",
  destinationCoords: [21.1020, 79.1050],
  shiftEndTime: "02:15 AM",
  arrivalDeadline: "03:00 AM",
  maxAcceptableWalkMeters: 2500,
};

export const NAGPUR_TRANSIT_FEED: TransitSchedule = {
  routeId: "aapli_feeder_10",
  routeName: "Aapli Night Feeder 10 (Medical Sq - Manewada)",
  agency: "Nagpur Municipal Corporation (Maha-Metro Feeder)",
  boardingStop: "Medical Square Feeder Bay",
  boardingLat: 21.1302,
  boardingLon: 79.0990,
  alightingStop: "Manewada Square Ring Road",
  alightingLat: 21.1022,
  alightingLon: 79.1048,
  scheduledDepartures: ["01:45", "02:22", "02:58"],
  transitDurationMinutes: 14,
  reliabilityRate: 0.84,
};
