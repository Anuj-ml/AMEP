
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Filter, 
  Plus, 
  Zap, 
  Crown, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  X,
  Target,
  Rocket,
  Loader2,
  GripVertical
} from 'lucide-react';
import { MOCK_TASKS } from '../constants';
import { UserRole } from '../types';

interface TaskManagementProps { userRole: UserRole; }

const XpAwardAnimation: React.FC<{ x: number; y: number; xp: number; onComplete: () => void }> = ({ x, y, xp, onComplete }) => {
  useEffect(() => { const timer = setTimeout(onComplete, 1200); return () => clearTimeout(timer); }, [onComplete]);
  return (
    <div className="fixed z-[100] pointer-events-none flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-slate-900 font-black rounded-full shadow-2xl border-2 border-white animate-xp-float" style={{ left: x, top: y, transform: 'translate(-50%, -100%)' }}>
      <Zap size={18} fill="currentColor" /> +{xp} XP
    </div>
  );
};

const TaskManagement: React.FC<TaskManagementProps> = ({ userRole }) => {
  const isStudent = userRole === UserRole.STUDENT;
  
  const [tasks, setTasks] = useState(isStudent ? [
    { id: 's-1', title: 'Calculus Mastery Quiz', type: 'homework', priority: 'high', status: 'todo', xp: 150, description: 'Apply chain rule and derivatives to complex orbital mechanics problems.' },
    { id: 's-2', title: 'Renewable Site Analysis', type: 'homework', priority: 'medium', status: 'todo', xp: 200, description: 'Analyze GIS data to determine peak solar irradiance for City Hub 4.' },
    { id: 's-3', title: 'Physics Lab Report', type: 'homework', priority: 'medium', status: 'todo', xp: 100, description: 'Submit findings on pendulum motion.' }
  ] : MOCK_TASKS.map(t => ({...t, xp: 75, description: 'Classroom administrative task.'})));

  const [awards, setAwards] = useState<{ id: number; x: number; y: number; xp: number }[]>([]);
  const [activeBriefing, setActiveBriefing] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const toggleTask = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (task.status === 'todo' && isStudent) {
      setAwards(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY, xp: task.xp }]);
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t));
  };

  const optimizeWorkflow = () => {
    setIsOptimizing(true);
    setTimeout(() => {
        setIsOptimizing(false);
        alert("Workflow Optimized: 3 administrative tasks offloaded to automated modules. 12% capacity reclaimed.");
    }, 2500);
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
    // Setup ghost image if needed, or rely on default
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedItem);
    const targetIndex = tasks.findIndex(t => t.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);

    setTasks(newTasks);
    setDraggedItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10 animate-in slide-in-from-top-4 duration-500 pb-12 relative">
      <style>{`
        @keyframes xp-float { 0% { transform: translate(-50%, -100%) scale(0.5); opacity: 0; } 20% { transform: translate(-50%, -140%) scale(1.1); opacity: 1; } 100% { transform: translate(-50%, -220%) scale(1); opacity: 0; } }
        .animate-xp-float { animation: xp-float 1.2s ease-out forwards; }
      `}</style>

      {awards.map(award => <XpAwardAnimation key={award.id} x={award.x} y={award.y} xp={award.xp} onComplete={() => setAwards(prev => prev.filter(a => a.id !== award.id))} />)}

      {activeBriefing && (
          <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in-95">
             <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full relative shadow-2xl border border-white/20">
                <button onClick={() => setActiveBriefing(null)} className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                <div className="space-y-8">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-indigo-600 text-white rounded-3xl"><Rocket size={32} /></div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">{activeBriefing.title}</h3>
                        <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mt-1">Strategic Mission Objective</p>
                      </div>
                   </div>
                   <p className="text-slate-600 text-lg leading-relaxed font-medium">{activeBriefing.description}</p>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] font-black uppercase text-slate-400">Reward</p><p className="text-xl font-black text-amber-600">+{activeBriefing.xp} XP</p></div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] font-black uppercase text-slate-400">Complexity</p><p className="text-xl font-black text-indigo-600">Tier 3</p></div>
                   </div>
                   <button onClick={() => { alert('Mission Deployed.'); setActiveBriefing(null); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 active:scale-95 transition-all">Engage Mission Hub</button>
                </div>
             </div>
          </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{isStudent ? 'Missions Hub' : 'Operational Workspace'}</h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">{isStudent ? 'Complete high-yield tasks to boost your global rank. Drag to reorder.' : 'Manage class workflows and curriculum logs. Drag to reorder.'}</p>
        </div>
        <div className="flex gap-3">
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"><Filter size={20} /></button>
          {!isStudent && <button onClick={() => alert('Launching Protocol Provisioning UI...')} className="bg-indigo-600 flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95"><Plus size={20} /> New Protocol</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, task.id)}
              className={`group flex items-center gap-4 sm:gap-6 p-5 sm:p-7 bg-white rounded-[2rem] border-2 transition-all duration-300 cursor-grab active:cursor-grabbing ${task.status === 'done' ? 'border-emerald-100 opacity-60' : draggedItem === task.id ? 'border-indigo-300 shadow-xl scale-105 rotate-1 z-10' : 'border-white hover:border-indigo-100 hover:shadow-2xl'}`}
            >
              <div className="text-slate-200 group-hover:text-indigo-300 cursor-grab">
                <GripVertical size={24} />
              </div>
              <button onClick={(e) => toggleTask(e, task.id)} className={`shrink-0 transition-all ${task.status === 'done' ? 'text-emerald-500' : 'text-slate-200 hover:text-indigo-600'}`}>{task.status === 'done' ? <CheckCircle2 size={36} /> : <Circle size={36} />}</button>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><h4 className={`font-black text-slate-800 truncate text-lg sm:text-xl tracking-tight ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>{task.title}</h4></div>
                <div className="flex flex-wrap items-center gap-2 mt-3"><span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200/50">{task.type.replace('_', ' ')}</span></div>
              </div>
              <button onClick={() => setActiveBriefing(task)} className="hidden sm:flex items-center gap-2 bg-slate-900 text-white font-black text-xs px-6 py-3.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-lg">{isStudent ? 'Briefing' : 'Configure'}</button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
          {isStudent ? (
            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden">
              <h3 className="text-xl font-black mb-10 flex items-center justify-between uppercase tracking-widest text-slate-500">Guild Rankings <Crown className="text-amber-400" size={24} /></h3>
              <div className="space-y-4">
                {[{ r: 1, n: 'Sarah W.', x: '15.4k XP' }, { r: 2, n: 'Alex J.', x: '14.8k XP' }].map(u => (
                  <div key={u.r} className="flex items-center gap-4 p-5 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${u.r === 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>#{u.r}</div>
                    <div className="flex-1 font-black text-sm">{u.n}</div>
                    <div className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">{u.x}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowFullLeaderboard(true)} className="w-full mt-10 py-5 bg-emerald-600 rounded-[1.5rem] font-black text-sm shadow-xl hover:bg-emerald-500 transition-all">Expand Leaderboard</button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
               <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs"><TrendingUp className="text-indigo-600" size={20} /> Operations</h3>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>Workload Intensity</span><span className="text-rose-500">85% Capacity</span></div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 rounded-full w-[85%] transition-all duration-1000 ease-out"></div></div>
               </div>
               <button onClick={optimizeWorkflow} disabled={isOptimizing} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                 {isOptimizing ? <Loader2 className="animate-spin" /> : <Zap size={16} />} {isOptimizing ? 'Optimizing...' : 'Optimize Workflow'}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
