'use client';

import { useState } from 'react';
import { authOperations } from '@/utils/supabase';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import * as Input from '@/components/ui/input';
import * as Button from '@/components/ui/button';
import * as AlertUI from '@/components/ui/alert';
import {
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiMailLine,
} from '@remixicon/react';
import Link from 'next/link';

// Custom Alert component using the AlertUI components
const Alert = ({
  variant,
  title,
  description,
  className,
}: {
  variant: 'error' | 'success' | 'warning' | 'information';
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <AlertUI.Root
      className={className}
      status={variant}
      variant='lighter'
      size='small'
    >
      <AlertUI.Icon
        as={variant === 'error' ? RiErrorWarningLine : RiCheckboxCircleLine}
      />
      <div className='flex flex-col space-y-1'>
        <h5 className='font-medium'>{title}</h5>
        <p className='text-paragraph-xs'>{description}</p>
      </div>
    </AlertUI.Root>
  );
};

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordForm() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate email
      emailSchema.parse({ email });

      // Attempt to send password reset email
      const { error } = await authOperations.resetPassword(email);

      if (error) {
        setError(error);
        return;
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An unexpected error occurred');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='shadow-md w-full max-w-md rounded-lg bg-white p-8'>
        <div className='text-center'>
          <AlertUI.Icon
            as={RiMailLine}
            className='mx-auto mb-4 size-16 text-success-base'
          />
          <h2 className='text-2xl font-bold tracking-tight text-text-strong-950'>
            {t('auth.forgotPassword.checkedEmailTitle')}
          </h2>
          <p className='mt-4 text-paragraph-sm text-text-sub-600'>
            {t('auth.forgotPassword.checkedEmailDesc', { email })}
          </p>
          <div className='mt-6'>
            <Button.Root
              variant='primary'
              mode='filled'
              size='medium'
              className='w-full'
              asChild
            >
              <Link href={`/${t('lang')}/auth/login`}>         {/* lang key */}
                {t('auth.forgotPassword.backToLogin')}
              </Link>
            </Button.Root>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold tracking-tight text-text-strong-950'>
          {t('auth.forgotPassword.title')}
        </h2>
        <p className='mt-2 text-paragraph-sm text-text-sub-600'>
          {t('auth.forgotPassword.description')}
        </p>
      </div>

      {error && (
        <Alert
          variant='error'
          title='Error'
          description={error}
          className='mb-4'
        />
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Input.Root size='medium'>
            <Input.Wrapper>
              <Input.Icon as={RiMailLine} />
              <Input.Input
                id='email'
                type='email'
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                disabled={loading}
                required
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='pt-2'>
          <Button.Root
            variant='primary'
            mode='filled'
            size='medium'
            disabled={loading}
            className='w-full'
            type='submit'
          >
            {loading
              ? t('auth.forgotPassword.sending')
              : t('auth.forgotPassword.sendResetLink')}
          </Button.Root>
        </div>
      </form>

      <div className='text-center text-paragraph-sm'>
        <p className='text-text-sub-600'>
          {t('auth.forgotPassword.remember')} {' '}
          <Link
            href={`/${t('lang')}/auth/login`}
            className='text-primary-base hover:underline'
          >
            {t('auth.forgotPassword.backToLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
}
