import { useState, useEffect } from 'react';

export function TitleBar({ title, isMaximized, onToggleMaximize, onMinimize, onClose }: {
  title: string;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onMinimize: () => void;
  onClose: () => void;
}) {
  return (
    <header className="titlebar h-10 w-full flex justify-between items-center px-4 relative z-50 border-b border-white/10 bg-black/80 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2 opacity-70">
        <img src="./khubledb_lg.png" alt="Khuble Logo" className="h-4 w-4 object-contain" />
        <span className="text-[11px] text-gray-400 font-medium tracking-wider">{title}</span>
      </div>
      <div className="flex h-full titlebar-btn items-center">
        <button
          onClick={onMinimize}
          className="flex items-center justify-center w-11 h-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
          title="Minimize"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          onClick={onToggleMaximize}
          className="flex items-center justify-center w-11 h-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
          title={isMaximized ? 'Restore Down' : 'Maximize'}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" rx="0.5" />
              <path d="M3 1H8.5C8.77614 1 9 1.22386 9 1.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="8" height="8" stroke="currentColor" strokeWidth="1.5" rx="1" />
            </svg>
          )}
        </button>

        <button
          onClick={onClose}
          className="flex items-center justify-center w-11 h-full text-gray-400 hover:bg-[#e81123] hover:text-white transition-colors focus:outline-none"
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
