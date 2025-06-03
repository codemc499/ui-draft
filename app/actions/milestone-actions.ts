'use server'; // Mark this file as Server Actions

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { contractMilestoneOperations } from '@/utils/supabase/database';
import { ContractMilestoneSchema } from '@/utils/supabase/types';

// --- Confirm Milestone Payment Action ---
export async function confirmMilestonePayment(milestoneId: string): Promise<{
  success: boolean;
  error?: string;
  milestone?: z.infer<typeof ContractMilestoneSchema>;
}> {
  if (!milestoneId) {
    return { success: false, error: 'Milestone ID is required.' };
  }

  console.log(
    `[Server Action] Confirming payment for milestone: ${milestoneId}`,
  );

  // TODO: Add permission checks here - e.g., is the current user the buyer?
  // This would require getting the user session within the server action.

  try {
    // Update status to 'paid' (assuming this is the correct final status for "completed")
    const updatedMilestone =
      await contractMilestoneOperations.updateMilestoneStatus(
        milestoneId,
        'paid',
      );

    if (!updatedMilestone) {
      return {
        success: false,
        error: 'Failed to update milestone status in database.',
      };
    }

    console.log(
      `[Server Action] Milestone ${milestoneId} status updated to paid.`,
    );

    // Revalidate the order details page path to refresh data
    // Note: We need the contract ID here to revalidate the specific page.
    // This action currently only gets milestoneId. We might need to pass contractId too,
    // or fetch the milestone first to get the contractId.
    // For now, let's revalidate a generic path, adjust as needed.
    // revalidatePath(`/orders/detail/[id]`, 'page'); // Needs dynamic segment
    // Or revalidate the layout if multiple pages might show this data
    revalidatePath('/orders', 'layout');

    return { success: true, milestone: updatedMilestone };
  } catch (error) {
    console.error('[Server Action] Error confirming milestone payment:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

// --- Add Milestone Action ---

// Schema for validating form data
const AddMilestoneFormSchema = z.object({
  contractId: z.string().uuid({ message: 'Invalid Contract ID.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }), // coerce to number
  sequence: z.coerce.number().int().positive().optional(), // Sequence might be calculated
  // Use preprocess to handle empty string for optional date
  dueDate: z.preprocess(
    (arg) => (arg === '' ? undefined : arg),
    z.string().date().optional().nullable(),
  ),
});

export async function addMilestone(
  contractId: string,
  sequence: number,
  formData: FormData,
): Promise<{
  success: boolean;
  error?: string;
  milestone?: z.infer<typeof ContractMilestoneSchema>;
}> {
  console.log(
    `[Server Action] Attempting to add milestone to contract: ${contractId}`,
  );

  const validatedFields = AddMilestoneFormSchema.safeParse({
    contractId: contractId,
    description: formData.get('description'),
    amount: formData.get('amount'),
    sequence: sequence,
    dueDate: formData.get('dueDate'),
  });

  if (!validatedFields.success) {
    console.error(
      '[Server Action] Add Milestone validation failed:',
      validatedFields.error.flatten().fieldErrors,
    );
    // Simplified error message, could return detailed errors
    return { success: false, error: 'Invalid milestone data provided.' };
  }

  const { description, amount, dueDate } = validatedFields.data;

  // TODO: Add permission checks - is the current user allowed to add milestones to this contract?

  try {
    // Determine the next sequence number (this might need a query)
    // For now, assume sequence is passed correctly or handled elsewhere
    // const nextSequence = await getNextMilestoneSequence(contractId);

    const newMilestoneData = {
      contract_id: contractId,
      description: description,
      amount: amount,
      status: 'pending' as const, // Explicitly cast status
      sequence: sequence, // Use calculated or passed sequence
      due_date: dueDate || null, // <-- Pass dueDate (or null) to database operation
    };

    const createdMilestone =
      await contractMilestoneOperations.createMilestone(newMilestoneData);

    if (!createdMilestone) {
      return {
        success: false,
        error: 'Failed to create milestone in database.',
      };
    }

    console.log(
      `[Server Action] Milestone added successfully: ${createdMilestone.milestone?.id}`,
    );

    // Revalidate path
    revalidatePath('/orders', 'layout'); // Revalidate layout or specific path

    return { success: true, milestone: createdMilestone };
  } catch (error) {
    console.error('[Server Action] Error adding milestone:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while adding the milestone.',
    };
  }
}

// Helper function example (needs implementation if sequence calculation is needed here)
// async function getNextMilestoneSequence(contractId: string): Promise<number> {
//   // Query contract_milestones, find max sequence for contractId, return max + 1
//   return 1; // Placeholder
// }
