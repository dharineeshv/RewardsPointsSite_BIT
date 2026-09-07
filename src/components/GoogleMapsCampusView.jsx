import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search,
  MapPin,
  Navigation,
  Layers,
  Compass,
  Building2,
  GraduationCap,
  Library,
  UtensilsCrossed,
  DoorOpen,
  Cpu,
  BookOpen,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Share2,
  Clock,
  CheckCircle2,
  Plus,
  Minus,
  Maximize2
} from 'lucide-react';

export const BIT_CAMPUS_PLACES = [
  {
    id: 'main_gate',
    name: 'MAIN GATE',
    shortCode: 'GATE-01',
    category: 'Entrance',
    tagline: 'Primary Campus Security & Entry Checkpoint',
    lat: 11.4946,
    lng: 77.2742,
    color: '#0284c7', // Sky Blue
    icon: 'DoorOpen',
    rating: 4.9,
    reviews: 320,
    openHours: 'Open 24 Hours • Security Active',
    departments: ['Security Control', 'Visitor Pass Desk', 'Vehicle Parking'],
    desc: 'The official grand entrance to Bannari Amman Institute of Technology (BIT Sathy). Features round-the-clock security monitoring, visitor registration, parking management, and express shuttle access.',
    features: ['24/7 Guard Station', 'Visitor Pass Kiosk', 'Two-Wheeler & Car Parking', 'Campus Bus Bay'],
    walkingTimeFromGate: '0 min (0 m)'
  },
  {
    id: 'principal_office',
    name: 'PRINCIPAL OFFICE',
    shortCode: 'ADMIN',
    category: 'Administrative',
    tagline: 'Executive Headquarters & Central Administrative Block',
    lat: 11.4962,
    lng: 77.2755,
    color: '#7c3aed', // Purple
    icon: 'Building2',
    rating: 4.9,
    reviews: 198,
    openHours: 'Open • 8:30 AM - 5:30 PM (Mon - Sat)',
    departments: ["Principal's Chamber", 'Vice Principal Office', 'Registrar', 'Admissions & Records', 'Accounts Desk'],
    desc: 'The administrative heart of BIT Sathy. Houses the Principal, Vice-Principal, Dean of Academics, controller of examinations liaison, administrative documentation, fee processing, and official student affairs counters.',
    features: ['Executive Boardroom', 'Student Verification Counters', 'Scholarship Helpdesk', 'Air Conditioned Reception'],
    walkingTimeFromGate: '2 min (180 m)'
  },
  {
    id: 'as_block',
    name: 'AS BLOCK (Academic Science)',
    shortCode: 'AS BLOCK',
    category: 'Academic',
    tagline: 'Computer Technology, Science & Humanities',
    lat: 11.4968,
    lng: 77.2758,
    color: '#2563eb', // Royal Blue
    icon: 'GraduationCap',
    rating: 4.8,
    reviews: 245,
    openHours: 'Open • 8:00 AM - 6:00 PM (Labs Open late)',
    departments: ['B.Tech Computer Technology (CT)', 'Physics & Nanotech Lab', 'Chemistry Research Cell', 'Mathematics & Humanities', 'Smart Classrooms'],
    desc: 'Academic Science Block is the home of B.Tech Computer Technology (CT) and foundational science departments. Equipped with high-performance computing centers, physics & chemistry experimentation labs, and interactive lecture theaters.',
    features: ['High-speed CT Computing Labs', 'Physics & Chemistry Laboratories', 'Seminar Halls with 4K AV', 'Faculty Consultation Cabins'],
    walkingTimeFromGate: '3 min (240 m)'
  },
  {
    id: 'ib_block',
    name: 'IB BLOCK (Information Block)',
    shortCode: 'IB BLOCK',
    category: 'Academic',
    tagline: 'Computer Science, IT, AI-DS & Special Computing Labs',
    lat: 11.4973,
    lng: 77.2768,
    color: '#4f46e5', // Indigo
    icon: 'Cpu',
    rating: 5.0,
    reviews: 410,
    openHours: 'Open • 8:00 AM - 8:00 PM (24/7 for Hackathons)',
    departments: ['Computer Science & Engineering (CSE)', 'Information Technology (IT)', 'AI & Data Science (AI-DS)', 'Special Project Labs', 'Central Server Infrastructure'],
    desc: 'The premier technology block of BIT Sathy. Features state-of-the-art AI/ML workstations, cloud computing labs, BIP innovation incubators, full-stack development studios, and faculty research wings.',
    features: ['Special Innovation Labs (BIP)', 'High-End GPU AI Workstations', 'Hackathon Arena & Code Theaters', 'High-Speed Wi-Fi 6'],
    walkingTimeFromGate: '4 min (320 m)'
  },
  {
    id: 'sf_block',
    name: 'SF BLOCK (Self-Financed Academic Block)',
    shortCode: 'SF BLOCK',
    category: 'Academic',
    tagline: 'Applied Engineering, Electronics & Project Studios',
    lat: 11.4980,
    lng: 77.2775,
    color: '#059669', // Emerald Green
    icon: 'BookOpen',
    rating: 4.8,
    reviews: 180,
    openHours: 'Open • 8:00 AM - 6:30 PM',
    departments: ['Applied Engineering Departments', 'Project Incubation Labs', 'Digital Media Studio', 'Advanced Workshop & Prototyping'],
    desc: 'Specialized academic and project facility designed for interdisciplinary engineering coursework, rapid prototyping workshops, capstone project exhibits, and multimedia studios.',
    features: ['Project Design & Fab Lab', 'Spacious Lecture Classrooms', 'Student Project Demonstration Hall', 'Faculty Lounge'],
    walkingTimeFromGate: '5 min (410 m)'
  },
  {
    id: 'library',
    name: 'CENTRAL LIBRARY',
    shortCode: 'LIBRARY',
    category: 'Library',
    tagline: 'Multi-Floor Knowledge Hub & Digital Reference Center',
    lat: 11.4966,
    lng: 77.2779,
    color: '#d97706', // Amber
    icon: 'Library',
    rating: 4.9,
    reviews: 520,
    openHours: 'Open • 8:00 AM - 9:00 PM (Daily)',
    departments: ['Digital Library & E-Journals', 'Reference & Research Section', 'Stack Section (100,000+ Books)', 'Quiet Study Cubicles', 'Periodicals & Newspaper Lounge'],
    desc: 'A world-class repository of academic knowledge with over 100,000 print books, IEEE, Springer, and ScienceDirect digital database subscriptions, individual research pods, and discussion rooms.',
    features: ['Air-Conditioned E-Resource Center', 'RFID Automated Book Borrowing', 'Quiet Study Pods & Carrels', 'Photocopy & Printing Desk'],
    walkingTimeFromGate: '3.5 min (290 m)'
  },
  {
    id: 'cafeteria',
    name: 'CAFETERIA / MAIN CANTEEN',
    shortCode: 'CANTEEN',
    category: 'Dining',
    tagline: 'Multi-Cuisine Food Court, Fresh Juices & Snacks',
    lat: 11.4957,
    lng: 77.2762,
    color: '#e11d48', // Rose / Red
    icon: 'UtensilsCrossed',
    rating: 4.7,
    reviews: 640,
    openHours: 'Open • 7:30 AM - 8:30 PM (All 7 Days)',
    departments: ['South Indian Meals & Tiffin', 'Juice Bar & Fresh Shakes', 'Bakery & Snacks Corner', 'Coffee & Tea Kiosk', 'Spacious Seating Area'],
    desc: 'The central student hangout and dining pavilion. Serving fresh, hygienic South Indian breakfast, lunch thalis, fast-food snacks, ice-creams, milkshakes, and specialty filter coffee.',
    features: ['Hygienic Kitchen & Dine-in Hall', 'Digital Cashless Payments (UPI/Cards)', 'Freshly Squeezed Juices', 'Evening Snack Counters'],
    walkingTimeFromGate: '2 min (150 m)'
  }
];

