import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/analyticsService';
import { supabase } from '../services/supabase';
import { 
  BarChart3, Users, Globe, Smartphone, 
  ArrowLeft, LogOut, RefreshCw, MousePointer2 
} from 'lucide-react';

export const AdminDashboard: React.FC<{ onLogout: () => void; onBack: () => void }> = ({ onLogout, onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await fetchAnalytics();
      setData(stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading && !data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <RefreshCw className="w-10 h-10 text-red-600 animate-spin mb-4" />
      <p className="text-white/40 font-medium">Loading Intelligence...</p>
    </div>
  );

  const Card = ({ title, value, icon: Icon, sub }: any) => (
    <div className="glass p-6 rounded-3xl border border-white/5">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-red-600/10 rounded-xl">
          <Icon className="w-6 h-6 text-red-500" />
        </div>
        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">{title}</span>
      </div>
      <div className="text-3xl font-black">{value}</div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2 italic uppercase tracking-tight">Command Center</h1>
          <p className="text-white/40 font-medium">Real-time link performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={loadData} className="p-3 glass rounded-xl hover:bg-white/5 transition-colors">
            <RefreshCw className={`w-5 h-5 ${loading && 'animate-spin'}`} />
          </button>
          <button onClick={onBack} className="p-3 glass rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="p-3 glass rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card title="Today" value={data.todayTotal} icon={MousePointer2} sub="Unique link clicks" />
        <Card title="Overall" value={data.overallTotal} icon={BarChart3} sub="Lifetime performance" />
        <Card title="Countries" value={data.byCountry.length} icon={Globe} sub="Global reach" />
        <Card title="Referrers" value={data.byReferrer.length} icon={Users} sub="Traffic sources" />
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Links */}
        <div className="glass p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-3 text-amber-500" />
            Top Links
          </h3>
          <div className="space-y-4">
            {data.topLinks.map((link: any, i: number) => (
              <div key={link.slug} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 text-white/20 font-bold italic">{i+1}</span>
                  <span className="font-semibold text-white/80">{link.slug}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 bg-red-600/20 rounded-full w-24 overflow-hidden">
                    <div className="h-full bg-red-600" style={{width: `${(link.count / data.overallTotal) * 100}%`}}></div>
                  </div>
                  <span className="font-black w-8 text-right">{link.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="glass p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Smartphone className="w-5 h-5 mr-3 text-blue-500" />
            Device & Platform
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data.byDevice.map((dev: any) => (
              <div key={dev.device} className="bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{dev.count}</span>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{dev.device}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="glass p-8 rounded-[2rem] lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-3 text-green-500" />
            Geographic Reach
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.byCountry.map((c: any) => (
              <div key={c.country} className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center space-x-3">
                <span className="font-bold">{c.country}</span>
                <span className="px-2 bg-red-600/20 text-red-500 text-xs rounded-lg py-1 font-black">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};