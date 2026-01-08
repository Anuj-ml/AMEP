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
  ArrowRight
} from 'lucide-react';
import { MOCK_TASKS } from '../constants';
import { UserRole } from '../types';

interface TaskManagementProps {
  userRole: UserRole;
}

// Visual confirmation component for XP awards
const XpAwardAnimation: React.FC<{ x: number; y: number; xp: number; onComplete: () => void }> = ({ x, y, xp, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="fixed z-[100] pointer-events-none flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-slate-900 font-black rounded-full shadow-[0_10px_40px_rgba(251,191,36,0.5)] border-2 border-white animate-xp-float"
      style={{ left: x, top: y, transform: 'translate(-50%, -100%)' }}
    >
      <Zap size={18} fill="currentColor" />
      +{xp} XP
    </div>
  );
};

const TaskManagement: React.FC<TaskManagementProps> = ({ userRole }) => {
  const isStudent = userRole === UserRole.STUDENT;
  const isTeacher = userRole === UserRole.TEACHER;
  
  const [tasks, setTasks] = useState(isStudent ? [
    { id: 's-1', title: 'Calculus Mastery Quiz', type: 'homework', priority: 'high', status: 'todo', xp: 150 },
    { id: 's-2', title: 'Renewable Site Analysis', type: 'homework', priority: 'medium', status: 'todo', xp: 200 },
    { id: 's-3', title: 'Physics: Wave Mechanics', type: 'homework', priority: 'low', status: 'done', xp: 50 }
  ] : MOCK_TASKS.map(t => ({...t, xp: 75})));

  const [awards, setAwards] = useState<{ id: number; x: number; y: number; xp: number }[]>([]);

  const toggleTask = (e: React.MouseEvent, id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Trigger animation for student completing task
    if (task.status === 'todo' && isStudent) {
      setAwards(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY, xp: task.xp }]);
    }

    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
    ));
  };

  const removeAward = (id: number) => {
    setAwards(prev => prev.filter(a => a.id !== id));
  };

  const theme = isStudent 
    ? { accent: 'emerald', bg: 'bg-emerald-600', text: 'text-emerald-600', ring: 'focus:ring-emerald-500' }
    : { accent: 'indigo', bg: 'bg-indigo-600', text: 'text-indigo-600', ring: 'focus:ring-indigo-500' };

  return (
    <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10 animate-in slide-in-from-top-4 duration-500 pb-12 relative">
      <style>{`
        @keyframes xp-float {
          0% { transform: translate(-50%, -100%) scale(0.5); opacity: 0; }
          20% { transform: translate(-50%, -140%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -220%) scale(1); opacity: 0; }
        }
        .animate-xp-float { animation: xp-float 1.2s ease-out forwards; }
      `}</style>

      {awards.map(award => (
        <XpAwardAnimation 
          key={award.id} 
          x={award.x} 
          y={award.y} 
          xp={award.xp} 
          onComplete={() => removeAward(award.id)} 
        />
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {isStudent ? 'Missions Hub' : 'Operational Workspace'}
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">
            {isStudent ? 'Complete high-yield tasks to boost your global rank.' : 'Manage class workflows and curriculum logs.'}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm active:scale-90 transition-transform">
            <Filter size={20} />
          </button>
          {!isStudent && (
            <button className={`${theme.bg} flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 active:scale-95 transition-all`}>
              <Plus size={20} /> New Protocol
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-4 sm:gap-6 p-5 sm:p-7 bg-white rounded-[2rem] border-2 transition-all duration-300 relative ${
                task.status === 'done' 
                  ? 'border-emerald-100 bg-emerald-50/20 opacity-60' 
                  : `border-white hover:border-${theme.accent}-100 hover:shadow-2xl hover:-translate-y-1`
              }`}
            >
              <button 
                onClick={(e) => toggleTask(e, task.id)}
                className={`shrink-0 transition-all hover:scale-110 active:scale-90 ${task.status === 'done' ? 'text-emerald-500' : `text-slate-200 hover:${theme.text}`}`}
                aria-label={task.status === 'done' ? "Unmark task" : "Complete task"}
              >
                {task.status === 'done' ? <CheckCircle2 size={36} /> : <Circle size={36} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <h4 className={`font-black text-slate-800 truncate text-lg sm:text-xl tracking-tight ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                    {task.title}
                  </h4>
                  {task.priority === 'high' && task.status !== 'done' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 px-2.5 py-1 bg-rose-50 rounded-lg w-fit border border-rose-100">
                      <AlertTriangle size={12} /> Critical
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200/50">
                    {task.type.replace('_', ' ')}
                  </span>
                  {isStudent && task.status !== 'done' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase shadow-sm border border-amber-200/50 group-hover:scale-105 transition-transform">
                      <Zap size={14} fill="currentColor" /> {task.xp} XP
                    </div>
                  )}
                  {task.status === 'done' && isStudent && (
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100/50 px-3 py-1.5 rounded-xl">
                      <Sparkles size={12} /> Claimed
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4">
                 <button className={`flex items-center gap-2 bg-slate-900 text-white font-black text-xs px-6 py-3.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-lg`}>
                   {isStudent ? 'Launch Mission' : 'Manage Protocol'} <ArrowRight size={14} />
                 </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          {isStudent ? (
            <div className="bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden">
              <h3 className="text-xl font-black mb-10 flex items-center justify-between uppercase tracking-widest text-slate-500">
                Guild Rankings <Crown className="text-amber-400" size={24} />
              </h3>
              <div className="space-y-4">
                {[
                  { r: 1, n: 'Sarah W.', x: '15.4k XP', c: 'border-amber-500/30 bg-amber-500/5' },
                  { r: 2, n: 'Alex J.', x: '14.8k XP', c: 'border-white/5 bg-white/5' },
                  { r: 3, n: 'Maria G.', x: '13.2k XP', c: 'border-white/5 bg-white/5' },
                ].map(u => (
                  <div key={u.r} className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all hover:bg-white/10 ${u.c}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${u.r === 1 ? 'bg-amber-400 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'bg-slate-800 text-slate-400'}`}>#{u.r}</div>
                    <div className="flex-1 font-black text-sm tracking-tight">{u.n}</div>
                    <div className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">{u.x}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-5 bg-emerald-600 rounded-[1.5rem] font-black text-sm text-white shadow-xl shadow-emerald-900/40 hover:bg-emerald-500 active:scale-95 transition-all">Expand Leaderboard</button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
               <div className="flex items-center justify-between">
                 <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                   <TrendingUp className="text-indigo-600" size={20} /> Operations
                 </h3>
                 <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">Active</span>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                     <span>Workload Intensity</span>
                     <span className="text-rose-500">85% Capacity</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-indigo-600 rounded-full w-[85%] shadow-lg shadow-indigo-200 transition-all duration-1000 ease-out"></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider mt-4 italic text-center px-4">
                    "AI predictive analysis suggests offloading grading tasks to automated peer-review modules."
                  </p>
               </div>
               <div className="pt-6 border-t border-slate-50">
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200">Optimize Workflow</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
