import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import anime from 'animejs';
import { 
  Zap,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Compass,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import './LiveTwin.css';

// ─── THEME & PALETTE ──────────────────────────────────────────────────────────
const C = {
  bg: "#f8fafc", surface: "#ffffff", surfaceAlt: "#f1f5f9",
  border: "#e2e8f0", borderMid: "#cbd5e1",
  sea: "#e0f2fe", seaDark: "#bae6fd", land: "#f8fafc", landStroke: "#cbd5e1",
  textPrimary: "#0f172a", textSecond: "#475569", textMuted: "#94a3b8",
  indigo: "#6366f1", indigoLight: "#e0e7ff",
  teal: "#14b8a6", tealLight: "#ccfbf1",
  sky: "#0ea5e9", skyLight: "#e0f2fe",
  violet: "#8b5cf6", violetLight: "#ede9fe",
  emerald: "#10b981", emeraldLight: "#d1fae5",
  amber: "#f59e0b", amberLight: "#fef3c7",
  rose: "#f43f5e", roseLight: "#ffe4e6",
  orange: "#f97316", orangeLight: "#ffedd5",
};

const incidentPalette = {
  critical: { color: C.rose,   bg: C.roseLight,   icon: "☢️", label: "CRITICAL", symbol: 'radiation' },
  high:     { color: C.orange, bg: C.orangeLight, icon: "🔥", label: "HIGH", symbol: 'fire' },
  medium:   { color: C.amber,  bg: C.amberLight,  icon: "⚠️", label: "MEDIUM", symbol: 'alert' },
  low:      { color: C.emerald,bg: C.emeraldLight,icon: "✅", label: "LOW", symbol: 'check' },
};

const MapSymbol = ({ type, size = 12, color = 'white' }) => {
  if (type === 'radiation') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M16 12h4"/><path d="M4 12h4"/><path d="M12 4v4"/><path d="M12 16v4"/><path d="m8.2 8.2-2.8-2.8"/><path d="m15.8 15.8 2.8 2.8"/><path d="m15.8 8.2 2.8-2.8"/><path d="m8.2 15.8-2.8 2.8"/>
    </svg>
  );
  if (type === 'fire') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.214 1.14-3.027 1.253 1.222 2.36 1.027 3.36 0z"/>
    </svg>
  );
  if (type === 'alert') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
  return null;
};

// ─── MOCK DATA ENGINE ────────────────────────────────────────────────────────
const MOCK_ZONES = [
  { id: 'b-a1', x: 260, y: 140, w: 100, h: 80, name: 'BERTH A1', workers: 2, labelX: 5, labelY: 15 },
  { id: 'b-a2', x: 260, y: 230, w: 100, h: 80, name: 'BERTH A2', workers: 13, labelX: 5, labelY: 15 },
  { id: 'b-b1', x: 260, y: 320, w: 100, h: 80, name: 'BERTH B1', workers: 5, labelX: 5, labelY: 15 },
  { id: 'cy-1', x: 400, y: 140, w: 120, h: 170, name: 'CONTAINER YARD 1', workers: 19, labelX: 10, labelY: 15 },
  { id: 'cy-2', x: 400, y: 320, w: 120, h: 140, name: 'CONTAINER YARD 2', workers: 24, labelX: 10, labelY: 15 },
  { id: 'hz-1', x: 550, y: 140, w: 80, h: 120, name: 'HAZMAT STORAGE', workers: 8, labelX: 5, labelY: 15, theme: 'amber' },
  { id: 'mb-1', x: 550, y: 280, w: 80, h: 120, name: 'MAINTENANCE BAY', workers: 14, labelX: 5, labelY: 15 },
  { id: 'gc-1', x: 650, y: 220, w: 80, h: 150, name: 'GATE COMPLEX', workers: 28, labelX: 5, labelY: 15 },
  { id: 'wa-1', x: 550, y: 420, w: 180, h: 100, name: 'WAREHOUSE ALPHA', workers: 52, labelX: 10, labelY: 15 },
];

