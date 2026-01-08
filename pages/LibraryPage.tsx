
import React, { useState } from 'react';
import { Sparkles, Book, Brain, FileText, Send, Loader2, Download, Bookmark } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const LibraryPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'quiz' | 'summary' | 'problems'>('summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await geminiService.generateEducationalContent(topic, contentType);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Knowledge Architect</h2>
        <p className="text-slate-500 text-lg font-medium">Generate deep-dive summaries, interactive quizzes, or practice sets on any topic instantly.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { id: 'summary', label: 'Summary', icon: <FileText size={18} /> },
              { id: 'quiz', label: 'Quiz', icon: <Brain size={18} /> },
              { id: 'problems', label: 'Practice Problems', icon: <Book size={18} /> }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setContentType(type.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                  contentType === type.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          <div className="relative group">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g. 'Quantum Entanglement', 'French Revolution', 'Photosynthesis')..."
              className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              aria-label="Generate content"
              className="absolute right-3 top-3 bottom-3 px-6 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span className="hidden sm:inline">Synthesize</span>
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-white/40 shadow-xl space-y-8">
            <div className="flex justify-between items-start">
              <h3 className="text-3xl font-black text-slate-900 leading-tight">{result.title}</h3>
              <div className="flex gap-2">
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all" aria-label="Bookmark">
                  <Bookmark size={20} />
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all" aria-label="Download">
                  <Download size={20} />
                </button>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {result.content}
              </p>
            </div>

            {result.items && result.items.length > 0 && (
              <div className="pt-10 border-t border-slate-100 space-y-6">
                <h4 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Brain className="text-indigo-600" size={24} /> 
                  Interactive Components
                </h4>
                <div className="grid gap-4">
                  {result.items.map((item: any, i: number) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                      <p className="font-bold text-slate-800 mb-2">Q{i + 1}: {item.question}</p>
                      <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-1">Answer</p>
                        <p className="text-sm text-slate-600 font-medium">{item.answer}</p>
                        {item.hint && (
                          <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">
                            Hint: {item.hint}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
           {[
             { title: 'The Quantum Leap', desc: 'Summary of subatomic particle behavior.', tag: 'Physics' },
             { title: 'Stoic Principles', desc: 'A practice set on Marcus Aurelius.', tag: 'Philosophy' },
             { title: 'Neural Architectures', desc: 'Visualizing transformer models.', tag: 'Computer Science' }
           ].map((card, i) => (
             <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] text-center space-y-3 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
               <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{card.tag}</div>
               <h4 className="font-black text-slate-800">{card.title}</h4>
               <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
