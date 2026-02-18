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

export const trackVisit = async () => {
  try {
    const ua = navigator.userAgent;
    const { browser, os, device } = parseUA(ua);
    
    let country = 'Unknown';
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      country = data.country_name || 'Unknown';
    } catch (e) {
      console.warn("Could not fetch GeoIP");
    }

    const event: ClickEvent = {
      slug: 'page_visit',
      url: window.location.href,
      referrer: document.referrer || 'direct',
      browser,
      os,
      device,
      country
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
    
    let country = 'Unknown';
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      country = data.country_name || 'Unknown';
    } catch (e) {
      console.warn("Could not fetch GeoIP");
    }

    const event: ClickEvent = {
      slug,
      url,
      referrer: document.referrer || 'direct',
      browser,
      os,
      device,
      country
    };

    await supabase.from('clicks').insert([event]);
  } catch (err) {
    console.error('Analytics tracking failed:', err);
  }
};

export const fetchAnalytics = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: allClicks, error } = await supabase
    .from('clicks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const todayData = allClicks.filter(c => new Date(c.created_at) >= today);

  const aggregate = (arr: any[], key: string, filterPageVisits = false) => {
    const counts: Record<string, number> = {};
    const filteredArr = filterPageVisits ? arr.filter(i => i.slug !== 'page_visit') : arr;
    filteredArr.forEach(item => {
      counts[item[key]] = (counts[item[key]] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ [key]: name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const visits = allClicks.filter(c => c.slug === 'page_visit');
  const clicks = allClicks.filter(c => c.slug !== 'page_visit');

  return {
    todayTotalVisits: todayData.filter(c => c.slug === 'page_visit').length,
    todayTotalClicks: todayData.filter(c => c.slug !== 'page_visit').length,
    overallTotalVisits: visits.length,
    overallTotalClicks: clicks.length,
    topLinks: aggregate(clicks, 'slug'),
    byCountry: aggregate(allClicks, 'country'),
    byDevice: aggregate(allClicks, 'device'),
    byReferrer: aggregate(allClicks, 'referrer'),
    byBrowser: aggregate(allClicks, 'browser'),
    recent: allClicks.slice(0, 15)
  };
};