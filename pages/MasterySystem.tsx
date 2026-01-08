
import React, { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Target, Zap, BookOpen, Mic, Sparkles, BrainCircuit, ChevronRight, Lock, Award, Star, Flame } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { UserRole } from '../types';

interface MasterySystemProps {
  userRole: UserRole;
}

const MasterySystem: React.FC<MasterySystemProps> = ({ userRole }) => {
  const isStudent = userRole === UserRole.STUDENT;
  const [selectedStudent] = useState(MOCK_STUDENTS[0]);

  const roadmap = [
    { title: 'Foundations', status: 'completed', score: 100, xp: 500 },
    { title: 'Calculus I', status: 'active', score: 72, xp: 250 },
    { title: 'Multivariate Analysis', status: 'locked', score: 0, xp: 1000 },
    { title: 'Applied Engineering', status: 'locked', score: 0, xp: 1500 },
  ];

  const masteryData = selectedStudent.masteryScores.map(score => ({
    subject: score.subject,
    mastery: score.score,
    fullMark: 100
  }));

  return (
    <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mastery Intelligence</h2>
          <p className="text-slate-500 font-medium">Your personalized path to total domain proficiency.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/40 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg">
            <Sparkles size={16} aria-hidden="true" /> Tier 3 Master
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-black text-xs border border-amber-200">
            <Star size={16} fill="currentColor" aria-hidden="true" /> Level 24
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar and Scores */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-xl">
            <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3">
              <BrainCircuit className="text-indigo-600" size={24} aria-hidden="true" /> Skill DNA
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                  <Radar
                    name="Mastery"
                    dataKey="mastery"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#4f46e5"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 space-y-4">
              {selectedStudent.masteryScores.map((score, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <span className="text-sm font-black text-slate-700">{score.subject}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-black px-4 py-1.5 rounded-full ${score.score >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {score.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Flame className="text-orange-400" size={20} aria-hidden="true" /> Mastery Streak
              </h3>
              <p className="text-4xl font-black mb-2 tracking-tight">14 <span className="text-lg font-bold text-indigo-300">Days</span></p>
              <p className="text-xs text-indigo-200 font-medium">You're in the top 2% of consistent learners this month!</p>
              <div className="mt-6 flex gap-1">
                {[1,1,1,1,1,1,1].map((_, i) => (
                  <div key={i} className="flex-1 h-2 bg-indigo-500 rounded-full">
                    <div className="h-full bg-amber-400 rounded-full w-full"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16" aria-hidden="true"></div>
          </div>
        </div>

        {/* Roadmap and Active Learning */}
        <div className="lg:col-span-8 space-y-8">
          {/* Concept Roadmap */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-xl overflow-hidden relative">
            <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
              <Target className="text-indigo-600" size={24} aria-hidden="true" /> Mastery Roadmap
            </h3>
            <div className="relative space-y-12">
              <div className="absolute left-[27px] top-2 bottom-2 w-1 bg-slate-100 rounded-full" aria-hidden="true"></div>
              {roadmap.map((step, i) => (
                <div key={i} className="flex items-center gap-8 relative group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-lg transition-all duration-300 ${
                    step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                    step.status === 'active' ? 'bg-indigo-600 text-white ring-8 ring-indigo-50 scale-110' : 
                    'bg-white text-slate-300 border border-slate-100'
                  }`} aria-hidden="true">
                    {step.status === 'locked' ? <Lock size={20} /> : step.status === 'completed' ? <Award size={20} /> : <Zap size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`text-lg font-black tracking-tight ${step.status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>{step.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Reward: {step.xp} XP</p>
                      </div>
                      {step.status !== 'locked' && <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{step.score}% Mastered</span>}
                    </div>
                    {step.status === 'active' && (
                      <div className="mt-3 flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
                         <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full w-3/4 shadow-[0_0_12px_rgba(79,70,229,0.4)]"></div>
                         </div>
                         <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1 hover:translate-x-1 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1">
                           Continue Quest <ChevronRight size={14} aria-hidden="true" />
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Voice Assistant Bridge */}
          <div className="bg-gradient-to-br from-indigo-800 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
                  <Mic size={14} className="text-indigo-400" aria-hidden="true" /> Live AI Tutoring
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">Start a Verbal Mastery Session</h3>
                <p className="text-indigo-200 font-medium text-lg leading-relaxed">
                  Discuss Calculus concepts with your Gemini tutor. Verbal explanation is the highest form of mastery. Earn 2x XP for oral quizzes!
                </p>
                <button className="mt-8 px-10 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all focus:ring-4 focus:ring-white/20 outline-none" aria-label="Initialize AI Voice Session">
                  Initialize Voice Link
                </button>
              </div>
              <div className="w-48 h-48 bg-white/10 rounded-[3rem] flex items-center justify-center relative rotate-6 group-hover:rotate-12 transition-transform duration-700">
                <Zap size={80} className="text-white opacity-40" aria-hidden="true" />
                <div className="absolute -inset-4 border-2 border-white/10 rounded-[3.5rem] animate-pulse"></div>
              </div>
            </div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterySystem;
