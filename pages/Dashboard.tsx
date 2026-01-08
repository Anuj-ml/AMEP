
import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  Star,
  Award,
  Trophy,
  Target,
  Activity,
  Clock,
  CheckCircle,
  Settings
} from 'lucide-react';
import { UserRole } from '../types';

interface DashboardProps {
  userRole: UserRole;
}

const StudentDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
              <Sparkles size={14} className="text-amber-300" /> Current Quest
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
              Push for <span className="text-emerald-100 italic">Advanced Mastery</span> in Physics.
            </h2>
            <p className="text-emerald-50 text-base sm:text-lg font-medium opacity-90 max-w-lg">
              You are 450 XP away from unlocking the next tier. Finish your "Wave Optics" practice set to claim a 2x bonus!
            </p>
            <button className="flex items-center gap-3 bg-white text-emerald-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all w-fit">
              Launch Task <ArrowRight size={20} />
            </button>
          </div>
          <Zap size={300} className="absolute -right-20 -top-20 opacity-10 rotate-12 pointer-events-none" />
        </div>

        {/* Level Progress */}
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] sm:rounded-[3rem] p-8 border border-slate-100 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">Your Rank</h3>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Level 24</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[10px] border-slate-50 flex items-center justify-center relative">
                 <div className="absolute inset-0 border-[10px] border-emerald-500 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 75%)' }}></div>
                 <span className="text-xl sm:text-2xl font-black text-slate-800">75%</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">XP to Next Level</p>
                <p className="text-xl sm:text-2xl font-black text-slate-800">1,240 / 2,000</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-8">
            {['Swift', 'Genius', 'Hero'].map((b, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center gap-2 grayscale opacity-40">
                <Award className="text-slate-400" size={20} />
                <span className="text-[10px] font-black uppercase text-slate-400">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { l: 'Weekly XP', v: '2,840', i: <Star size={20} />, c: 'emerald' },
          { l: 'Mastery', v: '82%', i: <Target size={20} />, c: 'blue' },
          { l: 'Streak', v: '14 Days', i: <Flame size={20} />, c: 'orange' },
          { l: 'Accuracy', v: '91%', i: <Activity size={20} />, c: 'indigo' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-5 text-center sm:text-left">
            <div className={`p-3 sm:p-4 rounded-2xl bg-${s.c}-50 text-${s.c}-600 shrink-0`}>{s.i}</div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
              <p className="text-xl sm:text-2xl font-black text-slate-800 truncate">{s.v}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Class Insight Card */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] sm:rounded-[3rem] border border-slate-100 p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Class Analysis</h2>
              <p className="text-slate-500 font-medium">Real-time aggregate engagement</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 active:scale-95 transition-all"><Activity size={20} /></button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 active:scale-95 transition-all"><Settings size={20} /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[
              {l: 'Grading Queue', v: '12', c: 'text-amber-600', sub: '3 Urgent'},
              {l: 'Active Projects', v: '4', c: 'text-indigo-600', sub: 'All On-Track'},
              {l: 'Students At-Risk', v: '2', c: 'text-rose-600', sub: 'Urgent'},
              {l: 'Avg Mastery', v: '74%', c: 'text-emerald-600', sub: '+5% increase'}
            ].map((s, i) => (
              <div key={i} className="p-5 sm:p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-100 transition-all">
                <p className={`text-3xl sm:text-4xl font-black ${s.c} mb-1 tracking-tighter`}>{s.v}</p>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{s.l}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 sm:p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex flex-col sm:flex-row items-center gap-5">
             <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <Sparkles size={24} />
             </div>
             <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-black text-indigo-900">AI Teaching Assistant</p>
                <p className="text-xs font-bold text-indigo-700 mt-0.5 italic leading-relaxed">"3 students struggling with Torque. Supplementary video ready."</p>
             </div>
             <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-indigo-700 active:scale-95 transition-all">Deploy</button>
          </div>
        </div>

        {/* Tasks & Operations */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-8 text-white shadow-2xl flex flex-col h-full">
           <h3 className="text-xl font-black mb-8 flex items-center justify-between">
              Action Items <Clock size={20} className="text-slate-500" />
           </h3>
           <div className="space-y-4 flex-1">
              {[
                { t: 'Review Lab Reports', p: 'High', s: 'Grading' },
                { t: 'PBL Group Feedback', p: 'Med', s: 'Mentorship' },
                { t: 'Sync Curriculum', p: 'Low', s: 'Admin' }
              ].map((task, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group active:scale-95">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${task.p === 'High' ? 'text-rose-400' : 'text-indigo-400'}`}>{task.p}</span>
                    <CheckCircle size={14} className="text-slate-700 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <p className="text-sm font-bold leading-tight">{task.t}</p>
                </div>
              ))}
           </div>
           <button className="mt-8 w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-100 active:scale-95 transition-all">Full Workspace</button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  switch (userRole) {
    case UserRole.STUDENT: return <StudentDashboard />;
    case UserRole.TEACHER: return <TeacherDashboard />;
    default: return <StudentDashboard />;
  }
};

export default Dashboard;
