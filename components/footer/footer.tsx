'use client';

import React from 'react';
import Image from 'next/image';

// Types
interface FooterLinkGroupProps {
  title: string;
  links: string[];
}

interface SocialPlatform {
  name: string;
  icon: string;
}

// Constants
const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { name: 'Instagram', icon: 'instagram-line' },
  { name: 'Dribbble', icon: 'dribbble-fill' },
];

const FOOTER_GROUPS: FooterLinkGroupProps[] = [
  {
    title: 'Company',
    links: ['Contact', 'Help Center', 'Terms', 'Privacy Policy'],
  },
  {
    title: 'For User',
    links: ['Find Work', 'Find Service'],
  },
  {
    title: 'For Work',
    links: ['Find Projects', 'Apply for certification'],
  },
];

// Components
const FooterLink: React.FC<{ text: string }> = ({ text }) => (
  <span className="cursor-pointer hover:text-gray-800 transition-colors duration-200">
    {text}
  </span>
);

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => (
  <div className="w-1/6 pl-2">
    <div className="font-inter font-medium text-[18px] my-3">{title}</div>
    <div className="flex flex-col gap-2 text-gray-500">
      {links.map((link) => (
        <FooterLink key={link} text={link} />
      ))}
    </div>
  </div>
);

const SocialIcon: React.FC<SocialPlatform> = ({ name, icon }) => (
  <div className="cursor-pointer transform hover:scale-110 transition-transform duration-200">
    <Image
      src={`/images/icons/${icon}.svg`}
      alt={`${name} icon`}
      width={24}
      height={24}
    />
  </div>
);

const SocialLinks: React.FC = () => (
  <div className="flex space-x-4">
    {SOCIAL_PLATFORMS.map((platform) => (
      <SocialIcon key={platform.icon} {...platform} />
    ))}
  </div>
);

const Logo: React.FC = () => (
  <div className="cursor-pointer transform hover:scale-105 transition-transform duration-200">
    <Image
      src="/images/logo.svg"
      alt="Company logo"
      width={40}
      height={40}
    />
  </div>
);

const Copyright: React.FC = () => {
  const openWindow = () => {
    window.open('https://beian.miit.gov.cn/', '_blank');
  };

  return (
    <div className="flex my-10 text-sm space-y-2 text-gray-500 border-t border-gray-200 pt-6">
      <div className="w-1/2 text-right pr-2 mt-2">© 2025 Innhee.com. All rights reserved.</div>
      <div className="text-sm cursor-pointer pl-1 hover:text-blue-800 transition-colors duration-200" onClick={openWindow}>鄂ICP备2025102709号-1</div>
    </div>
  );
};

export default function Footer() {
  return (
    <div className="mx-16 mt-12">
      <div className="flex ">
        <div className="flex flex-col gap-4 w-1/2">
          <Logo />
          <div className="font-inter font-normal text-[18px] leading-6 my-2">
            One-Stop Audio Talent Platform, Making Great Sounds Land Faster.<br />
            1v1 Customize Your Audio Solution.
          </div>
          <SocialLinks />
        </div>

        {FOOTER_GROUPS.map((group) => (
          <FooterLinkGroup key={group.title} {...group} />
        ))}
      </div>

      <Copyright />
    </div>
  );
}
