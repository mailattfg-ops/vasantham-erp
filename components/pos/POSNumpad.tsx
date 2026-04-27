import React from 'react'

export function POSNumpad({ onKey }: { onKey: (key: string) => void }) {
  const keys = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    'C', '0', '⌫'
  ]

  return (
    <div className="grid grid-cols-3 gap-2 h-full">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => onKey(key)}
          className={`flex items-center justify-center rounded-lg text-xl font-bold transition-colors active:scale-95 ${
            key === 'C' ? 'bg-red-100 text-red-600 hover:bg-red-200' :
            key === '⌫' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' :
            'bg-white text-gray-800 shadow-sm border border-gray-200 hover:bg-gray-50'
          }`}
          style={{ minHeight: '60px' }}
        >
          {key}
        </button>
      ))}
    </div>
  )
}
