'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { authOperations, SignUpSchema } from '@/utils/supabase';
import { z } from 'zod';
import * as Input from '@/components/ui/input';
import * as Button from '@/components/ui/button';
import * as AlertUI from '@/components/ui/alert';
import * as Radio from '@/components/ui/radio';
import * as Label from '@/components/ui/label';
import { RiErrorWarningLine, RiCheckboxCircleLine } from '@remixicon/react';

// Alert component
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
}) => (
  <AlertUI.Root status={variant} variant='lighter' size='small' className={className}>
    <AlertUI.Icon as={variant === 'error' ? RiErrorWarningLine : RiCheckboxCircleLine} />
    <div className='flex flex-col space-y-1'>
      <h5 className='font-medium'>{title}</h5>
      <p className='text-paragraph-xs'>{description}</p>
    </div>
  </AlertUI.Root>
);

export default function SignupForm() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'buyer' | 'seller' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      SignUpSchema.parse({
        email,
        password,
        full_name: fullName,
        user_type: userType || undefined,
      });

      const { error: signUpError } = await authOperations.signUp({
        email,
        password,
        full_name: fullName,
        user_type: userType as 'buyer' | 'seller',
      });

      if (signUpError) {
        setError(signUpError);
        return;
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(t('auth.signup.unexpectedError'));
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
            as={RiCheckboxCircleLine}
            className='mx-auto mb-4 size-16 text-success-base'
          />
          <h2 className='text-2xl font-bold tracking-tight text-text-strong-950'>
            {t('auth.signup.successTitle')}
          </h2>
          <p className='mt-4 text-paragraph-sm text-text-sub-600'>
            {t('auth.signup.successDesc')}
          </p>
          <div className='mt-6'>
            <Button.Root
              variant='primary'
              mode='filled'
              size='medium'
              className='w-full'
              asChild
            >
              <Link href={`/${i18n.language}/auth/login`}>
                {t('auth.signup.goToLogin')}
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
          {t('auth.signup.title')}
        </h2>
        <p className='mt-2 text-paragraph-sm text-text-sub-600'>
          {t('auth.signup.description')}
        </p>
      </div>

      {error && (
        <Alert
          variant='error'
          title={t('auth.signup.signupFailed')}
          description={error}
          className='mb-4'
        />
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* User type radio */}
        <div className='space-y-2'>
          <Label.Root className='text-label-sm text-text-strong-950'>
            {t('auth.signup.userTypeLabel')}
          </Label.Root>
          <Radio.Group
            className='flex gap-4'
            value={userType}
            onValueChange={(v) => setUserType(v as 'buyer' | 'seller')}
            required
            disabled={loading}
          >
            <div className='flex items-center space-x-2'>
              <Radio.Item value='buyer' id='r1' />
              <Label.Root htmlFor='r1'>{t('auth.signup.buyer')}</Label.Root>
            </div>
            <div className='flex items-center space-x-2'>
              <Radio.Item value='seller' id='r2' />
              <Label.Root htmlFor='r2'>{t('auth.signup.seller')}</Label.Root>
            </div>
          </Radio.Group>
        </div>

        {/* Full name */}
        <Input.Root size='medium'>
          <Input.Wrapper>
            <Input.Input
              id='fullName'
              type='text'
              placeholder={t('auth.signup.fullNamePlaceholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
          </Input.Wrapper>
        </Input.Root>

        {/* Email */}
        <Input.Root size='medium'>
          <Input.Wrapper>
            <Input.Input
              id='email'
              type='email'
              placeholder={t('auth.signup.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </Input.Wrapper>
        </Input.Root>

        {/* Password */}
        <div>
          <Input.Root size='medium'>
            <Input.Wrapper>
              <Input.Input
                id='password'
                type='password'
                placeholder={t('auth.signup.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </Input.Wrapper>
          </Input.Root>
          <p className='text-xs mt-2 text-text-soft-400'>
            {t('auth.signup.passwordHelper')}
          </p>
        </div>

        {/* Submit */}
        <Button.Root
          variant='primary'
          mode='filled'
          size='medium'
          disabled={loading}
          className='w-full'
          type='submit'
        >
          {loading ? t('auth.signup.creating') : t('auth.signup.signUp')}
        </Button.Root>
      </form>

      <div className='text-center text-paragraph-sm'>
        <p className='text-text-sub-600'>
          {t('auth.signup.alreadyHaveAccount')}{' '}
          <Link
            href={`/${i18n.language}/auth/login`}
            className='text-primary-base hover:underline'
          >
            {t('auth.signup.logIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
