'use client';

import React from 'react';
import Link from 'next/link';
import {
  User,
  Chat,
  Message
} from '@/utils/supabase/types';
import { useAuth } from '@/utils/supabase/AuthContext';
import { chatOperations, userOperations } from '@/utils/supabase/database';
import ChatPopupWrapper from '@/components/chat/chat-popup-wrapper';
import * as Table from '@/components/ui/table';
import OrderRowBuyer from '@/components/settings/OrderRowBuyer';
import OrderRowSeller from '@/components/settings/OrderRowSeller';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@/hooks/use-notification';

type UserRole = 'buyer' | 'seller';

/* ------------------------------------------------------------------ */
/** Minimal local interfaces so this file can compile on its own.
 *  They duplicate what you already have in OrdersContent – feel free
 *  to centralise in a shared file later.
 */
interface PersonInfo {
  id: string;
  name: string;
  avatarUrl: string;
}
export interface BuyerEngagement {
  id: string;
  contractId: string | null;
  type: 'job' | 'contract';
  subject: string;
  price: number;
  currency: string;
  deadline: string;
  proposals?: number | null;
  worker: PersonInfo | null;
  status: string;
}
export interface SellerOrder {
  id: string;
  from: PersonInfo | null;
  subject: string;
  price: number;
  deadline: string;
  rating: number | null;
  status: string;
  currency: string;
}

/* ------------------------------------------------------------------ */
interface Props {
  /** current page slice already cut by parent */
  rows: (BuyerEngagement | SellerOrder)[];
  isBuyer: boolean;
}

/* ------------------------------------------------------------------ */
/** Renders the orders/services table with role‑specific columns.
 *  Row components encapsulate the heavy per‑row JSX.
 */
export default function OrdersTable({ rows, isBuyer }: Props) {
  const { t } = useTranslation('common');

  // const [currentUserProfile, setCurrentUserProfile] = React.useState<User | null>(null);
  const [activeChat, setActiveChat] = React.useState<Chat | null>(null);
  const [activeChatMessages, setActiveChatMessages] = React.useState<Message[]>([]);
  const { userProfile: currentUser, loading: authLoading } = useAuth();
  // const otherParty = userRole === 'seller' ? buyer : seller;
  const [otherParty, setOtherParty] = React.useState<User | null>(null);
  const { notification } = useNotification();
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);
  const [chatError, setChatError] = React.useState<string | null>(null);




  if (rows.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">{t('ordersTable.noOrders')}</div>
    );
  }

  const handleOpenChat = async (contractId: string | null, personId: string | undefined, chatWith: 'buyer' | 'seller') => {
    console.log('handleOpenChat', contractId, personId, chatWith);
    if (!currentUser || !contractId || !personId) {
      console.warn('Cannot open chat: Missing user profiles or already loading.');
      if (!currentUser) setChatError(t('orders.details.chatError'));
      return;
    }
    setChatError(null);

    try {

      let chat = null;

      if (chatWith === 'buyer') {
        chat = await chatOperations.getContractChat(personId, currentUser?.id, contractId);
      } else if (chatWith === 'seller') {
        chat = await chatOperations.getContractChat(currentUser?.id, personId, contractId);
      }

      console.log('Chat found/created:', chat);

      const otherUserProfile = await userOperations.getUserById(personId);
      setOtherParty(otherUserProfile);

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
  };

  const handleCloseChat = () => {
    setActiveChat(null);
    setActiveChatMessages([]);
    setChatError(null);
    console.log('Chat closed');
  };


  return (
    <>
      <Table.Root className="min-w-full divide-y divide-stroke-soft-200">
        {/* ---------------- Header ---------------- */}
        <Table.Header className="bg-[#F5F7FA] rounded-lg ">
          <Table.Row className='bg-[#F5F7FA] rounded-lg'>
            {isBuyer ? (
              <>
                <Table.Head className="bg-[#F5F7FA] px-3 w-80 py-2 text-left text-[14px] text-[#525866] font-normal">
                  {t('ordersTable.details')}
                </Table.Head>
                <Table.Head className="bg-[#F5F7FA] px-3 w-80 py-2 text-left text-[14px] text-[#525866] font-normal">
                  {t('ordersTable.finalDeadline')}
                </Table.Head>
                {/* new Proposals column */}
                <Table.Head className="bg-[#F5F7FA] px-3 w-32 py-2 text-left text-[14px] text-[#525866] font-normal">
                  {t('ordersTable.proposals')}
                </Table.Head>
                <Table.Head className="bg-[#F5F7FA] px-3 w-80 py-2 text-left text-[14px] text-[#525866] font-normal">
                  {t('ordersTable.worker')}
                </Table.Head>
                <Table.Head className="bg-[#F5F7FA] px-3 w-32 py-2 text-left text-[14px] text-[#525866] font-normal">
                  {t('ordersTable.status')}
                </Table.Head>
              </>
            ) : (
              <>
                <Table.Head className="bg-[#F5F7FA] px-4 py-3 text-left text-[14px] tracking-wider text-[#525866] font-normal">
                  {t('ordersTable.from')}
                </Table.Head>
                <Table.Head className="bg-[#F5F7FA] px-4 py-3 text-left text-[14px] tracking-wider text-[#525866] font-normal">
                  {t('ordersTable.details')}
                </Table.Head>
                <Table.Head className="bg-[#F5F7FA] px-4 py-3 text-left text-[14px] tracking-wider text-[#525866] font-normal">
                  {t('ordersTable.finalDeadline')}
                </Table.Head>
                <Table.Head className="bg-[#F5F7FA] px-4 py-3 text-left text-[14px] tracking-wider text-[#525866] font-normal">
                  {t('ordersTable.rating')}
                </Table.Head>
                <Table.Head className="bg-[#F5F7FA] px-4 py-3 text-left text-[14px] tracking-wider text-[#525866] font-normal">
                  {t('ordersTable.status')}
                </Table.Head>
              </>
            )}
            {/* common EMPTY head for actions column */}
            <Table.Head className="bg-[#F5F7FA] px-4 py-3 text-right text-[14px] tracking-wider text-[#525866]" />
          </Table.Row>
        </Table.Header>

        {/* ---------------- Body ---------------- */}
        <Table.Body className="">
          {rows.map((row) =>
            isBuyer ? (
              <OrderRowBuyer key={row.id} engagement={row as BuyerEngagement} handleOpenChat={handleOpenChat} />
            ) : (
              <OrderRowSeller key={row.id} order={row as SellerOrder} handleOpenChat={handleOpenChat} />
            ),
          )}
        </Table.Body>
      </Table.Root>
      {activeChat && currentUser && otherParty && (
        <ChatPopupWrapper
          key={activeChat.id}
          chat={activeChat}
          initialMessages={activeChatMessages}
          currentUserProfile={currentUser}
          otherUserProfile={otherParty}
          currentUserId={currentUser?.id}
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
    </>
  );
}
