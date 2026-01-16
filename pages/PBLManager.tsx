
import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Users, 
  ChevronRight, 
  Sparkles, 
  Briefcase, 
  Layout, 
  FileText, 
  PenTool, 
  Minimize2, 
  Share2, 
  History, 
  Loader2, 
  Bold, 
  Italic, 
  List, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link, 
  Save, 
  X,
  Send,
  BrainCircuit
} from 'lucide-react';
import { Tldraw } from 'tldraw';
import { MOCK_PROJECTS as INITIAL_PROJECTS, MOCK_STUDENTS } from '../constants';
import { UserRole } from '../types';
import { geminiService } from '../services/geminiService';

interface PBLManagerProps {
  userRole: UserRole;
}

const RichTextEditor: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
      <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><Bold size={16} /></button>
        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><Italic size={16} /></button>
        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><List size={16} /></button>
        <div className="w-px h-4 bg-slate-200 mx-1"></div>
        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><AlignLeft size={16} /></button>
        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><AlignCenter size={16} /></button>
        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><AlignRight size={16} /></button>
        <div className="w-px h-4 bg-slate-200 mx-1"></div>
        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><Link size={16} /></button>
      </div>
      <textarea 
        className="w-full h-40 p-4 outline-none resize-none text-sm text-slate-700 font-medium" 
        placeholder="Enter project details..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const Whiteboard: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 bg-white">
      <Tldraw persistenceKey="amep-pbl-whiteboard" />
    </div>
  );
};

