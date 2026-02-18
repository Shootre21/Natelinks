import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/analyticsService';
import { supabase } from '../services/supabase';
import { INITIAL_PROFILE } from '../constants';
import { 
  BarChart3, Users, Globe, Smartphone, 
  ArrowLeft, LogOut, RefreshCw, MousePointer2,
  PieChart as PieChartIcon, Activity, Trophy,
  ShieldAlert, Network
} from 'lucide-react';

const getLinkLabel = (slug: string) => {
  if (slug === 'page_visit') return 'Page View';
  const found = INITIAL_PROFILE.links.find(l => l.id === slug);
  return found ? found.label : slug;
};

const SimpleBarChart = ({ data, colorClass = "bg-red-600" }: { data: { label: string, count: number }[], colorClass?: string }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i} className="group">
          <div className="flex justify-between text-xs mb-1.5 font-bold items-center">
            <div className="flex items-center space-x-2">
               <span className="text-white/20 w-4 font-black">#{i+1}</span>
               <span className="text-white/80 truncate max-w-[200px] uppercase tracking-tight group-hover:text-white">
                {getLinkLabel(item.label)}
               </span>
            </div>
            <span className="text-white text-sm tabular-nums">{item.count}</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden w-full p-[1px]">
            <div 
              className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const SimplePieChart = ({ data }: { data: { label: string, count: number }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent: number) => [Math.cos(2 * Math.PI * percent), Math.sin(2 * Math.PI * percent)];
  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"];

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-32 h-32">
        <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90">
          {data.map((item, i) => {
            const startPercent = cumulativePercent;
            const endPercent = cumulativePercent + (item.count / total);
            cumulativePercent = endPercent;
            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(endPercent);
            const pathData = [`M ${startX} ${startY}`, `A 1 1 0 ${endPercent - startPercent > 0.5 ? 1 : 0} 1 ${endX} ${endY}`, `L 0 0`].join(' ');
            return <path key={i} d={pathData} fill={colors[i % colors.length]} />;
          })}
        </svg>
      </div>
      <div className="w-full space-y-2">
        {data.slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-center text-[10px] font-bold uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-white/40 flex-1 truncate">{item.label}</span>
            <span className="text-white">{Math.round((item.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<{ onLogout: () => void; onBack: () => void }> = ({ onLogout, onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const stats = await fetchAnalytics();
      setData(stats);
      setCountdown(5);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 5000);
    const timer = setInterval(() => setCountdown(prev => (prev <= 1 ? 5 : prev - 1)), 1000);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, []);

  if (loading && !data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <RefreshCw className="w-12 h-12 text-red-600 animate-spin" />
    </div>
  );

  const topLink = data.topLinks[0] || { slug: 'N/A', count: 0 };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500/80">Active Monitoring</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">Command <span className="text-red-600">Center</span></h1>
          <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Refresh in {countdown}s</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => loadData()} className="p-4 glass rounded-2xl hover:bg-white/5 transition-all"><RefreshCw className={`w-5 h-5 ${loading && 'animate-spin'}`} /></button>
          <button onClick={onBack} className="p-4 glass rounded-2xl hover:bg-white/5 transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <button onClick={onLogout} className="p-4 glass rounded-2xl text-red-500 hover:bg-red-500/10 transition-all"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-3xl border border-white/5">
           <MousePointer2 className="w-6 h-6 text-red-500 mb-4" />
           <div className="text-3xl font-black">{data.todayTotalClicks}</div>
           <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Today's Interactions</div>
        </div>
        <div className="glass p-6 rounded-3xl border border-amber-500/30">
           <Trophy className="w-6 h-6 text-amber-500 mb-4" />
           <div className="text-3xl font-black text-amber-500">{topLink.count}</div>
           <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{getLinkLabel(topLink.slug)}</div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5">
           <Network className="w-6 h-6 text-blue-500 mb-4" />
           <div className="text-3xl font-black">{data.overallTotalVisits}</div>
           <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Total Impressions</div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5">
           <Globe className="w-6 h-6 text-green-500 mb-4" />
           <div className="text-3xl font-black">{data.byCountry.length}</div>
           <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Active Regions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="glass p-8 rounded-[2.5rem] lg:col-span-8 border border-white/5">
          <h3 className="text-xl font-black mb-10 flex items-center uppercase italic"><BarChart3 className="w-5 h-5 mr-3 text-red-600" />Link Leaderboard</h3>
          <SimpleBarChart data={data.topLinks.map((l: any) => ({ label: l.slug, count: l.count }))} />
        </div>
        <div className="glass p-8 rounded-[2.5rem] lg:col-span-4 border border-white/5">
          <h3 className="text-xl font-black mb-10 flex items-center uppercase italic"><Smartphone className="w-5 h-5 mr-3 text-amber-500" />Platform Mix</h3>
          <SimplePieChart data={data.byDevice.map((d: any) => ({ label: d.device, count: d.count }))} />
        </div>
      </div>

      {/* Network Intelligence Table */}
      <div className="glass p-8 rounded-[2.5rem] mb-8 border border-white/5 overflow-hidden">
        <h3 className="text-xl font-black mb-8 flex items-center uppercase italic">
          <ShieldAlert className="w-5 h-5 mr-3 text-amber-500" />
          Network Intelligence (IPs & Networks)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                <th className="pb-4 pr-4">Timestamp</th>
                <th className="pb-4 pr-4">IP Address</th>
                <th className="pb-4 pr-4">Main Network (ISP)</th>
                <th className="pb-4 text-right">Location</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold divide-y divide-white/5">
              {data.recent.map((log: any) => (
                <tr key={log.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4 text-white/40 tabular-nums uppercase">{new Date(log.created_at).toLocaleTimeString()}</td>
                  <td className="py-4 pr-4 font-black text-amber-500 tracking-wider tabular-nums">{log.ip || '---.---.---.---'}</td>
                  <td className="py-4 pr-4 text-white/60 truncate max-w-[300px]">{log.isp || 'Private Network'}</td>
                  <td className="py-4 text-right text-white/80">{log.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/5 overflow-hidden">
        <h3 className="text-xl font-black mb-8 flex items-center uppercase italic"><Activity className="w-5 h-5 mr-3 text-red-500" />Live Event Stream</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                <th className="pb-4 pr-4">Event</th>
                <th className="pb-4 pr-4">Target</th>
                <th className="pb-4 pr-4">Platform</th>
                <th className="pb-4 text-right">Referrer</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold divide-y divide-white/5">
              {data.recent.map((log: any) => (
                <tr key={log.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${log.slug === 'page_visit' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                      {log.slug === 'page_visit' ? 'VIEW' : 'CLICK'}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-white/80">{getLinkLabel(log.slug)}</td>
                  <td className="py-4 pr-4 text-white/40 uppercase text-[10px]">{log.os} / {log.browser}</td>
                  <td className="py-4 text-right text-white/20 truncate max-w-[150px]">{log.referrer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};