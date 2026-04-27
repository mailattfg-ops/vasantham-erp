import React from 'react'
import Barcode from 'react-barcode'
import { formatINR } from '@/lib/utils/currency'
import type { Item, LabelSize } from '@/types'

interface Props {
  item: Item
  size?: LabelSize
  className?: string
}

export function BarcodeLabel({ item, size = '50x25', className = '' }: Props) {
  // 50x25mm ≈ 189x94px at 96 DPI
  // 40x20mm ≈ 151x75px at 96 DPI
  
  const width = size === '50x25' ? '189px' : '151px'
  const height = size === '50x25' ? '94px' : '75px'
  
  const barcodeOptions = {
    width: size === '50x25' ? 1.5 : 1.2,
    height: size === '50x25' ? 30 : 20,
    fontSize: size === '50x25' ? 12 : 10,
    margin: 0,
    displayValue: true
  }

  return (
    <div 
      className={`bg-white border border-dashed border-gray-300 flex flex-col items-center justify-center p-1 overflow-hidden print-label-box ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      <div className="text-center w-full">
        <p className="font-bold text-[10px] leading-tight truncate px-1">Vasantham Textiles</p>
        <p className="text-[9px] leading-tight truncate px-1">{item.name}</p>
        
        <div className="flex justify-center my-0.5">
          <Barcode value={item.sku} format="CODE128" {...barcodeOptions} />
        </div>
        
        <p className="font-bold text-[11px] leading-none mt-0.5">MRP: {formatINR(item.mrp)}</p>
      </div>
    </div>
  )
}
