'use client';

import React, { useState, useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Root as Label } from '@/components/ui/label';
import * as Button from '@/components/ui/button';
import {
  RiDeleteBinLine,
  RiUploadCloud2Line,
  RiErrorWarningLine,
  RiCheckLine,
  RiLoader4Line,
} from '@remixicon/react';
import { SendOfferFormData } from '../schema';
import type { BaseFileData } from '@/utils/supabase/types';
import { cn } from '@/utils/cn';
import supabase from '@/utils/supabase/client';
import { useAuth } from '@/utils/supabase/AuthContext';

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
interface ManagedAttachment {
  localId: string;
  file: File;
  name: string;
  size: number;
  status: UploadStatus;
  errorMessage?: string;
  uploadedUrl?: string;
}

type FormMethods = Omit<UseFormReturn<SendOfferFormData>, 'handleSubmit'>;

interface AttachmentsSectionProps {
  form: Pick<
    FormMethods,
    'control' | 'register' | 'formState' | 'setValue' | 'getValues'
  >;
  setIsUploadingFiles: React.Dispatch<React.SetStateAction<boolean>>;
}

function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function AttachmentsSection({
  form,
  setIsUploadingFiles,
}: AttachmentsSectionProps) {
  const { t } = useTranslation('common');
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const { user } = useAuth();

  // useFieldArray for the final data that matches the schema ({ name, size, url })
  const { fields, append, remove } = useFieldArray<
    SendOfferFormData,
    'attachments',
    'id'
  >({
    control,
    name: 'attachments',
  });

  // --- Internal State for UI and Upload Management ---
  const [managedFiles, setManagedFiles] = useState<ManagedAttachment[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // 1) Sync pre-existing attachments into managedFiles on mount / when fields change
  useEffect(() => {
    const existing = fields.map((f, i) => ({
      localId: `pre-${i}`,
      name: f.name,
      size: f.size,
      status: 'success' as const,
      uploadedUrl: f.url,
      file: new File([], f.name), // dummy File just to satisfy type
    }));
    setManagedFiles(existing);
  }, [fields]);

  // 2) Notify parent when uploads are in flight
  useEffect(() => {
    const currentlyUploading = managedFiles.some(
      (file) => file.status === 'uploading' || file.status === 'idle',
    );
    setIsUploadingFiles(currentlyUploading);
  }, [managedFiles, setIsUploadingFiles]);

  const uploadFile = async (attachment: ManagedAttachment): Promise<void> => {
    if (!user) {
      updateManagedFileStatus(
        attachment.localId,
        'error',
        t('offers.attachments.errors.notLoggedIn'),
      );
      return;
    }
    updateManagedFileStatus(attachment.localId, 'uploading');
    try {
      const fileExt = attachment.file.name.split('.').pop();
      const uniqueFileName = `${user.id}/${attachment.localId}.${fileExt}`;
      const bucketName = 'contract-attachments';

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, attachment.file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uniqueFileName);
      if (!urlData?.publicUrl) throw new Error('Failed to get public URL');

      updateManagedFileStatus(
        attachment.localId,
        'success',
        undefined,
        urlData.publicUrl,
      );

      const finalData: BaseFileData = {
        name: attachment.name,
        size: attachment.size,
        url: urlData.publicUrl,
      };
      append(finalData);
    } catch (err: any) {
      console.error('Upload error:', err);
      updateManagedFileStatus(
        attachment.localId,
        'error',
        err.message || 'Upload failed',
      );
    }
  };

  const updateManagedFileStatus = (
    localId: string,
    status: UploadStatus,
    errorMessage?: string,
    uploadedUrl?: string,
  ) => {
    setManagedFiles((current) =>
      current.map((f) =>
        f.localId === localId ? { ...f, status, errorMessage, uploadedUrl } : f,
      ),
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      const toUpload = Array.from(e.target.files).map((file) => ({
        localId: generateUniqueId(),
        file,
        name: file.name,
        size: file.size,
        status: 'idle' as const,
      }));
      setManagedFiles((m) => [...m, ...toUpload]);
      toUpload.forEach(uploadFile);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveFile = (localId: string) => {
    const f = managedFiles.find((f) => f.localId === localId);
    if (f?.uploadedUrl) {
      const idx = fields.findIndex((fld) => fld.url === f.uploadedUrl);
      if (idx !== -1) remove(idx);
    }
    setManagedFiles((m) => m.filter((f) => f.localId !== localId));
  };

  const renderUploadStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'uploading':
        return <RiLoader4Line className="animate-spin w-[10%]" />;
      case 'success':
        return <RiCheckLine className="w-[10%]" />;
      case 'error':
        return <RiErrorWarningLine className="w-[10%]" />;
      default:
        return <RiUploadCloud2Line className="w-[10%]" />;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full items-start">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
        {managedFiles.length > 0 ? (
          managedFiles.map((file) => (
            <div
              key={file.localId}
              className="flex items-center justify-between rounded-lg border p-2"
            >
              <div className="flex gap-2 items-center w-full justify-between">
                {/* {renderUploadStatusIcon(file.status)} */}
                <div className="flex flex-col w-[80%]">
                  {/* ← file name as clickable link */}
                  {file.uploadedUrl ? (
                    <a
                      href={file.uploadedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 break-all text-[14px]"
                    >
                      {file.name}
                    </a>
                  ) : (
                    <span className="text-gray-700 text-[14px]">{file.name}</span>
                  )}
                  <span className="text-sm text-gray-500 text-[12px]">
                    {formatBytes(file.size)}
                  </span>
                </div>
                <div className='hover:bg-[#F5F7FA] rounded-md p-1'>
                  <RiDeleteBinLine
                    className="cursor-pointer size-5"
                    onClick={() => handleRemoveFile(file.localId)}
                    aria-label={t('offers.attachments.removeFile')}
                  />
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-gray-500">{t('offers.attachments.noFiles')}</div>
        )}
      </div>
      <Label htmlFor="contract-file-upload" className="cursor-pointer">
        <div className='flex items-center gap-2 justify-between px-2 py-1 border rounded-lg text-[#525866] text-[14px] font-medium hover:text-[#0E121B] hover:bg-[#F5F7FA] hover:border-none'>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.79592 5.08255L9.85717 6.1438C10.3447 6.63132 10.7315 7.2101 10.9954 7.84709C11.2592 8.48409 11.3951 9.16682 11.3951 9.8563C11.3951 10.5458 11.2592 11.2285 10.9954 11.8655C10.7315 12.5025 10.3447 13.0813 9.85717 13.5688L9.59167 13.8336C8.60706 14.8182 7.27163 15.3713 5.87917 15.3713C4.48672 15.3713 3.15129 14.8182 2.16667 13.8336C1.18206 12.8489 0.628906 11.5135 0.628906 10.1211C0.628906 8.72859 1.18206 7.39317 2.16667 6.40855L3.22792 7.4698C2.8772 7.81747 2.5986 8.23098 2.40812 8.68661C2.21764 9.14223 2.11903 9.63099 2.11795 10.1248C2.11686 10.6187 2.21333 11.1079 2.40182 11.5643C2.5903 12.0208 2.86709 12.4355 3.21629 12.7847C3.56548 13.1339 3.98021 13.4107 4.43667 13.5992C4.89312 13.7876 5.38231 13.8841 5.87615 13.883C6.36998 13.8819 6.85875 13.7833 7.31437 13.5929C7.76999 13.4024 8.18351 13.1238 8.53117 12.7731L8.79667 12.5076C9.49969 11.8043 9.89462 10.8507 9.89462 9.8563C9.89462 8.86194 9.49969 7.90828 8.79667 7.20505L7.73542 6.1438L8.79667 5.0833L8.79592 5.08255ZM13.8344 9.5908L12.7739 8.5303C13.1246 8.18264 13.4032 7.76912 13.5937 7.3135C13.7842 6.85787 13.8828 6.36911 13.8839 5.87528C13.885 5.38144 13.7885 4.89225 13.6 4.4358C13.4115 3.97934 13.1348 3.56461 12.7856 3.21541C12.4364 2.86622 12.0216 2.58943 11.5652 2.40095C11.1087 2.21246 10.6195 2.11599 10.1257 2.11707C9.63186 2.11815 9.1431 2.21677 8.68748 2.40725C8.23185 2.59773 7.81834 2.87633 7.47067 3.22705L7.20517 3.49255C6.50216 4.19578 6.10722 5.14944 6.10722 6.1438C6.10722 7.13817 6.50216 8.09182 7.20517 8.79505L8.26642 9.8563L7.20517 10.9168L6.14467 9.8563C5.65711 9.36879 5.27035 8.79001 5.00648 8.15301C4.74261 7.51602 4.6068 6.83329 4.6068 6.1438C4.6068 5.45432 4.74261 4.77158 5.00648 4.13459C5.27035 3.4976 5.65711 2.91882 6.14467 2.4313L6.41017 2.16655C7.39479 1.18194 8.73022 0.628784 10.1227 0.628784C11.5151 0.628784 12.8506 1.18194 13.8352 2.16655C14.8198 3.15117 15.3729 4.48659 15.3729 5.87905C15.3729 7.27151 14.8198 8.60694 13.8352 9.59155L13.8344 9.5908Z" fill="#525866" />
          </svg>

          <span className="">{t('offers.attachments.attachFile')}</span>
        </div>
        <input
          id="contract-file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          aria-label={t('offers.attachments.fileInput')}
        />
      </Label>
    </div>
  );
}
