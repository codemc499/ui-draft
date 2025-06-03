'use client';

import React, { useState, useEffect, useRef, useCallback, Fragment, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import supabase from '@/utils/supabase/client';
import { chatOperations, contractOperations, jobOperations } from '@/utils/supabase/database';
import { Chat, Message, User, MessageSchema, BaseFileData, MusicItem } from '@/utils/supabase/types';
import {
  ImageMessageData,
  OfferMessageData,
  MilestoneEventData,
  SystemEventData,
} from '@/utils/supabase/message-data-types';
import { format, isSameDay, formatRelative, parseISO, isToday, isYesterday } from 'date-fns';
import * as Avatar from '@/components/ui/avatar';
import { Root as Button } from '@/components/ui/button';
import { Root as Textarea } from '@/components/ui/textarea';
import { Root as LinkButton } from '@/components/ui/link-button';
import * as FancyButton from '@/components/ui/fancy-button';
import { Paperclip, Send, Smile, MoreVertical, Clock, XCircle, FileImage, CheckCircle, SendIcon, LoaderCircle, X } from 'lucide-react';
import Link from 'next/link';
import * as FileFormatIcon from '@/components/ui/file-format-icon';
import { useAudioPlayer } from '@/contexts/AudioContext';
import { ContractDetails } from '../orders/detail/contract-details';
import { useRouter } from 'next/navigation';
import i18n from '@/i18n';
import { RiLoader4Line } from '@remixicon/react';
import { useNotification } from '@/hooks/use-notification';


// --- Moved formatBytes function to top level --- 
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
// --- End moved function --- 

function formatMessageTimestamp(timestamp: string | null | undefined): string {
  if (!timestamp) return '';
  try {
    const date = parseISO(timestamp);
    // Return the time in 24 hour format
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
}


function formatDateSeparator(dateKey: string | null | undefined, t: (key: string) => string): string {
  if (!dateKey) return t('chat.dateUnknown');
  try {
    const date = parseISO(dateKey);

    if (isToday(date)) {
      return t('chat.today');
    }
    if (isYesterday(date)) {
      return t('chat.yesterday');
    }
    return format(date, 'MMM d, yyyy');

  } catch (error) {
    console.error('Error formatting date separator:', error);
    return t('chat.dateError');
  }
}

interface GroupedMessages {
  [date: string]: Message[];
}

function groupMessagesByDate(messages: Message[]): GroupedMessages {
  return messages.reduce((groups, message) => {
    if (!message.created_at) return groups;
    const messageDate = parseISO(message.created_at);
    const dateKey = format(messageDate, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as GroupedMessages);
}

interface ChatCoreProps {
  chat: Chat;
  initialMessages: Message[];
  currentUserProfile: User | null;
  otherUserProfile: User | null;
  currentUserId: string;
  isPopup?: boolean;
  onClose?: () => void;
}

interface SellerInfo {
  name: string;
  avatarUrl: string | null;
}

interface ChatMessageRendererProps {
  message: Message;
  isCurrentUser: boolean;
  senderProfile: User | null;
  timestamp: string;
  senderName: string;
  isSeller: boolean;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

function ChatMessageRenderer({
  message,
  isCurrentUser,
  senderProfile,
  timestamp,
  senderName,
  isSeller,
  setMessages,
}: ChatMessageRendererProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const audioPlayer = useAudioPlayer();
  const alignmentContainerClass = isCurrentUser ? 'justify-end' : 'justify-start';
  const alignmentItemsClass = isCurrentUser ? 'items-end' : 'items-start';
  const bubbleBaseClass = 'p-3 rounded-xl shadow-sm';
  const userBubbleClass = 'bg-blue-500 text-white rounded-br-none';
  const otherBubbleClass = 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none';

  const bubbleClass = isCurrentUser ? userBubbleClass : otherBubbleClass;
  const cardClass = 'border dark:border-gray-600 rounded-lg p-3 max-w-xs w-full bg-white dark:bg-gray-800 shadow-md';
  const cardTextColor = 'text-gray-900 dark:text-gray-100';
  const cardSubTextColor = 'text-gray-600 dark:text-gray-400';
  const plainTextColor = 'text-gray-800 dark:text-gray-100';
  const messageContentMaxWidth = 'max-w-[85%]';
  const [isAccepting, setIsAccepting] = useState(false);
  const { notification: toast } = useNotification();

  // const renderOfferMessage = (isCurrentUser: boolean) => {
  //   const offerData = message.data as OfferMessageData | null;
  //   if (!offerData) return <p className='italic text-xs text-gray-500'>[Offer data missing]</p>;

  //   const truncatedDescription = offerData.description
  //     ? (offerData.description.length > 80 ? offerData.description.substring(0, 80) + '...' : offerData.description)
  //     : 'No description provided.';

  //   const isRecipient = !isCurrentUser;

  //   return (
  //     <div className={cardClass}>
  //       <div className="flex justify-between items-start mb-2">
  //         <h4 className={`font-semibold text-base mr-2 ${cardTextColor}`} title={offerData.title}>
  //           {offerData.title || "Custom Offer"}kkk
  //         </h4>
  //         <span className="font-bold text-base text-blue-600 dark:text-blue-400 flex-shrink-0">
  //           {offerData.currency || '$'}{offerData.price?.toFixed(2) ?? '0.00'}
  //         </span>
  //       </div>

  //       <p className={`text-sm mb-3 ${cardSubTextColor}`}>
  //         {truncatedDescription}
  //       </p>

  //       <div className={`flex items-center text-sm mb-4 ${cardSubTextColor}`}>
  //         <Clock size={16} className="mr-2 flex-shrink-0" />
  //         <span>Delivery: {offerData.deliveryTime || 'Not specified'}</span>
  //       </div>

  //       <div className="flex flex-col space-y-2">
  //         <LinkButton
  //           asChild
  //           variant="primary"
  //           size="small"
  //           className="w-full justify-center"
  //         >
  //           <Link href={`/offers/${offerData.contractId}`}>
  //             View Offer Details
  //           </Link>
  //         </LinkButton>

  //         {isRecipient && (
  //           <div className="flex justify-end space-x-2 pt-2 border-t dark:border-gray-600">
  //             <Button variant="neutral" mode="stroke" size="small">Decline</Button>
  //             <Button variant="primary" mode="filled" size="small">Accept</Button>
  //           </div>
  //         )}
  //       </div>

  //       {message.content && (
  //         <p className={`text-sm mt-3 pt-3 border-t dark:border-gray-600 whitespace-pre-wrap ${cardTextColor}`}>
  //           {message.content}
  //         </p>
  //       )}
  //     </div>
  //   );
  // };

  // const renderMilestoneEventMessage = () => {
  //   const eventData = message.data as MilestoneEventData | null;
  //   if (!eventData) return <p className='italic text-xs text-gray-500'>[Milestone data missing]</p>;

  //   const truncatedDescription = eventData.description
  //     ? (eventData.description.length > 50 ? eventData.description.substring(0, 50) + '...' : eventData.description)
  //     : 'Milestone details';

  //   const isCompleted = eventData.status === 'completed';
  //   const Icon = isCompleted ? CheckCircle : Clock;
  //   const iconColor = isCompleted ? 'text-green-500' : 'text-blue-500';

  //   return (
  //     <div className={cardClass}>
  //       <div className="flex items-start mb-2">
  //         <Icon size={18} className={`mr-2 mt-0.5 flex-shrink-0 ${iconColor}`} />
  //         <div>
  //           <h4 className={`font-medium text-base ${cardTextColor}`} title={eventData.description}>
  //             Milestone: &quot;{truncatedDescription}&quot;
  //           </h4>
  //           {eventData.amount != null && (
  //             <p className={`text-sm mt-1 ${cardSubTextColor}`}>
  //               Amount: {eventData.currency || '$'}{eventData.amount.toFixed(2)}
  //             </p>
  //           )}
  //         </div>
  //       </div>

  //       <LinkButton
  //         asChild
  //         variant="primary"
  //         size="small"
  //         className="w-full justify-center mt-2"
  //       >
  //         <Link href={`/orders/detail/${eventData.contractId}`}>
  //           View Contract
  //         </Link>
  //       </LinkButton>
  //     </div>
  //   );
  // };

  const renderSystemEventMessage = () => {
    const eventData = message.data as SystemEventData | null;
    const textToShow = eventData?.eventText || message.content || '[System Event]';

    return (
      <div className="text-center w-full my-4 px-4">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {textToShow} — {timestamp}
        </span>
      </div>
    );
  };

  const handleAudioClick = () => {
    const trackData = message.data?.[0];
    if (!trackData || !senderProfile) return;

    const track: MusicItem = {
      url: trackData.url,
      title: trackData.name,
    };

    const seller: SellerInfo = {
      name: senderProfile.full_name || senderProfile.username || 'Unknown Seller',
      avatarUrl: senderProfile.avatar_url || null,
    };

    if (audioPlayer.currentTrack?.url === track.url) {
      // Toggle play/pause if same track
      audioPlayer.togglePlayPause();
    } else {
      // Load and play new track
      audioPlayer.loadTrack(track, seller);
    }
  };


  let contentElement = null;

  if (message.message_type === 'system_event') {
    return renderSystemEventMessage();
  }

  // if (message.message_type !== 'text' && message.message_type !== 'image') {
  //   switch (message.message_type) {
  //     case 'offer':
  //       contentElement = renderOfferMessage(isCurrentUser);
  //       break;
  //     case 'milestone_activated':
  //     case 'milestone_completed':
  //       contentElement = renderMilestoneEventMessage();
  //       break;
  //     default:
  //       contentElement = (
  //         <p className={`text-sm italic ${plainTextColor}`}>
  //           [Unsupported message type: {message.message_type}] {message.content || ''}
  //         </p>
  //       );
  //       break;
  //   }
  // }

  const updateOfferStatus = async (status: string) => {
    if (isAccepting) {
      return;
    }

    console.log('updateOfferStatus', status);

    if (status == 'cancelled' && isSeller) {
      console.log('Cannot cancel offer as a seller');
      return;
    }

    if (status == 'accepted' && !isSeller) {
      console.log('Cannot accept offer as a buyer');
      return;
    }

    if (status == 'declined' && !isSeller) {
      console.log('Cannot decline offer as a buyer');
      return;
    }

    if (status == 'accepted' && message.data?.contractDetails) {
      setIsAccepting(true);
      const { deadline, milestones, ...contractData } = message.data.contractDetails;

      try {
        // Check if any contract already exists for this job
        const { data: existingContracts, error: existingContractsError } = await supabase
          .from('contracts')
          .select('id')
          .eq('job_id', contractData.job_id)
          .not('status', 'eq', 'cancelled');

        if (existingContractsError) {
          toast({
            description: t('chat.failedToCheckExistingContracts'),
            notificationType: 'error',
          });
          setIsAccepting(false);
          return;
        }

        if (existingContracts && existingContracts.length > 0) {
          toast({
            description: t('chat.jobAlreadyHasContract'),
            notificationType: 'error',
          });
          setIsAccepting(false);
          return;
        }

        // Check buyer's balance first
        const { data: buyerData, error: buyerError } = await supabase
          .from('users')
          .select('balance')
          .eq('id', contractData.buyer_id)
          .single();

        if (buyerError || !buyerData) {
          toast({
            description: t('chat.failedToVerifyBuyerBalance'),
            notificationType: 'error',
          });
          setIsAccepting(false);
          return;
        }

        const buyerBalance = buyerData.balance || 0;
        let requiredAmount = 0;

        // Calculate required amount based on contract type
        if (contractData.contract_type === 'one-time') {
          requiredAmount = contractData.amount;
        } else if (milestones?.length) {
          requiredAmount = milestones.reduce((sum: number, m: any) => sum + (m.amount || 0), 0);
        }

        // Check if buyer has sufficient balance
        if (buyerBalance < requiredAmount) {
          toast({
            description: t('chat.insufficientBalance'),
            notificationType: 'error',
          });
          setIsAccepting(false);
          return;
        }

        // Create Contract
        const { data: newContract, error: contractError } = await supabase
          .from('contracts')
          .insert(contractData)
          .select('id, buyer_id, seller_id')
          .single();

        if (contractError || !newContract) {
          console.error('Contract creation failed:', contractError);
          throw contractError || new Error('Failed to create contract record');
        }
        console.log('Contract created successfully:', newContract);

        // Create a new chat for the contract
        const newChat = await chatOperations.createChat({
          buyer_id: contractData.buyer_id,
          seller_id: contractData.seller_id,
          contract_id: newContract.id
        });

        // Handle milestones and balance deduction
        let milestoneInsertError: any = null;
        if (contractData.contract_type === 'one-time') {
          console.log('Creating single milestone for one-time payment.');
          // Deduct full amount for one-time payment
          const { error: balanceError } = await supabase
            .from('users')
            .update({ balance: buyerBalance - contractData.amount })
            .eq('id', contractData.buyer_id);

          if (balanceError) {
            throw new Error('Failed to update buyer balance');
          }

          // Create a single milestone for one-time payment
          const singleMilestoneData = {
            contract_id: newContract.id,
            description: contractData.title,
            amount: contractData.amount,
            due_date: deadline,
            status: 'pending',
            sequence: 1,
          };
          const { error } = await supabase
            .from('contract_milestones')
            .insert(singleMilestoneData);

          if (newChat) {
            await chatOperations.sendMessage({
              chat_id: newChat.id,
              message_type: 'milestone_activated',
              content: 'Milestone activated',
              sender_id: contractData.buyer_id,
              data: {
                contractId: newContract.id,
                status: 'in_progress',
                description: contractData.title,
                amount: contractData.amount,
                sequence: 1,
                currency: contractData.currency,
              }
            });
          }

          milestoneInsertError = error;
        } else if (milestones?.length) {
          console.log(`Creating ${milestones.length} milestones for installment payment.`);

          // Deduct amount for all milestones
          const { error: balanceError } = await supabase
            .from('users')
            .update({ balance: buyerBalance - requiredAmount })
            .eq('id', contractData.buyer_id);

          if (balanceError) {
            throw new Error('Failed to update buyer balance');
          }

          // Create milestones from form for installment payment
          const milestoneData = milestones.map((m: any, index: number) => ({
            contract_id: newContract.id,
            description: m.description,
            amount: m.amount,
            due_date: m.dueDate || null,
            status: 'pending',
            sequence: index + 1,
          }));
          const { error } = await supabase
            .from('contract_milestones')
            .insert(milestoneData);
          milestoneInsertError = error;

          if (newChat) {
            await chatOperations.sendMessage({
              chat_id: newChat.id,
              message_type: 'milestone_activated',
              content: 'Milestone activated',
              sender_id: contractData.buyer_id,
              data: {
                contractId: newContract.id,
                status: 'in_progress',
                description: milestones[0].description,
                amount: milestones[0].amount,
                sequence: 1,
                currency: contractData.currency,
              }
            });
          }
        }

        if (milestoneInsertError) {
          // Rollback balance update if milestone creation fails
          if (contractData.contract_type === 'one-time') {
            await supabase
              .from('users')
              .update({ balance: buyerBalance })
              .eq('id', contractData.buyer_id);
          } else if (milestones?.length) {
            await supabase
              .from('users')
              .update({ balance: buyerBalance })
              .eq('id', contractData.buyer_id);
          }
          throw milestoneInsertError;
        }

        // Update job status
        const updatedJob = await jobOperations.updateJob(contractData.job_id, {
          status: 'in_progress',
        });

        // Update message status
        const updatedMessage = await chatOperations.updateMessageData(message.id, {
          ...message.data,
          status: status,
          contractId: newContract.id,
        });

        setMessages((prevMessages) => {
          return prevMessages.map((m) => {
            if (m.id === message.id) {
              return { ...m, data: { ...m.data, status: status } } as Message;
            }
            return m;
          });
        });

        toast({
          description: t('chat.contractCreated'),
          notificationType: 'success',
        });

        const currentLang = i18n.language;
        router.push(`/${currentLang}/orders/detail/${newContract.id}`);

      } catch (error) {
        console.error('Error in contract creation:', error);
        toast({
          description: t('chat.failedToCreateContract'),
          notificationType: 'error',
        });
      } finally {
        setIsAccepting(false);
      }
    } else {
      const updatedMessage = await chatOperations.updateMessageData(message.id, {
        ...message.data,
        status: status,
      });

      setMessages((prevMessages) => {
        return prevMessages.map((m) => {
          if (m.id === message.id) {
            return { ...m, data: { ...m.data, status: status } } as Message;
          }
          return m;
        });
      });
    }
  }

  const updateHireStatus = async (status: string) => {

    console.log('updateHireStatus', status);

    if (status == 'cancelled' && isSeller) {
      console.log('Cannot cancel hiring request as a seller');
      return;
    }

    if (status == 'accepted' && !isSeller) {
      console.log('Cannot accept hiring request as a buyer');
      return;
    }

    if (status == 'declined' && !isSeller) {
      console.log('Cannot decline hiring request as a buyer');
      return;
    }

    const updatedMessage = await chatOperations.updateMessageData(message.id, {
      ...message.data,
      status: status,
    });


    setMessages((prevMessages) => {
      return prevMessages.map((m) => {
        if (m.id === message.id) {
          return { ...m, data: { ...m.data, status: status } } as Message;
        }
        return m;
      });
    });
  }

  return (
    <div className={`flex gap-2 w-full ${alignmentContainerClass} ${!isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className='flex flex-col w-full'>
        <p className={`text-[12px] text-[#525866] font-medium ${!isCurrentUser ? 'text-left' : 'text-right'}`}>{`${senderName} ${timestamp}`}</p>
        {(message.message_type === 'text' || message.message_type === 'image') && <p className={`text-[12px] text-[#525866] break-all ${!isCurrentUser ? 'text-left pr-[30%]' : 'text-right pl-[30%]'}`}>{message.content}</p>}
        {message.message_type === 'image' && (
          <div className={`flex flex-col gap-2 mt-2 ${isCurrentUser ? 'items-end' : 'items-start'} w-full`}>
            <div className='flex flex-col w-40'>
              <a href={message.data?.[0]?.url} target='_blank' rel='noopener noreferrer'>
                <img src={message.data?.[0]?.url} alt={message.data?.[0]?.name} className='rounded-md p-2 w-40 h-32 rounded-md object-contain' />
              </a>
              <div className='flex flex-row justify-between w-full'>
                <p title={message.data?.[0]?.name} className={`w-1/2 text-[12px] text-[#525866] ${!isCurrentUser ? 'text-left' : 'text-left'} truncate`}>{message.data?.[0]?.name}</p>
                <p title={formatBytes(message.data?.[0]?.size)} className={`w-1/2 text-[12px] text-[#525866] ${!isCurrentUser ? 'text-right' : 'text-right'}`}>{formatBytes(message.data?.[0]?.size)}</p>
              </div>
            </div>
          </div>
        )}
        {message.message_type === 'audio' && message.data?.[0] && (
          <div className={`flex flex-col gap-1 mt-1 ${isCurrentUser ? 'items-end' : 'items-start'} w-full overflow-hidden`}>
            <button
              type="button"
              onClick={handleAudioClick}
              className={`flex items-center text-left gap-3 rounded-lg border p-3 max-w-[250px] ${isCurrentUser ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'} hover:bg-opacity-80 transition-colors overflow-hidden w-full`}
            >
              <FileFormatIcon.Root format="MP3" color="blue" />
              <div className='flex-1 space-y-0.5 min-w-0'>
                <div
                  className='block w-full text-xs font-medium text-gray-800 dark:text-gray-100 truncate overflow-hidden'
                  title={message.data[0].name}
                >
                  {message.data[0].name}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {formatBytes(message.data[0].size)} - {t('chat.clickToPlay')}
                </div>
              </div>
            </button>
            {message.content && (
              <p className={`text-[12px] text-[#525866] break-words whitespace-pre-wrap mt-1 ${!isCurrentUser ? 'text-left pr-[30%]' : 'text-right pl-[30%]'}`}>
                {message.content}
              </p>
            )}
          </div>
        )}
        {message.message_type === 'offer' && (
          <div className={`mt-2 flex flex-col gap-2 w-full ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            <div className={`flex flex-col gap-2 w-1/2 min-w-[16rem]`}>
              <div className='flex flex-row gap-1 items-center'>
                <p className='text-[12px] text-[#525866]'>{t('chat.offer')}</p>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12ZM6 10.8C7.27304 10.8 8.49394 10.2943 9.39411 9.39411C10.2943 8.49394 10.8 7.27304 10.8 6C10.8 4.72696 10.2943 3.50606 9.39411 2.60589C8.49394 1.70571 7.27304 1.2 6 1.2C4.72696 1.2 3.50606 1.70571 2.60589 2.60589C1.70571 3.50606 1.2 4.72696 1.2 6C1.2 7.27304 1.70571 8.49394 2.60589 9.39411C3.50606 10.2943 4.72696 10.8 6 10.8ZM5.4 3H6.6V4.2H5.4V3ZM5.4 5.4H6.6V9H5.4V5.4Z" fill="#525866" />
                </svg>
              </div>
              <div className='flex flex-col rounded-lg border border-[#E1E4EA] min-w-[16rem]'>
                <div className='flex flex-row justify-between bg-[#F5F7FA] rounded-t-lg p-2'>
                  <p className='text-[14px] text-[#0E121B] font-medium'>{message.data?.title}</p>
                  <p className='text-[16px] text-[#0E121B] font-medium'>{`${message.data?.currency === 'USD' ? '$' : message.data?.currency === 'EUR' ? '€' : message.data?.currency === 'GBP' ? '£' : message.data?.currency === 'CNY' ? '¥' : '$'}${message.data?.price}`}</p>
                </div>
                <div className='flex flex-col p-2 gap-1 border-b border-[#E1E4EA]'>
                  <p className='text-[12px] text-[#0E121B] border-b border-[#E1E4EA] pb-2 mb-1'>{message.data?.description}</p>
                  <p className='text-[#0E121B] text-[12px] font-medium'>{t('chat.yourOfferIncludes')}</p>
                  <div className='flex flex-row gap-2 items-center'>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12ZM6 10.8C7.27304 10.8 8.49394 10.2943 9.39411 9.39411C10.2943 8.49394 10.8 7.27304 10.8 6C10.8 4.72696 10.2943 3.50606 9.39411 2.60589C8.49394 1.70571 7.27304 1.2 6 1.2C4.72696 1.2 3.50606 1.70571 2.60589 2.60589C1.70571 3.50606 1.2 4.72696 1.2 6C1.2 7.27304 1.70571 8.49394 2.60589 9.39411C3.50606 10.2943 4.72696 10.8 6 10.8ZM6.6 6H9V7.2H5.4V3H6.6V6Z" fill="#525866" />
                    </svg>

                    <p className='text-[#525866] text-[12px] leading-none'>{message.data?.deliveryTime}</p>
                  </div>
                </div>

                <div className='flex flex-row justify-between w-full p-2 gap-3'>
                  {!isSeller ? (
                    <>
                      {/* Seller sees Cancel / Edit */}
                      <Button
                        variant='neutral'
                        mode='stroke'
                        size='small'
                        className={`w-1/2 ${message?.data?.status !== 'pending' ? 'invisible' : ''}`}
                        onClick={() => updateOfferStatus('cancelled')}
                        disabled={message?.data?.status === 'accepted' || message?.data?.status === 'declined' || message?.data?.status === 'cancelled'}
                      >
                        {t('chat.cancel')}
                      </Button>
                      <FancyButton.Root className='w-1/2' size='small' disabled={message?.data?.status !== 'pending'}>
                        {message?.data?.status === 'pending' ? t('chat.edit') : message?.data?.status === 'accepted' ? t('chat.accepted') : message?.data?.status === 'declined' ? t('chat.declined') : message?.data?.status === 'cancelled' ? t('chat.cancelled') : ''}
                      </FancyButton.Root>
                    </>
                  ) : (
                    <>
                      {/* Buyer sees Decline / Accept */}
                      <Button
                        variant='neutral'
                        mode='stroke'
                        size='small'
                        className={`w-1/2 ${message?.data?.status !== 'pending' ? 'invisible' : ''}`}
                        onClick={() => updateOfferStatus('declined')}
                        disabled={message?.data?.status === 'accepted' || message?.data?.status === 'declined' || message?.data?.status === 'cancelled'}
                      >
                        {t('chat.decline')}
                      </Button>
                      <FancyButton.Root
                        className="w-1/2"
                        size="small"
                        disabled={message?.data?.status === 'accepted' || message?.data?.status === 'declined' || message?.data?.status === 'cancelled'}
                        onClick={() => updateOfferStatus('accepted')}
                      >
                        {!isAccepting && (message?.data?.status === 'pending' ? t('chat.accept') : message?.data?.status === 'accepted' ? t('chat.accepted') : message?.data?.status === 'declined' ? t('chat.declined') : message?.data?.status === 'cancelled' ? t('chat.cancelled') : t('chat.accept'))}
                        {isAccepting && message?.data?.status === 'pending' && <FancyButton.Icon as={RiLoader4Line} className='animate-spin' />}

                      </FancyButton.Root>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Show Service Name, Description and Price with Accept and Decline Button on Seller Side and Cancel on Buyer Side */}
        {message.message_type === 'hire_request' && (
          <div className={`mt-2 flex flex-col gap-2 w-full ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            <div className={`flex flex-col gap-2 w-1/2 min-w-[16rem]`}>
              <div className='flex flex-row gap-1 items-center'>
                <p className='text-[12px] text-[#525866]'>{t('chat.hireRequest')}</p>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12ZM6 10.8C7.27304 10.8 8.49394 10.2943 9.39411 9.39411C10.2943 8.49394 10.8 7.27304 10.8 6C10.8 4.72696 10.2943 3.50606 9.39411 2.60589C8.49394 1.70571 7.27304 1.2 6 1.2C4.72696 1.2 3.50606 1.70571 2.60589 2.60589C1.70571 3.50606 1.2 4.72696 1.2 6C1.2 7.27304 1.70571 8.49394 2.60589 9.39411C3.50606 10.2943 4.72696 10.8 6 10.8ZM5.4 3H6.6V4.2H5.4V3ZM5.4 5.4H6.6V9H5.4V5.4Z" fill="#525866" />
                </svg>


              </div>
              <div className='flex flex-col rounded-lg border border-[#E1E4EA] min-w-[16rem]'>
                <div className='flex flex-row justify-between bg-[#F5F7FA] rounded-t-lg p-2'>
                  <p className='text-[14px] text-[#0E121B] font-medium'>{message.data?.title}</p>
                  <p className='text-[16px] text-[#0E121B] font-medium'>${message.data?.price}</p>
                </div>
                <div className='flex flex-col p-2 gap-1 border-b border-[#E1E4EA]'>
                  <p className='text-[12px] text-[#0E121B] border-b border-[#E1E4EA] pb-2 mb-1'>{message.data?.description}</p>
                  <p className='text-[#0E121B] text-[12px] font-medium'>{t('chat.hireRequest')}</p>

                </div>
                <div className='flex flex-row justify-between w-full p-2 gap-3'>
                  {!isSeller ? (
                    <>
                      {/* Seller sees Cancel / Edit */}


                      <Button
                        variant='neutral'
                        mode='stroke'
                        size='small'
                        className={`w-1/2 ${message?.data?.status !== 'pending' ? 'invisible' : ''}`}
                        onClick={() => updateHireStatus('cancelled')}
                        disabled={message?.data?.status === 'accepted' || message?.data?.status === 'declined' || message?.data?.status === 'cancelled'}
                      >
                        {message?.data?.status === 'accepted' ? t('chat.accepted') : message?.data?.status === 'declined' ? t('chat.declined') : message?.data?.status === 'cancelled' ? t('chat.cancelled') : t('chat.cancel')}
                      </Button>

                      <FancyButton.Root className='w-1/2' size='small' onClick={() => {
                        const currentLang = i18n.language;
                        router.push(`/${currentLang}/services/${message?.data?.service_id}`);
                      }}>
                        {t('chat.view')}
                      </FancyButton.Root>

                    </>
                  ) : (
                    <>
                      {/* Buyer sees Decline / Accept */}
                      <Button
                        variant='neutral'
                        mode='stroke'
                        size='small'
                        className={`w-1/2 ${message?.data?.status !== 'pending' ? 'invisible' : ''}`}
                        onClick={() => updateHireStatus('declined')}
                        disabled={message?.data?.status === 'accepted' || message?.data?.status === 'declined' || message?.data?.status === 'cancelled'}
                      >
                        {t('chat.decline')}
                      </Button>
                      <FancyButton.Root
                        className="w-1/2"
                        size="small"
                        disabled={message?.data?.status === 'accepted' || message?.data?.status === 'declined' || message?.data?.status === 'cancelled'}
                        onClick={() => updateHireStatus('accepted')}
                      >
                        {message?.data?.status === 'accepted' ? t('chat.accepted') : message?.data?.status === 'declined' ? t('chat.declined') : message?.data?.status === 'cancelled' ? t('chat.cancelled') : t('chat.accept')}
                      </FancyButton.Root>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {(message.message_type === 'milestone_completed' || message.message_type === 'milestone_activated') && (
          <div className={`flex flex-col gap-2 w-full ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            <div className={`flex flex-col gap-2 w-1/2 min-w-[16rem]`}>
              <div className='flex flex-row gap-1 items-center'>
                <p className='text-[12px] text-[#525866]'>
                  {message.data.status && message.data.status === 'completed'
                    ? t('chat.milestone.completed')
                    : t('chat.milestone.activated')}
                </p>
              </div>
              <div className='flex flex-col gap-2 rounded-lg bg-[#F5F7FA] p-2 min-w-[16rem]'>
                <p className='text-[14px] text-[#0E121B]'>Milestone {message.data?.sequence}: &quot;{message.data?.description}&quot;</p>
                <p className='text-[14px] text-[#0E121B]'>{`Amount: ${message.data?.currency === 'USD' ? '$' : message.data?.currency === 'EUR' ? '€' : message.data?.currency === 'GBP' ? '£' : message.data?.currency === 'CNY' ? '¥' : '$'}${message.data?.amount}`}</p>
                <LinkButton
                  variant="primary"
                  size="medium"
                  className='!justify-start'
                >
                  <Link href={`/${i18n.language}/orders/detail/${message.data.contractId}`}>
                    {t('chat.milestone.viewContract')}
                  </Link>
                </LinkButton>
              </div>
            </div>
          </div>
        )}
      </div>

      <Avatar.Root size='40'>
        {senderProfile?.avatar_url && senderProfile?.avatar_url != "" ? (
          <Avatar.Image src={senderProfile?.avatar_url} />
        ) : (
          <Avatar.Root size='32' color='yellow'>
            {senderProfile?.full_name?.charAt(0) ?? senderProfile?.username?.charAt(0)}
          </Avatar.Root>
        )}

      </Avatar.Root>
    </div>

  );
}

export default function ChatCore({
  chat,
  initialMessages,
  currentUserProfile,
  otherUserProfile,
  currentUserId,
  isPopup = false,
  onClose,
}: ChatCoreProps) {
  const { t } = useTranslation('common');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { notification: toast } = useNotification();


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  }, []);

  useEffect(() => {
    console.log('ChatCore: initialMessages prop updated', initialMessages);
    setMessages(initialMessages);
    setTimeout(scrollToBottom, 50);
  }, [initialMessages, scrollToBottom]);

  useEffect(() => {
    chatOperations.markMessagesAsRead(chat.id, currentUserId);

    const channel = supabase
      .channel(`chat_${chat.id}`)
      .on<Message>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chat.id}`,
        },
        (payload) => {
          try {
            const parsedMessage = MessageSchema.parse(payload.new);
            setMessages((currentMessages) => {
              if (currentMessages.some((m) => m.id === parsedMessage.id)) {
                return currentMessages;
              }
              return [...currentMessages, parsedMessage];
            });
            if (parsedMessage.sender_id !== currentUserId) {
              chatOperations.markMessagesAsRead(chat.id, currentUserId);
            }
            setTimeout(scrollToBottom, 100);
          } catch (subError) {
            console.error(
              'Failed to parse incoming message:',
              subError,
              payload.new,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chat.id, currentUserId, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // --- UseEffect to handle focus after sending --- 
  useEffect(() => {
    // Only focus if we just finished sending
    if (!isSending) {
      textareaRef.current?.focus();
    }
  }, [isSending]); // Dependency array includes isSending

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    // Check if the user has not reached the consecutive message limit which is 5 messages (do not count the messages which are of type 'offer', 'system', 'milestone_activated', 'milestone_completed')
    const consecutiveMessageLimit = 5;

    // Get the most recent messages and count consecutive ones from current user
    const recentMessages = [...messages].reverse();
    let consecutiveMessageCount = 0;

    for (const message of recentMessages) {
      if (message.message_type === 'offer' ||
        message.message_type === 'system_event' ||
        message.message_type === 'milestone_activated' ||
        message.message_type === 'milestone_completed') {
        continue;
      }

      if (message.sender_id === currentUserId) {
        consecutiveMessageCount++;
      } else {
        break; // Stop counting when we find a message from another user
      }
    }

    if (consecutiveMessageCount >= consecutiveMessageLimit) {
      toast({ description: t('chat.consecutiveMessageLimit'), notificationType: 'warning' });
      return;
    }

    const textContent = newMessage.trim();

    if ((!textContent && !selectedFile) || isSending) return;

    setIsSending(true); // Set sending to true *before* async operations
    setNewMessage('');
    let fileToUpload = selectedFile;
    setSelectedFile(null);

    let attachmentData: BaseFileData[] | null = null;
    let finalMessageType: Message['message_type'] = 'text'; // Default to text

    try {
      if (fileToUpload) {
        // --- Determine message type based on file ---
        const fileType = fileToUpload.type;
        if (fileType.startsWith('image/')) {
          finalMessageType = 'image';
        } else if (fileType === 'audio/mpeg' || fileToUpload.name.toLowerCase().endsWith('.mp3')) {
          finalMessageType = 'audio'; // Use 'audio' type for MP3s
        } else {
          finalMessageType = 'file'; // Fallback for other types
        }
        // --- End Determine message type ---

        console.log(`Uploading file: ${fileToUpload.name} (${fileToUpload.size} bytes) - Type: ${finalMessageType}`);

        try {
          const timestamp = Date.now();

          // --- Sanitize filename for object storage key compatibility ---
          const originalFileName = fileToUpload.name;
          const fileNameParts = originalFileName.split('.');
          const fileExtension = fileNameParts.length > 1 ? '.' + fileNameParts.pop() : '';
          let baseName = fileNameParts.join('.'); // Handles filenames with multiple dots before the extension

          // Replace non-alphanumeric (excluding hyphen, underscore) characters with an underscore
          baseName = baseName.replace(/[^a-zA-Z0-9_-]+/g, '_');
          // Collapse multiple consecutive underscores into a single underscore
          baseName = baseName.replace(/_{2,}/g, '_');
          // Remove leading or trailing underscores that might have resulted from replacements
          baseName = baseName.replace(/^_+|_+$/g, '');

          // If the baseName becomes empty after sanitization (e.g., "().txt" or "+++"), provide a default.
          if (!baseName && fileExtension) { // Handles cases like "().txt"
            baseName = 'file';
          } else if (!baseName && !fileExtension) { // Handles cases like "()"
            baseName = 'file';
            // fileExtension remains empty
          }
          // Ensure baseName is not empty if there's no extension either (e.g. if original name was just "+++")
          if (!baseName) {
            baseName = 'file';
          }

          const uniqueFileName = `${timestamp}-${baseName}${fileExtension}`;
          // --- End Sanitize filename ---

          const filePath = `public/${chat.id}/${currentUserId}/${uniqueFileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('chat-attachments')
            .upload(filePath, fileToUpload, { cacheControl: '3600', upsert: false });

          if (uploadError) throw uploadError;

          console.log('Upload successful:', uploadData);
          const { data: urlData } = supabase.storage
            .from('chat-attachments')
            .getPublicUrl(filePath);

          if (!urlData?.publicUrl) throw new Error('Could not get public URL');

          attachmentData = [{
            name: fileToUpload.name,
            size: fileToUpload.size,
            url: urlData.publicUrl,
            mimeType: fileToUpload.type, // <-- Store MIME type
          }];

        } catch (uploadError: any) {
          console.error('Error uploading attachment during send:', uploadError);
          alert(`File upload failed: ${uploadError.message}. Message not sent.`);
          setNewMessage(textContent); // Keep text content if upload fails
          setIsSending(false);
          return;
        }
      }


      console.log(`Sending message. Type: ${finalMessageType}, Content: "${textContent}", Data:`, attachmentData);
      const sentMessage = await chatOperations.sendMessage({
        chat_id: chat.id,
        sender_id: currentUserId,
        content: textContent,
        message_type: attachmentData ? finalMessageType : 'text', // Use determined type or text
        data: attachmentData, // Send BaseFileData including mimeType
      });

      if (!sentMessage) {
        console.error('Failed to send message after potential upload');
        setNewMessage(textContent); // Restore text on failure
      } else {
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setNewMessage(textContent); // Restore text on error
    } finally {
      setIsSending(false); // Set sending back to false
      // Remove focus logic from here
    }
  };

  const handleAttachmentClick = () => {
    if (isSending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isSending) {
      const maxSize = 25 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(t('chat.fileTooLarge'));
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const groupedMessages = groupMessagesByDate(messages);
  const sortedDateKeys = Object.keys(groupedMessages).sort();

  const containerClass = 'flex flex-col bg-white dark:bg-gray-800 h-full overflow-hidden';
  const containerModeClass = isPopup
    ? 'rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden w-full min-w-[300px] max-w-[600px] !h-[70vh] fixed bottom-4 right-4 z-50'
    : 'h-screen';

  return (
    <div className={`${containerClass} ${containerModeClass} overflow-hidden`}>
      <div className='flex items-center justify-between border-y border-gray-200 dark:border-gray-700 py-3 pl-[1.375rem] pr-[0.875rem] flex-shrink-0'>
        <div className='flex items-center space-x-3'>
          <div className='relative'>

            <Avatar.Root size='40'>
              {otherUserProfile?.avatar_url && otherUserProfile?.avatar_url != "" ? (
                <Avatar.Image src={otherUserProfile?.avatar_url} />
              ) : (
                <Avatar.Root size='40' color='yellow'>
                  {otherUserProfile?.full_name?.charAt(0) ?? otherUserProfile?.username?.charAt(0)}
                </Avatar.Root>
              )}
              <Avatar.Indicator position='top'>
                <svg
                  viewBox='0 0 36 36'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M22.3431 5.51481L20.1212 3.29299C18.9497 2.12141 17.0502 2.12141 15.8786 3.29299L13.6568 5.51481H10.5146C8.85778 5.51481 7.51463 6.85796 7.51463 8.51481V11.6569L5.2928 13.8788C4.12123 15.0503 4.12123 16.9498 5.2928 18.1214L7.51463 20.3432V23.4854C7.51463 25.1422 8.85777 26.4854 10.5146 26.4854H13.6568L15.8786 28.7072C17.0502 29.8788 18.9497 29.8788 20.1212 28.7072L22.3431 26.4854H25.4852C27.142 26.4854 28.4852 25.1422 28.4852 23.4854V20.3432L30.707 18.1214C31.8786 16.9498 31.8786 15.0503 30.707 13.8788L28.4852 11.6569V8.51481C28.4852 6.85796 27.142 5.51481 25.4852 5.51481H22.3431ZM21.2217 7.22192C21.4093 7.40946 21.6636 7.51481 21.9288 7.51481H25.4852C26.0375 7.51481 26.4852 7.96253 26.4852 8.51481V12.0712C26.4852 12.3364 26.5905 12.5907 26.7781 12.7783L29.2928 15.293C29.6833 15.6835 29.6833 16.3167 29.2928 16.7072L26.7781 19.2219C26.5905 19.4095 26.4852 19.6638 26.4852 19.929V23.4854C26.4852 24.0377 26.0375 24.4854 25.4852 24.4854H21.9288C21.6636 24.4854 21.4093 24.5907 21.2217 24.7783L18.707 27.293C18.3165 27.6835 17.6833 27.6835 17.2928 27.293L14.7781 24.7783C14.5905 24.5907 14.3362 24.4854 14.071 24.4854H10.5146C9.96234 24.4854 9.51463 24.0377 9.51463 23.4854V19.929C9.51463 19.6638 9.40927 19.4095 9.22174 19.2219L6.70702 16.7072C6.31649 16.3167 6.31649 15.6835 6.70702 15.293L9.22174 12.7783C9.40927 12.5907 9.51463 12.3364 9.51463 12.0712V8.51481C9.51463 7.96253 9.96234 7.51481 10.5146 7.51481H14.071C14.3362 7.51481 14.5905 7.40946 14.7781 7.22192L17.2928 4.7072C17.6833 4.31668 18.3165 4.31668 18.707 4.7072L21.2217 7.22192Z'
                    className='fill-bg-white-0'
                  />
                  <path
                    d='M21.9288 7.51457C21.6636 7.51457 21.4092 7.40921 21.2217 7.22167L18.707 4.70696C18.3164 4.31643 17.6833 4.31643 17.2927 4.70696L14.778 7.22167C14.5905 7.40921 14.3361 7.51457 14.0709 7.51457H10.5146C9.96228 7.51457 9.51457 7.96228 9.51457 8.51457V12.0709C9.51457 12.3361 9.40921 12.5905 9.22167 12.778L6.70696 15.2927C6.31643 15.6833 6.31643 16.3164 6.70696 16.707L9.22167 19.2217C9.40921 19.4092 9.51457 19.6636 9.51457 19.9288V23.4851C9.51457 24.0374 9.96228 24.4851 10.5146 24.4851H14.0709C14.3361 24.4851 14.5905 24.5905 14.778 24.778L17.2927 27.2927C17.6833 27.6833 18.3164 27.6833 18.707 27.2927L21.2217 24.778C21.4092 24.5905 21.6636 24.4851 21.9288 24.4851H25.4851C26.0374 24.4851 26.4851 24.0374 26.4851 23.4851V19.9288C26.4851 19.6636 26.5905 19.4092 26.778 19.2217L29.2927 16.707C29.6833 16.3164 29.6833 15.6833 29.2927 15.2927L26.778 12.778C26.5905 12.5905 26.4851 12.3361 26.4851 12.0709V8.51457C26.4851 7.96228 26.0374 7.51457 25.4851 7.51457H21.9288Z'
                    fill='#47C2FF'
                  />
                  <path
                    d='M23.3737 13.3739L16.6666 20.081L13.2928 16.7073L14.707 15.2931L16.6666 17.2526L21.9595 11.9597L23.3737 13.3739Z'
                    className='fill-text-white-0'
                  />
                </svg>
              </Avatar.Indicator>
            </Avatar.Root>

          </div>
          <div className='flex flex-col gap-0.5'>
            <p className='font-medium text-[12px] text-[#525866] dark:text-gray-100'>
              {otherUserProfile?.full_name ?? otherUserProfile?.username ?? 'User'}
            </p>
            <p className='text-[12px] text-[#525866] dark:text-green-400'>{t('chat.online')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {isPopup && onClose && (
            <Button
              variant="neutral"
              mode="ghost"
              size="medium"
              onClick={onClose}
              aria-label={t('chat.closeChat')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          )}
          {/* <Button
            variant="neutral"
            mode="ghost"
            size="medium"
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </Button> */}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 md:px-6 space-y-4 min-h-0 custom-scrollbar border-r border-[#E2E4E9]'>
        {sortedDateKeys.map((dateKey) => (
          <Fragment key={dateKey}>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400 text-[11px]">
                  {formatDateSeparator(dateKey, t)}
                </span>
              </div>
            </div>
            {groupedMessages[dateKey].map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              const senderProfile = isCurrentUser ? currentUserProfile : otherUserProfile;
              const senderName = isCurrentUser
                ? t('chat.me')
                : senderProfile?.full_name ?? senderProfile?.username ?? t('chat.user');
              return (
                <ChatMessageRenderer
                  key={message.id}
                  message={message}
                  setMessages={setMessages}
                  isCurrentUser={isCurrentUser}
                  senderProfile={senderProfile}
                  timestamp={formatMessageTimestamp(message.created_at)}
                  senderName={senderName}
                  isSeller={currentUserProfile?.user_type === 'seller'}
                />
              );
            })}
          </Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='border-r border-[#E2E4E9]'>
        <form onSubmit={handleSendMessage} className='p-4 mx-4 mb-4 rounded-lg border border-[#E1E4EA] flex flex-col gap-4 flex-shrink-0'>
          <div className='border-b border-[#E1E4EA] pb-2 w-full'>
            <textarea
              ref={textareaRef}
              placeholder={t('chat.typeMessage')}
              className='w-full border-none outline-none resize-none min-h-[24px] max-h-[72px] text-[14px]'
              rows={1}
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setNewMessage(e.target.value);
                // Auto-resize textarea
                const textarea = e.target;
                textarea.style.height = 'auto';
                const newHeight = Math.min(textarea.scrollHeight, 72); // 72px = 3 rows
                textarea.style.height = `${newHeight}px`;
              }}
              onKeyDown={handleTextareaKeyDown}
              disabled={isSending}
              autoComplete='off'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row'>
              {selectedFile && (
                <div className='rounded-lg h-24 w-24 border border-[#E1E4EA] p-2 relative flex items-center justify-center'>
                  {selectedFile.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(selectedFile)} alt="Attachment Preview" className='w-full h-full object-contain rounded-md' />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-center w-full overflow-hidden">
                      {(() => { // IIFE to compute icon props
                        const fileExt = selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE';
                        const iconColor = fileExt === 'MP3' ? 'blue' : fileExt === 'PDF' ? 'red' : 'gray';
                        return <FileFormatIcon.Root format={fileExt} color={iconColor} />;
                      })()}
                      <span
                        className="block w-full text-sm text-gray-600 dark:text-gray-400 truncate px-1"
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {formatBytes(selectedFile.size)}
                      </span>
                    </div>
                  )}
                  <div className='hover:bg-[#F5F7FA] absolute top-1 right-1 rounded-md'><X size={20} onClick={clearSelectedFile} className=' cursor-pointer text-[#525866] p-0.5 rounded-full' /></div>
                </div>
              )}
            </div>


            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-row gap-4 items-center'>
                <div className='cursor-pointer'>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18C4.0293 18 0 13.9707 0 9C0 4.0293 4.0293 0 9 0C13.9707 0 18 4.0293 18 9C18 13.9707 13.9707 18 9 18ZM9 16.2C10.9096 16.2 12.7409 15.4414 14.0912 14.0912C15.4414 12.7409 16.2 10.9096 16.2 9C16.2 7.09044 15.4414 5.25909 14.0912 3.90883C12.7409 2.55857 10.9096 1.8 9 1.8C7.09044 1.8 5.25909 2.55857 3.90883 3.90883C2.55857 5.25909 1.8 7.09044 1.8 9C1.8 10.9096 2.55857 12.7409 3.90883 14.0912C5.25909 15.4414 7.09044 16.2 9 16.2ZM4.5 9.9H6.3C6.3 10.6161 6.58446 11.3028 7.09081 11.8092C7.59716 12.3155 8.28392 12.6 9 12.6C9.71608 12.6 10.4028 12.3155 10.9092 11.8092C11.4155 11.3028 11.7 10.6161 11.7 9.9H13.5C13.5 11.0935 13.0259 12.2381 12.182 13.082C11.3381 13.9259 10.1935 14.4 9 14.4C7.80653 14.4 6.66193 13.9259 5.81802 13.082C4.97411 12.2381 4.5 11.0935 4.5 9.9ZM5.4 8.1C5.04196 8.1 4.69858 7.95777 4.44541 7.70459C4.19223 7.45142 4.05 7.10804 4.05 6.75C4.05 6.39196 4.19223 6.04858 4.44541 5.79541C4.69858 5.54223 5.04196 5.4 5.4 5.4C5.75804 5.4 6.10142 5.54223 6.35459 5.79541C6.60777 6.04858 6.75 6.39196 6.75 6.75C6.75 7.10804 6.60777 7.45142 6.35459 7.70459C6.10142 7.95777 5.75804 8.1 5.4 8.1ZM12.6 8.1C12.242 8.1 11.8986 7.95777 11.6454 7.70459C11.3922 7.45142 11.25 7.10804 11.25 6.75C11.25 6.39196 11.3922 6.04858 11.6454 5.79541C11.8986 5.54223 12.242 5.4 12.6 5.4C12.958 5.4 13.3014 5.54223 13.5546 5.79541C13.8078 6.04858 13.95 6.39196 13.95 6.75C13.95 7.10804 13.8078 7.45142 13.5546 7.70459C13.3014 7.95777 12.958 8.1 12.6 8.1Z" fill="#525866" />
                  </svg>

                </div>
                <div className='cursor-pointer'>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.mp3,audio/mpeg"
                  />
                  <div
                    onClick={() => isSending ? null : handleAttachmentClick()}
                  >
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.80078 10.35V5.4C9.80078 4.44522 9.4215 3.52955 8.74637 2.85442C8.07124 2.17928 7.15556 1.8 6.20078 1.8C5.246 1.8 4.33033 2.17928 3.6552 2.85442C2.98007 3.52955 2.60078 4.44522 2.60078 5.4V10.35C2.60078 11.9015 3.21712 13.3895 4.31421 14.4866C5.41129 15.5837 6.89926 16.2 8.45078 16.2C10.0023 16.2 11.4903 15.5837 12.5874 14.4866C13.6844 13.3895 14.3008 11.9015 14.3008 10.35V1.8H16.1008V10.35C16.1008 12.3789 15.2948 14.3247 13.8601 15.7594C12.4255 17.194 10.4797 18 8.45078 18C6.42188 18 4.47607 17.194 3.04141 15.7594C1.60676 14.3247 0.800781 12.3789 0.800781 10.35V5.4C0.800781 3.96783 1.36971 2.59432 2.3824 1.58162C3.3951 0.568927 4.76861 0 6.20078 0C7.63295 0 9.00646 0.568927 10.0192 1.58162C11.0319 2.59432 11.6008 3.96783 11.6008 5.4V10.35C11.6008 11.1854 11.2689 11.9866 10.6782 12.5774C10.0874 13.1681 9.28621 13.5 8.45078 13.5C7.61535 13.5 6.81414 13.1681 6.2234 12.5774C5.63266 11.9866 5.30078 11.1854 5.30078 10.35V5.4H7.10078V10.35C7.10078 10.708 7.24301 11.0514 7.49619 11.3046C7.74936 11.5578 8.09274 11.7 8.45078 11.7C8.80882 11.7 9.1522 11.5578 9.40538 11.3046C9.65855 11.0514 9.80078 10.708 9.80078 10.35Z" fill="#525866" />
                    </svg>
                  </div>

                </div>
              </div>
              <FancyButton.Root
                type='submit'
                disabled={(!newMessage.trim() && !selectedFile) || isSending}
              >
                {t('chat.send')}
                {!isSending ? <FancyButton.Icon as={SendIcon} /> :
                  <FancyButton.Icon as={LoaderCircle} className='animate-spin' />}
              </FancyButton.Root>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
} 