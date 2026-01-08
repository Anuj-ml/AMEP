
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Users, 
  ChevronRight, 
  Sparkles, 
  Briefcase, 
  Layout, 
  FileText, 
  PenTool, 
  MessageSquare, 
  Maximize2, 
  Eraser, 
  Trash2, 
  StickyNote,
  MousePointer2,
  Circle,
  TrendingUp
} from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
import { UserRole } from '../types';

interface PBLManagerProps {
  userRole: UserRole;
}

interface RemoteMember {
  id: string;
  name: string;
  color: string;
  tool: 'pen' | 'eraser' | 'idle';
  x: number;
  y: number;
}

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4f46e5');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  
  // Simulated remote presence data
  const [remoteMembers, setRemoteMembers] = useState<RemoteMember[]>([
    { id: '2', name: 'Maria', color: '#10b981', tool: 'pen', x: 250, y: 300 },
    { id: '3', name: 'Alex', color: '#f59e0b', tool: 'eraser', x: 500, y: 150 }
  ]);

  // Simulate remote movement for "Modern" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setRemoteMembers(prev => prev.map(m => ({
        ...m,
        x: m.x + (Math.random() - 0.5) * 10,
        y: m.y + (Math.random() - 0.5) * 10
      })));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.putImageData(tempImage, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-2xl relative flex flex-col overflow-hidden group/canvas">
      {/* Cursors Layer */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {remoteMembers.map(member => (
          <div 
            key={member.id}
            className="absolute transition-all duration-100 ease-out"
            style={{ left: member.x, top: member.y }}
          >
            <div className="relative">
              <MousePointer2 size={20} fill={member.color} stroke="white" strokeWidth={1} className="drop-shadow-md" />
              <div 
                className="absolute left-4 top-4 px-2 py-1 rounded-full text-[9px] font-black text-white whitespace-nowrap flex items-center gap-1.5 shadow-lg border border-white/20"
                style={{ backgroundColor: member.color }}
              >
                {member.name}
                <span className="opacity-70 flex items-center gap-1">
                  • {member.tool === 'pen' ? <PenTool size={8} /> : member.tool === 'eraser' ? <Eraser size={8} /> : 'idle'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar - Modern Glassmorphism */}
      <div className="absolute top-6 left-6 z-30 flex gap-2 bg-slate-900/95 backdrop-blur-xl p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
        <button 
          onClick={() => setTool('pen')}
          className={`p-2.5 rounded-xl transition-all active:scale-90 ${tool === 'pen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          title="Pen Tool"
        >
          <PenTool size={20} />
        </button>
        <button 
          onClick={() => setTool('eraser')}
          className={`p-2.5 rounded-xl transition-all active:scale-90 ${tool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          title="Eraser Tool"
        >
          <Eraser size={20} />
        </button>
        <div className="w-px h-6 bg-white/10 self-center mx-1" />
        <button onClick={clearCanvas} className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 transition-all active:scale-90" title="Clear Canvas">
          <Trash2 size={20} />
        </button>
        <button className="hidden sm:block p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 transition-all active:scale-90" title="Add Sticky">
          <StickyNote size={20} />
        </button>
      </div>

      {/* Presence Dashboard - Modern Sidebar overlay */}
      <div className="absolute right-6 top-6 z-30 flex flex-col gap-3">
        <div className="bg-slate-900/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/10 space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Presence</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 border border-white/20 flex items-center justify-center text-[10px] font-black text-white">YOU</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white leading-none">Me</span>
                <span className="text-[8px] font-medium text-slate-500">{tool === 'pen' ? 'Drawing' : 'Erasing'}</span>
              </div>
            </div>
            {remoteMembers.map(member => (
              <div key={member.id} className="flex items-center gap-3 px-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="relative">
                  <div 
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-black text-white"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name[0]}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white leading-none">{member.name}</span>
                  <span className="text-[8px] font-medium text-slate-500">{member.tool === 'pen' ? 'Drawing' : member.tool === 'eraser' ? 'Erasing' : 'Idle'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/95 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2">
          <div className="flex gap-1">
            {['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#000000'].map(c => (
              <button 
                key={c}
                onClick={() => { setColor(c); setTool('pen'); }}
                className={`w-6 h-6 rounded-lg border-2 border-white/10 transition-all ${color === c && tool === 'pen' ? 'scale-110 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="flex-1 cursor-crosshair touch-none"
      />
      
      <div className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md">
         <Circle size={8} fill="#10b981" className="text-emerald-500 animate-pulse" />
         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">3 Collaborators Live</span>
      </div>
    </div>
  );
};

const PBLManager: React.FC<PBLManagerProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'planning' | 'active'>('active');
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [workspaceTool, setWorkspaceTool] = useState<'doc' | 'board' | 'layout'>('doc');
  const isTeacher = userRole === UserRole.TEACHER;

  if (showWorkspace) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col animate-in fade-in zoom-in-95 duration-500 overflow-hidden font-inter">
        <header className="h-20 border-b border-slate-800/50 flex justify-between items-center px-6 bg-slate-950/80 backdrop-blur-2xl shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowWorkspace(false)} 
              className="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90 border border-white/5"
            >
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-white font-black text-xl tracking-tighter">Solar Pioneers Workspace</h2>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Synchronous Session
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i+10}`} 
                      className="w-10 h-10 rounded-xl border-2 border-slate-950 shadow-xl bg-slate-800" 
                      alt="User avatar" 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
                  </div>
                ))}
             </div>
             <div className="h-8 w-px bg-slate-800 mx-2"></div>
             <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black shadow-[0_10px_30px_rgba(79,70,229,0.3)] active:scale-95 transition-all border border-indigo-400/20">
               Share Lab
             </button>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-20 border-r border-slate-800/50 flex flex-col items-center py-8 gap-8 shrink-0 bg-slate-950/40">
            <button 
              onClick={() => setWorkspaceTool('doc')}
              className={`p-4 rounded-2xl transition-all relative group ${workspaceTool === 'doc' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
            >
              <FileText size={24} />
              {workspaceTool === 'doc' && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-400 rounded-l-full"></div>}
            </button>
            <button 
              onClick={() => setWorkspaceTool('board')}
              className={`p-4 rounded-2xl transition-all relative group ${workspaceTool === 'board' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
            >
              <PenTool size={24} />
              {workspaceTool === 'board' && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-400 rounded-l-full"></div>}
            </button>
            <button 
              onClick={() => setWorkspaceTool('layout')}
              className={`p-4 rounded-2xl transition-all relative group ${workspaceTool === 'layout' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
            >
              <Layout size={24} />
              {workspaceTool === 'layout' && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-400 rounded-l-full"></div>}
            </button>
            <div className="mt-auto mb-4 p-4 text-slate-700 hover:text-white transition-colors cursor-pointer">
              <MessageSquare size={24} />
            </div>
          </aside>
          
          <div className="flex-1 bg-slate-900/20 p-4 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
              {workspaceTool === 'doc' ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] p-8 sm:p-16 text-slate-800 border border-slate-100">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg uppercase tracking-[0.2em]">Draft V4</span>
                      <span className="text-slate-400 text-xs font-bold">Updated 2m ago by Alex</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black mb-8 text-slate-900 tracking-tighter">Renewable Energy City Proposal</h1>
                    <p className="text-base sm:text-xl leading-relaxed mb-10 font-medium text-slate-600/90">
                      Our proposed sustainable city model integrates multi-modal energy harvesting. By combining high-efficiency vertical-axis wind turbines with bifacial solar arrays, we minimize the land footprint while maximizing 24-hour yield.
                    </p>
                    <div className="p-6 sm:p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] italic text-slate-600 font-medium mb-12 shadow-sm flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-black text-sm border border-amber-200">A</div>
                      <div>
                        <p className="text-sm leading-relaxed">"We need to recalculate the energy storage requirements for the winter solstice. The current battery farm seems undersized by 15%."</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Alex Johnson • Lab Member</p>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
                      <Sparkles size={24} className="text-indigo-500" /> AI Feasibility Report
                    </h3>
                    <div className="aspect-video bg-indigo-950 rounded-[2rem] border border-white/10 flex items-center justify-center text-indigo-300 font-black italic relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent"></div>
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <TrendingUp size={48} className="opacity-50" />
                        <span className="text-sm uppercase tracking-widest opacity-80">Interactive Simulation Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : workspaceTool === 'board' ? (
                <Whiteboard />
              ) : (
                <div className="flex-1 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 flex items-center justify-center text-slate-500 font-black uppercase tracking-widest text-center px-10 border-dashed">
                  Spatial Layout Management Module
                </div>
              )}
            </div>
            
            <aside className="hidden xl:flex w-80 flex-col gap-8 shrink-0">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl">
                 <h4 className="text-white font-black flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
                   Live Feed <Maximize2 size={14} className="text-slate-700" />
                 </h4>
                 <div className="space-y-4">
                   {[
                     { user: 'Alex', action: 'edited', target: 'Efficiency Calculations', color: 'indigo' },
                     { user: 'Maria', action: 'completed', target: 'Site Survey V2', color: 'emerald' },
                     { user: 'Gemini', action: 'suggested', target: 'Grid Redundancy', color: 'purple' }
                   ].map((t, i) => (
                     <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-default">
                       <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 bg-${t.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
                       <div className="flex flex-col">
                         <span className="text-xs text-white font-bold leading-tight"><span className="text-slate-400">{t.user}</span> {t.action}</span>
                         <span className="text-[10px] text-slate-500 font-medium mt-1 truncate">{t.target}</span>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
              
              <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex flex-col shadow-2xl">
                 <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-6">Lab Chat</h4>
                 <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-indigo-400 uppercase">Maria G.</span>
                        <span className="text-[8px] text-slate-600">12:45 PM</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-[11px] text-slate-300 font-medium border border-white/5">
                        Does the turbine height conflict with FAA regulations in this zone?
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-slate-600">12:46 PM</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">YOU</span>
                      </div>
                      <div className="bg-indigo-600/20 p-3 rounded-2xl rounded-tr-none text-[11px] text-indigo-100 font-medium border border-indigo-500/20">
                        Checking zoning laws now. Looks like we're clear up to 200ft.
                      </div>
                    </div>
                 </div>
                 <div className="mt-8 pt-6 border-t border-slate-800">
                   <div className="relative group">
                     <input 
                       type="text" 
                       placeholder="Say something..." 
                       className="w-full bg-slate-950 border-white/5 rounded-2xl py-3.5 px-5 text-xs text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all border outline-none" 
                     />
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-xl shadow-lg cursor-pointer">
                        <ChevronRight size={14} className="text-white" />
                     </div>
                   </div>
                 </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">Lab Protocol</h2>
          <p className="text-slate-500 font-medium text-sm sm:text-lg mt-1">High-stakes synchronous collaborative engineering.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="flex flex-1 sm:flex-initial bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            {(['all', 'planning', 'active'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          
          {isTeacher && (
            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black shadow-[0_15px_35px_rgba(79,70,229,0.3)] hover:bg-indigo-700 active:scale-95 transition-all">
              <Plus size={20} />
              Provision Lab
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all group flex flex-col hover:-translate-y-2 duration-500">
            <div className="p-10 space-y-8 flex-1">
              <div className="flex justify-between items-start">
                <span className="px-5 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100 shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {project.status}
                </span>
                <button className="text-slate-300 hover:text-slate-600 transition-colors active:scale-90">
                  <MoreHorizontal size={24} />
                </button>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tighter leading-none">{project.title}</h3>
                <p className="text-slate-500 text-base font-medium line-clamp-2 mt-4 leading-relaxed opacity-80">{project.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest pt-4">
                <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100/50">
                  <Calendar size={16} className="text-indigo-400" />
                  <span>Dec 15 Target</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100/50">
                  <Users size={16} className="text-purple-400" />
                  <span>{project.teams.length} Labs Active</span>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                <div className="flex justify-between text-[11px] font-black text-slate-700 uppercase tracking-[0.2em]">
                  <span>Lab Velocity</span>
                  <span className="text-indigo-600">52% Proficient</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-full rounded-full w-[52%] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.3)]"></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowWorkspace(true)}
              className="w-full border-t border-slate-50 p-8 bg-slate-50/30 flex justify-between items-center cursor-pointer hover:bg-slate-900 group/btn transition-all outline-none"
            >
              <div className="flex flex-col items-start">
                <span className="text-base font-black text-slate-900 group-hover:text-white transition-colors">Join Collaboration</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-slate-500">3 Peers online</span>
              </div>
              <div className="p-3 bg-white rounded-2xl shadow-lg group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1 border border-slate-100">
                <ChevronRight size={22} />
              </div>
            </button>
          </div>
        ))}

        {isTeacher && (
          <div className="bg-indigo-950 rounded-[3.5rem] p-12 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl min-h-[500px] border border-white/5">
            <div className="relative z-10">
              <div className="bg-white/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                <Sparkles className="text-indigo-300" size={40} />
              </div>
              <h3 className="text-4xl font-black mb-6 tracking-tighter leading-tight">AI Lab Synthesis</h3>
              <p className="text-indigo-200/70 text-lg font-medium leading-relaxed">
                Generate enterprise-grade engineering challenges, adaptive rubrics, and team scaffolds based on current class mastery.
              </p>
            </div>
            <button className="relative z-10 mt-12 w-full py-6 bg-white text-indigo-950 hover:bg-indigo-50 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-indigo-950/50 active:scale-95">
              Generate Protocol Pipeline
            </button>
            <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        )}

        {userRole === UserRole.STUDENT && (
          <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white flex flex-col justify-between border-2 border-indigo-500/30 relative overflow-hidden group shadow-2xl min-h-[500px] hover:border-indigo-500 transition-all duration-500">
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                 <div className="bg-indigo-600/20 p-6 rounded-[2rem] border border-indigo-500/20 shadow-inner group-hover:scale-105 transition-transform">
                    <Briefcase size={36} className="text-indigo-400" />
                 </div>
                 <div className="flex flex-col">
                    <h3 className="text-2xl font-black tracking-tight text-white leading-none">Solar Pioneers</h3>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active Session
                    </p>
                 </div>
              </div>
              <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
                Your team is debating <span className="text-white font-black underline decoration-indigo-500 decoration-4 underline-offset-4">Battery Sizing</span> on the whiteboard right now.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <img 
                      key={i} 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=member${i+20}`} 
                      className="w-12 h-12 rounded-2xl border-4 border-slate-900 bg-slate-800 shadow-2xl"
                      alt="Team member"
                    />
                  ))}
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">+3 more</div>
              </div>
            </div>
            <button onClick={() => setShowWorkspace(true)} className="relative z-10 w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-[0_20px_50px_rgba(79,70,229,0.4)] border border-indigo-400/20">
              Launch Live Workspace
            </button>
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PBLManager;
