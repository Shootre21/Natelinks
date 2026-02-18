import { supabase } from './supabase';
import { ClickEvent } from '../types';

const parseUA = (ua: string) => {
  const browser = /chrome|safari|firefox|edge|opera|msie|trident/i.exec(ua)?.[0] || 'Unknown';
  const os = /windows|macintosh|linux|android|iphone|ipad/i.exec(ua)?.[0] || 'Unknown';
  let device: 'desktop' | 'mobile' | 'tablet' | 'bot' = 'desktop';
  
  if (/bot|crawl|slurp|spider/i.test(ua)) device = 'bot';
  else if (/tablet|ipad|playbook|silk/i.test(ua)) device = 'tablet';
  else if (/mobile|iphone|ipod|android/i.test(ua)) device = 'mobile';
  
  return { browser, os, device };
};

const getNetworkData = async (): Promise<{ country: string, ip: string, isp: string }> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    // ipwho.is provides rich connection data including ISP/ASN
    const res = await fetch('https://ipwho.is/json/', { signal: controller.signal });
    const data = await res.json();
    clearTimeout(timeoutId);

    return {
      country: data.country || 'Unknown',
      ip: data.ip || 'Unknown',
      isp: data.connection?.isp || data.connection?.org || 'Unknown'
    };
  } catch (e) {
    // Fallback if ipwho.is is down
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      return {
        country: data.country_name || 'Unknown',
        ip: data.ip || 'Unknown',
        isp: data.org || 'Unknown'
      };
    } catch (err) {
      return { country: 'Unknown', ip: 'Unknown', isp: 'Unknown' };
    }
  }
};

export const trackVisit = async () => {
  try {
    const ua = navigator.userAgent;
    const { browser, os, device } = parseUA(ua);
    const network = await getNetworkData();

    const event: ClickEvent = {
      slug: 'page_visit',
      url: window.location.href,
      referrer: document.referrer || 'direct',
      browser,
      os,
      device,
      country: network.country,
      ip: network.ip,
      isp: network.isp
    };

    await supabase.from('clicks').insert([event]);
  } catch (err) {
    console.error('Visit tracking failed:', err);
  }
};

export const trackClick = async (slug: string, url: string) => {
  if (url === '#') return;

  try {
    const ua = navigator.userAgent;
    const { browser, os, device } = parseUA(ua);
    const network = await getNetworkData();

    const event: ClickEvent = {
      slug,
      url,
      referrer: document.referrer || 'direct',
      browser,
      os,
      device,
      country: network.country,
      ip: network.ip,
      isp: network.isp
    };

    await supabase.from('clicks').insert([event]);
  } catch (err) {
    console.error('Analytics tracking failed:', err);
  }
};

export const fetchAnalytics = async () => {
  const { data: allClicks, error } = await supabase
    .from('clicks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayData = allClicks.filter(c => new Date(c.created_at) >= today);

  const aggregate = (arr: any[], key: string) => {
    const counts: Record<string, number> = {};
    arr.forEach(item => {
      const val = item[key] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ [key]: name, count }))
      .sort((a, b) => b.count - a.count);
  };

  return {
    todayTotalVisits: todayData.filter(c => c.slug === 'page_visit').length,
    todayTotalClicks: todayData.filter(c => c.slug !== 'page_visit').length,
    overallTotalVisits: allClicks.filter(c => c.slug === 'page_visit').length,
    overallTotalClicks: allClicks.filter(c => c.slug !== 'page_visit').length,
    topLinks: aggregate(allClicks.filter(c => c.slug !== 'page_visit'), 'slug'),
    byCountry: aggregate(allClicks, 'country'),
    byDevice: aggregate(allClicks, 'device'),
    byReferrer: aggregate(allClicks, 'referrer'),
    byBrowser: aggregate(allClicks, 'browser'),
    recent: allClicks.slice(0, 25)
  };
};