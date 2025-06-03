"use client";

import * as React from 'react';
import * as Accordion from "@/components/ui/accordion";
import * as Button from "@/components/ui/button";
import { Input as InputField, Root as InputRoot } from "@/components/ui/input";
import * as Tag from "@/components/ui/tag";
import { useTranslation } from 'react-i18next';
import {
  RiCheckFill,
  RiTimeLine,
  RiAddLine,
  RiArrowDownSLine,
  RiAddCircleLine,
  RiCalendarLine
} from '@remixicon/react';
import { Calendar } from '@/components/ui/datepicker';
import {
  Root as Popover,
  Content as PopoverContent,
  Trigger as PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import { chatOperations, contractOperations } from '@/utils/supabase/database';
import { useNotification } from '@/hooks/use-notification';
import { supabase } from '@/utils/supabase';

// Import UserRole type
type UserRole = 'buyer' | 'seller';

interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: 'completed' | 'pending' | 'in-progress';
  date?: string;
  sequence?: number;
}

interface MilestoneSectionProps {
  userRole: UserRole;
  contractId: string;
  milestones: Milestone[];
  onConfirmPayment?: (milestoneId: string) => void;
  isConfirmingId?: string | null;
  currency: string;
}

export function MilestoneSection({
  userRole,
  contractId,
  milestones: initialMilestones,
  onConfirmPayment,
  isConfirmingId,
  currency
}: MilestoneSectionProps) {
  const { t } = useTranslation('common');

  // Log initial props
  console.log('MilestoneSection received initialMilestones:', initialMilestones);

  const [milestones, setMilestones] = React.useState<Milestone[]>(initialMilestones);
  const [showAddMilestone, setShowAddMilestone] = React.useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = React.useState("");
  const [newMilestoneAmount, setNewMilestoneAmount] = React.useState("");
  const [newMilestoneDueDate, setNewMilestoneDueDate] = React.useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const { notification: toast } = useNotification();
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'CNY' ? '¥' : '$';

  // Log state after initialization
  React.useEffect(() => {
    console.log('MilestoneSection milestones state initialized:', milestones);
  }, []); // Run only once on mount

  // Update local state if initialMilestones prop changes
  React.useEffect(() => {
    setMilestones(initialMilestones);
  }, [initialMilestones]);

  const handleAddFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving || userRole !== 'buyer') return; // Prevent saving if not buyer or already saving
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const nextSequence = (milestones.length > 0 ? Math.max(...milestones.map((m, i) => m.sequence ?? i)) : 0) + 1;

    // If we have a date, format it as YYYY-MM-DD for the form data
    if (newMilestoneDueDate) {
      formData.set('dueDate', format(newMilestoneDueDate, 'yyyy-MM-dd'));
    }

    // Get contract data first
    const contract = await contractOperations.getContractById(contractId);
    if (!contract) {
      const { notification } = await import('@/hooks/use-notification');
      notification({
        type: 'foreground',
        description: t('orders.milestoneSection.errors.failedToLoadContract'),
        notificationType: 'error',
      });
      setIsSaving(false);
      return;
    }

    // Check buyer's balance before creating milestone
    const { data: buyerData, error: buyerError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', contract.buyer_id)
      .single();

    if (buyerError || !buyerData) {
      const { notification } = await import('@/hooks/use-notification');
      notification({
        type: 'foreground',
        description: t('orders.milestoneSection.errors.failedToVerifyBalance'),
        notificationType: 'error',
      });
      setIsSaving(false);
      return;
    }

    const milestoneAmount = Number(formData.get('amount'));
    if (buyerData.balance < milestoneAmount) {
      const { notification } = await import('@/hooks/use-notification');
      notification({
        type: 'foreground',
        description: t('orders.milestoneSection.errors.insufficientBalanceMessage'),
        notificationType: 'error',
      });
      setIsSaving(false);
      return;
    }

    const { addMilestone } = await import('@/app/actions/milestone-actions');
    const result = await addMilestone(contractId, nextSequence, formData);

    if (result.success && result.milestone) {

      const contract = await contractOperations.getContractById(contractId);

      if (contract) {
        let chat = await chatOperations.getContractChat(contract.buyer_id, contract.seller_id, contractId);

        if (chat) {

          const milestoneActivatedMessage = await chatOperations.sendMessage({
            chat_id: chat.id,
            message_type: 'milestone_activated',
            content: 'Milestone activated',
            sender_id: contract.buyer_id,
            data: {
              contractId: contractId,
              status: 'in_progress',
              description: 'New Milestone',
              amount: newMilestoneAmount,
              sequence: nextSequence,
              currency: currency
            }
          });
        }
      }

      setNewMilestoneTitle("");
      setNewMilestoneAmount("");
      setNewMilestoneDueDate(undefined);
      setShowAddMilestone(false);
      // TODO: Optimistically update or refetch milestones
    } else {
      console.error("Failed to add milestone:", result.error);
      const { notification } = await import('@/hooks/use-notification');
      notification({ type: 'foreground', title: t('orders.milestoneSection.errors.addFailed'), description: result.error || t('orders.milestoneSection.errors.addFailed') });
    }
    setIsSaving(false);
  };

  // Log state just before rendering
  console.log('MilestoneSection rendering with milestones state:', milestones);

  return (
    <Accordion.Root type="single" collapsible defaultValue="item-1" className="w-full bg-white rounded-[16px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] mb-4 border border-stroke-soft-200">
      <Accordion.Item value="item-1" className="p-0 rounded-none ring-0 hover:bg-white data-[state=open]:bg-white">

        <Accordion.Header className="px-4 py-3 border-b border-stroke-soft-200 bg-[#F5F7FA]">
          <Accordion.Trigger className="w-full text-[16px] text-text-strong-950 p-0 m-0 flex font-medium justify-between items-center hover:no-underline">
            {t('orders.milestoneSection.timeline')}
            <Accordion.Arrow openIcon={RiArrowDownSLine} closeIcon={RiArrowDownSLine} className="size-5 text-gray-500 transition-transform duration-200 group-data-[state=open]/accordion:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className="p-[16px]">
          <div className="space-y-[24px] mt-4 ">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3 pb-2.5">
                {/* status icon */}
                <div className="mt-1 flex-shrink-0">
                  {milestone.status === 'completed' ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <RiCheckFill className="h-4 w-4" />
                    </div>
                  ) : (
                    // <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <RiTimeLine className="h-6 w-6 text-gray-400" />
                    // </div> 
                  )}
                </div>

                {/* title+amount on the left, date on the far right */}
                <div className="flex-1 flex justify-between items-center min-w-0 mt-[-7px]">
                  <div className="min-w-0 gap-1">
                    <h4 className="text-[16px] pb-1 text-[#0E121B]">
                      {milestone.title}
                    </h4>
                    <p className="text-[16px] text-[#0E121B] mt-[4px]">
                      {`${currencySymbol}${milestone.amount}`}
                    </p>
                  </div>
                  {milestone.date && (
                    <p className="text-[12px] text-[#525866]">
                      {milestone.date}
                    </p>
                  )}
                </div>

                {/* only buyers see "Confirm Payment" on pending items */}
                {userRole === 'buyer' && milestone.status === 'pending' && (
                  <Tag.Root
                    onClick={() => onConfirmPayment?.(milestone.id)}
                    className={`ml-4 flex-shrink-0 cursor-pointer text-text-strong-950 ${isConfirmingId === milestone.id ? 'opacity-50 pointer-events-none' : ''
                      }`}
                  >
                    {isConfirmingId === milestone.id ? t('orders.milestoneSection.confirming') : t('orders.milestoneSection.confirmPayment')}
                  </Tag.Root>
                )}
              </div>
            ))}
          </div>

          {/* Only show Add Milestone form/button for buyers */}
          {userRole === 'buyer' && (
            <>
              {showAddMilestone && (
                <form onSubmit={handleAddFormSubmit} className="flex flex-col mt-4 ml-9">
                  <div className="flex items-end gap-2">
                    <div className="w-56">
                      <InputRoot size="small">
                        <InputField
                          name="description"
                          placeholder="Milestone title"
                          value={newMilestoneTitle}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMilestoneTitle(e.target.value)}
                          required
                          className="p-2"
                        />
                      </InputRoot>
                    </div>
                    <div className="w-24">
                      <InputRoot size="small">
                        <InputField
                          name="amount"
                          placeholder={t('orders.milestoneSection.amount')}
                          type="number"
                          value={newMilestoneAmount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMilestoneAmount(e.target.value)}
                          required
                          step="0.01"
                          className="p-2"
                        />
                      </InputRoot>
                    </div>
                    <div className="w-36">
                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button.Root
                            type="button"
                            className={cn(
                              "justify-start rounded-md border border-gray-300 bg-white px-3 py-2 text-left font-normal hover:bg-gray-50",
                              !newMilestoneDueDate && "text-muted-foreground"
                            )}
                          >
                            <RiCalendarLine className="mr-2 h-4 w-4 text-[#0E121B]" />
                            {newMilestoneDueDate ? (
                              <p className="text-[14px] text-[#0E121B]">
                                {format(newMilestoneDueDate, 'PPP')}
                              </p>
                            ) : (
                              <span className="text-[14px] text-[#525866]">
                                Due Date (Optional)
                              </span>
                            )}
                          </Button.Root>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newMilestoneDueDate}
                            onSelect={(date) => {
                              if (date) {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                if (date < today) {
                                  // Don't allow past dates
                                  return;
                                }
                                setNewMilestoneDueDate(date);
                              }
                              setCalendarOpen(false);
                            }}
                            disabled={{ before: new Date() }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex justify-end mr-4 mt-4 gap-2">
                    <Button.Root type="submit" size="small" disabled={isSaving}>
                      {isSaving ? t('orders.milestoneSection.saving') : t('orders.milestoneSection.save')}
                    </Button.Root>
                    <Button.Root variant="neutral" mode="ghost" size="small" type="button" onClick={() => setShowAddMilestone(false)} disabled={isSaving}>
                      {t('orders.milestoneSection.cancel')}
                    </Button.Root>
                  </div>
                </form>
              )}

              {!showAddMilestone && (
                <button
                  onClick={() => setShowAddMilestone(true)}
                  className="flex items-center gap-2.5 text-text-strong-950 hover:text-text-secondary-600 mt-6 text-sm font-medium"
                >
                  <RiAddCircleLine className="h-7 w-7 text-[#525866]" />
                  <span className='text-[#525866]'>{t('orders.milestoneSection.addNewMilestone')}</span>
                </button>
              )}
            </>
          )}
        </Accordion.Content>

      </Accordion.Item>
    </Accordion.Root>
  );
} 