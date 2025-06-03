'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook for copying text to the clipboard.
 * @param {number} [timeout=2000] - Duration in milliseconds for the copied state.
 * @returns {{ copy: (text: string) => Promise<boolean>, hasCopied: boolean }}
 */
export function useCopyToClipboard(timeout = 2000) {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not available');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setHasCopied(true);

        const timer = setTimeout(() => {
          setHasCopied(false);
        }, timeout);

        // Optional: Clear timeout if component unmounts or copy is called again?
        // Depends on desired behavior, but usually not necessary for this simple case.

        return true;
      } catch (error) {
        console.warn('Copy failed:', error);
        setHasCopied(false);
        return false;
      }
    },
    [timeout],
  );

  return { copy, hasCopied };
}