const MOCK_VESSELS = [
  { id: 'v1', x: 195, y: 180, name: 'MSC AURORA', type: 'container', status: 'DOCKED', cargo: 'Electronics', rotation: 270, color: C.violet },
  { id: 'v2', x: 195, y: 270, name: 'PACIFIC STAR', type: 'tanker', status: 'DOCKED', cargo: 'Crude Oil', rotation: 270, color: C.orange },
  { id: 'v3', x: 195, y: 360, name: 'TITAN BULK', type: 'bulk', status: 'DOCKED', cargo: 'Grain', rotation: 270, color: C.sky },
  { id: 'v4', x: 40, y: 240, name: 'HORIZON QUEEN', type: 'container', status: 'APPROACHING', cargo: 'Machinery', rotation: 90, color: C.indigo, eta: '14:32' },
  { id: 'v5', x: 50, y: 440, name: 'CORAL FERRY', type: 'ferry', status: 'APPROACHING', cargo: 'Passengers', rotation: 90, color: C.emerald, eta: '16:15' },
];

const MOCK_INCIDENTS = [
  { id: 'inc1', x: 450, y: 210, severity: 'high', type: 'equipment_failure', zone: 'Container Yard 1', description: 'STS Crane 3 hydraulic failure', status: 'RESPONDING', time: '10:08', start: 30, end: 100 },
  { id: 'inc2', x: 590, y: 190, severity: 'critical', type: 'gas_leak', zone: 'Hazmat Storage', description: 'Ammonia leak — Zone evacuated', status: 'ACTIVE', time: '10:14', start: 55, end: 100 },
  { id: 'inc3', x: 470, y: 390, severity: 'medium', type: 'worker_injury', zone: 'Container Yard 2', description: 'Slip & fall near stack G7', status: 'ACTIVE', time: '10:05', start: 15, end: 100 },
  { id: 'inc4', x: 380, y: 250, severity: 'medium', type: 'equipment_failure', zone: 'Container Yard 1', description: 'Wharf Crane #2 - Hydraulic Leak', status: 'RESPONDING', time: '10:02', start: 10, end: 60 },
  { id: 'inc5', x: 680, y: 280, severity: 'high', type: 'security_breach', zone: 'Gate Complex', description: 'Unauthorized Vehicle Entry - Gate', status: 'ACTIVE', time: '11:45', start: 45, end: 100 },
  { id: 'inc6', x: 620, y: 460, severity: 'critical', type: 'fire', zone: 'Warehouse Alpha', description: 'Fume Alarm Triggered', status: 'ACTIVE', time: '14:10', start: 70, end: 100 },
  { id: 'inc7', x: 580, y: 320, severity: 'low', type: 'hazard', zone: 'Maintenance Bay', description: 'Minor Oil Spill - Mtnc Bay', status: 'RESOLVING', time: '10:22', start: 22, end: 100 },
  { id: 'inc8', x: 230, y: 380, severity: 'low', type: 'hazard', zone: 'Berth B1', description: 'Missing Life Ring - Berth B1', status: 'RESOLVED', time: '09:15', start: 5, end: 100 },
];

