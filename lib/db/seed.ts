/**
 * Seed data for Vasantham Textiles ERP demo
 * Full Indian textile shop inventory with realistic pricing in PAISE
 */

import type { Category, Item, Vendor, Employee, ChartOfAccount, Barcode } from '@/types'

export const COMPANY = {
  name: 'Vasantham Textiles',
  tagline: 'Quality Fabrics Since 1995',
  address: 'No. 42, Cherootty Road, Kozhikode',
  city: 'Kozhikode',
  state: 'Kerala',
  pincode: '673001',
  phone: '+91 94470 12345',
  email: 'info@vasanthamtextiles.com',
  gstin: '32AABCV1234M1ZA',
}

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-01', name: 'Cotton Fabrics', description: 'Plain and printed cotton fabrics', parent_id: undefined, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'cat-02', name: 'Silk Fabrics', description: 'Pure silk and blended silk', parent_id: undefined, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'cat-03', name: 'Synthetic Fabrics', description: 'Polyester, nylon, chiffon', parent_id: undefined, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'cat-04', name: 'Readymade', description: 'Readymade garments and sets', parent_id: undefined, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'cat-05', name: 'Accessories', description: 'Threads, buttons, laces', parent_id: undefined, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'cat-06', name: 'Linen & Wool', description: 'Linen, khadi, woolen fabrics', parent_id: undefined, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
]

