import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserCircle, School } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const personas = [
    {
      role: UserRole.TEACHER,
      title: 'Educator',
      description: 'Manage PBL, track engagement, and guide mastery.',
      icon: <GraduationCap size={40} className="text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-100 hover:border-indigo-400',
    },
    {
      role: UserRole.STUDENT,
      title: 'Learner',
      description: 'Access adaptive practice, track progress, and join teams.',
      icon: <UserCircle size={40} className="text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-100 hover:border-emerald-400',
    }
  ];

  const handleSelect = (role: UserRole) => {
    onLogin(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-5 bg-indigo-600 rounded-[2rem] shadow-2xl mb-4 transform hover:rotate-6 transition-transform">
            <School size={56} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">AMEP</h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto font-medium">
            The Adaptive Mastery & Engagement Platform. Select your persona to begin the quest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {personas.map((p) => (
            <button
              key={p.role}
              onClick={() => handleSelect(p.role)}
              className={`flex flex-col items-center p-10 rounded-[2.5rem] border-2 transition-all group shadow-sm hover:shadow-2xl ${p.color}`}
            >
              <div className="p-5 bg-white rounded-2xl shadow-sm mb-6 group-hover:scale-110 group-active:scale-95 transition-all">
                {p.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500 text-center leading-relaxed font-medium">
                {p.description}
              </p>
            </button>
          ))}
        </div>

        <div className="pt-12">
          <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
            Demo Version 2.0 • Data-Driven Mastery
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