const BIT_CENTER = [11.4967, 77.2763];

const MAP_LAYERS = [
  {
    id: 'streets',
    name: 'Default (Google Style)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors'
  },
  {
    id: 'satellite',
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery'
  },
  {
    id: 'dark',
    name: 'Night Dark View',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB Dark'
  }
];

export default function GoogleMapsCampusView({ isDarkMode }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const routePolylineRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState(isDarkMode ? 'dark' : 'streets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDirectionsActive, setIsDirectionsActive] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Sync layer with dark mode if user hasn't explicitly overridden
  useEffect(() => {
    setActiveLayer(isDarkMode ? 'dark' : 'streets');
  }, [isDarkMode]);

  // Categories
  const categories = useMemo(() => ['All', 'Academic', 'Administrative', 'Library', 'Dining', 'Entrance'], []);

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return BIT_CAMPUS_PLACES.filter(place => {
      const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesSearch =
        place.name.toLowerCase().includes(q) ||
        place.shortCode.toLowerCase().includes(q) ||
        place.tagline.toLowerCase().includes(q) ||
        place.departments.some(d => d.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: BIT_CENTER,
      zoom: 17,
      minZoom: 15,
      maxZoom: 19,
      zoomControl: false // custom controls
    });

    mapInstanceRef.current = map;

    // Add Tile Layer
    const layerConfig = MAP_LAYERS.find(l => l.id === activeLayer) || MAP_LAYERS[0];
    const tileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Add BIT Campus Boundary Box (soft highlight)
    const campusBounds = [
      [11.4935, 77.2730],
      [11.4990, 77.2790]
    ];
    L.rectangle(campusBounds, {
      color: '#4f46e5',
      weight: 1.5,
      dashArray: '4, 8',
      fillColor: '#6366f1',
      fillOpacity: 0.03
    }).addTo(map);

    // Add Custom Markers
    BIT_CAMPUS_PLACES.forEach(place => {
      const customIcon = L.divIcon({
        className: 'custom-google-pin',
        html: `
          <div class="gmap-pin-wrapper" id="pin-\${place.id}">
            <div class="gmap-pin-pill" style="border-left: 3px solid \${place.color};">
              <span class="gmap-pin-dot" style="background-color: \${place.color};"></span>
              <span class="gmap-pin-label">\${place.shortCode}</span>
            </div>
            <div class="gmap-pin-pointer"></div>
          </div>
        `,
        iconSize: [80, 42],
        iconAnchor: [40, 40]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        handleSelectPlace(place);
      });

      markersRef.current[place.id] = marker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when layer switch changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const layerConfig = MAP_LAYERS.find(l => l.id === activeLayer) || MAP_LAYERS[0];
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
  }, [activeLayer]);

  // Select place handler
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setIsDirectionsActive(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lng], 18, {
        animate: true,
        duration: 1.2
      });
    }

    // Clear old route
    if (routePolylineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
  };

  // Draw Directions Route (From Main Gate to Selected Place)
  const handleToggleDirections = () => {
    if (!selectedPlace || !mapInstanceRef.current) return;

    if (isDirectionsActive) {
      // Clear
      if (routePolylineRef.current) {
        mapInstanceRef.current.removeLayer(routePolylineRef.current);
        routePolylineRef.current = null;
      }
      setIsDirectionsActive(false);
    } else {
      // Draw walking route from Main Gate
      const mainGate = BIT_CAMPUS_PLACES.find(p => p.id === 'main_gate');
      const startPoint = [mainGate.lat, mainGate.lng];
      const endPoint = [selectedPlace.lat, selectedPlace.lng];

      // Intermediate point for natural campus walkway turn
      const midPoint = [
        (startPoint[0] + endPoint[0]) / 2 + 0.0003,
        (startPoint[1] + endPoint[1]) / 2 - 0.0001
      ];

      const routeCoordinates = [startPoint, midPoint, endPoint];

      if (routePolylineRef.current) {
        mapInstanceRef.current.removeLayer(routePolylineRef.current);
      }

      const polyline = L.polyline(routeCoordinates, {
        color: '#2563eb',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '8, 12',
        className: 'gmap-walking-route animate-pulse'
      }).addTo(mapInstanceRef.current);

      routePolylineRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [60, 60] });
      setIsDirectionsActive(true);
    }
  };

  // Share / Copy Link
  const handleShare = () => {
    if (!selectedPlace) return;
    const shareText = `📍 \${selectedPlace.name} - Bannari Amman Institute of Technology (BIT Sathy)\nCoordinates: \${selectedPlace.lat}, \${selectedPlace.lng}\nhttps://maps.google.com/?q=\${selectedPlace.lat},\${selectedPlace.lng}`;
    navigator.clipboard.writeText(shareText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  return (
    <div className="relative w-full h-[78vh] sm:h-[720px] min-h-[550px] rounded-3xl overflow-hidden border shadow-2xl flex flex-col select-none bg-slate-950">
      {/* 1. MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. FLOATING GOOGLE MAPS SEARCH HEADER */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-auto z-20 w-auto sm:w-[420px] space-y-2 pointer-events-auto">
        {/* Search Bar Box */}
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-xl transition-all ${
          isDarkMode 
            ? 'bg-slate-900/95 border-slate-700 text-white shadow-black/80' 
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/15'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search BIT campus (IB Block, Library, Canteen)..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-medium outline-none placeholder-slate-400"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="w-[1px] h-5 bg-slate-700/40" />

          <button
            type="button"
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo(BIT_CENTER, 17);
              }
            }}
            title="Re-center on BIT Sathy"
            className="p-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 cursor-pointer transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-md border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 scale-102'
                  : isDarkMode
                    ? 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'
                    : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' && '🌟 '}
              {cat === 'Academic' && '🏫 '}
              {cat === 'Administrative' && '🏛️ '}
              {cat === 'Library' && '📚 '}
              {cat === 'Dining' && '🍽️ '}
              {cat === 'Entrance' && '🚪 '}
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search Suggestions Dropdown if typing */}
        {searchQuery.trim() && (
          <div className={`p-2 rounded-2xl shadow-2xl border backdrop-blur-xl max-h-56 overflow-y-auto space-y-1 ${
            isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'
          }`}>
            {filteredPlaces.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">No campus places matched "{searchQuery}"</div>
            ) : (
              filteredPlaces.map(place => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => {
                    handleSelectPlace(place);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-indigo-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: place.color }} />
                    <div className="truncate">
                      <div className="font-bold truncate">{place.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">{place.tagline}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* 3. FLOATING MAP CONTROLS (RIGHT SIDE) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* Layer Switcher (Streets / Satellite / Dark) */}
        <div className={`p-1 rounded-2xl shadow-xl border backdrop-blur-md flex flex-col gap-1 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/95 border-slate-200'
        }`}>
          {MAP_LAYERS.map(layer => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              title={layer.name}
              className={`p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeLayer === layer.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{layer.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Zoom In / Out Controls */}
        <div className={`p-1 rounded-2xl shadow-xl border backdrop-blur-md flex flex-col gap-1 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/95 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600/30 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600/30 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. GOOGLE MAPS STYLE BOTTOM SHEET / PLACE DETAILS CARD */}
      {selectedPlace && (
        <div className={`absolute bottom-3 sm:bottom-5 left-3 sm:left-4 right-3 sm:right-auto z-30 w-auto sm:w-[440px] max-h-[58vh] overflow-y-auto p-4 sm:p-5 rounded-3xl shadow-2xl border backdrop-blur-2xl animate-slideUp transition-all pointer-events-auto ${
          isDarkMode 
            ? 'bg-slate-900/95 border-indigo-500/40 text-white shadow-black/90' 
            : 'bg-white/95 border-indigo-200 text-slate-900 shadow-indigo-950/20'
        }`}>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow-xs"
                  style={{ backgroundColor: selectedPlace.color }}
                >
                  {selectedPlace.category}
                </span>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  ★ {selectedPlace.rating} <span className="text-slate-400 font-normal">({selectedPlace.reviews})</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight mt-1 truncate">
                {selectedPlace.name}
              </h2>
              <p className="text-xs text-indigo-400 font-medium">{selectedPlace.tagline}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPlace(null);
                if (routePolylineRef.current && mapInstanceRef.current) {
                  mapInstanceRef.current.removeLayer(routePolylineRef.current);
                  routePolylineRef.current = null;
                }
                setIsDirectionsActive(false);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
              title="Close Details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Timing & Walk Distance Status */}
          <div className="mt-3 py-2 px-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{selectedPlace.openHours}</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-cyan-300 shrink-0 ml-2">
              🚶 {selectedPlace.walkingTimeFromGate}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3 text-xs leading-relaxed text-slate-300 font-normal">
            {selectedPlace.desc}
          </p>

          {/* Facilities / Departments Chips */}
          <div className="mt-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
              Key Labs & Departments:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedPlace.departments.map((dept, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl text-[10.5px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons (Directions / Google Maps / Share) */}
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleDirections}
              className={`flex-1 py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isDirectionsActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isDirectionsActive ? 'Clear Walking Route' : '🚶 Get Walking Route'}</span>
            </button>

            <a
              href={`https://maps.google.com/?q=\${selectedPlace.lat},\${selectedPlace.lng}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Open in Google Maps App"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors cursor-pointer relative"
              title="Share Location"
            >
              <Share2 className="w-4 h-4" />
              {copiedToast && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* CSS Styles for Leaflet & Google Maps Pins */}
      <style>{`
        .custom-google-pin {
          background: transparent;
          border: none;
        }
        .gmap-pin-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .gmap-pin-wrapper:hover {
          transform: translateY(-4px) scale(1.08);
          z-index: 1000 !important;
        }
        .gmap-pin-pill {
          background: rgba(15, 23, 42, 0.95);
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 9999px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.15);
          white-space: nowrap;
        }
        .gmap-pin-dot {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
        }
        .gmap-pin-pointer {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #0f172a;
          margin-top: -1px;
        }
        .gmap-walking-route {
          filter: drop-shadow(0 2px 6px rgba(37, 99, 235, 0.6));
        }
      `}</style>
    </div>
  );
}