const PBLManager: React.FC<PBLManagerProps> = ({ userRole }) => {
  const isTeacher = userRole === UserRole.TEACHER;
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [workspaceTool, setWorkspaceTool] = useState<'doc' | 'board' | 'layout'>('doc');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { user: 'Maria G.', text: 'Should we add wind turbines to the north ridge?', time: '12:45' },
    { user: 'Alex J.', text: 'Definitely, the data shows consistent 15mph currents there.', time: '12:48' }
  ]);
  const [docContent, setDocContent] = useState('Our sustainable city project integrates multi-modal harvesting systems...');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showVersioning, setShowVersioning] = useState(false);
  
  // Project Edit State
  const [editingProject, setEditingProject] = useState<any>(null);

  // Synergy Matchmaking State
  const [showSynergyModal, setShowSynergyModal] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [suggestedTeams, setSuggestedTeams] = useState<any[]>([]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { user: 'You', text: chatInput, time: 'Now' }]);
    setChatInput('');
  };

  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    // Simulate complex AI generation
    await new Promise(r => setTimeout(r, 2500));
    const newProject = {
      id: `p-${Date.now()}`,
      title: 'Neural City Infrastructure',
      description: 'Using bio-mimicry to design efficient traffic and power routing for a 2M population hub.',
      status: 'active' as const,
      milestones: [],
      teams: [{ id: 't-new', name: 'Synth Team', members: [], progress: 0 }]
    };
    setProjects([newProject, ...projects]);
    setIsSynthesizing(false);
    alert("AI Synthesis Complete: 'Neural City Infrastructure' protocol has been deployed.");
  };

  const handleAutoGroup = async () => {
    setIsMatching(true);
    setSuggestedTeams([]);
    try {
      const teams = await geminiService.generateSynergyTeams(MOCK_STUDENTS);
      setSuggestedTeams(teams);
    } catch (e) {
      console.error(e);
      // Fallback mock
      setSuggestedTeams([
        { teamName: 'Quantum Architects', synergyScore: 94, rationale: 'Matches Alex\'s Analysis with Maria\'s Design.', members: ['Alex Johnson', 'Maria Garcia'] },
        { teamName: 'Kinetic Innovators', synergyScore: 88, rationale: 'Combines Liam\'s Logic with Sophie\'s Engineering.', members: ['Liam Chen', 'Sophie Van'] }
      ]);
    } finally {
      setIsMatching(false);
    }
  };

  const provisionNewLab = () => {
    setEditingProject({
      id: `new-${Date.now()}`,
      title: 'New Protocol',
      description: '',
      status: 'planning',
      isNew: true
    });
  };

  const saveProject = () => {
    if (editingProject.isNew) {
      setProjects([editingProject, ...projects]);
    } else {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    }
    setEditingProject(null);
  };

  const shareLab = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Secure collaboration link copied to clipboard.');
  };

  if (showWorkspace) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowWorkspace(false)} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <Minimize2 size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Solar Pioneers Lab</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Protocol Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=u${i+30}`} className="w-11 h-11 rounded-xl border-4 border-white shadow-xl bg-slate-100 hover:scale-110 cursor-pointer" alt="Peer" />
                ))}
             </div>
             <button onClick={shareLab} className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3">
              <Share2 size={16} /> Share Lab
             </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0 overflow-visible">
          <aside className="lg:w-20 bg-white border border-slate-200 rounded-[2.5rem] flex lg:flex-col items-center py-4 lg:py-10 gap-4 lg:gap-10 shadow-sm justify-center lg:justify-start shrink-0">
            <button onClick={() => setWorkspaceTool('doc')} className={`p-4 rounded-2xl transition-all relative ${workspaceTool === 'doc' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}><FileText size={24} /></button>
            <button onClick={() => setWorkspaceTool('board')} className={`p-4 rounded-2xl transition-all relative ${workspaceTool === 'board' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}><PenTool size={24} /></button>
            <button onClick={() => setWorkspaceTool('layout')} className={`p-4 rounded-2xl transition-all relative ${workspaceTool === 'layout' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}><Layout size={24} /></button>
          </aside>
          
          <div className="flex-1 flex flex-col xl:flex-row gap-8 min-h-[600px] relative">
            <div className="flex-1 flex flex-col min-w-0 relative h-full">
              {workspaceTool === 'doc' ? (
                <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-14 text-slate-800 relative flex flex-col border border-slate-100">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100"><FileText size={24} /></div>
                      <div>
                        <h4 className="font-black text-slate-900 tracking-tight">Project Synthesis.md</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-widest border border-emerald-100">Synchronized</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 border-4 border-white shadow-md hover:scale-110" title="Maria"></div>
                        <div className="w-10 h-10 rounded-full bg-amber-500 border-4 border-white shadow-md animate-pulse hover:scale-110" title="Alex"></div>
                      </div>
                    </div>
                  </div>
                  <textarea value={docContent} onChange={(e) => setDocContent(e.target.value)} className="flex-1 w-full text-xl sm:text-2xl leading-relaxed font-bold border-none focus:ring-0 resize-none outline-none" placeholder="Drafting..." />
                  <div className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Saved 12s ago</p>
                    <button onClick={() => setShowVersioning(!showVersioning)} className={`flex items-center gap-3 font-black text-xs transition-all uppercase tracking-widest py-3 px-6 rounded-2xl border ${showVersioning ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}>
                      <History size={20} /> {showVersioning ? 'Hide Timeline' : 'Versioning Hub'}
                    </button>
                  </div>
                  {showVersioning && (
                    <div className="absolute right-10 bottom-24 w-80 bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 animate-in slide-in-from-right-4 z-50">
                      <h5 className="font-black text-xs uppercase tracking-widest mb-4">Revision History</h5>
                      <div className="space-y-4">
                         {[
                           { time: '12:45 PM', user: 'Alex J.', action: 'Added Wind Section' },
                           { time: '11:20 AM', user: 'Maria G.', action: 'Initial Framework' },
                           { time: 'Yesterday', user: 'System', action: 'Auto-Backup' }
                         ].map((rev, i) => (
                           <div key={i} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0">
                             <div className="p-2 bg-slate-50 rounded-lg"><History size={14} className="text-slate-400" /></div>
                             <div>
                               <p className="text-xs font-bold text-slate-900">{rev.action}</p>
                               <p className="text-[10px] font-medium text-slate-400">{rev.user} • {rev.time}</p>
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : workspaceTool === 'board' ? (
                <div className="flex-1 relative h-full w-full rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm bg-white">
                  <Whiteboard />
                </div>
              ) : (
                <div className="flex-1 bg-white border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center text-slate-300 font-black uppercase tracking-[0.3em] text-center px-10 gap-8">
                  <Layout size={48} />
                  <h4 className="text-xl">Engineering Spatial Hub Active</h4>
                </div>
              )}
            </div>
            
            <aside className="w-full xl:w-96 flex flex-col gap-6 shrink-0 h-[600px] xl:h-auto pointer-events-none xl:pointer-events-auto">
              <div className="flex-1 bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-[3rem] flex flex-col shadow-2xl relative overflow-hidden group pointer-events-auto">
                 <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mb-10">Team Protocol</h4>
                 <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col gap-3 ${m.user === 'You' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${m.user === 'You' ? 'text-indigo-400' : 'text-slate-500'}`}>{m.user}</span>
                        </div>
                        <div className={`p-5 rounded-[1.5rem] text-xs font-bold leading-relaxed shadow-2xl ${m.user === 'You' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/10'}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-10 pt-8 border-t border-white/10 flex gap-4 relative z-10">
                   <div className="relative flex-1">
                     <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} type="text" placeholder="Deploy message..." className="w-full bg-slate-950 border-white/10 rounded-2xl py-5 px-6 text-xs text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 border" />
                     <button onClick={sendMessage} className="absolute right-3 top-3 bottom-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all"><Send size={18} /></button>
                   </div>
                 </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Synergy Matchmaking Modal */}
      {showSynergyModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in-95">
           <div className="bg-white rounded-[3rem] p-12 max-w-4xl w-full relative shadow-2xl border border-white/20 overflow-hidden">
              <button onClick={() => setShowSynergyModal(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900 z-20"><X size={24} /></button>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3"><BrainCircuit className="text-indigo-600" /> Synergy Engine</h3>
                <p className="text-slate-500 font-medium mb-10">AI-optimized team formation based on mastery maps & personality traits.</p>

                {suggestedTeams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-8">
                     {isMatching ? (
                       <>
                         <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                         <p className="font-black text-slate-900 animate-pulse">Analyzing Cognitive Architectures...</p>
                       </>
                     ) : (
                       <button onClick={handleAutoGroup} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all">
                         Initialize Matchmaking
                       </button>
                     )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-10">
                     {suggestedTeams.map((team, i) => (
                       <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group">
                          <div className="flex justify-between items-start mb-4">
                             <h4 className="text-xl font-black text-slate-900">{team.teamName}</h4>
                             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black">{team.synergyScore}% Fit</span>
                          </div>
                          <p className="text-sm font-medium text-slate-500 mb-6 italic">"{team.rationale}"</p>
                          <div className="flex flex-wrap gap-2">
                             {team.members.map((m: string, mi: number) => (
                               <span key={mi} className="px-4 py-2 bg-white rounded-xl text-xs font-bold border border-slate-100 text-slate-700">{m}</span>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
                )}
                
                {suggestedTeams.length > 0 && (
                   <button onClick={() => { alert('Teams Applied'); setShowSynergyModal(false); }} className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-emerald-600 transition-all">Confirm Team Structures</button>
                )}
              </div>
           </div>
        </div>
      )}

      {/* Edit/Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in-95">
           <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full relative shadow-2xl border border-white/20">
              <button onClick={() => setEditingProject(null)} className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900"><X size={24} /></button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Briefcase className="text-indigo-600" /> {editingProject.isNew ? 'Provision Protocol' : 'Edit Protocol'}</h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Protocol Title</label>
                    <input 
                      type="text" 
                      value={editingProject.title} 
                      onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-bold"
                    />
                 </div>
                 
                 <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Detailed Specification</label>
                    <RichTextEditor 
                      value={editingProject.description} 
                      onChange={val => setEditingProject({...editingProject, description: val})} 
                    />
                 </div>

                 <button onClick={saveProject} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <Save size={18} /> Save Protocol
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Lab Protocols</h2>
          <p className="text-slate-500 font-medium text-xl leading-relaxed">High-fidelity synchronous collaborative engineering hubs.</p>
        </div>
        <div className="flex gap-4">
          {isTeacher && (
             <>
                <button onClick={() => setShowSynergyModal(true)} className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-slate-100 text-slate-700 rounded-[1.8rem] font-black hover:border-indigo-200 hover:text-indigo-600 transition-all text-lg">
                   <BrainCircuit size={24} /> AI Synergy
                </button>
                <button onClick={provisionNewLab} className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 text-lg group">
                  <Plus size={24} /> Provision Protocol
                </button>
             </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden hover:shadow-2xl transition-all group flex flex-col hover:-translate-y-3 duration-500">
            <div className="p-12 sm:p-14 space-y-10 flex-1">
              <div className="flex justify-between items-start">
                 <span className="px-6 py-2.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-emerald-100 flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> {project.status}
                 </span>
                 <button onClick={() => setEditingProject(project)} className="text-slate-200 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-xl"><MoreHorizontal size={28} /></button>
              </div>
              <div className="space-y-5">
                <h3 className="text-4xl font-black text-slate-800 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                <p className="text-slate-500 text-lg font-medium opacity-80 leading-relaxed line-clamp-3">{project.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100/50"><Users size={20} className="text-indigo-600" /> 4 Online</div>
                 <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100/50"><Calendar size={20} className="text-rose-500" /> Dec 12</div>
              </div>
            </div>
            <button onClick={() => setShowWorkspace(true)} className="w-full border-t border-slate-50 p-12 bg-slate-50/50 flex justify-between items-center hover:bg-slate-900 group/btn transition-all duration-500">
              <div className="text-left">
                <span className="text-2xl font-black text-slate-900 group-hover:text-white transition-colors tracking-tight">Access Laboratory</span>
                <p className="text-xs font-black text-slate-400 group-hover:text-slate-600 mt-2 uppercase tracking-[0.2em]">Synchronous Node Active</p>
              </div>
              <div className="p-5 bg-white rounded-3xl shadow-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-3 border border-slate-100">
                <ChevronRight size={36} />
              </div>
            </button>
          </div>
        ))} 
        
        {isTeacher && (
           <div className="bg-indigo-950 rounded-[4rem] p-14 text-white flex flex-col justify-between relative overflow-hidden group shadow-[0_40px_80px_rgba(30,27,75,0.4)] min-h-[550px] border border-white/10 hover:border-indigo-500/50 transition-all duration-500">
            <div className="relative z-10">
              <div className="bg-white/10 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-12 border border-white/10 shadow-3xl group-hover:rotate-12 group-hover:scale-110 transition-all backdrop-blur-md">
                <Sparkles className="text-indigo-400" size={48} />
              </div>
              <h3 className="text-5xl font-black mb-8 tracking-tighter leading-tight">Synthesis Hub</h3>
              <p className="text-indigo-200/60 text-xl font-medium leading-relaxed max-w-sm">Deploy AI-generated engineering protocols based on granular class mastery logs.</p>
            </div>
            <button onClick={handleSynthesize} disabled={isSynthesizing} className="relative z-10 mt-12 w-full py-6 bg-white text-indigo-950 hover:bg-indigo-50 rounded-[1.8rem] font-black text-lg transition-all shadow-3xl active:scale-95">
              {isSynthesizing ? <div className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Synthesizing...</div> : 'Generate Protocol'}
            </button>
            <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] group-hover:scale-150 transition-transform duration-[2s] pointer-events-none"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PBLManager;