const MOCK_ACTIVITIES = [
  { id: 1, type: 'incident', message: 'Slip & fall reported — Container Yard 2, stack G7', time: '10:05', start: 15 },
  { id: 2, type: 'status', message: 'HAZMAT team deployed — Zone 6 exclusion zone active', time: '10:14', start: 58 },
  { id: 3, type: 'status', message: 'Vessel Traffic: HORIZON QUEEN on approach', time: '14:32', start: 50 },
  { id: 4, type: 'status', message: 'Berth A1 crane operations resumed', time: '11:05', start: 35 },
  { id: 5, type: 'incident', message: 'Wharf Crane #2 leak reported - Container Yard 1', time: '10:02', start: 10 },
  { id: 6, type: 'status', message: 'Security Breach: Unauthorized entry at Gate Complex', time: '11:45', start: 45 },
  { id: 7, type: 'incident', message: 'Warehouse Alpha: Air quality sensor triggered', time: '14:10', start: 70 },
  { id: 8, type: 'status', message: 'Maintenance Bay: Oil spill containment active', time: '10:22', start: 22 },
  { id: 9, type: 'status', message: 'Berth B1: Safety inspection alert - Missing ring', time: '09:15', start: 5 },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function VesselShape({ vessel, isSelected }) {
  const fill = vessel.color || C.indigo;
  const len = 36;
  const hw = 5;
  return (
    <g transform={`translate(${vessel.x},${vessel.y}) rotate(${vessel.rotation || 0})`}>
      {isSelected && <ellipse rx={len / 2 + 8} ry={hw + 10} fill="none" stroke={fill} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />}
      <path d={`M${-len / 2},0 L${len / 2 - 6},-${hw} L${len / 2},0 L${len / 2 - 6},${hw} Z`} fill={fill} opacity={0.9} />
      <circle cx={-len / 2 + 8} cy={0} r={2} fill="white" opacity={0.8} />
    </g>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function LiveTwin() {
  const [data] = useState({ incidents: MOCK_INCIDENTS, vessels: MOCK_VESSELS, activities: MOCK_ACTIVITIES, zones: MOCK_ZONES });
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [isLive, setIsLive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mapContainerRef = useRef(null);
  const radarRef = useRef(null);
  const [mapXform, setMapXform] = useState({ x: 0, y: 0, scale: 1.1 });
  const [mapCursor, setMapCursor] = useState("grab");
  const isDragging = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const xformAtDrag = useRef({ x: 0, y: 0, scale: 1 });

  const [timelineProgress, setTimelineProgress] = useState(100);
  const timelineTrackRef = useRef(null);
  const isScrubbing = useRef(false);

  // Timeline Handlers
  const calculateProgress = useCallback((e) => {
    if (!timelineTrackRef.current) return 0;
    const rect = timelineTrackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return Math.min(Math.max((x / rect.width) * 100, 0), 100);
  }, []);

  const handleTimelineMouseDown = (e) => {
    e.stopPropagation();
    isScrubbing.current = true;
    setIsLive(false);
    setIsPlaying(false);
    const p = calculateProgress(e);
    setTimelineProgress(p);
  };

  useEffect(() => {
    const handleGlobalMove = (e) => {
      if (isScrubbing.current) {
        const p = calculateProgress(e);
        setTimelineProgress(p);
      }
    };
    const handleGlobalUp = () => {
      isScrubbing.current = false;
    };
    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
    };
  }, [calculateProgress]);

  // Filtered Data
  const filteredIncidents = data.incidents.filter(inc => {
    return timelineProgress >= inc.start && (!inc.end || timelineProgress <= inc.end);
  });

  const filteredActivities = data.activities.filter(act => {
    return timelineProgress >= act.start;
  }).reverse();

  // Top Alert Logic
  const topAlert = useMemo(() => {
    if (filteredIncidents.length === 0) return null;
    const severityMap = { critical: 4, high: 3, medium: 2, low: 1 };
    return [...filteredIncidents].sort((a, b) => severityMap[b.severity] - severityMap[a.severity] || b.id.localeCompare(a.id))[0];
  }, [filteredIncidents]);

  const W = 900, H = 550;

  useEffect(() => {
    let t;
    if (isPlaying && !isLive) {
      t = setInterval(() => {
        setTimelineProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(t);
  }, [isPlaying, isLive]);

  // Real-time loop
  useEffect(() => {
    const t = setInterval(() => {
      if (isLive) {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
        setTimelineProgress(100);
      } else {
        const now = new Date();
        const startOfWindow = new Date(now.getTime() - 10 * 60 * 60 * 1000);
        const targetTime = new Date(startOfWindow.getTime() + (timelineProgress / 100) * 10 * 60 * 60 * 1000);
        setCurrentTime(targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isLive, timelineProgress]);

  // Animations (Radar & Continuous)
  useEffect(() => {
    const sweep = radarRef.current?.querySelector(".radar-sweep");
    if (sweep) {
        anime({
          targets: sweep,
          rotate: '360deg',
          duration: 4000,
          easing: 'linear',
          loop: true
        });
    }

    anime({
      targets: '.vessel-node',
      translateY: [0, -2, 0],
      duration: 3000,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,
      delay: anime.stagger(200)
    });
  }, []);

  // Incident Pulsing (Stable)
  useEffect(() => {
    const markers = document.querySelectorAll('.incident-pulse-ring');
    if (markers.length > 0) {
        anime({
          targets: markers,
          r: [8, 16],
          opacity: [0.6, 0],
          duration: 1500,
          easing: 'easeOutQuart',
          loop: true
        });
    }
  }, [filteredIncidents]);

  // Pan & Zoom
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragOrigin.current = { x: e.clientX, y: e.clientY };
    xformAtDrag.current = { ...mapXform };
    setMapCursor("grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragOrigin.current.x;
    const dy = e.clientY - dragOrigin.current.y;
    setMapXform({ ...xformAtDrag.current, x: xformAtDrag.current.x + dx, y: xformAtDrag.current.y + dy });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setMapCursor("grab");
  };

  const zoomAt = useCallback((factor, cx, cy) => {
    setMapXform(prev => {
      const ns = Math.min(Math.max(prev.scale * factor, 0.4), 4);
      const sf = ns / prev.scale;
      return { x: cx - sf * (cx - prev.x), y: cy - sf * (cy - prev.y), scale: ns };
    });
  }, []);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.1 : 0.9, e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const resetMap = () => {
    setMapXform({ x: 0, y: 0, scale: 1.1 });
  };

  return (
    <div className="live-twin-container premium-theme" onMouseDown={() => isPlaying && setIsPlaying(false)}>
      
      <div className="live-twin-main">
        {/* ── MAP VIEWPORT ── */}
        <div 
          ref={mapContainerRef}
          className="map-viewport" 
          style={{ cursor: mapCursor }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg 
            viewBox={`0 0 ${W} ${H}`} 
            className="map-svg"
            style={{ 
              transform: `translate(${mapXform.x}px, ${mapXform.y}px) scale(${mapXform.scale})`,
              transformOrigin: "0 0" 
            }}
          >
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5"/>
              </pattern>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feComponentTransfer><feFuncA type="linear" slope="0.1"/></feComponentTransfer>
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Base */}
            <rect width={W} height={H} fill={C.bg} />
            <rect width={W} height={H} fill="url(#grid)" />
            
            {/* Sea Area */}
            <path d={`M0,0 L230,0 L230,${H} L0,${H} Z`} fill={C.sea} opacity={0.6} stroke={C.seaDark} strokeWidth={1} />
            
            {/* Berth annotations (STS Cranes) */}
            {[140, 230, 320].map((y, i) => (
                <g key={`sts-${i}`} transform={`translate(225, ${y + 40})`}>
                    <line x1={-30} y1={0} x2={10} y2={0} stroke={C.indigo} strokeWidth={1} strokeDasharray="2 2" opacity={0.4} />
                    <circle r={2.5} fill={C.indigo} />
                    <text x={12} y={3} fill={C.indigo} fontSize={7} fontWeight="900" opacity={0.6}>STS-{i+1}</text>
                </g>
            ))}

            {/* Boundaries */}
            <line x1={530} y1={0} x2={530} y2={H} stroke={C.orange} strokeWidth={1} strokeDasharray="5 5" opacity={0.5} />

            {/* Radar Overlay */}
            <g ref={radarRef} transform="translate(100, 100)">
              <circle r={60} fill="none" stroke={C.indigo} strokeWidth={0.5} opacity={0.1} />
              <circle r={40} fill="none" stroke={C.indigo} strokeWidth={0.5} opacity={0.15} />
              <circle r={20} fill="none" stroke={C.indigo} strokeWidth={0.5} opacity={0.2} />
              <g className="radar-sweep">
                 <path d="M0,0 L60,-6 A60,60 0 0,1 60,6 Z" fill={C.indigo} opacity={0.15} />
              </g>
              <text y={80} textAnchor="middle" fill={C.indigo} fontSize={9} fontWeight="bold" opacity={0.5} letterSpacing={1}>RADAR</text>
            </g>

            {/* Zone Rects */}
            {data.zones.map(z => (
              <g key={z.id} className="zone-group">
                <rect 
                  x={z.x} y={z.y} width={z.w} height={z.h} 
                  fill={z.theme === 'amber' ? C.amberLight : "white"} 
                  stroke={z.theme === 'amber' ? C.amber : C.emerald} 
                  strokeWidth={1} rx={4} strokeOpacity={0.4}
                  filter="url(#shadow)"
                />
                <text 
                  x={z.x + (z.labelX || 0)} y={z.y + (z.labelY || 0)} 
                  fill={z.theme === 'amber' ? C.orange : C.emerald} 
                  fontSize={8} fontWeight="900" letterSpacing={0.5}
                >
                  {z.name}
                </text>
                <text x={z.x + (z.labelX || 0)} y={z.y + (z.labelY || 0) + 12} fill={C.textMuted} fontSize={7} fontWeight="500">
                    {z.workers} workers
                </text>
              </g>
            ))}

            {/* Vessels */}
            {data.vessels.map(v => (
              <g key={v.id} className="vessel-node" onClick={() => setSelectedVessel(v)}>
                <VesselShape vessel={v} isSelected={selectedVessel?.id === v.id} />
                <path d={`M${v.x - 40},${v.y} L${v.x - 10},${v.y}`} stroke={v.color} strokeWidth={1} opacity={0.4} />
                <circle cx={v.x - 40} cy={v.y} r={2} fill={v.color} />
                <text x={v.x - 36} y={v.y - 6} fill={C.textPrimary} fontSize={7} fontWeight="900">{v.name}</text>
              </g>
            ))}

            {/* Incidents */}
            {filteredIncidents.map(inc => {
              const theme = incidentPalette[inc.severity];
              return (
                <g key={inc.id} className="incident-node" onClick={() => setSelectedIncident(inc)}>
                  <circle 
                    className="incident-pulse-ring"
                    cx={inc.x} cy={inc.y} r={12} 
                    fill={theme.color} opacity={0.25} 
                  />
                  <circle cx={inc.x} cy={inc.y} r={7} fill={theme.color} filter="url(#shadow)" />
                  <g transform={`translate(${inc.x - 5}, ${inc.y - 5})`}>
                    <MapSymbol type={theme.symbol} size={10} />
                  </g>
                </g>
              );
            })}

            {/* Floating Legend */}
            <g transform={`translate(${W - 130}, ${H - 180})`} className="floating-legend">
                <rect width={120} height={170} rx={8} fill="rgba(255,255,255,0.9)" stroke="#e2e8f0" strokeWidth={1} />
                <text x={10} y={20} fill={C.textMuted} fontSize={8} fontWeight="900" letterSpacing={1}>LEGEND</text>
                
                <g transform="translate(10, 35)">
                    {[{l:'Container Vessel', c:C.violet}, {l:'Tanker Vessel', c:C.orange}, {l:'Bulk Vessel', c:C.sky}, {l:'Ferry Vessel', c:C.emerald}].map((v, i) => (
                        <g key={v.l} transform={`translate(0, ${i * 15})`}>
                           <rect width={12} height={4} rx={2} fill={v.c} />
                           <text x={18} y={4} fill={C.textSecond} fontSize={7} fontWeight="700">{v.l}</text>
                        </g>
                    ))}
                </g>

                <g transform="translate(10, 110)">
                    {[{l:'Critical Incident', c:C.rose}, {l:'High Incident', c:C.orange}, {l:'Medium Incident', c:C.amber}].map((v, i) => (
                        <g key={v.l} transform={`translate(0, ${i * 15})`}>
                           <circle r={4} cx={6} cy={0} fill={v.c} />
                           <text x={18} y={3} fill={C.textSecond} fontSize={7} fontWeight="700">{v.l}</text>
                        </g>
                    ))}
                </g>
            </g>

            <g transform="translate(30, 500)">
               <line x1={0} y1={0} x2={40} y2={0} stroke={C.textMuted} strokeWidth={1} />
               <line x1={0} y1={-3} x2={0} y2={3} stroke={C.textMuted} strokeWidth={1} />
               <line x1={40} y1={-3} x2={40} y2={3} stroke={C.textMuted} strokeWidth={1} />
               <text x={45} y={3} fill={C.textMuted} fontSize={7} fontWeight="bold">500 m</text>
            </g>

            <g transform="translate(850, 80)">
               <circle r={14} fill="white" stroke="#e2e8f0" strokeWidth={1} opacity={0.8} />
               <Compass size={16} color={C.textMuted} opacity={0.5} />
               <text x={0} y={-18} textAnchor="middle" fill={C.textMuted} fontSize={7} fontWeight="900">N</text>
               <text x={18} y={2} textAnchor="start" fill={C.textMuted} fontSize={7} fontWeight="900">E</text>
               <text x={0} y={24} textAnchor="middle" fill={C.textMuted} fontSize={7} fontWeight="900">S</text>
               <text x={-18} y={2} textAnchor="end" fill={C.textMuted} fontSize={7} fontWeight="900">W</text>
            </g>

            {selectedIncident && (
                <g transform={`translate(${selectedIncident.x + 20}, ${selectedIncident.y - 60})`}>
                    <rect width={160} height={70} rx={8} fill="white" filter="url(#shadow)" stroke={incidentPalette[selectedIncident.severity].color} strokeWidth={1} />
                    <text x={10} y={20} fill={incidentPalette[selectedIncident.severity].color} fontSize={8} fontWeight="900" letterSpacing={0.5}>{selectedIncident.severity.toUpperCase()} ALERT</text>
                    <text x={10} y={38} fill={C.textPrimary} fontSize={9} fontWeight="700">{selectedIncident.description}</text>
                    <text x={10} y={54} fill={C.textMuted} fontSize={7}>{selectedIncident.zone} • {selectedIncident.time}</text>
                    <text x={150} y={15} textAnchor="end" fontSize={10} fill={C.textMuted} style={{cursor:'pointer'}} onClick={() => setSelectedIncident(null)}>✕</text>
                    <rect x={110} y={45} width={40} height={15} rx={3} fill={incidentPalette[selectedIncident.severity].color} />
                    <text x={130} y={55} textAnchor="middle" fill="white" fontSize={6} fontWeight="bold">DETAILS</text>
                </g>
            )}
          </svg>

          { !isLive && (
            <div className="historical-overlay">
                <div className="historical-pill">
                    <SkipBack size={12} fill="white" />
                    <span>HISTORICAL — 10:00</span>
                </div>
            </div>
          )}

          <div className="timeline-bar" onMouseDown={e => e.stopPropagation()}>
            <div className="timeline-controls">
                <button className="ctrl-btn" onClick={() => { setIsLive(false); setTimelineProgress(Math.max(0, timelineProgress - 10)); }}><SkipBack size={16} /></button>
                <button className={`ctrl-btn ${isPlaying ? 'active' : ''}`} onClick={() => { setIsLive(false); setIsPlaying(!isPlaying); }}>
                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
                <button className={`ctrl-btn live-toggle ${isLive ? 'active' : ''}`} onClick={() => { setIsLive(!isLive); setIsPlaying(false); }}>
                    <div className="live-dot" /> LIVE
                </button>
            </div>
            <div className="timeline-track-container">
                <div className="timeline-labels">
                    {[0, 20, 40, 60, 80, 100].map(pct => {
                        const labelDate = new Date(new Date().getTime() - (10 - (pct / 10) ) * 60 * 60 * 1000);
                        return <span key={pct}>{labelDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>;
                    })}
                </div>
                <div 
                  ref={timelineTrackRef}
                  className="timeline-track" 
                  onMouseDown={handleTimelineMouseDown}
                >
                    <div className="track-bg" />
                    <div className={`track-progress ${isLive ? 'live' : 'review'}`} style={{ width: `${timelineProgress}%` }} />
                    <div className={`track-thumb ${isLive ? 'live' : 'review'}`} style={{ left: `${timelineProgress}%` }} />
                    {data.incidents.map(inc => (
                        <div key={inc.id} className="track-marker" style={{ left: `${inc.start}%`, background: incidentPalette[inc.severity].color }} />
                    ))}
                </div>
            </div>
            <div className="timeline-time">{currentTime.slice(0, 5)} <SkipForward size={14} /></div>
          </div>

          <div className="map-view-controls">
            <button onClick={() => zoomAt(1.2, W/2, H/2)}>+</button>
            <button onClick={() => zoomAt(0.8, W/2, H/2)}>−</button>
            <button onClick={resetMap} title="Reset View" style={{ fontSize: '12px' }}>↺</button>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="live-twin-sidebar panel">
          <div className="sidebar-tab-actions">
              <span>ACTIVE INCIDENTS</span>
              <div className="alert-count red">{filteredIncidents.length} OPEN</div>
          </div>
          
          <div className="sidebar-section scrollable" style={{paddingTop: '8px'}}>
            {filteredIncidents.map(inc => (
                <div 
                  key={inc.id} 
                  className="modern-incident-card" 
                  onClick={() => setSelectedIncident(inc)}
                  style={{ borderLeftColor: incidentPalette[inc.severity].color }}
                >
                   <div className="card-top">
                      <div className="severity-badge" style={{ color: incidentPalette[inc.severity].color, background: incidentPalette[inc.severity].bg }}>
                         <MapSymbol type={incidentPalette[inc.severity].symbol} size={8} color={incidentPalette[inc.severity].color} />
                         <span style={{marginLeft:'4px'}}>{inc.severity.toUpperCase()}</span>
                      </div>
                      <span className="view-details-link">View Details ›</span>
                   </div>
                   <div className="card-body">
                      <div className="card-title">
                        {inc.description}
                      </div>
                      <div className="card-loc">{inc.zone}</div>
                   </div>
                   <div className="card-foot">
                      <span className={`status-pill ${inc.status.toLowerCase()}`}>{inc.status}</span>
                   </div>
                </div>
            ))}
          </div>

          <div className="sidebar-section-divider">VESSEL TRAFFIC</div>
          <div className="sidebar-section">
            {data.vessels.map(v => (
                <div key={v.id} className="vessel-list-item" onClick={() => setSelectedVessel(v)}>
                    <div className="vessel-dot" style={{ background: v.color }} />
                    <div className="vessel-info">
                        <span className="v-name">{v.name}</span>
                        <span className="v-type">{v.cargo}</span>
                    </div>
                    <div className={`v-status ${v.status.toLowerCase()}`}>{v.status} {v.eta && <span className="v-eta">{v.eta}</span>}</div>
                </div>
            ))}
          </div>

          <div className="sidebar-section-divider">ACTIVITY LOG</div>
          <div className="sidebar-section scrollable activity-timeline-container" style={{maxHeight:'180px'}}>
            <div className="timeline-connector" />
            {filteredActivities.map(act => (
                <div key={act.id} className="activity-item">
                    <div className="act-dot" style={{ borderColor: act.type === 'incident' ? C.rose : C.teal }} />
                    <div className="act-content">
                       <div className="act-msg">{act.message}</div>
                       <div className="act-time-row">
                          <span className="act-time-val">{act.time}</span>
                          <span className="act-status-meta">Verified</span>
                       </div>
                    </div>
                </div>
            ))}
          </div>

          <div className="sidebar-section-divider">ZONE RISK</div>
          <div className="sidebar-section">
             <div className="zone-risk-grid">
               {['A1','A2','B1','Y1','Y2','STR','BAY','CMP','ALPH'].map(z => (
                 <div key={z} className={`risk-tag ${['STR','Y1'].includes(z) ? 'warn' : ''}`}>{z}</div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="live-twin-footer">
          <div className="f-left">Port Safety Digital Twin - v3.5.0</div>
          <div className="f-center">
             <span>AIS: <tspan className="green">Live</tspan></span>
             <span>CCTV: <tspan className="green">32/34</tspan></span>
             <span>IoT Sensors: <tspan className="green">316/350</tspan></span>
             <span>Hazmat Detect: <tspan className="green">Active</tspan></span>
             <span>Comms: <tspan className="green">Secure</tspan></span>
          </div>
          <div className="f-right">North Container Terminal - Port Klang</div>
      </div>
    </div>
  );
}
