'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { contractOperations } from '@/utils/supabase/database';
import { BaseFileData } from '@/utils/supabase/types';
import { randomUUID } from 'crypto'; // For generating unique file names

interface UploadResult {
  success: boolean;
  message?: string;
  newAttachments?: BaseFileData[];
  error?: string;
}

// Function to extract file extension
function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export async function uploadContractAttachments(
  contractId: string,
  formData: FormData,
): Promise<UploadResult> {
  if (!contractId) {
    return { success: false, error: 'Contract ID is required.' };
  }

  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return { success: false, error: 'No files provided.' };
  }

  console.log(`Uploading ${files.length} files for contract ${contractId}...`);

  const supabase = await createSupabaseServerClient();
  const newFileDatas: BaseFileData[] = [];

  try {
    // 1. Upload files to storage
    for (const file of files) {
      if (file.size === 0) {
        console.warn(`Skipping empty file: ${file.name}`);
        continue; // Skip empty files
      }

      const fileExtension = getFileExtension(file.name);
      const uniqueFileName = `${randomUUID()}.${fileExtension}`;
      const filePath = `${contractId}/${uniqueFileName}`; // Store in folder named after contractId

      console.log(`Uploading ${file.name} (${file.size} bytes) to ${filePath}`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contract-attachments') // Ensure this bucket exists
        .upload(filePath, file);

      if (uploadError) {
        console.error(`Error uploading ${file.name}:`, uploadError);
        throw new Error(
          `Failed to upload ${file.name}: ${uploadError.message}`,
        );
      }

      console.log(
        `File ${file.name} uploaded successfully. Path: ${uploadData?.path}`,
      );

      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('contract-attachments')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        console.error(`Could not get public URL for ${filePath}`);
        throw new Error(`Could not get public URL for ${file.name}`);
      }

      console.log(`Public URL for ${file.name}: ${publicUrlData.publicUrl}`);

      newFileDatas.push({
        name: file.name,
        size: file.size,
        url: publicUrlData.publicUrl,
      });
    }

    // 3. Update contract record
    if (newFileDatas.length > 0) {
      const currentContract =
        await contractOperations.getContractById(contractId);
      if (!currentContract) {
        throw new Error(`Contract with ID ${contractId} not found.`);
      }

      const existingAttachments = currentContract.attachments || [];
      const updatedAttachments = [...existingAttachments, ...newFileDatas];

      console.log(`Updating contract ${contractId} attachments...`);
      const updatedContract = await contractOperations.updateContract(
        contractId,
        {
          attachments: updatedAttachments,
        },
      );

      if (!updatedContract) {
        throw new Error('Failed to update contract attachments in database.');
      }
      console.log(`Contract ${contractId} attachments updated.`);
    }

    // 4. Revalidate path to show updated files
    revalidatePath(`/orders/detail/${contractId}`);

    return {
      success: true,
      message: `${newFileDatas.length} file(s) uploaded successfully.`,
      newAttachments: newFileDatas, // Return the details of newly added files
    };
  } catch (error: any) {
    console.error('Error during file upload process:', error);
    // Optional: Attempt to clean up already uploaded files if update fails?
    return {
      success: false,
      error:
        error.message || 'An unexpected error occurred during file upload.',
    };
  }
}
