'use client';

import * as React from 'react';
import {
  User,
  Contract,
  ContractMilestone,
  Chat,
  Message
} from '@/utils/supabase/types';
import { useAuth } from '@/utils/supabase/AuthContext';
import { chatOperations, userOperations } from '@/utils/supabase/database';
import ChatPopupWrapper from '@/components/chat/chat-popup-wrapper';
import { ProfileSection } from "./profile-section";
import { FinancialSummary } from "./financial-summary";
import { MilestoneSection } from "./milestone-section";
import { ContractDetails } from "./contract-details";
import { WorkFiles } from "./work-files";
import { confirmMilestonePayment } from '@/app/actions/milestone-actions';
import { uploadContractAttachments } from '@/app/actions/contract-actions';
import { useNotification } from '@/hooks/use-notification';
import { useTranslation } from 'react-i18next';

// Define user role type
type UserRole = 'buyer' | 'seller';

// Define props for the Client Component
interface OrderDetailsClientProps {
  contract: Contract;
  seller: User;
  buyer: User;
  milestones: ContractMilestone[];
  currentUserId: string;
}

export function OrderDetailsClient({
  contract,
  seller,
  buyer,
  milestones: initialMilestonesData,
  currentUserId,
}: OrderDetailsClientProps) {
  // --- State --- 
  const [isConfirming, setIsConfirming] = React.useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = React.useState<User | null>(null);
  const [activeChat, setActiveChat] = React.useState<Chat | null>(null);
  const [activeChatMessages, setActiveChatMessages] = React.useState<Message[]>([]);
  const [isLoadingChat, setIsLoadingChat] = React.useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);
  const [chatError, setChatError] = React.useState<string | null>(null);

  // --- Hooks --- 
  const { notification } = useNotification();
  const { user: authUser, loading: authLoading } = useAuth();
  const { t } = useTranslation('common');

  // --- Derived State --- 
  const userRole: UserRole = currentUserId === seller.id ? 'seller' : 'buyer';
  const otherParty = userRole === 'seller' ? buyer : seller;

  // --- Effects --- 
  React.useEffect(() => {
    if (currentUserId) {
      userOperations.getUserById(currentUserId)
        .then(profile => {
          if (profile) {
            setCurrentUserProfile(profile);
            console.log('Current user profile fetched:', profile.id);
          } else {
            console.error('Could not fetch current user profile');
            setChatError('Could not load your profile data.');
          }
        })
        .catch(err => {
          console.error('Error fetching current user profile:', err);
          setChatError('Error loading your profile data.');
        });
    }
  }, [currentUserId]);

  React.useEffect(() => {
    console.log(`Current user role: ${userRole}`);
    console.log('Other party details:', otherParty);
    console.log('OrderDetailsClient received milestones:', initialMilestonesData);
  }, [userRole, otherParty, initialMilestonesData]);

  // --- Chat Handlers --- 
  const handleOpenChat = async () => {
    if (!currentUserProfile || !otherParty || isLoadingChat) {
      console.warn('Cannot open chat: Missing user profiles or already loading.');
      if (!currentUserProfile) setChatError(t('orders.details.chatError'));
      return;
    }
    setIsLoadingChat(true);
    setChatError(null);
    console.log(`Attempting to find/create chat between Buyer ${contract.buyer_id} and Seller ${contract.seller_id}`);

    try {

      console.log(`Attempting to find/create chat between Buyer ${contract.buyer_id} and Seller ${contract.seller_id} for contract ${contract.id}`);
      const chat = await chatOperations.getContractChat(contract.buyer_id, contract.seller_id, contract.id);

      console.log('Chat found/created:', chat);
      if (chat) {
        console.log('Chat found/created:', chat.id);
        setActiveChat(chat);
        const messages = await chatOperations.getChatMessages(chat.id);
        setActiveChatMessages(messages);
      } else {
        throw new Error('Could not find or create a chat.');
      }
    } catch (err: any) {
      console.error('Error opening chat:', err);
      setChatError(err.message || t('orders.details.failedToOpenChat'));
      notification({
        type: 'foreground',
        title: t('orders.details.chatError'),
        description: err.message || t('orders.details.failedToOpenChat')
      });
    }
    setIsLoadingChat(false);
  };

  const handleCloseChat = () => {
    setActiveChat(null);
    setActiveChatMessages([]);
    setChatError(null);
    console.log('Chat closed');
  };

  // --- Other Event Handlers (handleConfirmPayment, handleDownload, handleUpload) --- 
  const handleConfirmPayment = async (milestoneId: string) => {
    if (userRole !== 'buyer') {
      notification({
        type: 'foreground',
        title: t('orders.details.actionDenied'),
        description: t('orders.details.buyerOnlyConfirm')
      });
      return;
    }
    if (isConfirming) return;
    setIsConfirming(milestoneId);
    console.log(`Calling server action to confirm payment for milestone ${milestoneId}`);

    const result = await confirmMilestonePayment(milestoneId);

    // Add a chat message for milestone_completed

    let chat = await chatOperations.getContractChat(contract.buyer_id, contract.seller_id, contract.id);

    if (chat) {

      const milestone = mappedMilestones.find(m => m.id === milestoneId);
      const milestoneActivatedMessage = await chatOperations.sendMessage({
        chat_id: chat.id,
        message_type: 'milestone_completed',
        content: 'Milestone completed',
        sender_id: contract.buyer_id,
        data: {
          contractId: contract.id,
          status: 'completed',
          description: milestone?.description || 'N/A',
          amount: milestone?.amount || 'N/A',
          sequence: milestone?.sequence || 1,
          currency: contract.currency || 'USD',
        }
      });
    }

    if (result.success) {
      notification({
        type: 'foreground',
        title: t('orders.details.success'),
        description: t('orders.details.milestoneConfirmed'),
      });
    } else {
      notification({
        type: 'foreground',
        title: t('orders.details.error'),
        description: result.error || t('orders.details.failedToConfirm'),
      });
    }
    setIsConfirming(null);
  };

  const handleDownload = (fileUrl: string) => {
    console.log(`Downloading file from ${fileUrl}`);
    window.open(fileUrl, '_blank');
  };

  const handleUpload = async (files: File[]) => {
    console.log(`handleUpload called with ${files.length} files`);
    if (userRole !== 'seller') {
      notification({
        type: 'foreground',
        title: t('orders.details.actionDenied'),
        description: t('orders.details.sellerOnlyUpload')
      });
      return;
    }

    if (!files || files.length === 0) {
      notification({
        type: 'foreground',
        title: t('orders.details.noFiles'),
        description: t('orders.details.selectFiles')
      });
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    try {
      const result = await uploadContractAttachments(contract.id, formData);
      if (result.success) {
        notification({
          type: 'foreground',
          title: t('orders.details.uploadSuccess'),
          description: result.message || `${files.length} file(s) uploaded.`
        });
      } else {
        throw new Error(result.error || t('orders.details.couldNotUpload'));
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      notification({
        type: 'foreground',
        title: t('orders.details.uploadFailed'),
        description: error.message || t('orders.details.couldNotUpload'),
      });
    }
  };

  // --- Rehire Handler --- 
  const handleRehireClick = () => {
    console.log(`Rehiring user: ${otherParty.full_name} (ID: ${otherParty.id})`);
    notification({
      type: 'foreground',
      title: t('orders.details.rehireInitiated'),
      description: t('orders.details.rehireSuccess', { name: otherParty.full_name })
    });
  };
  // --- End Rehire Handler ---

  // --- Prepare data for child components --- 

  const contractDetailItems = [
    { label: t('chatDetails.contractId'), value: `#${contract.id.substring(0, 6)}` },
    { label: t('chatDetails.startDate'), value: contract.created_at ? new Date(contract.created_at).toLocaleDateString() : 'N/A' },
  ];

  const workFileItems = contract.attachments?.map(file => ({
    id: file.url,
    name: file.name,
    size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    date: contract.created_at ? new Date(contract.created_at).toLocaleString() : 'N/A',
  })) || [];

  const currency = contract.currency || 'USD';
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'CNY' ? '¥' : '$';

  const financialData = {
    totalAmount: `${currencySymbol}${initialMilestonesData.reduce((acc, m) => acc + (m.amount ?? 0), 0).toFixed(2)}`,
    received: `${currencySymbol}${initialMilestonesData.reduce((acc, m) => acc + (m.status === 'paid' || m.status === 'approved' ? (m.amount ?? 0) : 0), 0).toFixed(2)}`,
    inEscrow: `${currencySymbol}${initialMilestonesData.reduce((acc, m) => acc + (m.status === 'pending' || m.status === 'rejected' ? (m.amount ?? 0) : 0), 0).toFixed(2)}`,
    refunded: `${currencySymbol}0.00`,
  };

  let mappedMilestones = initialMilestonesData.map(m => {
    let displayStatus: 'completed' | 'pending' | 'in-progress';
    switch (m.status) {
      case 'approved':
      case 'paid':
        displayStatus = 'completed';
        break;
      case 'rejected':
      case 'pending':
      default:
        displayStatus = 'pending';
        break;
    }

    const displayDate = m.due_date ? new Date(m.due_date).toLocaleString()
      : m.updated_at ? new Date(m.updated_at).toLocaleString()
        : m.created_at ? new Date(m.created_at).toLocaleString()
          : undefined;

    return {
      id: m.id,
      title: m.description,
      amount: String(m.amount ?? 0),
      description: m.description,
      status: displayStatus,
      date: displayDate,
      sequence: m.sequence,
      created_at: m.created_at
    };
  });

  // sort the milestones by sequence number and then created_at
  mappedMilestones.sort((a, b) => {
    if (a.sequence === b.sequence) {
      if (a.created_at && b.created_at) {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      else {
        return 0;
      }
    }
    return a.sequence - b.sequence;
  });

  console.log('OrderDetailsClient mapped milestones for section:', mappedMilestones);

  return (
    <div className="container mx-auto py-8 max-w-[1200px]">

      <ProfileSection
        userRole={userRole}
        name={otherParty.full_name}
        rating={4.9}
        totalReviews={125}
        specialty={otherParty.bio || (otherParty.user_type === 'seller' ? 'Seller' : 'Buyer')}
        avatarUrl={otherParty.avatar_url || undefined}
        onMessageClick={handleOpenChat}
        isMessagingLoading={isLoadingChat}
        onRehireClick={handleRehireClick}
        disabled={!currentUserProfile || authLoading}
      />

      <FinancialSummary {...financialData} />

      <div className="flex gap-[24px] max-w-[1200px]">
        <div className="w-full md:w-[614px] md:max-w-none">
          <MilestoneSection
            currency={currency}
            userRole={userRole}
            contractId={contract.id}
            milestones={mappedMilestones}
            onConfirmPayment={handleConfirmPayment}
            isConfirmingId={isConfirming}
          />
        </div>
        <div className="w-full md:w-[562px] md:max-w-none">
          <ContractDetails
            contractName={contract.title}
            details={contractDetailItems}
          />
          <WorkFiles
            userRole={userRole}
            files={workFileItems}
            onDownload={handleDownload}
            onUpload={handleUpload}
          />
        </div>
      </div>

      {activeChat && currentUserProfile && otherParty && (
        <ChatPopupWrapper
          key={activeChat.id}
          chat={activeChat}
          initialMessages={activeChatMessages}
          currentUserProfile={currentUserProfile}
          otherUserProfile={otherParty}
          currentUserId={currentUserId}
          isLoadingMessages={isLoadingMessages}
          onClose={handleCloseChat}
          position="bottom-right"
        />
      )}

      {chatError && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50" role="alert">
          <strong className="font-bold">Chat Error: </strong>
          <span className="block sm:inline">{chatError}</span>
        </div>
      )}

    </div>
  );
} 