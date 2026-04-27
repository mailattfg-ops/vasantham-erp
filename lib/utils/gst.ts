/**
 * @file lib/utils/gst.ts
 * GST calculation utilities for Kerala (intra-state: CGST + SGST only)
 * All values in PAISE
 */

import type { GSTRate } from '@/types'

export interface GSTBreakup {
  baseAmount: number   // paise (price before GST)
  cgst: number         // paise
  sgst: number         // paise
  totalGst: number     // paise
  totalAmount: number  // paise (base + GST)
}

/**
 * Calculates GST breakup for a given amount and rate.
 * Kerala is intra-state — always CGST + SGST (never IGST).
 * @param amountPaise - The taxable amount in paise (after discount)
 * @param gstRate - GST rate as a number (0, 5, 12, or 18)
 * @param isInclusive - If true, amount already includes GST (extract it)
 */
export function calculateGST(
  amountPaise: number,
  gstRate: GSTRate,
  isInclusive = false
): GSTBreakup {
  if (gstRate === 0) {
    return {
      baseAmount: amountPaise,
      cgst: 0,
      sgst: 0,
      totalGst: 0,
      totalAmount: amountPaise,
    }
  }

  let baseAmount: number
  let totalGst: number

  if (isInclusive) {
    // Extract GST from inclusive price
    baseAmount = Math.round((amountPaise * 100) / (100 + gstRate))
    totalGst = amountPaise - baseAmount
  } else {
    // Add GST to exclusive price
    baseAmount = amountPaise
    totalGst = Math.round((amountPaise * gstRate) / 100)
  }

  const cgst = Math.round(totalGst / 2)
  const sgst = totalGst - cgst // handles odd paise

  return {
    baseAmount,
    cgst,
    sgst,
    totalGst: cgst + sgst,
    totalAmount: baseAmount + cgst + sgst,
  }
}

/**
 * Calculates GST for a cart of items and returns total breakup
 */
export function calculateCartGST(
  items: Array<{ amount: number; gstRate: GSTRate }>
): { totalCgst: number; totalSgst: number; totalGst: number } {
  let totalCgst = 0
  let totalSgst = 0
  for (const item of items) {
    const { cgst, sgst } = calculateGST(item.amount, item.gstRate)
    totalCgst += cgst
    totalSgst += sgst
  }
  return { totalCgst, totalSgst, totalGst: totalCgst + totalSgst }
}

/**
 * Applies a flat or percentage discount to an amount (in paise)
 */
export function applyDiscount(
  amountPaise: number,
  discountType: 'flat' | 'percent',
  discountValue: number
): number {
  if (discountType === 'flat') {
    return Math.max(0, amountPaise - discountValue)
  }
  const discount = Math.round((amountPaise * discountValue) / 100)
  return Math.max(0, amountPaise - discount)
}
