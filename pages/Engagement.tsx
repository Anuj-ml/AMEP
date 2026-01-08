
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Sparkles, MessageSquare, Radio, Info, TrendingUp, Lightbulb } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { UserRole } from '../types';

interface EngagementProps {
  userRole: UserRole;
}

const Engagement: React.FC<EngagementProps> = ({ userRole }) => {
  const [sessionNotes, setSessionNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{index: number, takeaways: string[], sentiment: string} | null>(null);

  // Fix: Removed reference to non-existent UserRole.ADMIN
  
  const pollData = [
    { name: 'Understood', count: 18, color: '#10b981' },
    { name: 'Confused', count: 5, color: '#f59e0b' },
    { name: 'Need Example', count: 9, color: '#6366f1' },
  ];

  const handleAnalysis = async () => {
    if (!sessionNotes.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await geminiService.summarizeEngagement(sessionNotes);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 animate-in zoom-in-95 duration-500 pb-10">
      {/* Real-time Input Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full min-h-[500px]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center relative">
              <Radio className="text-rose-600 animate-pulse" size={28} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
              </span>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Intelligence Log</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Passive & Active Observations</p>
            </div>
          </div>

          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="E.g., 'Class seemed confused about the integration constants. Participation dropped when moving to problem set B...'"
            className="flex-1 w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-slate-800 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-base"
          />

          <button 
            onClick={handleAnalysis}
            disabled={isAnalyzing || !sessionNotes}
            className="mt-8 flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {isAnalyzing ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Sparkles size={22} />
            )}
            {isAnalyzing ? 'Processing Signals...' : 'Generate Engagement Insights'}
          </button>
        </div>
      </div>

      {/* Visual Feedback Section */}
      <div className="space-y-6 lg:space-y-8">
        {/* Instant Poll Result */}
        <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Comprehension Pulse</h3>
              <p className="text-xs text-slate-400 font-bold">32 Real-time Responses</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <TrendingUp size={20} className="text-indigo-500" />
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pollData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} width={120} />
                <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{borderRadius: '16px', border: 'none', fontWeight: 'bold'}} />
                <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={32}>
                  {pollData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analysis Result */}
        <div className={`transition-all duration-700 ${analysis ? 'opacity-100 scale-100' : 'opacity-40 blur-[4px] scale-95'}`}>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Lightbulb size={24} className="text-amber-400" />
                Strategic Insight
              </h3>
              {analysis && (
                <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl text-2xl font-black border border-white/20">
                  {analysis.index}/100
                </div>
              )}
            </div>

            {analysis ? (
              <div className="relative z-10 space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Action Plan</p>
                  <ul className="space-y-4">
                    {analysis.takeaways.map((t, i) => (
                      <li key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-sm font-semibold leading-relaxed">
                        <span className="text-indigo-400 font-black shrink-0">{i+1}</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Classroom Atmosphere</p>
                  <p className="text-sm font-bold text-white italic">"{analysis.sentiment}"</p>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-indigo-300/40">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-lg">Analysis Required</p>
              </div>
            )}
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Engagement;
