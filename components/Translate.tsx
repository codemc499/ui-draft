// components/Translate.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslateProps {
  id: string;
  values?: Record<string, unknown>;
}

export default function Translate({ id, values }: TranslateProps) {
  const { t } = useTranslation('common');
  // t(...) should return a string; if it ever returns an object, fallback to JSON
  const text = t(id, values) as unknown;
  return <>{typeof text === 'string' ? text : JSON.stringify(text)}</>;
}
