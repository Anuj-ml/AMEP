
import React, { useState, useRef, useMemo } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis
} from 'recharts';
import { 
  Target, 
  Activity, 
  Globe, 
  Network,
  Mic,
  MicOff,
  Volume2,
  Terminal,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  Star,
  Zap,
  Lock,
  Play
} from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { UserRole } from '../types';

interface MasterySystemProps { userRole: UserRole; }

// --- Types for Constellation Map ---
interface SkillNode {
  id: string;
  x: number;
  y: number;
  label: string;
  status: 'locked' | 'available' | 'mastered' | 'in-progress';
  connections: string[];
  mastery: number;
}

interface DomainCluster {
  id: string;
  name: string;
  x: number;
  y: number;
  nodes: SkillNode[];
  color: string;
}

// --- Mock Data Generator ---
const generateDomainData = (): DomainCluster[] => {
  return [
    {
      id: 'math',
      name: 'Calculus',
      x: 200,
      y: 200,
      color: '#6366f1', // Indigo
      nodes: [
        { id: 'm1', x: 200, y: 200, label: 'Limits', status: 'mastered', connections: ['m2', 'm3'], mastery: 100 },
        { id: 'm2', x: 280, y: 150, label: 'Derivatives', status: 'mastered', connections: ['m4', 'm5'], mastery: 95 },
        { id: 'm3', x: 280, y: 250, label: 'Continuity', status: 'mastered', connections: ['m4'], mastery: 88 },
        { id: 'm4', x: 380, y: 200, label: 'Chain Rule', status: 'in-progress', connections: ['m6'], mastery: 45 },
        { id: 'm5', x: 450, y: 120, label: 'Optimization', status: 'locked', connections: [], mastery: 0 },
        { id: 'm6', x: 500, y: 220, label: 'Integration', status: 'locked', connections: [], mastery: 0 },
      ]
    },
    {
      id: 'phys',
      name: 'Physics',
      x: 600,
      y: 400,
      color: '#10b981', // Emerald
      nodes: [
        { id: 'p1', x: 600, y: 400, label: 'Kinematics', status: 'mastered', connections: ['p2'], mastery: 92 },
        { id: 'p2', x: 680, y: 450, label: 'Forces', status: 'available', connections: ['p3'], mastery: 20 },
        { id: 'p3', x: 750, y: 380, label: 'Energy', status: 'locked', connections: [], mastery: 0 },
      ]
    }
  ];
};

const VoiceVisualizer: React.FC<{ active: boolean }> = ({ active }) => {
  const bars = Array.from({ length: 32 }, (_, i) => i + 1);
  return (
    <div className="flex items-end justify-center gap-1.5 h-24 w-full px-4">
      {bars.map((i) => (
        <div 
          key={i} 
          className={`w-1.5 rounded-full transition-all duration-150 ${active ? 'bg-indigo-400' : 'bg-slate-700 h-1 opacity-20'}`} 
          style={{ 
            height: active ? `${15 + Math.random() * 85}%` : '4px',
            animationDelay: `${i * 0.04}s`,
            opacity: active ? (0.3 + (i / 32) * 0.7) : 0.1
          }} 
        />
      ))}
    </div>
  );
};

