
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Zap,
  ArrowRight,
  ChevronRight,
  Flame,
  Star,
  Award,
  Trophy,
  Target,
  Activity,
  Clock,
  CheckCircle,
  Settings,
  Bell,
  Palette,
  EyeOff,
  User as UserIcon,
  RefreshCw,
  Mail,
  Smartphone,
  Eye,
  Briefcase,
  AlertTriangle,
  X,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import { UserRole, NotificationSettings } from '../types';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  userRole: UserRole;
}

const PREDEFINED_AVATARS = [
  'student1', 'student2', 'student3', 'student4', 'student5', 'student6'
].map(seed => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [avatar, setAvatar] = useState(PREDEFINED_AVATARS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notifs, setNotifs] = useState<NotificationSettings>({
    tasks: true, pbl: true, community: false, quietHours: false
  });

  const generateAIAvatar = async () => {
    setIsGenerating(true);
    try {
      const url = await geminiService.generateAvatar("A futuristic scholar of physics and mathematics with glowing cybernetic eyes and a high-tech academic robe.");
      if (url) setAvatar(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const resumeMission = () => navigate('/tasks');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3.5rem] p-10 sm:p-14 text-white shadow-[0_40px_80px_rgba(79,70,229,0.3)] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col sm:flex-row gap-12 items-center">
            <div className="relative group">
               <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <img src={avatar} className="relative w-40 h-40 rounded-[3rem] bg-white border-[6px] border-white/10 shadow-2xl group-hover:rotate-3 transition-all duration-500" alt="Avatar" />
               <button onClick={() => setShowSettings(true)} className="absolute -bottom-3 -right-3 p-3 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-indigo-500 active:scale-90 transition-all"><Palette size={20} /></button>
            </div>
            <div className="space-y-6 text-center sm:text-left">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.1]">Mastery Awaits, <span className="text-indigo-300 italic">Scholar</span>.</h2>
              <p className="text-indigo-100 text-xl font-medium opacity-80 max-w-lg leading-relaxed">You're in the <span className="text-white font-black underline decoration-indigo-400 decoration-4">top 5%</span> of your guild this week. Calculus mastery is within reach.</p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start pt-4">
                <button onClick={resumeMission} className="flex items-center gap-3 bg-white text-indigo-950 px-8 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm">Resume Mission <ArrowRight size={20} /></button>
                <button onClick={() => setShowSettings(true)} className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black hover:bg-white/20 transition-all text-sm border border-white/10">Guild Settings</button>
              </div>
            </div>
          </div>
          <Zap size={400} className="absolute -right-32 -top-32 opacity-5 rotate-12 pointer-events-none text-white" />
        </div>

        <div className="lg:col-span-4 bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-between group hover:border-indigo-100 transition-all">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Vanguard Rank</h3>
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">Level 24</div>
            </div>
            <div className="flex flex-col items-center gap-6 py-6">
              <div className="relative w-40 h-40 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="110" className="text-indigo-600 stroke-round transition-all duration-1000" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800 tracking-tight">75%</span>
                 </div>
              </div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">1,240 / 2,000 XP</p>
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="bg-white rounded-[4rem] shadow-2xl max-w-4xl w-full p-12 sm:p-16 relative space-y-12 overflow-y-auto max-h-[90vh] custom-scrollbar border border-slate-100">
              <button onClick={() => setShowSettings(false)} className="absolute top-10 right-10 p-4 hover:bg-slate-100 rounded-3xl text-slate-400 transition-all active:scale-90"><X size={24} /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight"><Palette className="text-indigo-600" size={32} /> Identity Forge</h3>
                  <div className="flex flex-col items-center gap-10 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <img src={avatar} className="w-48 h-48 rounded-[3.5rem] shadow-2xl bg-white border-4 border-white transition-all duration-500" alt="Avatar" />
                    <div className="space-y-6 w-full text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avatar Gallery</p>
                       <div className="flex flex-wrap justify-center gap-3">
                          {PREDEFINED_AVATARS.map((src, i) => (
                            <button key={i} onClick={() => setAvatar(src)} className={`w-14 h-14 rounded-2xl border-2 transition-all p-1 hover:scale-110 ${avatar === src ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-transparent bg-white shadow-sm'}`}><img src={src} className="w-full h-full rounded-xl" alt="Option" /></button>
                          ))}
                       </div>
                       <button onClick={generateAIAvatar} disabled={isGenerating} className="flex items-center justify-center gap-3 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 group">
                         {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />} 
                         {isGenerating ? 'Synthesizing...' : 'AI Generate Archetype'}
                       </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-10">
                  <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight"><Bell className="text-indigo-600" size={32} /> Control Center</h3>
                  <div className="space-y-6">
                    {[{id: 'tasks', label: 'Missions & Tasks', icon: <Target size={18} />}, {id: 'pbl', label: 'Lab Collaboration', icon: <Users size={18} />}, {id: 'community', label: 'Guild Feedback', icon: <Star size={18} />}, {id: 'quietHours', label: 'Immersive Mode', icon: <EyeOff size={18} />}].map(pref => (
                      <label key={pref.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 cursor-pointer transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-2xl text-slate-400 group-hover:text-indigo-600 shadow-sm">{pref.icon}</div>
                          <span className="block text-sm font-black text-slate-800">{pref.label}</span>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(notifs as any)[pref.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                          <input type="checkbox" checked={(notifs as any)[pref.id]} onChange={() => setNotifs({...notifs, [pref.id]: !(notifs as any)[pref.id]})} className="sr-only" />
                          <div className={`h-4 w-4 rounded-full bg-white transition-transform ${(notifs as any)[pref.id] ? 'translate-x-6' : 'translate-x-1'}`}></div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowSettings(false)} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-slate-800 transition-all active:scale-95">Apply Profile Changes</button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[{ l: 'Weekly XP', v: '2,840', i: <Star size={24} />, c: 'indigo' }, { l: 'Current Mastery', v: '82%', i: <Target size={24} />, c: 'emerald' }, { l: 'Streak', v: '14 Days', i: <Flame size={24} />, c: 'orange' }, { l: 'Domain Rank', v: '#3', i: <Trophy size={24} />, c: 'amber' }].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex items-center gap-6 group hover:scale-105 transition-all">
            <div className={`p-5 rounded-3xl ${s.c === 'indigo' ? 'bg-indigo-50 text-indigo-600' : s.c === 'emerald' ? 'bg-emerald-50 text-emerald-600' : s.c === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-amber-50 text-amber-600'}`}>{s.i}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{s.v}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const [showOpsHub, setShowOpsHub] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white rounded-[4rem] border border-slate-100 p-12 shadow-2xl relative group">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Command Pulse</h2>
              <p className="text-slate-500 font-medium text-lg mt-2">Aggregate cohort engagement metrics</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => alert('Activity feed refreshed.')} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Activity size={24} /></button>
              <button onClick={() => alert('Data synchronized with cloud.')} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"><RefreshCw size={24} /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[{l: 'Grading Protocols', v: '12', c: 'text-amber-600', sub: '3 High Priority', i: <Award />}, {l: 'Active PBL Labs', v: '4', c: 'text-indigo-600', sub: 'All Nodes Synchronous', i: <Briefcase />}, {l: 'Risk Assessment', v: '2', c: 'text-rose-600', sub: 'Action Required', i: <AlertTriangle />}, {l: 'Avg Domain Mastery', v: '74%', c: 'text-emerald-600', sub: '+5% since Monday', i: <Target />}].map((s, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-indigo-100 transition-all group/card">
                <div className={`p-4 rounded-2xl bg-white w-fit mb-6 shadow-sm ${s.c}`}>{s.i}</div>
                <p className={`text-5xl font-black ${s.c} mb-2 tracking-tighter leading-none`}>{s.v}</p>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-4 bg-slate-950 rounded-[4rem] p-10 text-white shadow-2xl flex flex-col h-full border border-white/5 relative group">
           <h3 className="text-2xl font-black mb-10 flex items-center justify-between tracking-tight">Deployment Queue <Clock size={24} className="text-slate-700" /></h3>
           <div className="space-y-6 flex-1 z-10">
              {[{ t: 'PBL Synthesis Review', p: 'High' }, { t: 'Calculus Quiz Provision', p: 'Med' }].map((task, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">{task.p} Priority</span>
                    <CheckCircle size={18} className="text-slate-800" />
                  </div>
                  <p className="text-lg font-black leading-tight text-white/90">{task.t}</p>
                </div>
              ))}
           </div>
           <button onClick={() => setShowOpsHub(true)} className="mt-12 w-full py-6 bg-white text-slate-950 rounded-3xl font-black text-sm shadow-2xl hover:bg-slate-100 transition-all active:scale-95 z-10">Launch Operations Hub</button>
        </div>
      </div>

      {showOpsHub && (
        <div className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-in zoom-in-95">
           <div className="bg-white rounded-[4rem] shadow-2xl max-w-5xl w-full p-16 relative">
              <button onClick={() => setShowOpsHub(false)} className="absolute top-10 right-10 p-4 hover:bg-slate-100 rounded-2xl"><X size={24} /></button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="md:col-span-2 space-y-12">
                    <h3 className="text-5xl font-black tracking-tighter text-slate-900">Operations Strategy</h3>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                          <PieChart size={32} className="text-indigo-600 mb-6" />
                          <p className="text-2xl font-black text-indigo-900">82% Mastery</p>
                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-2">Class-wide average</p>
                       </div>
                       <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                          <ShieldAlert size={32} className="text-rose-600 mb-6" />
                          <p className="text-2xl font-black text-rose-900">2 Nodes At-Risk</p>
                          <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mt-2">Immediate intervention</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Recommended Actions</p>
                       {['Trigger Adaptive Quiz for Mathematics Group B', 'Host Synchronous Lab Review for Energy City Project'].map((act, i) => (
                         <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                            <span className="font-bold text-slate-800">{act}</span>
                            <ChevronRight className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col">
                    <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-500 mb-10">Real-time Logs</h4>
                    <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-4 text-[11px] font-bold text-slate-400 leading-relaxed">
                       <p className="border-l-2 border-indigo-500 pl-4 py-1">12:30 PM: AI detected high confusion in Calculus Section.</p>
                       <p className="border-l-2 border-slate-700 pl-4 py-1">11:55 AM: Team Solar Pioneers met Milestone A.</p>
                       <p className="border-l-2 border-emerald-500 pl-4 py-1">10:15 AM: Engagement index peaked at 92%.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
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
