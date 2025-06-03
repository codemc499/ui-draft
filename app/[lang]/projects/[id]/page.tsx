'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { RiLinksLine, RiHomeSmile2Line, RiFileCopyLine, RiArrowRightSLine, RiLoader4Line } from '@remixicon/react';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import { Root as FancyButtonRoot, Icon as FancyButtonIcon } from '@/components/ui/fancy-button'; // Import FancyButton

// Import Supabase functions and types
import {
  jobOperations,
  userOperations,
  chatOperations,
} from '@/utils/supabase/database';
import type { Job, User, BaseFileData, Chat, Message, JobApplication } from '@/utils/supabase/types'; // Import types
import { useAuth } from '@/utils/supabase/AuthContext'; // Import useAuth

// Import Notification hook
import { useNotification } from '@/hooks/use-notification';

// Import existing components
import ClientProfileCard from '@/components/projects/detail/ClientProfileCard';
import ProjectInfoCard from '@/components/projects/detail/ProjectInfoCard';
import ApplicantsList from '@/components/projects/detail/ApplicantsList';
import ProjectHeader from '@/components/projects/detail/ProjectHeader';
import ProjectDetailsSection from '@/components/projects/detail/ProjectDetailsSection';
import SkillsSection from '@/components/projects/detail/SkillsSection';
import AttachmentsSection from '@/components/projects/detail/AttachmentsSection';
import FaqSection from '@/components/projects/detail/FaqSection';
import ChatPopupWrapper from '@/components/chat/chat-popup-wrapper';
import { jobApplicationOperations } from '@/utils/supabase/job-application-operations';

// --- Mock Data (Keep for sections not yet implemented with real data) ---
const mockFaqs = [
  {
    question: 'How to join the project?',
    answer: '',
    isOpen: false,
  },
  {
    question: 'What requirements must be met to participate in the project?',
    answer:
      'Insert the accordion description here. It would look better as two lines of text.',
    isOpen: false,
  },
  {
    question:
      'How long does it take to receive payment after project completion?',
    answer: '',
    isOpen: false,
  },
  {
    question: 'What requirements must be met to participate in the project?',
    answer: '',
    isOpen: false,
  },
];

// --- Mock Applicants (Buyer vs. Seller views) ---
const mockApplicants = [
  {
    id: '1',
    name: 'James Brown',
    avatar: 'https://via.placeholder.com/40',
    rating: 4.9,
    reviews: 125,
    time: '1m ago',
    // for buyer view: this one was already hired & replaced
    hired: true,
    replacedBy: 'Arthur Taylor',
    unreadMessages: 0,
  },
  {
    id: '2',
    name: 'Sophia Williams',
    avatar: 'https://via.placeholder.com/40',
    rating: 4.9,
    reviews: 125,
    time: '1m ago',
    // not hired, but has unread messages
    hired: false,
    unreadMessages: 2,
  },
  {
    id: '3',
    name: 'Arthur Taylor',
    avatar: 'https://via.placeholder.com/40',
    rating: 4.9,
    reviews: 125,
    time: '1m ago',
    hired: false,
    unreadMessages: 0,
  },
  {
    id: '4',
    name: 'Emma Wright',
    avatar: 'https://via.placeholder.com/40',
    rating: 4.9,
    reviews: 125,
    time: '1m ago',
    hired: false,
    unreadMessages: 0,
  },
  {
    id: '5',
    name: 'Emma Wright',
    avatar: 'https://via.placeholder.com/40',
    rating: 4.9,
    reviews: 125,
    time: '1m ago',
    hired: false,
    unreadMessages: 0,
  },
];