const MasterySystem: React.FC<MasterySystemProps> = ({ userRole }) => {
  const [viewMode, setViewMode] = useState<'galaxy' | 'constellation'>('galaxy');
  const [activeDomain, setActiveDomain] = useState<DomainCluster | null>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  
  // Voice State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceLog, setVoiceLog] = useState<string[]>([]);
  
  const domains = useMemo(() => generateDomainData(), []);
  
  const trajectoryData = [
    { week: 'W1', score: 60 },
    { week: 'W2', score: 65 },
    { week: 'W3', score: 72 },
    { week: 'W4', score: 78 },
    { week: 'W5', score: 82 },
  ];

  const masteryData = useMemo(() => MOCK_STUDENTS[0].masteryScores.map(score => ({
    subject: score.subject, 
    mastery: score.score, 
    peerAvg: score.score - (Math.random() * 8 - 4),
    fullMark: 100,
  })), []);

  const startVoiceSession = async () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsVoiceActive(true);
      setVoiceLog([`Establishing Neural Interface...`]);
      setTimeout(() => {
          setVoiceLog(prev => [...prev, `AI: Ready. Select a node to begin Socratic analysis.`]);
      }, 1200);
    } catch (err) {
      alert("Microphone access is required for Socratic Hub.");
    }
  };

  const handleDomainClick = (domain: DomainCluster) => {
    setActiveDomain(domain);
    setViewMode('constellation');
    setSelectedNode(null);
  };

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
    if (isVoiceActive) {
      setVoiceLog(prev => [...prev, `Analyzing node: ${node.label}...`]);
    }
  };

  const backToGalaxy = () => {
    setViewMode('galaxy');
    setActiveDomain(null);
    setSelectedNode(null);
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 pb-20">
      
      {/* Hero: Neural Domain Navigator */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[4rem] p-12 sm:p-16 text-white shadow-3xl border border-white/5 group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-[3s]"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-600/20 text-indigo-400 rounded-full border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em]">
                 <Globe size={14} /> Domain Architecture v4.2
               </div>
               <h2 className="text-6xl sm:text-7xl font-black tracking-tighter leading-none">Neural Domain Navigator</h2>
               <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                 Real-time mapping of your cognitive strengths and procedural gaps. Synchronize your mastery across the STEM guild.
               </p>
            </div>
            
            <div className="flex flex-wrap gap-6">
               <div className="flex items-center gap-6 px-10 py-6 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                  <div className="p-4 bg-indigo-500 text-white rounded-2xl shadow-lg"><Activity size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Weekly Velocity</p>
                    <p className="text-3xl font-black text-white">+14.2%</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 px-10 py-6 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                  <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg"><Target size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Mastery</p>
                    <p className="text-3xl font-black text-white">85%</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="w-full xl:w-[450px] aspect-square bg-black/40 rounded-[3.5rem] p-8 border border-white/5 shadow-2xl relative">
             <div className="absolute inset-0 flex items-center justify-center opacity-20"><Network size={200} className="text-indigo-400" /></div>
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                 <PolarGrid stroke="#475569" />
                 <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                 <Radar name="You" dataKey="mastery" stroke="#818cf8" strokeWidth={3} fill="#818cf8" fillOpacity={0.5} />
               </RadarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Interactive Constellation Map */}
        <div className="xl:col-span-8 bg-slate-950 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden min-h-[700px] flex flex-col">
           {/* Map Toolbar */}
           <div className="absolute top-8 left-8 z-20 flex gap-4">
              {viewMode === 'constellation' && (
                <button onClick={backToGalaxy} className="p-3 bg-white/10 text-white backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                   <ChevronLeft size={24} />
                </button>
              )}
              <div className="px-6 py-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 text-white font-black text-sm uppercase tracking-widest">
                 {viewMode === 'galaxy' ? 'Galaxy View' : `${activeDomain?.name} Constellation`}
              </div>
           </div>
           
           <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
              <button className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white hover:bg-slate-700 transition-all"><ZoomIn size={20} /></button>
              <button className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white hover:bg-slate-700 transition-all"><ZoomOut size={20} /></button>
           </div>

           {/* SVG Graph Layer */}
           <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">
              {/* Starfield Background */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              
              <svg width="100%" height="100%" className="absolute inset-0" viewBox="0 0 800 600">
                 <defs>
                    <filter id="glow">
                       <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                       <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                       </feMerge>
                    </filter>
                 </defs>

                 {viewMode === 'galaxy' ? (
                   // Galaxy View: Show Domain Clusters
                   domains.map(domain => (
                     <g key={domain.id} onClick={() => handleDomainClick(domain)} className="cursor-pointer hover:opacity-80 transition-opacity">
                        <circle cx={domain.x} cy={domain.y} r={60} fill={domain.color} opacity={0.1} className="animate-pulse" />
                        <circle cx={domain.x} cy={domain.y} r={30} fill={domain.color} filter="url(#glow)" />
                        <text x={domain.x} y={domain.y + 50} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" letterSpacing="2">{domain.name.toUpperCase()}</text>
                     </g>
                   ))
                 ) : (
                   // Constellation View: Show Nodes & Connections
                   activeDomain && (
                      <g>
                         {/* Connections */}
                         {activeDomain.nodes.map(node => (
                            node.connections.map(targetId => {
                               const target = activeDomain.nodes.find(n => n.id === targetId);
                               if (!target) return null;
                               return (
                                  <line 
                                    key={`${node.id}-${target.id}`}
                                    x1={node.x} y1={node.y}
                                    x2={target.x} y2={target.y}
                                    stroke={node.status === 'mastered' ? activeDomain.color : '#334155'}
                                    strokeWidth="2"
                                    strokeDasharray={node.status === 'in-progress' ? '5,5' : '0'}
                                    opacity={0.6}
                                  />
                               );
                            })
                         ))}

                         {/* Nodes */}
                         {activeDomain.nodes.map(node => {
                            const isSelected = selectedNode?.id === node.id;
                            let fill = '#334155'; // Locked
                            let stroke = 'none';
                            let glow = '';

                            if (node.status === 'mastered') { fill = '#10b981'; glow = 'url(#glow)'; }
                            else if (node.status === 'in-progress') { fill = activeDomain.color; stroke = 'white'; glow = 'url(#glow)'; }
                            else if (node.status === 'available') { fill = '#475569'; stroke = activeDomain.color; }

                            return (
                               <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer transition-all">
                                  {/* Ripple effect for active node */}
                                  {isSelected && (
                                     <circle cx={node.x} cy={node.y} r={35} stroke="white" strokeWidth="1" fill="none" opacity="0.5" className="animate-ping" />
                                  )}
                                  <circle cx={node.x} cy={node.y} r={isSelected ? 20 : 12} fill={fill} stroke={stroke} strokeWidth="3" filter={glow} className="transition-all duration-300" />
                                  <text x={node.x} y={node.y + 35} textAnchor="middle" fill={isSelected ? 'white' : '#94a3b8'} fontSize={isSelected ? "14" : "10"} fontWeight="bold">{node.label}</text>
                               </g>
                            );
                         })}
                      </g>
                   )
                 )}
              </svg>
           </div>
        </div>

        {/* Sidebar: Inspector & Socratic Hub */}
        <div className="xl:col-span-4 flex flex-col gap-6 h-[700px]">
           {/* Node Inspector */}
           <div className={`flex-1 bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 transition-all duration-500 overflow-hidden relative flex flex-col ${selectedNode ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-50 grayscale'}`}>
              {!selectedNode ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 gap-4">
                    <Target size={48} className="opacity-20" />
                    <p className="font-black uppercase tracking-widest text-xs">Select a Node to Inspect</p>
                 </div>
              ) : (
                 <div className="space-y-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{activeDomain?.name} Domain</p>
                          <h3 className="text-3xl font-black text-slate-900 leading-none">{selectedNode.label}</h3>
                       </div>
                       <div className={`p-3 rounded-xl ${selectedNode.status === 'mastered' ? 'bg-emerald-100 text-emerald-600' : selectedNode.status === 'locked' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-600'}`}>
                          {selectedNode.status === 'mastered' ? <Star size={24} fill="currentColor" /> : selectedNode.status === 'locked' ? <Lock size={24} /> : <Zap size={24} fill="currentColor" />}
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Proficiency</span>
                          <span className="text-2xl font-black text-slate-900">{selectedNode.mastery}%</span>
                       </div>
                       <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${selectedNode.status === 'mastered' ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${selectedNode.mastery}%` }}></div>
                       </div>
                    </div>

                    <div className="space-y-3 flex-1">
                       <p className="text-xs font-black uppercase tracking-widest text-slate-400">Recommended Path</p>
                       <button className="w-full p-4 bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl text-left transition-all group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">1</div>
                             <span className="font-bold text-slate-700 group-hover:text-indigo-900">Interactive Visualization</span>
                          </div>
                       </button>
                       <button className="w-full p-4 bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl text-left transition-all group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">2</div>
                             <span className="font-bold text-slate-700 group-hover:text-indigo-900">Practice Problem Set</span>
                          </div>
                       </button>
                    </div>

                    <button disabled={selectedNode.status === 'locked'} className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                       <Play size={20} fill="currentColor" /> Launch Module
                    </button>
                 </div>
              )}
           </div>

           {/* Socratic Terminal Mini */}
           <div className={`bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col gap-4 ${isVoiceActive ? 'ring-4 ring-indigo-500/20' : ''}`}>
              <div className="flex justify-between items-center">
                 <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={16} className="text-indigo-400" /> Socratic Hub
                 </h4>
                 {isVoiceActive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
              </div>
              
              <div className="h-32 bg-black/40 rounded-2xl border border-white/5 p-4 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-relaxed text-slate-400">
                  {voiceLog.length === 0 ? "Terminal Idle..." : voiceLog.map((l, i) => <div key={i}>{l}</div>)}
              </div>
              
              <VoiceVisualizer active={isVoiceActive} />
              
              <button 
                onClick={startVoiceSession}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isVoiceActive ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/20 text-indigo-200'}`}
              >
                 {isVoiceActive ? <MicOff size={14} /> : <Mic size={14} />} {isVoiceActive ? 'End Link' : 'Initialize Voice'}
              </button>
           </div>
        </div>
      </div>

      {/* Trajectory Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
             <h3 className="text-xl font-black text-slate-900 mb-8">Mastery Velocity</h3>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={trajectoryData}>
                      <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} dot={{r: 4, fill: '#6366f1'}} />
                      <XAxis dataKey="week" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold' }} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="bg-indigo-600 rounded-[3rem] p-10 shadow-2xl text-white flex flex-col justify-center items-center text-center relative overflow-hidden group">
             <div className="relative z-10">
                <div className="text-6xl font-black mb-2 tracking-tighter">Top 5%</div>
                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Global Ranking</p>
             </div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          </div>
      </div>
    </div>
  );
};

export default MasterySystem;
