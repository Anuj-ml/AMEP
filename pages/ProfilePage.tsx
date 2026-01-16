
import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Award, 
  MapPin, 
  Calendar, 
  Edit3, 
  Trophy, 
  Zap, 
  Star,
  Target,
  Flame,
  ArrowRight,
  History,
  Users,
  BrainCircuit,
  Layout,
  X,
  Sparkles,
  RefreshCw,
  Camera
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { UserRole } from '../types';
import { geminiService } from '../services/geminiService';

interface ProfilePageProps {
  userRole: UserRole;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userRole }) => {
  const isStudent = userRole === UserRole.STUDENT;
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  const studentData = {
    name: "Alex Johnson",
    role: "Vanguard Scholar",
    bio: "Passionate about orbital mechanics and sustainable engineering. Aiming for Top 1% in Mathematics Guild this semester.",
    location: "Neo-Siberia Hub",
    joined: "Sep 2023",
    xp: "12,450",
    streak: "14",
    mastery: "75%",
    rank: "#24",
    achievements: [
      { name: "Calculus Crusader", icon: <Zap size={20} />, color: "bg-indigo-500" },
      { name: "Team Synergy", icon: <User size={20} />, color: "bg-emerald-500" },
      { name: "Early Bird", icon: <Calendar size={20} />, color: "bg-amber-500" }
    ],
    stats: [
      { label: "Missions Completed", value: "48" },
      { label: "Lab Hours", value: "124h" },
      { label: "Quiz Accuracy", value: "92%" }
    ],
    recentActivity: [
      { event: "Mastered 'Chain Rule' in Calculus", date: "2h ago", icon: <Target className="text-emerald-500" /> },
      { event: "Completed Solar Site Analysis Lab", date: "Yesterday", icon: <Layout className="text-indigo-500" /> },
      { event: "Earned 'Synergy' Badge", date: "3 days ago", icon: <Award className="text-amber-500" /> }
    ],
    synergyPartners: [
      { name: "Maria Garcia", role: "Design Lead", seed: "u1" },
      { name: "Liam Chen", role: "Logic Architect", seed: "u2" },
      { name: "Sophie Van", role: "Physics Scholar", seed: "u3" }
    ]
  };

  const teacherData = {
    name: "Dr. Sarah Wilson",
    role: "Lead Education Architect",
    bio: "Dedicated to developing high-fidelity PBL protocols. Specializing in advanced physics and collaborative learning systems.",
    location: "Global Command Center",
    joined: "Jan 2022",
    classes: "4 Active",
    avgEngagement: "82%",
    totalLabs: "12",
    achievements: [
      { name: "Protocol Designer", icon: <Award size={20} />, color: "bg-purple-500" },
      { name: "Engagement Master", icon: <Flame size={20} />, color: "bg-rose-500" },
      { name: "Master Mentor", icon: <Star size={20} />, color: "bg-blue-500" }
    ],
    stats: [
      { label: "Students Guided", value: "128" },
      { label: "Protocols Provisioned", value: "34" },
      { label: "Admin Hours Saved", value: "85h" }
    ],
    recentActivity: [
      { event: "Provisioned 'Neural City' Protocol", date: "1h ago", icon: <Zap className="text-indigo-500" /> },
      { event: "Analyzed Engagement for Period 3", date: "4h ago", icon: <History className="text-slate-500" /> },
      { event: "Updated Mastery Map (Physics)", date: "Yesterday", icon: <BrainCircuit className="text-emerald-500" /> }
    ],
    classDistribution: [
      { name: "Mastery", value: 65, color: '#10b981' },
      { name: "Proficient", value: 25, color: '#4f46e5' },
      { name: "Developing", value: 10, color: '#f59e0b' }
    ]
  };

  const data = isStudent ? studentData : teacherData;

  const handleGenerateAvatar = async () => {
    if (!avatarPrompt) return;
    setIsGeneratingAvatar(true);
    try {
      const url = await geminiService.generateAvatar(avatarPrompt);
      if (url) setCustomAvatar(url);
    } catch (e) {
      console.error(e);
      alert("Failed to generate avatar. Please try again.");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full p-10 relative overflow-hidden border border-slate-100">
              <button onClick={() => setIsEditing(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900"><X size={24} /></button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Camera className="text-indigo-600" /> Identity Forge</h3>
              
              <div className="space-y-8">
                 <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                       <img 
                          src={customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} 
                          className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl" 
                          alt="Current Avatar" 
                       />
                       {isGeneratingAvatar && (
                         <div className="absolute inset-0 bg-white/80 rounded-[2.5rem] flex items-center justify-center backdrop-blur-sm">
                           <RefreshCw className="animate-spin text-indigo-600" size={32} />
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">AI Avatar Generator</label>
                    <textarea 
                      value={avatarPrompt}
                      onChange={(e) => setAvatarPrompt(e.target.value)}
                      placeholder="Describe your persona (e.g., 'A cyberpunk mathematician with neon glasses and a holographic robe')..."
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-medium"
                    />
                    <button 
                      onClick={handleGenerateAvatar} 
                      disabled={isGeneratingAvatar || !avatarPrompt}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} /> {isGeneratingAvatar ? 'Synthesizing...' : 'Generate New Avatar'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative group">
        <div className={`h-48 bg-gradient-to-r ${isStudent ? 'from-indigo-600 to-blue-700' : 'from-slate-900 to-indigo-900'} relative`}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <button onClick={() => setIsEditing(true)} className="absolute top-8 right-8 p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/20">
            <Edit3 size={20} />
          </button>
        </div>
        
        <div className="px-12 pb-12">
          <div className="flex flex-col md:flex-row items-end -mt-20 gap-8">
            <div className="relative">
              <img 
                src={customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} 
                className="w-44 h-44 rounded-[3.5rem] bg-white border-[8px] border-white shadow-2xl relative z-10" 
                alt="Profile" 
              />
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl z-20 border-4 border-white">
                <Shield size={20} />
              </div>
            </div>
            
            <div className="flex-1 pb-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{data.name}</h2>
              <div className="flex flex-wrap items-center gap-6 mt-3 text-slate-500 font-bold">
                <span className="flex items-center gap-2"><MapPin size={16} /> {data.location}</span>
                <span className="flex items-center gap-2"><Calendar size={16} /> Joined {data.joined}</span>
              </div>
            </div>
            
            <div className="flex gap-4 pb-4">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2">
                <Settings size={18} /> Settings
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
            <div className="lg:col-span-2 space-y-12">
              <section className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <User className="text-indigo-600" size={28} /> About Me
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {data.bio}
                </p>
              </section>

              <section className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Award className="text-amber-500" size={28} /> {isStudent ? "Achievement Vault" : "Professional Accolades"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {data.achievements.map((ach, i) => (
                    <div key={i} className="flex flex-col items-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group/ach">
                      <div className={`${ach.color} text-white p-5 rounded-3xl mb-4 group-hover/ach:rotate-12 transition-transform shadow-lg`}>
                        {ach.icon}
                      </div>
                      <span className="font-black text-slate-800 text-sm text-center">{ach.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <History className="text-indigo-600" size={28} /> {isStudent ? "Quest Log" : "Administrative History"}
                </h3>
                <div className="space-y-4">
                  {data.recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 transition-all group cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                          {activity.icon}
                        </div>
                        <span className="font-bold text-slate-800">{activity.event}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{activity.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 space-y-8">
                <h3 className="text-xl font-black text-indigo-900 uppercase tracking-widest text-center">Core Metrics</h3>
                <div className="space-y-6">
                  {data.stats.map((stat, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/50 rounded-2xl">
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{stat.label}</span>
                      <span className="text-xl font-black text-indigo-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
                {isStudent && (
                  <div className="pt-4">
                    <div className="flex justify-between text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                      <span>Mastery Progress</span>
                      <span>{(data as any).mastery}</span>
                    </div>
                    <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: (data as any).mastery }}></div>
                    </div>
                  </div>
                )}
              </div>

              {isStudent ? (
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
                   <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                     <Users size={20} className="text-indigo-600" /> Synergy Partners
                   </h3>
                   <div className="space-y-4">
                     {studentData.synergyPartners.map((partner, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.seed}`} className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-indigo-300 transition-all" alt="" />
                           <div>
                              <p className="text-sm font-black text-slate-900 leading-none">{partner.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{partner.role}</p>
                           </div>
                        </div>
                     ))}
                   </div>
                   <button className="w-full py-4 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black transition-all">
                     View All Connections
                   </button>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-6 overflow-hidden">
                   <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 px-2">
                     <Target size={20} className="text-indigo-600" /> Class Distribution
                   </h3>
                   <div className="h-56 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={teacherData.classDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {teacherData.classDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold', fontSize: '10px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-2xl font-black text-slate-900">82%</span>
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Avg Pulse</span>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 gap-2 px-2 pb-2">
                      {teacherData.classDistribution.map((dist, i) => (
                         <div key={i} className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dist.color }}></div>
                               <span>{dist.name}</span>
                            </div>
                            <span className="text-slate-900">{dist.value}%</span>
                         </div>
                      ))}
                   </div>
                </div>
              )}

              <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl text-white space-y-6 relative overflow-hidden group">
                <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
                   <Zap size={14} className="text-indigo-400" /> Platform Tier
                </h4>
                <div className="flex items-center gap-4">
                   <div className="text-4xl font-black tracking-tighter">Gold V</div>
                   <div className="bg-indigo-600/20 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Master</div>
                </div>
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2">
                  View Leaderboards <ArrowRight size={16} />
                </button>
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
