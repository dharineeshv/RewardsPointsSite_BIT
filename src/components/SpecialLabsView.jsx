import React, { useState, useMemo, useRef } from 'react';
import {
  FlaskConical,
  Search,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Building2,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  X,
  Bot,
  Cpu,
  CircuitBoard,
  Wifi,
  Zap,
  Code2,
  ShieldCheck,
  Glasses,
  Link,
  Cog,
  Leaf,
  Tractor,
  Shirt,
  Cookie,
  Trophy,
  Droplets,
  Microchip,
  Layers,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import {
  SPECIAL_LABS_LIST,
  SPECIAL_LAB_CLUSTERS,
  SPECIAL_LAB_CENTRAL_COORDINATORS
} from '../data/specialLabsData';

const LAB_ICON_MAP = {
  manuf_fab: Cog,
  robotics_auto: Bot,
  ai_industrial: Cpu,
  hackathon_cell: Trophy,
  aquatech: Droplets,
  sensors_tamil: Wifi,
  pcb_lab: CircuitBoard,
  embedded_tech: Microchip,
  iot_lab: Layers,
  elec_drives: Zap,
  ai_lab: Sparkles,
  data_science: Award,
  fullstack_devops: Code2,
  cloud_cyber: ShieldCheck,
  xr_studio: Glasses,
  blockchain_tech: Link,
  machine_building: Building2,
  bioprospecting: FlaskConical,
  bioproduct_innov: Leaf,
  smart_agri: Tractor,
  sustainable_civil: Building2,
  fiber_fashion: Shirt,
  food_innov: Cookie
};

export default function SpecialLabsView({ isDarkMode = false, setActiveNav = () => {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('ALL');
  const [selectedLab, setSelectedLab] = useState(null);
  const [copiedText, setCopiedText] = useState(null);
  const filterScrollRef = useRef(null);

  const scrollFilters = (direction) => {
    if (filterScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      filterScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCopy = (text, label) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const filteredLabs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SPECIAL_LABS_LIST.filter(lab => {
      const matchCluster = selectedCluster === 'ALL' || lab.cluster === selectedCluster;
      if (!matchCluster) return false;

      if (!q) return true;
      const matchName = lab.name.toLowerCase().includes(q) || lab.shortName.toLowerCase().includes(q);
      const matchFaculty = lab.faculty.name.toLowerCase().includes(q) || lab.faculty.email.toLowerCase().includes(q) || lab.faculty.phone.includes(q);
      const matchTech = lab.technologies.some(t => t.toLowerCase().includes(q));
      const matchTagline = lab.tagline.toLowerCase().includes(q);
      const matchDesc = lab.description.toLowerCase().includes(q);

      return matchName || matchFaculty || matchTech || matchTagline || matchDesc;
    });
  }, [searchQuery, selectedCluster]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. HERO HEADER WITH STATS & SEARCH */}
      <div className={`p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-slate-900/95 border-slate-800 shadow-2xl backdrop-blur-xl' 
          : 'bg-white border-slate-200 shadow-md'
      }`}>
        {/* Background glow orb */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>BIT Center for Excellence</span>
              </span>
            </div>
            
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              BIT Special Labs & Research Cells
            </h1>
            <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Explore all 23 autonomous Special Labs. Connect directly with Faculty Coordinators, discover cutting-edge technology stacks, and submit project initiatives on the BIP portal to earn reward points.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Labs</span>
                <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">23 Labs</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tech Clusters</span>
                <span className="text-lg sm:text-xl font-black text-teal-600 dark:text-teal-400 font-mono">5 Domains</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Central Coordinators</span>
                <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono">4 Faculty</span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="lg:w-80 w-full shrink-0">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lab, faculty, tech, phone..."
                className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CLUSTER FILTER CHIPS WITH ARROWS */}
      <div className="relative flex items-center gap-1.5 sm:gap-2">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollFilters('left')}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer shadow-xs active:scale-95 ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Scroll Left"
          aria-label="Scroll clusters left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={filterScrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scroll-smooth scrollbar-none"
        >
          {SPECIAL_LAB_CLUSTERS.map(cluster => {
            const isActive = selectedCluster === cluster.id;
            const count = cluster.id === 'ALL' 
              ? SPECIAL_LABS_LIST.length 
              : SPECIAL_LABS_LIST.filter(l => l.cluster === cluster.id).length;

            return (
              <button
                key={cluster.id}
                onClick={() => setSelectedCluster(cluster.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/50'
                    : isDarkMode
                      ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                }`}
              >
                <span>{cluster.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollFilters('right')}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer shadow-xs active:scale-95 ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Scroll Right"
          aria-label="Scroll clusters right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. SPECIAL LABS CARDS GRID */}
      {filteredLabs.length === 0 ? (
        <div className={`p-10 rounded-2xl border text-center ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-40 text-indigo-500" />
          <h3 className="text-base font-bold">No Special Labs Found</h3>
          <p className="text-xs mt-1">Try adjusting your search query or select another cluster.</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedCluster('ALL'); }}
            className="mt-4 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredLabs.map((lab) => {
            const IconComponent = LAB_ICON_MAP[lab.id] || FlaskConical;

            return (
              <div
                key={lab.id}
                onClick={() => setSelectedLab(lab)}
                className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 group cursor-pointer hover:-translate-y-1 ${
                  isDarkMode 
                    ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/30 text-white' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg text-slate-900'
                }`}
              >
                <div>
                  {/* Top Header with Icon and Cluster Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                      isDarkMode 
                        ? 'bg-slate-800/80 border-slate-700 text-indigo-400 group-hover:bg-indigo-950/80 group-hover:border-indigo-800' 
                        : 'bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-indigo-100'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        #{lab.slNo}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lab.badgeClass}`}>
                        {lab.clusterLabel}
                      </span>
                    </div>
                  </div>

                  {/* Lab Title & Tagline */}
                  <h3 className="text-sm sm:text-base font-black tracking-tight leading-snug group-hover:text-indigo-500 transition-colors">
                    {lab.name}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {lab.tagline}
                  </p>

                  {/* Technology Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {lab.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          isDarkMode 
                            ? 'bg-slate-800 text-slate-300 border border-slate-700/60' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {lab.technologies.length > 3 && (
                      <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
                        +{lab.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Faculty Coordinator Strip */}
                <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 text-xs ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      Faculty In-Charge
                    </span>
                    <span className="font-bold truncate block text-xs mt-0.5">
                      {lab.faculty.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${lab.faculty.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      title={`Call ${lab.faculty.phone}`}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-400 border-slate-700' 
                          : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border-slate-200'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`mailto:${lab.faculty.email}`}
                      onClick={(e) => e.stopPropagation()}
                      title={`Email ${lab.faculty.email}`}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-slate-800 hover:bg-indigo-950/80 hover:text-indigo-400 border-slate-700' 
                          : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border-slate-200'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs group-hover:bg-indigo-700 transition-colors"
                      title="View Lab Details"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CENTRAL SPECIAL LAB COORDINATORS SECTION */}
      <div className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800 text-white' 
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight">Special Labs Central Coordinators</h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Center for Excellence administrative leadership and student project coordinators
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Center for Excellence
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SPECIAL_LAB_CENTRAL_COORDINATORS.map((coord) => (
            <div
              key={coord.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDarkMode 
                  ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <h4 className="text-xs font-black truncate">{coord.name}</h4>
              <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 truncate mt-0.5">
                {coord.role}
              </p>
              <p className={`text-[10px] line-clamp-2 mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {coord.responsibilities}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-1">
                <a
                  href={`tel:${coord.phone}`}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  <span>{coord.phone}</span>
                </a>
                <a
                  href={`mailto:${coord.email}`}
                  title={coord.email}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. DETAILED LAB INSPECTOR MODAL */}
      {selectedLab && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedLab(null)}
        >
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border shadow-2xl p-5 sm:p-7 transition-all ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-white' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedLab(null)}
              className={`absolute top-4 right-4 p-2 rounded-xl border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 pr-10">
              {(() => {
                const IconComp = LAB_ICON_MAP[selectedLab.id] || FlaskConical;
                return (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
                    <IconComp className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                );
              })()}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedLab.badgeClass}`}>
                    {selectedLab.clusterLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Lab #{selectedLab.slNo}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black mt-1 leading-snug">{selectedLab.name}</h2>
                <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {selectedLab.tagline}
                </p>
              </div>
            </div>

            {/* Modal Description */}
            <div className={`mt-5 p-3.5 sm:p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Lab Focus & Research Scope
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {selectedLab.description}
              </p>
            </div>

            {/* Technologies & Skill Domains */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Core Technologies & Equipment
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedLab.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                      isDarkMode 
                        ? 'bg-slate-800/80 border-slate-700 text-indigo-300' 
                        : 'bg-indigo-50 border-indigo-100 text-indigo-800'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Faculty In-Charge Profile Card */}
            <div className={`mt-5 p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Faculty Coordinator Details
                </span>
                <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Official Contact
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black">{selectedLab.faculty.name}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {selectedLab.faculty.designation} • {selectedLab.faculty.department}
                  </p>
                  <p className={`text-[11px] font-mono mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    📍 {selectedLab.faculty.cabin}
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${selectedLab.faculty.phone}`}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`mailto:${selectedLab.faculty.email}`}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(`${selectedLab.faculty.name}\nEmail: ${selectedLab.faculty.email}\nPhone: ${selectedLab.faculty.phone}`, 'modal')}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                    title="Copy Contact Info"
                  >
                    {copiedText === 'modal' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedLab(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
