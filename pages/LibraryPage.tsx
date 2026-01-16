
import React, { useState } from 'react';
import { Sparkles, Book, Brain, FileText, Send, Loader2, Download, Bookmark, Check, Link, ExternalLink } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const LibraryPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'quiz' | 'summary' | 'problems'>('summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Related Resources State
  const [relatedResources, setRelatedResources] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    setRelatedResources([]);
    setIsBookmarked(false);
    try {
      const data = await geminiService.generateEducationalContent(topic, contentType);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!topic) return;
    setLoadingResources(true);
    try {
      const resources = await geminiService.getRelatedResources(topic);
      setRelatedResources(resources);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingResources(false);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    alert(isBookmarked ? "Artifact removed from library." : "Artifact bookmarked to your AI Vault.");
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert(`${result.title}.pdf has been generated and downloaded.`);
    }, 2000);
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
            {[{ id: 'summary', label: 'Summary', icon: <FileText size={18} /> }, { id: 'quiz', label: 'Quiz', icon: <Brain size={18} /> }, { id: 'problems', label: 'Practice Problems', icon: <Book size={18} /> }].map((type) => (
              <button key={type.id} onClick={() => setContentType(type.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${contentType === type.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{type.icon} {type.label}</button>
            ))}
          </div>
          <div className="relative">
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter a topic (e.g. 'Quantum Entanglement')..." className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none" onKeyPress={(e) => e.key === 'Enter' && handleGenerate()} />
            <button onClick={handleGenerate} disabled={loading || !topic} className="absolute right-3 top-3 bottom-3 px-6 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 disabled:opacity-50 transition-all flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span className="hidden sm:inline">Synthesize</span>
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-white/40 shadow-xl space-y-8">
            <div className="flex justify-between items-start">
              <h3 className="text-3xl font-black text-slate-900 leading-tight">{result.title}</h3>
              <div className="flex gap-2">
                <button onClick={toggleBookmark} className={`p-4 rounded-2xl transition-all ${isBookmarked ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-indigo-600 shadow-sm'}`}><Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} /></button>
                <button onClick={handleDownload} disabled={isDownloading} className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm">
                  {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                </button>
              </div>
            </div>
            <div className="prose prose-slate max-w-none"><p className="text-lg text-slate-600 leading-relaxed font-medium">{result.content}</p></div>
            
            <div className="pt-8 border-t border-slate-200">
               <button 
                  onClick={fetchRecommendations} 
                  disabled={loadingResources || relatedResources.length > 0}
                  className="px-6 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-2xl font-black text-sm transition-all flex items-center gap-2 disabled:opacity-50"
               >
                 {loadingResources ? <Loader2 size={16} className="animate-spin" /> : <Link size={16} />}
                 {relatedResources.length > 0 ? 'Recommendations Loaded' : 'Recommend Related Resources'}
               </button>
            </div>
          </div>

          {relatedResources.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
               {relatedResources.map((res, i) => (
                 <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">{res.type}</span>
                       <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <h4 className="font-black text-slate-800 mb-2 leading-tight">{res.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{res.description}</p>
                 </div>
               ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
