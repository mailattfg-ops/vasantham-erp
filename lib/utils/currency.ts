/**
 * @file lib/utils/currency.ts
 * Currency formatting utilities — all DB values are in PAISE (integers)
 */

/**
 * Formats a paise value to INR display string (e.g. 9950 → "₹99.50")
 */
export function formatINR(paise: number): string {
  const rupees = paise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees)
}

/**
 * Converts rupees (float) to paise (integer)
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

/**
 * Converts paise (integer) to rupees (float)
 */
export function paiseToRupees(paise: number): number {
  return paise / 100
}

/**
 * Formats a number in Indian numbering system without currency symbol
 */
export function formatNumber(paise: number): string {
  const rupees = paise / 100
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees)
}
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)
}