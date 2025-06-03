// Utility functions for formatting data

/**
 * Formats a number as currency.
 * @param amount - The numeric amount to format.
 * @param currencyCode - The ISO currency code (e.g., 'USD', 'EUR'). Defaults to 'USD'.
 * @returns Formatted currency string (e.g., "$1,234.56") or '-' if amount is invalid.
 */
export function formatCurrency(
  amount: number | null | undefined,
  currencyCode: string = 'USD',
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-'; // Return a dash for invalid or missing amounts
  }

  try {
    return new Intl.NumberFormat('en-US', {
      // Consider making locale dynamic if needed
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error(`Error formatting currency for code ${currencyCode}:`, error);
    // Fallback for invalid currency codes
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Formats a number with default locale settings (e.g., thousands separators).
 * @param value - The number to format.
 * @returns Formatted number string or '-' if value is invalid.
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }
  return new Intl.NumberFormat('en-US').format(value);
}
