import React, { useState, useEffect } from 'react';
import { INITIAL_PROFILE } from './constants';
import { LinkButton } from './components/LinkButton';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { supabase, getSession } from './services/supabase';
import { trackVisit } from './services/analyticsService';
import { Settings, Lock } from 'lucide-react';

type ViewState = 'profile' | 'login' | 'admin';

const App: React.FC = () => {
  const profile = INITIAL_PROFILE;
  const [view, setView] = useState<ViewState>('profile');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Track visit on mount
    trackVisit();

    getSession().then(session => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('profile');
  };

  if (view === 'login') {
    return (
      <div className={`min-h-screen bg-[#050505] flex items-center justify-center p-4`}>
        <Login onSuccess={() => setView('admin')} onBack={() => setView('profile')} />
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className={`min-h-screen bg-[#050505] py-12`}>
        <AdminDashboard onLogout={handleLogout} onBack={() => setView('profile')} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${profile.theme.backgroundGradient} flex flex-col items-center px-4 py-16 transition-all duration-1000 overflow-x-hidden relative`}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600 rounded-full blur-[150px]"></div>
      </div>

      {/* Brand Header */}
      <div className="absolute top-8 left-0 right-0 flex justify-center opacity-30 pointer-events-none">
        <span className="text-4xl font-black tracking-[0.5em] uppercase italic text-white">Socialistnate</span>
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-lg flex flex-col items-center mb-12 text-center animate-in fade-in slide-in-from-top-8 duration-1000 relative z-10">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-red-600/40 blur-3xl rounded-full group-hover:bg-amber-600/50 transition-colors duration-1000 animate-float"></div>
          <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-red-600 to-amber-500 shadow-2xl">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full rounded-full border-4 border-[#050505] object-cover"
            />
          </div>
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tight italic uppercase">{profile.displayName}</h1>
        <div className="px-4 py-1 bg-amber-400 text-red-950 font-black text-xs rounded-full mb-6 tracking-widest uppercase">
          {profile.handle}
        </div>
        <p className="text-white/80 max-w-xs text-base leading-relaxed font-medium">{profile.bio}</p>
      </div>

      {/* Links Section */}
      <div className="w-full flex flex-col items-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 relative z-10">
        {profile.links.map((link) => (
          <LinkButton key={link.id} link={link} theme={profile.theme} />
        ))}
      </div>

      {/* Contact & Footer */}
      <div className="mt-auto w-full max-w-lg text-center pb-8 animate-in fade-in duration-1000 delay-500 relative z-10">
        <div className="flex justify-center space-x-8 mb-10">
          {profile.contactInfo?.email && (
            <a href={`mailto:${profile.contactInfo.email}`} className="text-white/40 hover:text-white transition-all transform hover:scale-125">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          )}
          <a href="https://delta-press.vercel.app/" target="_blank" className="text-white/40 hover:text-white transition-all transform hover:scale-125">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </a>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <p className="text-white/20 text-[10px] font-black tracking-[1em] uppercase">Powered by Socialistnate</p>
          
          {user ? (
            <button 
              onClick={() => setView('admin')}
              className="flex items-center space-x-2 text-xs font-bold text-amber-500/60 hover:text-amber-500 transition-colors uppercase tracking-widest"
            >
              <Settings className="w-3 h-3" />
              <span>Dashboard</span>
            </button>
          ) : (
             <button 
              onClick={() => setView('login')}
              className="flex items-center space-x-2 text-[8px] font-bold text-white/5 hover:text-white/20 transition-colors uppercase tracking-[0.4em] mt-8"
            >
              <Lock className="w-2 h-2" />
              <span>Staff Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;