import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/analyticsService';
import { supabase } from '../services/supabase';
import { 
  BarChart3, Users, Globe, Smartphone, 
  ArrowLeft, LogOut, RefreshCw, MousePointer2,
  PieChart as PieChartIcon, Activity
} from 'lucide-react';

// --- Custom Components for Visualizations ---

const SimpleBarChart = ({ data, colorClass = "bg-red-600" }: { data: { label: string, count: number }[], colorClass?: string }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="group">
          <div className="flex justify-between text-xs mb-1 font-bold">
            <span className="text-white/60 truncate max-w-[150px] uppercase tracking-tighter">{item.label}</span>
            <span className="text-white">{item.count}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden w-full">
            <div 
              className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
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

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];

  return (
    <div className="flex items-center space-x-8">
      <svg viewBox="-1 -1 2 2" className="w-32 h-32 -rotate-90">
        {data.map((item, i) => {
          const startPercent = cumulativePercent;
          const endPercent = cumulativePercent + (item.count / total);
          cumulativePercent = endPercent;

          const [startX, startY] = getCoordinatesForPercent(startPercent);
          const [endX, endY] = getCoordinatesForPercent(endPercent);
          const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
          const pathData = [
            `M ${startX} ${startY}`,
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `L 0 0`,
          ].join(' ');

          return <path key={i} d={pathData} fill={colors[i % colors.length]} className="transition-all hover:opacity-80 cursor-pointer" />;
        })}
      </svg>
      <div className="flex-1 space-y-2">
        {data.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center text-[10px] font-bold uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors[i % colors.length] }} />
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
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(5);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const stats = await fetchAnalytics();
      setData(stats);
      setLastRefreshed(new Date());
      setCountdown(5);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 5000);

    // Countdown timer for UI
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 5 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  if (loading && !data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 animate-pulse"></div>
        <RefreshCw className="w-12 h-12 text-red-600 animate-spin relative" />
      </div>
      <p className="mt-6 text-white/40 font-black uppercase tracking-[0.2em] animate-pulse">Synchronizing Intelligence</p>
    </div>
  );

  const Card = ({ title, value, icon: Icon, sub, colorClass = "text-red-500" }: any) => (
    <div className="glass p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-red-600/10 transition-colors">
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{title}</span>
      </div>
      <div className="text-4xl font-black tabular-nums tracking-tighter">{value}</div>
      {sub && <div className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-wider">{sub}</div>}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500/80">Live Data Feed</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">Command <span className="text-red-600">Center</span></h1>
          <p className="text-white/30 font-bold uppercase tracking-widest text-xs flex items-center">
            Updated {lastRefreshed.toLocaleTimeString()} <span className="mx-2">•</span> Next in {countdown}s
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => loadData()} className="px-6 py-3 glass rounded-2xl flex items-center space-x-3 hover:bg-white/5 transition-all active:scale-95 group">
            <RefreshCw className={`w-4 h-4 ${loading && 'animate-spin'}`} />
            <span className="text-xs font-black uppercase tracking-widest">Manual sync</span>
          </button>
          <button onClick={onBack} className="p-4 glass rounded-2xl hover:bg-white/5 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button onClick={onLogout} className="p-4 glass rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors group">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card title="Today's Reach" value={data.todayTotalVisits} icon={Activity} sub="Live Page Impressions" colorClass="text-blue-500" />
        <Card title="Today's Clicks" value={data.todayTotalClicks} icon={MousePointer2} sub="Total Link Interactions" colorClass="text-amber-500" />
        <Card title="Overall Vis." value={data.overallTotalVisits} icon={Globe} sub="Lifetime Awareness" colorClass="text-green-500" />
        <Card title="Overall Clicks" value={data.overallTotalClicks} icon={BarChart3} sub="Lifetime Conversion" colorClass="text-red-500" />
      </div>

      {/* Deep Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Performance Bar Chart */}
        <div className="glass p-8 rounded-[2.5rem] lg:col-span-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black flex items-center uppercase italic italic">
              <BarChart3 className="w-6 h-6 mr-3 text-red-600" />
              Link Engagement
            </h3>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Ranked by popularity</span>
          </div>
          <SimpleBarChart data={data.topLinks.map((l: any) => ({ label: l.slug, count: l.count }))} />
        </div>

        {/* Device Pie Chart */}
        <div className="glass p-8 rounded-[2.5rem] lg:col-span-4">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-black mb-8 flex items-center uppercase italic">
              <Smartphone className="w-5 h-5 mr-3 text-amber-500" />
              Device Mix
            </h3>
            <div className="flex-grow flex items-center justify-center">
              <SimplePieChart data={data.byDevice.map((d: any) => ({ label: d.device, count: d.count }))} />
            </div>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="glass p-8 rounded-[2.5rem] lg:col-span-4">
          <h3 className="text-xl font-black mb-8 flex items-center uppercase italic">
            <Globe className="w-5 h-5 mr-3 text-green-500" />
            Top Locations
          </h3>
          <SimpleBarChart data={data.byCountry.slice(0, 6).map((c: any) => ({ label: c.country, count: c.count }))} colorClass="bg-green-500" />
        </div>

        <div className="glass p-8 rounded-[2.5rem] lg:col-span-4">
          <h3 className="text-xl font-black mb-8 flex items-center uppercase italic">
            <Users className="w-5 h-5 mr-3 text-blue-500" />
            Traffic Sources
          </h3>
          <SimpleBarChart data={data.byReferrer.slice(0, 6).map((r: any) => ({ label: r.referrer, count: r.count }))} colorClass="bg-blue-500" />
        </div>

        <div className="glass p-8 rounded-[2.5rem] lg:col-span-4">
          <h3 className="text-xl font-black mb-8 flex items-center uppercase italic">
            <PieChartIcon className="w-5 h-5 mr-3 text-purple-500" />
            Browser Split
          </h3>
          <SimplePieChart data={data.byBrowser.map((b: any) => ({ label: b.browser, count: b.count }))} />
        </div>

        {/* Live Feed Log */}
        <div className="glass p-8 rounded-[2.5rem] lg:col-span-12 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black flex items-center uppercase italic">
              <Activity className="w-5 h-5 mr-3 text-red-500" />
              Live Activity Stream
            </h3>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-white/20">
              <span>Streaming {data.recent.length} nodes</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                  <th className="pb-4 pr-4">Timestamp</th>
                  <th className="pb-4 pr-4">Event</th>
                  <th className="pb-4 pr-4">Location</th>
                  <th className="pb-4 pr-4">System</th>
                  <th className="pb-4 text-right">Identifier</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold divide-y divide-white/5">
                {data.recent.map((log: any) => (
                  <tr key={log.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-4 text-white/40 font-medium tabular-nums uppercase">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-tighter ${log.slug === 'page_visit' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                        {log.slug === 'page_visit' ? 'Vis_Page' : `Clk_${log.slug}`}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-white/60">{log.country}</td>
                    <td className="py-4 pr-4 text-white/40">
                      <span className="flex items-center space-x-1">
                        <span className="capitalize">{log.os}</span>
                        <span className="opacity-50">/</span>
                        <span className="capitalize">{log.browser}</span>
                      </span>
                    </td>
                    <td className="py-4 text-right font-black text-white/80 tabular-nums">
                      {log.id.slice(0, 8).toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};