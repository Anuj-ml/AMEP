import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  Briefcase, 
  CheckSquare, 
  Menu, 
  X,
  GraduationCap,
  LogOut,
  Bell,
  Search,
  Library,
  Users2,
  Sword,
  Map,
  ClipboardList
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getNavItems = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT:
        return [
          { name: 'My Quest', icon: <Sword size={20} />, path: '/', roles: [UserRole.STUDENT] },
          { name: 'Team Lab', icon: <Briefcase size={20} />, path: '/pbl', roles: [UserRole.STUDENT] },
          { name: 'Mastery Map', icon: <Map size={20} />, path: '/mastery', roles: [UserRole.STUDENT] },
          { name: 'AI Scribe', icon: <Library size={20} />, path: '/library', roles: [UserRole.STUDENT] },
          { name: 'Guild Hub', icon: <Users2 size={20} />, path: '/community', roles: [UserRole.STUDENT] },
          { name: 'Missions', icon: <CheckSquare size={20} />, path: '/tasks', roles: [UserRole.STUDENT] },
        ];
      case UserRole.TEACHER:
        return [
          { name: 'Command Hub', icon: <LayoutDashboard size={20} />, path: '/', roles: [UserRole.TEACHER] },
          { name: 'PBL Control', icon: <Briefcase size={20} />, path: '/pbl', roles: [UserRole.TEACHER] },
          { name: 'Class Pulse', icon: <BarChart3 size={20} />, path: '/engagement', roles: [UserRole.TEACHER] },
          { name: 'Competency', icon: <Target size={20} />, path: '/mastery', roles: [UserRole.TEACHER] },
          { name: 'Curriculum AI', icon: <Library size={20} />, path: '/library', roles: [UserRole.TEACHER] },
          { name: 'Workflow', icon: <ClipboardList size={20} />, path: '/tasks', roles: [UserRole.TEACHER] },
        ];
      default:
        return [];
    }
  };

  const filteredNavItems = getNavItems(userRole);

  const getRoleTheme = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT: return { accent: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500/20' };
      case UserRole.TEACHER: return { accent: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-500/20' };
      default: return { accent: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-500/20' };
    }
  };

  const theme = getRoleTheme(userRole);

  const NavigationLinks = ({ isMobile = false }) => (
    <nav className="flex-1 mt-4 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
      <div className="mb-4">
        {(!isMobile ? isSidebarOpen : true) && (
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
            {userRole} PORTAL
          </p>
        )}
      </div>
      {filteredNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => isMobile && setMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group focus:ring-2 focus:ring-indigo-500 outline-none active:scale-95 ${
            location.pathname === item.path 
              ? 'bg-white/10 text-white shadow-xl' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          }`}
        >
          <span className={`shrink-0 transition-transform group-hover:scale-110 ${location.pathname === item.path ? theme.text : ''}`}>
            {item.icon}
          </span>
          {(!isMobile ? isSidebarOpen : true) && <span className="font-bold text-sm">{item.name}</span>}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-inter">
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 overflow-hidden" aria-hidden="true">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${userRole === UserRole.STUDENT ? 'bg-emerald-200' : 'bg-indigo-200'}`}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-blue-100 rounded-full blur-[120px]"></div>
      </div>

      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out bg-slate-900 text-white hidden lg:flex flex-col z-50`}
        aria-label="Desktop Sidebar"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`${theme.accent} p-2.5 rounded-2xl shrink-0 shadow-lg`}>
              <GraduationCap size={24} />
            </div>
            {isSidebarOpen && <span className="font-black text-2xl tracking-tighter">AMEP</span>}
          </div>
        </div>

        <NavigationLinks />

        <div className="p-4 mt-auto">
          <div className={`p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="" className="w-9 h-9 rounded-xl border-2 border-slate-700" />
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{userRole.toLowerCase()}</p>
                <button 
                  onClick={onLogout} 
                  className="text-xs text-rose-400 font-bold flex items-center gap-1 mt-0.5 hover:text-rose-300 transition-colors focus:ring-1 focus:ring-rose-500 outline-none rounded"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside 
          className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-out shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className={`${theme.accent} p-2.5 rounded-2xl shrink-0 shadow-lg`}>
                <GraduationCap size={24} />
              </div>
              <span className="font-black text-2xl tracking-tighter">AMEP</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-white/10 rounded-xl text-slate-400 active:scale-90" aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          <NavigationLinks isMobile={true} />

          <div className="p-6 mt-auto border-t border-slate-800">
            <div className="flex items-center gap-4">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="" className="w-12 h-12 rounded-xl border-2 border-slate-700" />
              <div className="flex-1">
                <p className="text-sm font-black text-white">{userRole}</p>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }} 
                  className="text-xs text-rose-400 font-bold flex items-center gap-1 mt-1 active:scale-95"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/20 px-4 lg:px-10 h-20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="lg:hidden p-3 bg-white shadow-sm rounded-2xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95 transition-all"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter">
              {filteredNavItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-white/50 border border-white/30 rounded-2xl px-4 py-2 text-slate-500 w-48 lg:w-64 shadow-sm focus-within:w-72 transition-all">
              <Search size={16} className="mr-3" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm w-full font-medium" />
            </div>
            <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl shadow-sm relative active:scale-95 transition-all" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
