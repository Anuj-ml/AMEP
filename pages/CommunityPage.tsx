
import React from 'react';
import { MessageSquare, ThumbsUp, Share2, Award, TrendingUp, Users, Crown, Zap } from 'lucide-react';
import { MOCK_FEED } from '../constants';

const CommunityPage: React.FC = () => {
  const leaderboard = [
    { rank: 1, name: 'Solar Pioneers', xp: '15,420', change: '+2', avatar: 'SP' },
    { rank: 2, name: 'Wind Warriors', xp: '14,800', change: '-1', avatar: 'WW' },
    { rank: 3, name: 'Ocean Harness', xp: '13,200', change: '0', avatar: 'OH' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser" className="w-12 h-12 rounded-2xl bg-indigo-50" alt="My avatar" />
            <input 
              type="text" 
              placeholder="Share a milestone or resource with the community..." 
              className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <div className="space-y-8">
            {MOCK_FEED.map((item) => (
              <div key={item.id} className="group p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-indigo-400 text-lg border border-slate-700">
                      {item.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">{item.user}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{item.role} • {item.timestamp}</p>
                    </div>
                  </div>
                  {item.type === 'milestone' && (
                    <div className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Milestone Met
                    </div>
                  )}
                </div>
                
                <p className="text-slate-700 text-lg leading-relaxed font-medium mb-8">
                  {item.content}
                </p>
                
                <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors" aria-label="Like post">
                    <ThumbsUp size={18} />
                    <span className="text-sm font-black">{item.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors" aria-label="Comment on post">
                    <MessageSquare size={18} />
                    <span className="text-sm font-black">{item.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors ml-auto" aria-label="Share post">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden">
          <h3 className="text-xl font-black mb-10 flex items-center justify-between">
            Global Rankings <Crown className="text-amber-400" size={24} />
          </h3>
          <div className="space-y-4">
            {leaderboard.map((team) => (
              <div key={team.rank} className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all ${
                team.rank === 1 ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-white/5 border-white/5'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  team.rank === 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-white'
                }`}>
                  #{team.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm truncate">{team.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-[10px] font-black text-indigo-400">{team.xp} XP</span>
                  </div>
                </div>
                <div className={`text-[10px] font-black ${
                  team.change.startsWith('+') ? 'text-emerald-400' : team.change === '0' ? 'text-slate-500' : 'text-rose-400'
                }`}>
                  {team.change}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all">
            Full Leaderboard
          </button>
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
           <h3 className="font-black text-slate-800 flex items-center gap-2">
             <Zap className="text-amber-500" size={20} /> Community Pulse
           </h3>
           <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                <TrendingUp size={14} /> Collective engagement is up 12% this week.
              </p>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i+10}`} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-50" alt="Active community member" />
                ))}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">32+ Members Online</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