// --- Placeholder Seller Components ---
const SellerActionButtons = ({
  onApply,
  onMessageClick,
  isLoadingChat,
  disabled,
}: {
  onApply: () => void;
  onMessageClick: () => void;
  isLoadingChat: boolean;
  disabled: boolean;
}) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex items-center gap-3 p-4 pt-0 mt-4">
      <Button.Root
        variant="neutral"
        mode="stroke"
        className="flex-1"
        onClick={onMessageClick}
        disabled={disabled || isLoadingChat}
      >
        {isLoadingChat ? (
          <>
            <RiLoader4Line className="animate-spin mr-2" size={16} />
            {t('projects.detail.page.actions.opening')}
          </>
        ) : (
          <>
            {t('projects.detail.page.actions.message')}
            <Button.Icon className="flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 stroke-current text-[#525866]"
              >
                <path
                  d="M6.66641 5.2668L13.7414 2.90846C16.9164 1.85013 18.6414 3.58346 17.5914 6.75846L15.2331 13.8335C13.6497 18.5918 11.0497 18.5918 9.46641 13.8335L8.76641 11.7335L6.66641 11.0335C1.90807 9.45013 1.90807 6.85846 6.66641 5.2668Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.92578 11.375L11.9091 8.3833"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button.Icon>
          </>
        )}
      </Button.Root>
      <FancyButtonRoot
        variant="neutral"
        size="medium"
        className="flex-1"
        onClick={onApply}
        disabled={disabled}
      >
        {t('projects.detail.page.actions.apply')}
        <FancyButtonIcon>
          <RiArrowRightSLine />
        </FancyButtonIcon>
      </FancyButtonRoot>
    </div>
  );
};

