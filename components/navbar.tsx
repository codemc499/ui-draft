'use client'; // Mark component as client-side

import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import * as Button from './ui/button';
import * as FancyButton from './ui/fancy-button'; // Import FancyButton
import * as Input from './ui/input';
import * as Dropdown from './ui/dropdown';
import * as Avatar from './ui/avatar';
import * as Switch from './ui/switch'; // Import Switch
import * as Badge from './ui/badge'; // Import Badge
import * as Divider from './ui/divider'; // Import Divider
import {
  RiSearchLine,
  RiFlagLine,
  RiAddLine,
  RiNotification3Line,
  RiArrowDownSLine,
  RiSettings3Line, // Icon for Settings
  RiLogoutBoxRLine, // Icon for Logout
  RiMoonLine, // Added
  RiFileCopyLine, // Added for Copy ID
  RiFileList2Line, // Added for Orders
  RiQuestionLine, // Added for Help Center
  RiChat1Line,
  RiArrowDownFill,
  RiArrowDropDownFill, // Added for Live Chat
} from '@remixicon/react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'; // Assuming a copy hook exists
import { useAuth } from '@/utils/supabase/AuthContext'; // Import useAuth
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useRouter } from 'next/navigation';

// This CSS ensures the navbar doesn't shift when the scrollbar appears/disappears
// Add this at the top of the file
const fixScrollbarStyles = `
  /* Prevent content shift when scrollbar appears/disappears */
  html {
    scrollbar-gutter: stable;
  }

  /* Alternative approach that ensures body always has the same width */
  body {
    overflow-y: scroll;
    width: 100vw;
    box-sizing: border-box;
    position: relative;
  }

  /* For older browsers */
  @supports not (scrollbar-gutter: stable) {
    body {
      overflow-y: scroll;
    }
  }
`;

