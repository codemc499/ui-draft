'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function ServicesPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [, lang] = usePathname().split('/');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    router.replace(`/${lang}/services/search`);
  }, [router, lang]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse">{t('services.page.redirecting')}</div>
    </div>
  );
}
