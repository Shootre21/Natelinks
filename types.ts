
export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
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
