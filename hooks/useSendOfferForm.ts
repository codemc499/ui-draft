'use client';

import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/supabase/AuthContext';
import supabase from '@/utils/supabase/client';
import { SendOfferSchema, SendOfferFormData } from '@/components/offers/schema';
import { User, Job, BaseFileData } from '@/utils/supabase/types';
import { chatOperations } from '@/utils/supabase/database';
import { format, parseISO, isValid } from 'date-fns';
import i18n from '@/i18n';
import { useNotification } from './use-notification';
import { useTranslation } from 'react-i18next';

export interface UseSendOfferFormReturn {
  formMethods: UseFormReturn<SendOfferFormData>;
  onSubmit: (data: SendOfferFormData) => Promise<void>;
  isSubmitting: boolean;
  isLoadingSellers: boolean;
  isLoadingJobs: boolean;
  error: string | null;
  success: boolean;
  sellers: Pick<User, 'id' | 'username' | 'full_name'>[];
  jobs: Pick<Job, 'id' | 'title'>[];
  isUploadingFiles: boolean;
  setIsUploadingFiles: React.Dispatch<React.SetStateAction<boolean>>;
}

// Helper function to format date string safely
function formatDueDate(
  dateString: string | Date | null | undefined,
): string | null {
  if (!dateString) return null;
  try {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;
    // Check if the date is valid after parsing
    if (!isValid(date)) {
      console.warn('Invalid date provided for formatting:', dateString);
      return null; // Return null for invalid dates
    }
    return `Due ${format(date, 'PP')}`;
  } catch (e) {
    console.error('Error formatting due date:', e);
    return null;
  }
}

