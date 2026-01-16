import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2, Award, TrendingUp, Users, Crown, Zap, Send, MoreHorizontal } from 'lucide-react';
import { MOCK_FEED as INITIAL_FEED } from '../constants';

const CommunityPage: React.FC = () => {
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [postInput, setPostInput] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const leaderboard = [
    { rank: 1, name: 'Solar Pioneers', xp: '15,420', change: '+2' },
    { rank: 2, name: 'Wind Warriors', xp: '14,800', change: '-1' },
    { rank: 3, name: 'Ocean Harness', xp: '13,200', change: '0' },
  ];

  const handleLike = (id: string) => {
    const newLiked = new Set(likedPosts);
    const isLiked = newLiked.has(id);
    if (isLiked) newLiked.delete(id); else newLiked.add(id);
    setLikedPosts(newLiked);
    
    setFeed(feed.map(post => {
      if (post.id === id) return { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 };
      return post;
    }));
  };

  const handlePost = () => {
    if (!postInput.trim()) return;
    const newPost = {
      id: `f-${Date.now()}`,
      user: 'You (Student)',
      role: 'Learner',
      content: postInput,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      type: 'update' as const
    };
    setFeed([newPost, ...feed]);
    setPostInput('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user7" className="w-12 h-12 rounded-2xl bg-indigo-50" alt="Avatar" />
            <input value={postInput} onChange={e => setPostInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePost()} type="text" placeholder="Share a milestone or resource with the community..." className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
            <button onClick={handlePost} className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all"><Send size={20} /></button>
          </div>
          
          <div className="space-y-8">
            {feed.map((item) => (
              <div key={item.id} className="group p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-indigo-400 text-lg border border-slate-700">{item.user.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <h4 className="font-black text-slate-900">{item.user}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{item.role} • {item.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed font-medium mb-8">{item.content}</p>
                <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                  <button onClick={() => handleLike(item.id)} className={`flex items-center gap-2 transition-colors ${likedPosts.has(item.id) ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
                    <ThumbsUp size={18} fill={likedPosts.has(item.id) ? 'currentColor' : 'none'} />
                    <span className="text-sm font-black">{item.likes}</span>
                  </button>
                  <button onClick={() => setActiveCommentId(activeCommentId === item.id ? null : item.id)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-sm font-black">{item.comments}</span>
                  </button>
                  <button onClick={() => alert("Post shared to your private vault.")} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 ml-auto"><Share2 size={18} /></button>
                </div>
                {activeCommentId === item.id && (
                  <div className="mt-6 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2">
                    <div className="flex gap-4">
                       <input type="text" placeholder="Write a comment..." className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none" />
                       <button onClick={() => alert('Comment submitted')} className="p-2 bg-indigo-600 text-white rounded-xl"><Send size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden">
          <h3 className="text-xl font-black mb-10 flex items-center justify-between">Global Rankings <Crown className="text-amber-400" size={24} /></h3>
          <div className="space-y-4">
            {leaderboard.map((team) => (
              <div key={team.rank} className="flex items-center gap-4 p-5 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${team.rank === 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-white'}`}>#{team.rank}</div>
                <div className="flex-1 min-w-0"><h4 className="font-black text-sm truncate">{team.name}</h4><p className="text-[10px] font-black text-indigo-400">{team.xp} XP</p></div>
              </div>
            ))}
          </div>
          <button onClick={() => alert('Opening full world rankings...')} className="w-full mt-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all">Full Leaderboard</button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;