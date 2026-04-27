/**
 * @file lib/utils/barcode.ts
 * Barcode generation utilities — Code128 format
 * SKU format for textile: VAS-[CATEGORY]-[SEQUENCE]
 * Example: VAS-FAB-001, VAS-RDM-042, VAS-ACC-007
 */

/**
 * Generates a unique barcode value for a textile item.
 * Format: VAS-[CAT3]-[SEQ4] — e.g. "VAS-FAB-0001"
 * This is the industry-standard format for Indian textile retail.
 */
export function generateBarcodeValue(
  categoryCode: string,
  sequence: number
): string {
  const cat = categoryCode.toUpperCase().substring(0, 3).padEnd(3, 'X')
  const seq = String(sequence).padStart(4, '0')
  return `VAS-${cat}-${seq}`
}

/**
 * Validates that a barcode string matches our format
 */
export function validateBarcode(value: string): boolean {
  return /^VAS-[A-Z]{3}-\d{4}$/.test(value)
}

/**
 * Extracts the category code from a barcode value
 */
export function extractCategory(barcodeValue: string): string {
  const parts = barcodeValue.split('-')
  return parts[1] || 'UNK'
}

/**
 * Generates a sequential invoice number
 * Format: VAS/YYYY-YY/NNNN — e.g. "VAS/2025-26/0001"
 */
export function generateInvoiceNumber(sequence: number): string {
  const now = new Date()
  const year = now.getFullYear()
  const nextYear = year + 1
  const fy = `${year}-${String(nextYear).slice(2)}`
  const seq = String(sequence).padStart(4, '0')
  return `VAS/${fy}/${seq}`
}

/**
 * Generates a purchase reference number
 * Format: PUR/YYYY-YY/NNNN
 */
export function generatePurchaseRef(sequence: number): string {
  const now = new Date()
  const year = now.getFullYear()
  const nextYear = year + 1
  const fy = `${year}-${String(nextYear).slice(2)}`
  const seq = String(sequence).padStart(4, '0')
  return `PUR/${fy}/${seq}`
}

/**
 * Generates a quotation number
 * Format: QUO/YYYY-YY/NNNN
 */
export function generateQuoteNumber(sequence: number): string {
  const now = new Date()
  const year = now.getFullYear()
  const nextYear = year + 1
  const fy = `${year}-${String(nextYear).slice(2)}`
  const seq = String(sequence).padStart(4, '0')
  return `QUO/${fy}/${seq}`
}
