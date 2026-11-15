import React from 'react';

export function ToggleSwitch({ checked, onChange, label, description }: { key?: React.Key, checked: boolean, onChange: () => void, label: React.ReactNode, description?: React.ReactNode }) {
  return (
    <label className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer clickable">
      <div>
        <div className="text-white text-sm font-bold mb-1 flex items-center gap-2">{label}</div>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      <div className="relative inline-block w-12 h-6 shrink-0 align-middle select-none">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
        <div className="block h-6 rounded-full bg-gray-800 border border-white/10 peer-checked:bg-green-500/20 peer-checked:border-green-500/50 peer-checked:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all"></div>
        <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-white border-2 border-gray-600 peer-checked:border-green-500 peer-checked:bg-green-500 peer-checked:translate-x-6 transition-all"></div>
      </div>
    </label>
  )
}