// NOTE: ProjectLinkCard requires a link - Job schema doesn't have one.
const ProjectLinkCard = ({ link }: { link: string }) => {
  const { t } = useTranslation('common');
  return (
    <div className="shadow-sm rounded-[20px] bg-bg-white-0 py-4 border border-neutral-300 shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.15)] p-4">
      <label
        htmlFor="project-link"
        className="mb-2 block text-label-md font-medium text-text-strong-950"
      >
        {t('projects.details.link')}
      </label>
      <Input.Root>
        <Input.Wrapper className="flex items-center bg-white border border-gray-300 rounded-md px-2 py-1">
          {/* link icon */}
          <RiLinksLine className="size-5 text-gray-400 mr-2" />
          {/* read-only input */}
          <Input.Input
            id="project-link"
            readOnly
            value={link}
            className="bg-transparent text-gray-400 flex-1 focus:outline-none"
          />
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="text-icon-secondary-400 hover:text-icon-primary-500 p-1"
            aria-label="Copy link"
          >
            <RiFileCopyLine className="size-5" />
          </button>
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
};

// --- Main Page Component ---

export default function ProjectDetailPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const { t } = useTranslation('common');
  const [, lang] = usePathname().split('/');
  const authContext = useAuth();
  const { notification } = useNotification();

  // State for fetched data
  const [projectDataState, setProjectDataState] = useState<Job | null>(null);
  const [clientDataState, setClientDataState] = useState<User | null>(null);
  const [applicantDataState, setApplicantDataState] = useState<User | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  const [pageViewRole, setPageViewRole] = useState<'owner' | 'seller_visitor' | 'buyer_visitor' | 'anonymous'>('anonymous');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<Array<JobApplication & { seller: User }>>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);

  // Chat State
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Derived boolean for cleaner conditional rendering
  const isOwner = pageViewRole === 'owner';
  const isSellerVisitor = pageViewRole === 'seller_visitor';
  const isBuyerVisitor = pageViewRole === 'buyer_visitor';
  const isAnonymous = pageViewRole === 'anonymous';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    if (!projectId || authContext.loading) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setProjectDataState(null);
      setClientDataState(null);
      setCurrentUserProfile(null);
      setPageViewRole('anonymous');

      let fetchedJobData: Job | null = null;

      try {
        // 1. Fetch Job data
        const jobData = await jobOperations.getJobById(projectId);
        if (!jobData) {
          throw new Error('Project not found.');
        }
        setProjectDataState(jobData);
        fetchedJobData = jobData;

        // 2. Fetch Client (Buyer) data
        const clientData = await userOperations.getUserById(jobData.buyer_id);
        setClientDataState(clientData);

        // 3. Fetch Current User Profile (if logged in)
        let fetchedCurrentUserProfile: User | null = null;
        if (authContext.user?.id) {
          fetchedCurrentUserProfile = await userOperations.getUserById(authContext.user.id);
          setCurrentUserProfile(fetchedCurrentUserProfile);
        }

        // 4. Determine Page View Role using fetched data
        if (authContext.user && fetchedJobData) {
          if (authContext.user.id === fetchedJobData.buyer_id) {
            setPageViewRole('owner');
          } else if (fetchedCurrentUserProfile?.user_type === 'seller') {
            setPageViewRole('seller_visitor');
          } else if (fetchedCurrentUserProfile?.user_type === 'buyer') {
            setPageViewRole('buyer_visitor');
          } else {
            setPageViewRole('anonymous');
          }
        } else {
          setPageViewRole('anonymous');
        }

        // Reset chat state on new fetch
        setActiveChat(null);
        setActiveChatMessages([]);
        setChatError(null);

      } catch (err: any) {
        console.error('Error fetching project details:', err);
        setError(err.message || 'Failed to load project details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [projectId, authContext.user?.id, authContext.loading]);

  // Add new useEffect for fetching job applications
  useEffect(() => {
    if (!projectId || !isOwner) return;

    const fetchJobApplications = async () => {
      setIsLoadingApplications(true);
      try {
        const applications = await jobApplicationOperations.getJobApplicationsWithSellers(projectId);
        setJobApplications(applications);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      } finally {
        setIsLoadingApplications(false);
      }
    };

    fetchJobApplications();
  }, [projectId, isOwner]);

  // Handler for the Apply button click
  const handleApplyClick = () => {
    console.log('Apply button clicked');
    notification({
      description: t('projects.detail.page.actions.applicationSent'),
    });
  };

  // --- Chat Handlers ---
  const handleOpenChat = async (applicantData: User) => {

    console.log('HERE is the current user profile', currentUserProfile);
    console.log('HERE is the applicant data state', applicantData);

    if (!currentUserProfile || !applicantData) {
      setChatError(t('projects.detail.page.chat.profileError'));
      return;
    }
    setApplicantDataState(applicantData);

    console.log('HERE is the page view role', pageViewRole);
    if (pageViewRole !== 'owner') {
      console.warn('Attempted to open chat with incorrect role:', pageViewRole);
      return;
    }

    setIsLoadingChat(true);
    setChatError(null);
    setActiveChat(null);
    setActiveChatMessages([]);

    try {
      const chat = await chatOperations.findOrCreateChat(applicantData.id, currentUserProfile.id);
      console.log('HERE is the chat', chat);
      if (chat) {
        setActiveChat(chat);
        setIsLoadingMessages(true);
        const messages = await chatOperations.getChatMessages(chat.id);
        setActiveChatMessages(messages);
      } else {
        setChatError(t('projects.detail.page.chat.createError'));
      }
    } catch (error: any) {
      console.error('Error opening chat:', error);
      setChatError(t('projects.detail.page.chat.error', { message: error.message || 'An unexpected error occurred.' }));
    } finally {
      setIsLoadingChat(false);
      setIsLoadingMessages(false);
    }
  };

  const handleCloseChat = () => {
    setActiveChat(null);
    setActiveChatMessages([]);
    setChatError(null);
  };
  // --- End Chat Handlers ---

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 lg:px-8 text-center">
        {t('projects.detail.page.loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 lg:px-8 text-center text-red-600">
        {t('projects.detail.page.error', { message: error })}
      </div>
    );
  }

  if (!projectDataState) {
    return (
      <div className="container mx-auto px-4 py-6 lg:px-8 text-center">
        {t('projects.detail.page.notFound')}
      </div>
    );
  }

  // Prepare data for child components, handling missing fields
  const projectTitle = projectDataState.title ?? 'Untitled Project';
  const projectCategory = projectDataState.usage_option === 'business' ? 'Business' : 'Private';
  const projectDescription = projectDataState.description ? [projectDataState.description] : [];
  const projectSkills = projectDataState.skill_levels ?? [];
  const projectAttachments = projectDataState.files ?? [];
  const projectCurrency = projectDataState.currency ?? 'USD';
  const projectCurrencySymbol = projectCurrency === 'USD' ? '$' : projectCurrency === 'EUR' ? '€' : projectCurrency === 'GBP' ? '£' : projectCurrency === 'CNY' ? '¥' : '$';

  const clientName = clientDataState?.full_name ?? 'Unknown Client';
  const clientAvatar = clientDataState?.avatar_url ?? 'https://via.placeholder.com/100'; // Placeholder avatar
  // Rating, Reviews, isVerified are not in UserSchema - use placeholders
  const clientRating = 4.9; // Placeholder
  const clientReviews = 125; // Placeholder
  const clientIsVerified = true; // Placeholder

  const projectBudget = `${projectCurrencySymbol}${projectDataState.budget ?? 0}`;
  // Derive Release Time (Example: using raw date for now)
  const projectReleaseTime = projectDataState.created_at ? new Date(projectDataState.created_at).toLocaleDateString() : 'N/A';
  const projectDeadline = projectDataState.deadline ?? 'N/A';
  const projectProposals = 5; // Placeholder - not in JobSchema
  const projectLink = 'https://www.example.com'; // Placeholder - not in JobSchema

  // Adjust breadcrumb logic based on role if needed
  const findWorksLabel = isOwner || isBuyerVisitor ? 'Find Project' : 'Find Project';
  const findWorksLink = isOwner || isBuyerVisitor ? '/projects' : '/projects'; // Example adjustment

  return (
    <div className='container mx-auto  py-10 px-1   max-w-[1200px]'>
      {/* Header with Breadcrumbs - updated links */}
      <div className='mb-6 flex items-center justify-between text-[14px]'>
        <div className='flex flex-wrap items-center gap-3'>
          {/* Updated Home Link */}
          <Link
            href={`/${lang}/home`}
            className='text-text-sub-600 text-icon-secondary-400 hover:text-icon-primary-500'
          >
            <RiHomeSmile2Line className='size-5 hover:text-[#0E121B]' />
          </Link>
          <span className='text-text-sub-600'>/</span>
          {/* Updated Find Project/Works Link */}
          <Link
            href={`/${lang}/services/search?tab=Project`}
            className='font-medium text-text-sub-600 text-text-strong-950 hover:text-[#0E121B] hover:underline'
          >
            {t('projects.detail.page.breadcrumbs.findProject')} { /* Keep dynamic label for now */}
          </Link>
          <span className='text-text-sub-600'>/</span>
          <span className='font-medium text-text-sub-600 text-text-strong-950 hover:text-[#0E121B] hover:underline'>
            {t('projects.detail.page.breadcrumbs.projectDetail')}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='flex gap-6'>
        {/* Left Content Area (Project Details) */}
        <div className='w-[824px]'>
          <div className='p-[24px] shadow-[0px_23px_32px_-8px_rgba(14,18,27,0.17)] rounded-[20px] border border-[#E2E4E9] bg-bg-white-0'>
            <ProjectHeader
              title={projectTitle}
              category={projectCategory}
              showBookmark={isSellerVisitor || isAnonymous} // Show bookmark for non-owners
            />
            <ProjectDetailsSection
              description={projectDescription}
              requirements={[]} // Pass empty array as requirements are not fetched
            />
            <SkillsSection skills={projectSkills} />
            <AttachmentsSection attachments={projectAttachments} client={clientDataState} />
            <FaqSection initialFaqs={mockFaqs} /> {/* Use mock FAQs */}
          </div>
        </div>

        {/* Right Sidebar - Conditionally Rendered based on pageViewRole */}
        <div className='flex flex-col gap-6 flex-1'>
          {(isOwner || isBuyerVisitor || isAnonymous) && (
            // Sidebar Layout for Owner, Buyer Visitor, Anonymous (No Apply Button)
            <>
              <div className='shadow-sm rounded-[20px] border border-[#E2E4E9] bg-bg-white-0 shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.15)]'>
                <ClientProfileCard client={{
                  id: clientDataState?.id ?? '',
                  name: clientName,
                  avatar: clientAvatar,
                  rating: clientRating,
                  reviews: clientReviews,
                  isVerified: clientIsVerified
                }} />
                <div className="w-[90%] mx-auto my-4 h-[2px] bg-stroke-soft-200" />
                <ProjectInfoCard
                  budget={projectBudget}
                  releaseTime={projectReleaseTime}
                  deadline={projectDeadline}
                  proposals={projectProposals} // Use placeholder
                />
              </div>
              {/* No Action Buttons for these roles */}
              {/* Anonymous doesn't see applicants */}
              {!isAnonymous && (
                /* Applicant List Card Wrapper */
                <div className="shadow-sm rounded-[20px] border border-white bg-bg-white-0 shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.15)] overflow-hidden">
                  <ApplicantsList
                    applications={jobApplications}
                    userRole={isOwner ? 'buyer' : 'seller'}
                    onMessageClick={isOwner ? handleOpenChat : undefined}
                  />
                </div>
              )}
              {/* Link Card might still be relevant for Anonymous? */}
              {(isAnonymous || isBuyerVisitor) && <ProjectLinkCard link={projectLink} />}
            </>
          )}
          {isSellerVisitor && (
            // Seller Visitor Sidebar Layout (With Apply Button)
            <>
              <div className='shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.15)] rounded-[20px] border border-neutral-300 bg-bg-white-0'>
                <ClientProfileCard client={{
                  id: clientDataState?.id ?? '',
                  name: clientName,
                  avatar: clientAvatar,
                  rating: clientRating,
                  reviews: clientReviews,
                  isVerified: clientIsVerified
                }} />
                <div className="w-[90%] mx-auto my-4 h-[2px] bg-stroke-soft-200" />
                <ProjectInfoCard
                  budget={projectBudget}
                  releaseTime={projectReleaseTime}
                  deadline={projectDeadline}
                  proposals={projectProposals}
                />
                {/* <SellerActionButtons
                  onApply={handleApplyClick}
                  onMessageClick={handleOpenChat}
                  isLoadingChat={isLoadingChat}
                  disabled={!currentUserProfile || !clientDataState}
                /> */}
              </div>
              {chatError && (
                <p className="text-xs text-red-600 -mt-4 mb-2 text-center">
                  {t('projects.detail.page.chat.error', { message: chatError })}
                </p>
              )}
              {/* <div className="shadow-sm rounded-[20px] border border-neutral-300 bg-bg-white-0 shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.15)] overflow-hidden">
                <ApplicantsList
                  applications={jobApplications}
                  userRole="seller"
                />
              </div> */}
              <ProjectLinkCard link={projectLink} />
            </>
          )}
        </div>
      </div>
      {/* Conditionally render Chat Popup */}
      {activeChat && currentUserProfile && applicantDataState && (
        <ChatPopupWrapper
          key={activeChat.id}
          chat={activeChat}
          initialMessages={activeChatMessages}
          currentUserProfile={currentUserProfile} // Seller is current user here
          otherUserProfile={applicantDataState} // Buyer is other user here
          currentUserId={currentUserProfile.id}
          isLoadingMessages={isLoadingMessages}
          onClose={handleCloseChat}
          position="bottom-right"
        />
      )}
    </div>
  );
}
