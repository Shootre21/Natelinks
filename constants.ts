
import { ProfileData } from './types';

export const INITIAL_PROFILE: ProfileData = {
  handle: "@socialistnate",
  displayName: "Socialistnate",
  avatarUrl: "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_Chile.svg",
  bio: "Author, Creator of Delta Press, and Music Producer",
  links: [
    { 
      id: "store", 
      label: "My Amazon Store", 
      url: "https://www.amazon.com/stores/Nathan-Carrasco/author/B0GDTXG3FY?ref=sr_ntt_srch_lnk_1&qid=1769842187&sr=8-1&shoppingPortalEnabled=true&ccs_id=19049792-8ce3-4ecf-a53e-1b9376b8f0f3",
      icon: "🛒"
    },
    { 
      id: "tiktok-main", 
      label: "Main TikTok", 
      url: "https://www.tiktok.com/@comrajiw5f6?is_from_webapp=1&sender_device=pc",
      icon: "📱"
    },
    { 
      id: "tiktok-edu", 
      label: "Education TikTok", 
      url: "https://www.tiktok.com/@darknetdruid?is_from_webapp=1&sender_device=pc",
      icon: "🎓"
    },
    { 
      id: "notebook", 
      label: "My Notebook App (beta)", 
      url: "https://weavenote-q4l7.vercel.app/",
      icon: "📓"
    },
    { 
      id: "ats", 
      label: "My Resume ATS APP (Coming Soon)", 
      url: "#",
      icon: "📄"
    },
    { 
      id: "marxists", 
      label: "Marxist Open Source Library", 
      url: "https://www.marxists.org/archive/index.htm",
      icon: "📚"
    },
    { 
      id: "blog", 
      label: "Delta Press Blog", 
      url: "https://delta-press.vercel.app/",
      icon: "✍️"
    },
    { 
      id: "music", 
      label: "My Music on Spotify", 
      url: "https://open.spotify.com/search/flyingVproductions",
      icon: "🎵"
    },
    { 
      id: "contact", 
      label: "Get in Touch", 
      url: "https://delta-press.vercel.app/#/contact",
      icon: "📩"
    }
  ],
  theme: {
    backgroundGradient: "from-red-900 via-red-950 to-black",
    buttonColor: "bg-amber-400 backdrop-blur-md",
    buttonTextColor: "text-red-950"
  },
  contactInfo: {
    email: "contact@delta-press.vercel.app"
  }
};