export const SEED_ITEMS: Item[] = [
  // Cotton Fabrics
  { id: 'item-01', sku: 'VAS-COT-0001', name: 'Pure Cotton Shirting', description: 'Premium white plain cotton', category_id: 'cat-01', unit: 'metre', hsn_code: '5208', gst_rate: 5, mrp: 18000, cost_price: 13000, stock_quantity: 150, min_stock_level: 20, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-02', sku: 'VAS-COT-0002', name: 'Cotton Printed Dress Material', description: 'Floral printed cotton', category_id: 'cat-01', unit: 'metre', hsn_code: '5208', gst_rate: 5, mrp: 28000, cost_price: 20000, stock_quantity: 80, min_stock_level: 15, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-03', sku: 'VAS-COT-0003', name: 'Khadi Cotton', description: 'Handloom khadi fabric', category_id: 'cat-01', unit: 'metre', hsn_code: '5208', gst_rate: 5, mrp: 35000, cost_price: 26000, stock_quantity: 60, min_stock_level: 10, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-04', sku: 'VAS-COT-0004', name: 'Cotton Voile', description: 'Light semi-transparent cotton', category_id: 'cat-01', unit: 'metre', hsn_code: '5208', gst_rate: 5, mrp: 14000, cost_price: 9500, stock_quantity: 200, min_stock_level: 30, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  // Silk
  { id: 'item-05', sku: 'VAS-SLK-0001', name: 'Pure Silk Saree', description: 'Kanchipuram pure silk saree 6.3m', category_id: 'cat-02', unit: 'piece', hsn_code: '5007', gst_rate: 5, mrp: 1200000, cost_price: 900000, stock_quantity: 12, min_stock_level: 3, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-06', sku: 'VAS-SLK-0002', name: 'Silk Blend Fabric', description: 'Polyester silk blend', category_id: 'cat-02', unit: 'metre', hsn_code: '5007', gst_rate: 5, mrp: 55000, cost_price: 38000, stock_quantity: 45, min_stock_level: 8, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-07', sku: 'VAS-SLK-0003', name: 'Raw Silk', description: 'Natural raw silk', category_id: 'cat-02', unit: 'metre', hsn_code: '5007', gst_rate: 5, mrp: 85000, cost_price: 62000, stock_quantity: 30, min_stock_level: 5, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  // Synthetic
  { id: 'item-08', sku: 'VAS-SYN-0001', name: 'Georgette Chiffon', description: 'Light georgette for dupattas', category_id: 'cat-03', unit: 'metre', hsn_code: '5407', gst_rate: 12, mrp: 16000, cost_price: 10000, stock_quantity: 120, min_stock_level: 20, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-09', sku: 'VAS-SYN-0002', name: 'Polyester Crepe', description: 'Matte finish crepe fabric', category_id: 'cat-03', unit: 'metre', hsn_code: '5407', gst_rate: 12, mrp: 19000, cost_price: 13000, stock_quantity: 90, min_stock_level: 15, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-10', sku: 'VAS-SYN-0003', name: 'Net Fabric', description: 'Embroidered net for blouses', category_id: 'cat-03', unit: 'metre', hsn_code: '5407', gst_rate: 12, mrp: 25000, cost_price: 17000, stock_quantity: 70, min_stock_level: 10, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  // Readymade
  { id: 'item-11', sku: 'VAS-RDM-0001', name: 'Cotton Churidar Set', description: '3-piece churidar set', category_id: 'cat-04', unit: 'piece', hsn_code: '6211', gst_rate: 12, mrp: 85000, cost_price: 58000, stock_quantity: 25, min_stock_level: 5, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-12', sku: 'VAS-RDM-0002', name: 'Mens Formal Shirt', description: 'Premium cotton formal shirt', category_id: 'cat-04', unit: 'piece', hsn_code: '6205', gst_rate: 12, mrp: 65000, cost_price: 42000, stock_quantity: 40, min_stock_level: 8, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-13', sku: 'VAS-RDM-0003', name: 'Ladies Blouse Piece', description: 'Pre-stitched blouse piece 1m', category_id: 'cat-04', unit: 'piece', hsn_code: '6211', gst_rate: 5, mrp: 22000, cost_price: 15000, stock_quantity: 60, min_stock_level: 10, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  // Accessories
  { id: 'item-14', sku: 'VAS-ACC-0001', name: 'Embroidery Thread Set', description: '24-colour thread set', category_id: 'cat-05', unit: 'set', hsn_code: '5401', gst_rate: 12, mrp: 35000, cost_price: 22000, stock_quantity: 30, min_stock_level: 5, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'item-15', sku: 'VAS-ACC-0002', name: 'Decorative Lace 1m', description: 'Golden border lace', category_id: 'cat-05', unit: 'metre', hsn_code: '5608', gst_rate: 12, mrp: 4500, cost_price: 2800, stock_quantity: 8, min_stock_level: 10, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  // Linen
  { id: 'item-16', sku: 'VAS-LIN-0001', name: 'Pure Linen Fabric', description: 'Belgian linen shirting', category_id: 'cat-06', unit: 'metre', hsn_code: '5309', gst_rate: 5, mrp: 48000, cost_price: 34000, stock_quantity: 35, min_stock_level: 8, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
]

export const SEED_BARCODES: Barcode[] = SEED_ITEMS.map(item => ({
  id: `bc-${item.id}`,
  item_id: item.id,
  barcode_value: item.sku,
  format: 'CODE128' as const,
  created_at: item.created_at,
}))

export const SEED_VENDORS: import('@/types').Vendor[] = [
  { id: 'ven-01', name: 'Coimbatore Cotton Mills', contact_person: 'Rajan K', phone: '9842001234', email: 'rcotton@ccmills.in', gst_number: '33AABCC1234M1ZB', address: '15 Mill Road', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001', opening_balance: 0, current_balance: 250000, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'ven-02', name: 'Surat Silk House', contact_person: 'Mehta Bhai', phone: '9913456789', email: 'mehta@suratsilk.com', gst_number: '24AABCS5678M1ZC', address: '8 Ring Road', city: 'Surat', state: 'Gujarat', pincode: '395003', opening_balance: 0, current_balance: 500000, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'ven-03', name: 'Kerala Handlooms', contact_person: 'Suresh Nair', phone: '9447001122', email: 'suresh@keralahandlooms.in', gst_number: '32AABCK2345M1ZD', address: 'Weavers Colony', city: 'Thrissur', state: 'Kerala', pincode: '680001', opening_balance: 0, current_balance: 120000, is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
]

export const SEED_EMPLOYEES: Employee[] = [
  { id: 'emp-01', user_id: 'usr-admin', name: 'Admin User', phone: '9400000001', email: 'admin@vasantham.com', role: 'admin', join_date: '2020-01-01', is_active: true, created_at: '2020-01-01T00:00:00Z', updated_at: '2020-01-01T00:00:00Z' },
  { id: 'emp-02', user_id: 'usr-cashier', name: 'Priya Menon', phone: '9400000002', email: 'priya@vasantham.com', role: 'cashier', join_date: '2022-06-01', is_active: true, created_at: '2022-06-01T00:00:00Z', updated_at: '2022-06-01T00:00:00Z' },
  { id: 'emp-03', user_id: 'usr-staff', name: 'Anoop Kumar', phone: '9400000003', email: 'anoop@vasantham.com', role: 'staff', join_date: '2023-01-15', is_active: true, created_at: '2023-01-15T00:00:00Z', updated_at: '2023-01-15T00:00:00Z' },
]

export const SEED_ACCOUNTS: ChartOfAccount[] = [
  { id: 'acc-01', code: '1001', name: 'Cash in Hand', type: 'asset', opening_balance: 5000000, current_balance: 5000000, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-02', code: '1002', name: 'Bank Account - SBI', type: 'asset', opening_balance: 25000000, current_balance: 25000000, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-03', code: '1003', name: 'Accounts Receivable', type: 'asset', opening_balance: 0, current_balance: 0, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-04', code: '1004', name: 'Stock / Inventory', type: 'asset', opening_balance: 80000000, current_balance: 80000000, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-05', code: '2001', name: 'Accounts Payable', type: 'liability', opening_balance: 0, current_balance: 0, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-06', code: '2002', name: 'GST Payable', type: 'liability', opening_balance: 0, current_balance: 0, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-07', code: '3001', name: 'Capital Account', type: 'capital', opening_balance: 100000000, current_balance: 100000000, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-08', code: '4001', name: 'Sales Revenue', type: 'income', opening_balance: 0, current_balance: 0, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-09', code: '5001', name: 'Purchase / COGS', type: 'expense', opening_balance: 0, current_balance: 0, is_system: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-10', code: '5002', name: 'Rent Expense', type: 'expense', opening_balance: 0, current_balance: 0, is_system: false, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 'acc-11', code: '5003', name: 'Salaries Expense', type: 'expense', opening_balance: 0, current_balance: 0, is_system: false, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
]
