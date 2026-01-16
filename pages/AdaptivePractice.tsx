
import React, { useState, useEffect } from 'react';
import { Target, Zap, Clock, ChevronRight, CheckCircle2, AlertTriangle, ArrowUp, Shield } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const AdaptivePractice: React.FC = () => {
  const [tier, setTier] = useState(1);
  const [streak, setStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [scaffoldingMode, setScaffoldingMode] = useState(false);

  // Mock Questions - In production, these would come from geminiService.generateAdaptivePractice
  const QUESTIONS = [
    { q: "What is the derivative of x²?", a: ["2x", "x", "2", "x²"], c: "2x", t: 1 },
    { q: "Solve for x: 2x + 5 = 15", a: ["5", "10", "2", "7.5"], c: "5", t: 1 },
    { q: "Integration of 2x dx?", a: ["x² + C", "2x²", "x", "2"], c: "x² + C", t: 2 },
    { q: "Limit of (1/x) as x -> infinity?", a: ["0", "Infinity", "1", "Undefined"], c: "0", t: 2 },
    { q: "Chain rule of sin(x²)?", a: ["2x cos(x²)", "cos(x²)", "2x sin(x)", "-cos(x²)"], c: "2x cos(x²)", t: 3 }
  ];

  const currentQ = QUESTIONS[questionIndex % QUESTIONS.length];

  const handleAnswer = (ans: string) => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const isCorrect = ans === currentQ.c;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      if (timeTaken < 5 && !scaffoldingMode) {
        // Fast Correct - DDS Tier Up
        if (streak >= 1) {
          setTier(prev => Math.min(prev + 1, 3));
          setStreak(0);
        } else {
          setStreak(prev => prev + 1);
        }
      }
      setScaffoldingMode(false);
    } else {
      // Incorrect - DDS Drop / Scaffolding
      if (tier > 1) setTier(prev => prev - 1);
      setScaffoldingMode(true);
      setStreak(0);
    }

    setTimeout(() => {
      setQuestionIndex(prev => prev + 1);
      setFeedback(null);
      setStartTime(Date.now());
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      {/* Header Stats */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Adaptive Dojo</h2>
           <p className="text-slate-500 font-medium mt-2">Dynamic Difficulty Scaling Active</p>
        </div>
        <div className="flex items-center gap-4">
           <div className={`px-6 py-3 rounded-2xl border-2 font-black flex items-center gap-2 transition-all duration-500 ${tier === 3 ? 'bg-amber-50 border-amber-200 text-amber-600' : tier === 2 ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
              <Target size={20} /> Tier {tier}
           </div>
           <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-2">
              <Zap size={20} className={streak > 1 ? 'text-amber-400 fill-amber-400' : 'text-slate-400'} /> x{streak} Streak
           </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className={`bg-white rounded-[3rem] p-12 shadow-2xl border-2 transition-all duration-500 relative overflow-hidden ${feedback === 'correct' ? 'border-emerald-400 shadow-emerald-100' : feedback === 'incorrect' ? 'border-rose-400 shadow-rose-100' : 'border-slate-100'}`}>
         
         {/* Scaffolding Banner */}
         {scaffoldingMode && !feedback && (
           <div className="absolute top-0 left-0 right-0 bg-amber-50 py-2 text-center text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center justify-center gap-2 border-b border-amber-100">
             <Shield size={12} /> Foundation Repair Mode
           </div>
         )}

         <div className="mb-10 mt-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Question {questionIndex + 1} • {currentQ.t === 3 ? 'Advanced' : currentQ.t === 2 ? 'Intermediate' : 'Foundational'}</span>
            <h3 className="text-3xl font-black text-slate-800 leading-tight">{currentQ.q}</h3>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.a.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className="p-6 text-left rounded-2xl border-2 border-slate-100 font-bold text-slate-700 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {opt}
              </button>
            ))}
         </div>

         {/* Feedback Overlay */}
         {feedback && (
           <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
              <div className={`transform scale-125 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 ${feedback === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                 {feedback === 'correct' ? <CheckCircle2 size={48} /> : <AlertTriangle size={48} />}
                 <span className="text-2xl font-black">{feedback === 'correct' ? 'Excellent!' : 'Review Needed'}</span>
                 {feedback === 'correct' && streak >= 1 && <span className="flex items-center gap-2 text-sm font-bold bg-white/20 px-3 py-1 rounded-full"><ArrowUp size={14} /> Escalating Difficulty</span>}
              </div>
           </div>
         )}
      </div>

      <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest px-4">
         <span>Time Bonus Active</span>
         <span>Next Reward: 50 XP</span>
      </div>
    </div>
  );
};

export default AdaptivePractice;
