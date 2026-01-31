
import React from 'react';
import { LinkItem } from '../types';

interface LinkButtonProps {
  link: LinkItem;
  theme: {
    buttonColor: string;
    buttonTextColor: string;
  };
}

export const LinkButton: React.FC<LinkButtonProps> = ({ link, theme }) => {
  const isPlaceholder = link.url === '#' || !link.url;

  return (
    <a
      href={isPlaceholder ? undefined : link.url}
      target={isPlaceholder ? undefined : "_blank"}
      rel={isPlaceholder ? undefined : "noopener noreferrer"}
      onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
      className={`w-full max-w-lg ${theme.buttonColor} ${theme.buttonTextColor} font-semibold py-4 px-8 rounded-2xl text-center transition-all duration-300 transform ${isPlaceholder ? 'opacity-60 cursor-not-allowed grayscale-[0.5]' : 'hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]'} flex items-center justify-between group`}
    >
      <span className={`text-2xl ${!isPlaceholder && 'group-hover:rotate-12'} transition-transform duration-300`}>
        {link.icon || '🔗'}
      </span>
      <span className="flex-grow text-lg">{link.label}</span>
      <span className={`transition-opacity duration-300 ${!isPlaceholder ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </span>
    </a>
  );
};