export function useSendOfferForm(): UseSendOfferFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isLoadingSellers, setIsLoadingSellers] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sellers, setSellers] = useState<
    Pick<User, 'id' | 'username' | 'full_name'>[]
  >([]);
  const [jobs, setJobs] = useState<Pick<Job, 'id' | 'title'>[]>([]);
  const { notification: toast } = useNotification();
  const { t } = useTranslation('common');

  const { user } = useAuth();
  const router = useRouter();

  const formMethods = useForm<SendOfferFormData>({
    resolver: zodResolver(SendOfferSchema),
    mode: 'onBlur',
    defaultValues: {
      sendTo: '',
      skillLevels: [],
      selectOrder: '',
      contractTitle: '',
      description: '',
      paymentType: 'one-time',
      amount: undefined,
      currency: 'USD',
      deadline: undefined,
      milestones: [],
      attachments: [],
      agreeToTerms: false,
    },
  });

  // Fetch Sellers (Users with user_type == 'seller')
  useEffect(() => {
    const fetchSellers = async () => {
      if (!user) return; // Only fetch if user is logged in
      setIsLoadingSellers(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('id, username, full_name')
          .eq('user_type', 'seller');

        if (fetchError) throw fetchError;
        setSellers(data || []);
      } catch (err: any) {
        console.error('Error fetching sellers:', err);
        setError(`Failed to load sellers: ${err.message}`);
        setSellers([]); // Clear sellers on error
      } finally {
        setIsLoadingSellers(false);
      }
    };

    fetchSellers();
  }, [user]); // Re-fetch if user changes

  // Fetch Buyer's Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return; // Only fetch if user is logged in
      setIsLoadingJobs(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('jobs')
          .select('id, title')
          .eq('buyer_id', user.id)
          .eq('status', 'open');

        if (fetchError) throw fetchError;
        setJobs(data || []);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(`Failed to load your jobs: ${err.message}`);
        setJobs([]); // Clear jobs on error
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [user]); // Re-fetch if user changes

  const onSubmit = async (data: SendOfferFormData) => {
    if (!user) {
      setError('You must be logged in to send an offer');
      return;
    }

    // Check if the user has enough balance to send the offer
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      setError('Failed to fetch user balance');
      return;
    }

    const userBalance = userData.balance;

    // Handle both one-time and installment payments
    let totalAmount = 0;
    if (data.paymentType === 'one-time') {
      totalAmount = data.amount!;
    } else if (data.milestones?.length) {
      totalAmount = data.milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
    }

    if (totalAmount > userBalance) {
      // setError('Insufficient balance to send offer');

      toast({
        description: t('offers.sendOfferForm.insufficientBalance'),
        notificationType: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const validatedData = data;

      // --- Calculate Total Amount ---
      let totalAmount = 0;
      if (validatedData.paymentType === 'one-time') {
        totalAmount = validatedData.amount!; // Ensure amount is present for one-time
      } else if (validatedData.milestones?.length) {
        totalAmount = validatedData.milestones.reduce(
          (sum, m) => sum + (m.amount || 0),
          0,
        );
      } else {
        throw new Error('Cannot determine offer amount.'); // Should be caught by validation, but good safety check
      }

      // --- Create Contract ---
      // const contractData = {
      //   buyer_id: user.id,
      //   seller_id: validatedData.sendTo,
      //   job_id: validatedData.selectOrder || null,
      //   service_id: null, // Assuming offers are always for jobs in this context
      //   title: validatedData.contractTitle, // Add title
      //   contract_type: validatedData.paymentType, // Add contract type
      //   status: 'pending',
      //   amount: totalAmount,
      //   description: validatedData.description,
      //   attachments: validatedData.attachments || null,
      //   currency: validatedData.currency,
      // };

      // const { data: newContract, error: contractError } = await supabase
      //   .from('contracts')
      //   .insert(contractData)
      //   .select('id, buyer_id, seller_id') // Select necessary fields
      //   .single();

      // if (contractError || !newContract) {
      //   console.error('Contract creation failed:', contractError);
      //   throw contractError || new Error('Failed to create contract record');
      // }
      // console.log('Contract created successfully:', newContract);

      // // --- Create Milestones (Always create at least one) ---
      // let milestoneInsertError: any = null;
      // if (validatedData.paymentType === 'one-time') {
      //   console.log('Creating single milestone for one-time payment.');
      //   // Create a single milestone for one-time payment
      //   const singleMilestoneData = {
      //     contract_id: newContract.id,
      //     description: validatedData.contractTitle, // Use contract title or description
      //     amount: totalAmount,
      //     due_date: validatedData.deadline?.toISOString() || null,
      //     status: 'pending',
      //     sequence: 1,
      //   };
      //   const { error } = await supabase
      //     .from('contract_milestones')
      //     .insert(singleMilestoneData);
      //   milestoneInsertError = error;
      // } else if (validatedData.milestones?.length) {
      //   console.log(
      //     `Creating ${validatedData.milestones.length} milestones for installment payment.`,
      //   );
      //   // Create milestones from form for installment payment
      //   const milestoneData = validatedData.milestones.map((m, index) => ({
      //     contract_id: newContract.id,
      //     description: m.description,
      //     amount: m.amount,
      //     due_date: m.dueDate?.toISOString() || null,
      //     status: 'pending',
      //     sequence: index + 1,
      //   }));
      //   const { error } = await supabase
      //     .from('contract_milestones')
      //     .insert(milestoneData);
      //   milestoneInsertError = error;
      // } else {
      //   // This case should ideally not happen if validation is correct
      //   console.warn('No milestones provided for installment payment type.');
      // }

      // if (milestoneInsertError) {
      //   console.error('Failed to insert milestones:', milestoneInsertError);
      //   // Decide how critical this is. Maybe proceed but add to error state?
      //   const currentError = error ? `${error} ` : '';
      //   setError(
      //     `${currentError}Offer created, but failed to save milestones: ${milestoneInsertError.message}`,
      //   );
      //   // Do not throw here, let the offer message proceed if possible
      // }

      // --- Create Chat ---
      let newChat;
      try {
        console.log('Attempting to create/get chat...');
        newChat = await chatOperations.findOrCreateChat(
          user.id, validatedData.sendTo,
        );
        if (!newChat) {
          console.error('Failed to create/get chat. createChat returned null.');
          setError(
            (prevError) =>
              `${prevError || ''} Offer sent, but couldn't initiate chat.`,
          );
        } else {
          console.log(
            `Chat created/retrieved successfully (Chat ID: ${newChat.id})`,
          );
        }
      } catch (chatErr: any) {
        console.error('Error during chat creation/retrieval:', chatErr);
        setError(
          (prevError) =>
            `${prevError || ''} Offer sent, but failed to create/get chat: ${chatErr.message || 'Unknown error'}.`,
        );
      }

      // --- Send Offer Message to Chat ---
      if (newChat) {
        try {
          // Determine and format delivery time
          let deliveryDueDate: string | Date | null | undefined = null;
          if (validatedData.paymentType === 'one-time') {
            deliveryDueDate = validatedData.deadline;
          } else if (validatedData.milestones?.length) {
            // Use the due date of the *last* milestone for installment contracts
            deliveryDueDate =
              validatedData.milestones[validatedData.milestones.length - 1]
                .dueDate;
          }
          const formattedDeliveryTime = formatDueDate(deliveryDueDate);

          const offerMessageData = {
            title: validatedData.contractTitle,
            description: validatedData.description,
            price: totalAmount,
            currency: validatedData.currency,
            deliveryTime: formattedDeliveryTime,
            status: 'pending',
            contractDetails: {
              buyer_id: user.id,
              seller_id: validatedData.sendTo,
              job_id: validatedData.selectOrder || null,
              service_id: null, // Assuming offers are always for jobs in this context
              title: validatedData.contractTitle, // Add title
              contract_type: validatedData.paymentType, // Add contract type
              status: 'pending',
              amount: totalAmount,
              description: validatedData.description,
              attachments: validatedData.attachments || null,
              currency: validatedData.currency,
              deadline: validatedData.deadline?.toISOString() || null,
              milestones: validatedData.milestones,
            },
          };

          console.log('Sending offer message to chat:', offerMessageData);
          await chatOperations.sendMessage({
            chat_id: newChat.id,
            sender_id: user!.id,
            content: '',
            message_type: 'offer',
            data: offerMessageData,
          });
          console.log(`Offer message sent to chat ${newChat.id}`);
        } catch (messageError: any) {
          console.error(
            `Failed to send offer message to chat ${newChat.id}:`,
            messageError,
          );
          setError(
            (prevError) =>
              `${prevError || ''} Offer created, but failed to send offer details into chat.`,
          );
        }
      }

      // Final success state check
      if (!error) {
        console.log('Offer submission process completed successfully.');
        setSuccess(true);
      }
    } catch (err: any) {
      // Catch errors from contract creation or other unexpected issues
      console.error('Overall Send Offer error:', err);
      setError(err.message || 'Failed to send offer. Please try again.');
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect to redirect on success
  useEffect(() => {
    if (success) {
      console.log('Redirecting to /chats...');
      const currentLang = i18n.language;
      router.push(`/${currentLang}/chats`);
    }
  }, [success, router]); // Depend on success and router

  return {
    formMethods,
    onSubmit,
    isSubmitting,
    isLoadingSellers,
    isLoadingJobs,
    error,
    success,
    sellers,
    jobs,
    isUploadingFiles,
    setIsUploadingFiles,
  };
}
