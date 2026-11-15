import React from 'react';

export function DeleteModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="obsidian-glass w-full max-w-sm rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden text-center p-6 border border-red-500/30">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
                <p className="text-xs text-gray-400 mb-6">Are you sure you want to permanently delete this record? This cannot be undone.</p>
                <div className="flex justify-center gap-3">
                    <button onClick={onClose} className="clickable px-5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="clickable px-6 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">Delete Record</button>
                </div>
            </div>
        </div>
    );
}
