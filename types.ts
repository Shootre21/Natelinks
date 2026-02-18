export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  isPlaceholder?: boolean;
}

export interface ProfileData {
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  links: LinkItem[];
  theme: {
    backgroundGradient: string;
    buttonColor: string;
    buttonTextColor: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export interface ClickEvent {
  id?: string;
  created_at?: string;
  slug: string;
  url: string;
  referrer: string;
  browser: string;
  os: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'bot';
  country: string;
  ip?: string;
  isp?: string;
}

export interface AnalyticsSummary {
  todayTotal: number;
  overallTotal: number;
  topLinks: { slug: string; count: number }[];
  byCountry: { country: string; count: number }[];
  byDevice: { device: string; count: number }[];
  byReferrer: { referrer: string; count: number }[];
}