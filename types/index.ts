/**
 * @file types/index.ts
 * All TypeScript interfaces and types for Vasantham Textiles ERP
 * Monetary values are stored in PAISE (integers) — divide by 100 for display
 */

// ─── Core Enums ──────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'cashier' | 'staff'
export type BillingMode = 'retail' | 'wholesale' | 'cash_counter'
export type PaymentMode = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque' | 'credit'
export type SaleStatus = 'draft' | 'completed' | 'returned' | 'cancelled'
export type PurchaseStatus = 'draft' | 'received' | 'partial' | 'returned' | 'cancelled'
export type ChequeStatus = 'pending' | 'cleared' | 'bounced'
export type StockAdjReason = 'purchase' | 'sale' | 'damage' | 'return' | 'manual' | 'opening'
export type AccountType = 'asset' | 'liability' | 'income' | 'expense' | 'capital'
export type GSTRate = 0 | 5 | 12 | 18
export type BarcodeFormat = 'CODE128'
export type LabelSize = '50x25' | '40x20'

// ─── User & Employee ─────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  user_id: string
  name: string
  phone: string
  email: string
  role: UserRole
  address?: string
  join_date: string
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

// ─── Vendor ───────────────────────────────────────────────────────────────────

export interface Vendor {
  id: string
  name: string
  contact_person?: string
  phone: string
  email?: string
  gst_number?: string
  address: string
  city: string
  state: string
  pincode?: string
  bank_name?: string
  account_number?: string
  ifsc_code?: string
  opening_balance: number // paise
  current_balance: number // paise
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

// ─── Accounting ────────────────────────────────────────────────────────────

export interface ChartOfAccount {
  id: string
  code: string
  name: string
  type: AccountType
  parent_id?: string
  opening_balance: number // paise
  current_balance: number // paise
  is_system: boolean // system accounts cannot be deleted
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  date: string
  reference: string
  narration: string
  debit_account_id: string
  credit_account_id: string
  amount: number // paise
  created_by: string
  created_at: string
  updated_at: string
  // joined
  debit_account?: ChartOfAccount
  credit_account?: ChartOfAccount
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  description?: string
  parent_id?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Item {
  id: string
  sku: string
  name: string
  description?: string
  category_id: string
  unit: string // metres, pieces, kg, etc.
  hsn_code: string
  gst_rate: GSTRate
  mrp: number // paise
  cost_price: number // paise
  wholesale_price?: number // paise
  stock_quantity: number // in units (for textile: metres or pieces)
  min_stock_level: number // low stock threshold
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
  // joined
  category?: Category
  barcode?: Barcode
  variants?: ItemVariant[]
}

export interface ItemVariant {
  id: string
  item_id: string
  name: string // e.g. "Blue - Medium"
  color?: string
  size?: string
  mrp: number // paise — can override parent
  cost_price: number // paise
  stock_quantity: number
  barcode_value?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Barcode {
  id: string
  item_id: string
  variant_id?: string
  barcode_value: string // e.g. "VAS-FAB-001"
  format: BarcodeFormat
  created_at: string
}

export interface StockAdjustment {
  id: string
  item_id: string
  variant_id?: string
  type: 'add' | 'reduce'
  quantity: number
  reason: StockAdjReason
  notes?: string
  reference_id?: string // purchase_id or sale_id
  created_by: string
  created_at: string
  // joined
  item?: Item
}

export interface DamageStock {
  id: string
  item_id: string
  variant_id?: string
  quantity: number
  reason: string
  notes?: string
  created_by: string
  created_at: string
  // joined
  item?: Item
}

// ─── Barcode Label Print ──────────────────────────────────────────────────

export interface LabelPrintRequest {
  item: Item
  variant?: ItemVariant
  quantity: number // number of labels to print
  size: LabelSize
}

// ─── Purchase ─────────────────────────────────────────────────────────────────

export interface Purchase {
  id: string
  reference_number: string
  vendor_id: string
  date: string
  status: PurchaseStatus
  subtotal: number // paise
  discount_type?: 'flat' | 'percent'
  discount_value: number // paise or percent
  discount_amount: number // paise
  cgst_amount: number // paise
  sgst_amount: number // paise
  total_amount: number // paise
  paid_amount: number // paise
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
  deleted_at?: string
  // joined
  vendor?: Vendor
  items?: PurchaseItem[]
  payments?: PurchasePayment[]
}

export interface PurchaseItem {
  id: string
  purchase_id: string
  item_id: string
  variant_id?: string
  quantity: number
  unit_price: number // paise
  gst_rate: GSTRate
  cgst_amount: number // paise
  sgst_amount: number // paise
  total_amount: number // paise
  // joined
  item?: Item
  variant?: ItemVariant
}

export interface PurchaseReturn {
  id: string
  purchase_id: string
  date: string
  reason: string
  items: PurchaseReturnItem[]
  total_amount: number // paise
  created_by: string
  created_at: string
}

export interface PurchaseReturnItem {
  item_id: string
  variant_id?: string
  quantity: number
  amount: number // paise
}

export interface PurchasePayment {
  id: string
  purchase_id: string
  mode: PaymentMode
  amount: number // paise
  date: string
  cheque_number?: string
  bank_name?: string
  notes?: string
  created_at: string
}

// ─── Sales ────────────────────────────────────────────────────────────────────

export interface Sale {
  id: string
  invoice_number: string
  billing_mode: BillingMode
  customer_name?: string
  customer_phone?: string
  customer_gstin?: string
  vendor_id?: string // for wholesale
  date: string
  status: SaleStatus
  subtotal: number // paise
  discount_type?: 'flat' | 'percent'
  discount_value: number
  discount_amount: number // paise
  cgst_amount: number // paise
  sgst_amount: number // paise
  total_amount: number // paise
  paid_amount: number // paise
  change_amount: number // paise (cash change to return)
  cashier_id: string
  session_id?: string
  notes?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  // joined
  items?: SaleItem[]
  payments?: SalePayment[]
}

export interface SaleItem {
  id: string
  sale_id: string
  item_id: string
  variant_id?: string
  item_name: string // snapshot
  barcode_value: string // snapshot
  quantity: number
  unit_price: number // paise (at time of sale)
  gst_rate: GSTRate
  cgst_amount: number // paise
  sgst_amount: number // paise
  discount_amount: number // paise
  total_amount: number // paise
  // joined
  item?: Item
  variant?: ItemVariant
}

export interface SaleReturn {
  id: string
  sale_id: string
  date: string
  reason: string
  items: SaleReturnItem[]
  refund_amount: number // paise
  refund_mode: PaymentMode
  created_by: string
  created_at: string
}

export interface SaleReturnItem {
  item_id: string
  variant_id?: string
  quantity: number
  amount: number // paise
}

export interface SalePayment {
  id: string
  sale_id: string
  mode: PaymentMode
  amount: number // paise
  date: string
  reference?: string // UPI ref, card last 4, etc.
  notes?: string
  created_at: string
}

// ─── Quotation ────────────────────────────────────────────────────────────

export interface Quotation {
  id: string
  quote_number: string
  customer_name: string
  customer_phone?: string
  date: string
  valid_until: string
  items: QuotationItem[]
  subtotal: number // paise
  discount_amount: number // paise
  cgst_amount: number // paise
  sgst_amount: number // paise
  total_amount: number // paise
  notes?: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  created_by: string
  created_at: string
  updated_at: string
}

export interface QuotationItem {
  item_id: string
  item_name: string
  quantity: number
  unit_price: number // paise
  gst_rate: GSTRate
  total_amount: number // paise
}

// ─── POS ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string // temp cart id
  item_id: string
  variant_id?: string
  item_name: string
  barcode_value: string
  sku: string
  unit: string
  mrp: number // paise
  unit_price: number // paise (selling price, may differ from MRP)
  quantity: number
  gst_rate: GSTRate
  cgst_amount: number // paise
  sgst_amount: number // paise
  discount_amount: number // paise
  total_amount: number // paise
}

export interface HeldBill {
  id: string
  session_id: string
  cashier_id: string
  label: string // e.g. "Bill #2"
  billing_mode: BillingMode
  customer_name?: string
  cart_items: CartItem[]
  discount_type?: 'flat' | 'percent'
  discount_value: number
  held_at: string
}

export interface POSSession {
  id: string
  cashier_id: string
  cashier_name: string
  started_at: string
  ended_at?: string
  opening_cash: number // paise
  total_sales: number // paise
  total_cash: number // paise
  total_card: number // paise
  total_upi: number // paise
  total_credit: number // paise
  bill_count: number
}

// ─── Receipts & Cheques ───────────────────────────────────────────────────────

export interface Cheque {
  id: string
  type: 'payment' | 'receipt'
  party_name: string
  party_id?: string
  amount: number // paise
  cheque_number: string
  bank_name: string
  due_date: string
  status: ChequeStatus
  notes?: string
  created_at: string
  updated_at: string
}

export interface Receipt {
  id: string
  receipt_number: string
  sale_id?: string
  purchase_id?: string
  party_name: string
  amount: number // paise
  mode: PaymentMode
  date: string
  notes?: string
  created_at: string
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface DashboardStats {
  today_sales: number // paise
  today_bill_count: number
  low_stock_count: number
  pending_receivables: number // paise
  top_items: TopItem[]
  payment_split: PaymentSplit
}

export interface TopItem {
  item_id: string
  item_name: string
  total_qty: number
  total_amount: number // paise
}

export interface PaymentSplit {
  cash: number // paise
  card: number // paise
  upi: number // paise
  credit: number // paise
}

// ─── Company Info ─────────────────────────────────────────────────────────────

export interface CompanyInfo {
  name: string
  tagline: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  gstin: string
  logo?: string
}
