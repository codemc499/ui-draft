'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  RiCloseLine,
  RiLinksLine,
  RiLoader2Fill,
  RiUploadCloud2Line,
  RiInformationLine,
} from '@remixicon/react';
import { useTranslation } from 'react-i18next';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import * as FileFormatIcon from '@/components/ui/file-format-icon';
import * as FileUpload from '@/components/ui/file-upload';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as ProgressBar from '@/components/ui/progress-bar';
import * as Checkbox from '@/components/ui/checkbox';
import * as Badge from '@/components/ui/badge';
import * as Tag from '@/components/ui/tag';
import * as Textarea from '@/components/ui/textarea';
import * as Alert from '@/components/ui/alert';
import { userOperations } from '@/utils/supabase/database';
import { useNotification } from '@/hooks/use-notification';

function IconInfoCustomFill(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={20}
      height={20}
      fill='none'
      viewBox='0 0 20 20'
      {...props}
    >
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M10 16.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm1.116-3.041l.1-.408a1.709 1.709 0 01-.25.083 1.176 1.176 0 01-.308.048c-.193 0-.329-.032-.407-.095-.079-.064-.118-.184-.118-.359a3.514 3.514 0 01.118-.672l.373-1.318c.037-.121.062-.255.075-.4a3.73 3.73 0 00.02-.304.866.866 0 00-.292-.678c-.195-.174-.473-.26-.833-.26-.2 0-.412.035-.636.106a9.37 9.37 0 00-.704.256l-.1.409a3.49 3.49 0 01.262-.087c.101-.03.2-.045.297-.045.198 0 .331.034.4.1.07.066.105.185.105.354 0 .093-.01.197-.034.31a6.216 6.216 0 01-.084.36l-.374 1.325c-.033.14-.058.264-.073.374a2.42 2.42 0 00-.022.325c0 .272.1.496.301.673.201.177.483.265.846.265.236 0 .443-.03.621-.092s.417-.152.717-.27zM11.05 7.85a.772.772 0 00.26-.587.78.78 0 00-.26-.59.885.885 0 00-.628-.244.893.893 0 00-.63.244.778.778 0 00-.264.59c0 .23.088.426.263.587a.897.897 0 00.63.243.888.888 0 00.629-.243z'
        clipRule='evenodd'
      />
    </svg>
  );
}

interface BlockFileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onUploadComplete?: (updatedMusicData: any[]) => void;
}

