import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Lock, User, Loader2 } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass rounded-3xl animate-in zoom-in duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/40">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Admin Portal</h2>
        <p className="text-white/50 text-sm">Secure access for Socialistnate</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-red-500 transition-colors outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-red-500 transition-colors outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="w-full text-white/40 hover:text-white/60 text-sm font-medium pt-2 transition-colors"
        >
          Return to Profile
        </button>
      </form>
    </div>
  );
};