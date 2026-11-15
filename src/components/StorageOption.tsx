import React from 'react';

export function StorageOption({ id, value, checked, onChange, title, description, children }: any) {
  return (
    <div className="relative">
      <input type="radio" name="db_type" id={id} className="peer db-radio sr-only" value={value} checked={checked} onChange={onChange} />
      <label htmlFor={id} className="w-full block rounded-2xl border-2 border-white/5 bg-white/[0.01] p-5 hover:bg-white/[0.03] transition-all peer-checked:border-green-500 peer-checked:bg-green-500/10 overflow-hidden relative cursor-pointer clickable">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-[50px] peer-checked:opacity-100 opacity-0 pointer-events-none transition-opacity"></div>
          <div className="flex gap-4 relative z-10">
              <div className="mt-0.5"><div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center peer-checked:bg-green-500/20 peer-checked:border-green-500 text-gray-400 peer-checked:text-green-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              </div></div>
              <div className="flex-1">
                  <h4 className="text-base font-bold text-white mb-1 flex justify-between">{title} <svg className="w-5 h-5 text-green-500 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></h4>
                  <p className="text-xs text-gray-400 mb-0">{description}</p>
              </div>
          </div>
      </label>
      {checked && (
        <div className="mt-3 ml-[3.25rem] animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}