export default function BlockFileUploadDialog({
  open,
  onOpenChange,
  userId,
  onUploadComplete,
}: BlockFileUploadDialogProps) {
  const { t } = useTranslation('common');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { notification: toast } = useNotification();

  React.useEffect(() => {
    if (open) {
      setFile(null);
      setTitle('');
      setRemarks('');
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError(null);
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setUploadError(t('fileUpload.errors.fileSize'));
        setFile(null);
      } else if (!selectedFile.type.startsWith('audio/')) {
        setUploadError(t('fileUpload.errors.fileType'));
        setFile(null);
      } else {
        setFile(selectedFile);
        setTitle(selectedFile.name.split('.')[0]);
        setUploadError(null);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file || !title || !userId) {
      const missingFields = [];
      if (!file) missingFields.push('File');
      if (!title) missingFields.push('Title');
      setUploadError(t('fileUpload.errors.missingFields', { fields: missingFields.join(' ') }));
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const result = await userOperations.uploadUserMusic(
        userId,
        file,
        title,
        remarks || null,
      );

      clearInterval(interval);
      setUploadProgress(100);

      if (result.success) {
        toast({
          title: t('fileUpload.success.title'),
          description: t('fileUpload.success.description', { fileName: file.name }),
        });
        onUploadComplete?.(result.updatedMusicData || []);
        onOpenChange(false);
      } else {
        const errorMessage = typeof result.error === 'string' ? result.error : result.error?.message || 'Upload failed.';
        setUploadError(t('fileUpload.errors.uploadFailed', { message: errorMessage }));
        toast({
          title: t('fileUpload.errors.uploadFailed', { message: errorMessage }),
          description: errorMessage,
        });
      }
    } catch (error: any) {
      clearInterval(interval);
      const errorMessage = error.message || 'An unexpected error occurred.';
      setUploadError(t('fileUpload.errors.uploadFailed', { message: errorMessage }));
      toast({
        title: t('fileUpload.errors.uploadFailed', { message: errorMessage }),
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > 50 * 1024 * 1024) {
        setUploadError('File size exceeds 50MB limit.');
        setFile(null);
      } else if (!droppedFile.type.startsWith('audio/')) {
        setUploadError('Invalid file type. Please upload an audio file.');
        setFile(null);
      } else {
        setFile(droppedFile);
        setTitle(droppedFile.name.split('.')[0]);
        setUploadError(null);
      }
    }
  }, []);

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='max-w-[440px] shadow-custom-md max-h-[85vh] overflow-y-auto'>
        <Modal.Header
          icon={RiUploadCloud2Line}
          title={t('fileUpload.title')}
          description={t('fileUpload.description')}
        />
        <Modal.Body className='space-y-6'>
          <div className='space-y-4'>
            <FileUpload.Root
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={uploadError ? 'border-red-500' : ''}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept="audio/*"
                onChange={handleFileChange}
                tabIndex={-1}
                className='hidden'
              />
              <FileUpload.Icon as={RiUploadCloud2Line} />
              <div className='space-y-1.5'>
                <div className='text-label-sm text-text-strong-950'>
                  {t('fileUpload.chooseFile')}
                </div>
                <div className='text-paragraph-xs text-text-sub-600'>
                  {t('fileUpload.fileTypes')}
                </div>
              </div>
            </FileUpload.Root>
            {file && (
              <div className='space-y-4'>
                <div className='flex w-full flex-col gap-4 rounded-2xl border border-stroke-soft-200 p-4 pl-3.5'>
                  <div className='flex gap-3 items-center'>
                    <FileFormatIcon.Root format={file.type.split('/')[1]?.toUpperCase() || 'AUDIO'} color='purple' />
                    <div className='space-y-4'>
                      <div className='flex w-full flex-col gap-4 rounded-2xl border border-stroke-soft-200 p-4 pl-3.5'>
                        <div className='flex gap-3'>
                          <FileFormatIcon.Root format='PDF' color='red' />
                          <div className='flex-1 space-y-1'>
                            <div className='text-label-sm text-text-strong-950'>
                              my-cv.pdf
                            </div>
                            <div className='flex items-center gap-1'>
                              <span className='text-paragraph-xs text-text-sub-600'>
                                60 KB of 120 KB
                              </span>
                              <span className='text-paragraph-xs text-text-sub-600'>
                                ∙
                              </span>
                              <RiLoader2Fill className='size-4 shrink-0 animate-spin text-primary-base' />
                              <span className='text-paragraph-xs text-text-strong-950'>
                                {t('fileUpload.uploading')}
                              </span>
                            </div>
                          </div>
                          <CompactButton.Root
                            variant='ghost'
                            size='medium'
                            tabIndex={-1}
                          >
                            <CompactButton.Icon as={RiCloseLine} />
                          </CompactButton.Root>
                        </div>
                        <ProgressBar.Root value={50} />
                      </div>
                    </div>
                  </div>
                  <Divider.Root variant='line-text'>{t('fileUpload.or')}</Divider.Root>
                  <div className='flex flex-col gap-1'>
                    <Label.Root className='flex items-center gap-1 text-label-sm text-text-strong-950'>
                      {t('fileUpload.importFromUrl')}
                      <IconInfoCustomFill className='size-4 text-text-disabled-300' />
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiLinksLine} />
                        <Input.Input placeholder={t('fileUpload.pasteUrl')} />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <Label.Root className='text-label-sm text-text-strong-950'>
                      {t('fileUpload.subject')}
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input placeholder={t('fileUpload.question')} />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button.Root
            variant='neutral'
            mode='stroke'
            onClick={() => onOpenChange(false)}
          >
            {t('fileUpload.cancel')}
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='filled'
            onClick={() => onOpenChange(false)}
          >
            {t('fileUpload.upload')}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