export default function Navbar() {
  // --- Get Auth State using useAuth hook ---
  const { user, userProfile, signOut, loading } = useAuth();
  // Replace the placeholder isLoggedIn with the actual user state
  // const isLoggedIn = true; // Remove this line
  // -----------------------------------------

  const [isDarkMode, setIsDarkMode] = useState(false);
  const { copy, hasCopied } = useCopyToClipboard();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // const userId = '1235984'; // Use user.id instead

  const { t } = useTranslation('common');
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

  // Add the scrollbar styles to head
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = fixScrollbarStyles;
    document.head.appendChild(styleElement);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // TODO: Implement Dark Mode toggle logic (e.g., using next-themes)
  const handleDarkModeToggle = () => {
    setIsDarkMode((prev) => !prev);
    // Add theme switching logic here
  };

  // Handle Logout
  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error logging out:', error);
      // TODO: Show notification to user
    } else {
      // Navigate to login page with current language prefix
      router.push(`/${i18n.language}/auth/login`);
    }
  };



  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (!dropdownRef.current) return;
      const rect = dropdownRef.current.getBoundingClientRect();
      const { clientX: x, clientY: y } = e;
      const isOutside =
        x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;

      if (isOutside) setDropdownOpen(false);
    },
    [setDropdownOpen]
  );

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-8 py-5 gap-4 border-b border-stroke-soft-200">
          {/* Left: logo + links */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded bg-gray-200 animate-pulse" />
            <div className="hidden lg:flex items-center gap-5">
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>

          {/* Right: search + buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-10 w-[220px] rounded bg-gray-200 animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav ref={navRef} className='fixed top-0 left-0 right-0 z-50 bg-white w-[100vw] box-border'>
      <div className='mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-8 py-5 gap-4 border-b border-stroke-soft-200 shadow-sm'>
        {/* Left Section: Logo and Nav Links */}
        <div className='flex items-center gap-4'>
          {/* Logo */}
          <Link
            href={`/${i18n.language}/home`}
            className='text-lg flex items-center gap-2 font-semibold text-text-strong-950'
          >
            <Image
              src='/images/logo.svg'
              alt={t('navbar.logo.alt')}
              width={40}
              height={40}
              priority
            />
          </Link>
          {/* Navigation Links Container */}
          <div className='text-text-secondary-600 hidden items-center gap-5 text-label-md lg:flex'>
            <Link href={`/${i18n.language}/services/search?tab=Service`} className='hover:text-text-strong-950  px-2 py-1 rounded-md hover:bg-[#F6F8FA] transition-colors'>
              {t('navbar.links.findServices')}
            </Link>
            <Link href={`/${i18n.language}/services/search?tab=Worker`} className='hover:text-text-strong-950 px-2 py-1 rounded-md hover:bg-[#F6F8FA] transition-colors'>
              {t('navbar.links.findWorker')}
            </Link>

            <Link href={`/${i18n.language}/services/search?tab=Project`} className='hover:text-text-strong-950 px-2 py-1 rounded-md hover:bg-[#F6F8FA] transition-colors'>
              {t('navbar.links.findProjects')}
            </Link>
            <Link href={`/${i18n.language}/bonus`} className='hover:text-text-strong-950 px-2 py-1 rounded-md hover:bg-[#F6F8FA] transition-colors'>
              {t('navbar.links.bonus')}
            </Link>
          </div>
        </div>

        {/* Right Section: Search, Language, Auth Buttons/Account */}
        <div className='flex items-center gap-3 sm:gap-4'>
          {/* Search Input */}
          <div className='relative hidden sm:block'>
            <Input.Root>
              <Input.Wrapper size='medium' className='h-10 w-[220px] rounded-10 border bg-white shadow-regular-xs gap-1.5'>
                <Input.Icon
                  as={RiSearchLine}
                  className='text-icon-secondary-400'
                />
                <Input.Input
                  placeholder={t('navbar.search.placeholder')}
                  className='w-52 lg:w-64 font-normal'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          {user ? (
            <>
              <Link
                href={
                  userProfile?.user_type === 'seller'
                    ? `/${i18n.language}/worker/services/create`
                    : `/${i18n.language}/jobs/create`
                }
                passHref
              >
                <FancyButton.Root size='medium' className='gap-2 font-medium text-[14px]'>
                  {t('navbar.buttons.create')}
                  <FancyButton.Icon className='ml-[2px]' as={RiAddLine} />
                </FancyButton.Root>
              </Link>

            </>
          ) : (null)}

          <button
            onClick={() => {
              const newLang = i18n.language === 'en' ? 'zh' : 'en';
              const currentPath = window.location.pathname;
              const newPath = currentPath.replace(/^\/(en|zh)/, `/${newLang}`);
              // Get current query parameters
              const searchParams = window.location.search;
              // Update i18n language
              i18n.changeLanguage(newLang);
              // Update URL using Next.js router, preserving query parameters
              router.push(`${newPath}${searchParams}`);
            }}
            className="hover:bg-bg-neutral-subtle-100 rounded-md p-1 transition-colors"
          >
            <Image
              src={`/images/icons/${i18n.language === 'en' ? 'United_States' : 'China'}.svg`}
              alt={t('navbar.language.alt')}
              width={24}
              height={24}
            />
          </button>

          {user ? (
            <>
              <button className='text-icon-secondary-400 hover:bg-[#F6F8FA] relative rounded-md p-2'>
                <span className='absolute right-1.5 top-1.5 block h-2 w-2 rounded-full bg-error-base ring-2 ring-bg-white-0'></span>
                <RiNotification3Line className='size-5' />
              </button>

              <Dropdown.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <Dropdown.Trigger asChild>
                  <button onClick={() => setDropdownOpen((prev) => !prev)} className='text-text-secondary-600 hover:bg-[#F6F8FA] flex items-center rounded-10 border border-stroke-soft-200 p-1 pr-2 h-10 bg-white'>
                    {user.user_metadata?.avatar_url ? <Avatar.Root size='32'>
                      <Avatar.Image
                        src={user.user_metadata.avatar_url ? user.user_metadata.avatar_url : 'https://via.placeholder.com/40'}
                        alt={user.user_metadata?.full_name || user.email || t('navbar.account.avatarAlt')}
                      />
                    </Avatar.Root> :
                      <Avatar.Root size='32' color='yellow'>{user.user_metadata?.full_name?.charAt(0).toUpperCase()}</Avatar.Root>}
                    <span className='hidden md:inline text-sm pl-2 pr-0.5 font-medium'>{t('navbar.account.title')}</span>
                    <RiArrowDropDownFill className='text-icon-sub-500 hidden size-8 md:inline' />
                  </button>
                </Dropdown.Trigger>
                <div ref={dropdownRef} onMouseLeave={handleMouseLeave}>
                  <Dropdown.Content align='end' className='w-72'>
                    <Link href={`/${i18n.language}/users/${user.id}`} passHref>
                      <div className='mb-1 flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-bg-neutral-subtle-100'>
                        <Avatar.Root size='40'>
                          <Avatar.Image
                            src={user.user_metadata?.avatar_url ? user.user_metadata.avatar_url : 'https://via.placeholder.com/40'}
                            alt={user.user_metadata?.full_name || user.email || t('navbar.account.avatarAlt')}
                          />
                        </Avatar.Root>
                        <div className='flex-1'>
                          <div className='text-label-sm text-text-strong-950'>
                            {user.user_metadata?.full_name || user.email || t('navbar.account.defaultName')}
                          </div>
                          <div className='mt-0.5 flex items-center gap-1'>
                            <span className='text-paragraph-xs text-text-sub-600'>
                              {t('navbar.account.id')}: {user.id}
                            </span>
                            <button
                              onClick={() => copy(user.id)}
                              title={t('navbar.account.copyId')}
                              className='text-icon-secondary-400 hover:text-icon-primary-500'
                            >
                              <RiFileCopyLine className='size-3.5' />
                            </button>
                            {hasCopied && (
                              <Badge.Root variant='light' color='green' size='small'>
                                {t('navbar.account.copied')}
                              </Badge.Root>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Divider.Root className='mx-2 my-1' />

                    <Dropdown.Item className='cursor-default hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent' onSelect={(e) => e.preventDefault()}>
                      <Dropdown.ItemIcon as={RiMoonLine} />
                      {t('navbar.account.darkMode')}
                      <span className='flex-1' />
                      <Switch.Root checked={isDarkMode} onCheckedChange={handleDarkModeToggle} />
                    </Dropdown.Item>

                    <Link href={`/${i18n.language}/settings`} passHref>
                      <Dropdown.Item>
                        <Dropdown.ItemIcon as={RiSettings3Line} />
                        {t('navbar.account.settings')}
                      </Dropdown.Item>
                    </Link>

                    <Link href={`/${i18n.language}/settings?tab=orders`} passHref>
                      <Dropdown.Item>
                        <Dropdown.ItemIcon as={RiFileList2Line} />
                        {t('navbar.account.orders')}
                      </Dropdown.Item>
                    </Link>

                    <Divider.Root className='mx-2 my-1' />

                    <Dropdown.Label>{t('navbar.support.title')}</Dropdown.Label>
                    <Dropdown.Item>
                      <Dropdown.ItemIcon as={RiQuestionLine} />
                      {t('navbar.support.helpCenter')}
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Dropdown.ItemIcon as={RiChat1Line} />
                      {t('navbar.support.liveChat')}
                    </Dropdown.Item>

                    <Divider.Root className='mx-2 my-1' />

                    <div className='flex items-center justify-between p-2'>
                      <div>
                        <div className='text-text-secondary-600 text-label-sm'>
                          {t('navbar.account.balance')}
                        </div>
                        <div className='text-label-md font-medium text-text-strong-950'>
                          {userProfile?.balance?.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) ?? '0.00'}
                        </div>
                      </div>
                      <Button.Root variant='primary' mode='stroke' size='small'>
                        {t('navbar.account.topUp')}
                      </Button.Root>
                    </div>

                    <Divider.Root className='mx-2 my-1' />

                    <Dropdown.Item
                      onClick={() => {
                        const newLang = i18n.language === 'en' ? 'zh' : 'en';
                        const currentPath = window.location.pathname;
                        const newPath = currentPath.replace(/^\/(en|zh)/, `/${newLang}`);
                        // Get current query parameters
                        const searchParams = window.location.search;
                        // Update i18n language
                        i18n.changeLanguage(newLang);
                        // Update URL using Next.js router, preserving query parameters
                        router.push(`${newPath}${searchParams}`);
                      }}
                    >
                      <Dropdown.ItemIcon as={RiFlagLine} />
                      {i18n.language === 'en' ? '切换到中文' : 'Switch to English'}
                    </Dropdown.Item>

                    <Dropdown.Item className='text-error-base' onSelect={handleLogout}>
                      <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
                      {t('navbar.account.logout')}
                    </Dropdown.Item>
                  </Dropdown.Content>
                </div>
              </Dropdown.Root>
            </>
          ) : (
            <>
              <Link href={`/${i18n.language}/auth/login`} passHref>
                <Button.Root variant='neutral' mode='stroke' size='medium'>
                  {t('navbar.auth.login')}
                </Button.Root>
              </Link>
              <Link href={`/${i18n.language}/auth/signup`} passHref>
                <Button.Root variant='neutral' mode='filled' size='medium'>
                  {t('navbar.auth.freeStart')}
                </Button.Root>
              </Link>
            </>
          )}

          <div className='lg:hidden'>
            <button className='text-icon-secondary-400 hover:bg-bg-neutral-subtle-100 rounded-md p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
