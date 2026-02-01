import React from 'react';
import { INITIAL_PROFILE } from './constants';
import { LinkButton } from './components/LinkButton';

const App: React.FC = () => {
  const profile = INITIAL_PROFILE;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${profile.theme.backgroundGradient} flex flex-col items-center px-4 py-16 transition-all duration-1000 overflow-x-hidden`}>
      {/* Brand Header */}
      <div className="absolute top-8 left-0 right-0 flex justify-center opacity-30 pointer-events-none">
        <span className="text-4xl font-black tracking-[0.5em] uppercase italic text-white">Socialistnate</span>
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-lg flex flex-col items-center mb-12 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full group-hover:bg-amber-500/40 transition-colors duration-1000"></div>
          <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-red-600 to-amber-500 shadow-2xl">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full rounded-full border-4 border-gray-900 object-cover"
            />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">{profile.displayName}</h1>
        <p className="text-amber-400 font-bold mb-4 tracking-wide">{profile.handle}</p>
        <p className="text-white/70 max-w-xs text-base leading-relaxed font-medium">{profile.bio}</p>
      </div>

      {/* Links Section */}
      <div className="w-full flex flex-col items-center space-y-5 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        {profile.links.map((link) => (
          <LinkButton key={link.id} link={link} theme={profile.theme} />
        ))}
      </div>

      {/* Contact & Footer */}
      <div className="mt-auto w-full max-w-lg text-center pb-8 animate-in fade-in duration-1000 delay-500">
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
        <p className="text-white/20 text-[10px] font-black tracking-[0.8em] uppercase">Powered by Socialistnate</p>
      </div>
    </div>
  );
};

export default App;