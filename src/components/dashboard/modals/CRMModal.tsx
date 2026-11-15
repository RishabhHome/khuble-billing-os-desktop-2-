import React, { useState, useEffect } from 'react';
import { useAppContext, CRMClient } from '../../../store/AppContext';

export function CRMModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: CRMClient | null }) {
    const { crm, setCrm } = useAppContext();
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'Active' | 'Premium'>('Active');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setStatus(initialData.status);
        } else {
            setName('');
            setStatus('Active');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const token = localStorage.getItem('auth_token');
        if (initialData) {
            const updated = { ...initialData, name, status };
            if (token) {
                try {
                    await fetch(`/api/crm/${initialData.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(updated)
                    });
                } catch (e) { console.error(e); }
            }
            setCrm(crm.map(i => i.id === initialData.id ? updated : i));
        } else {
            const newClient: CRMClient = {
                id: `CLI-${Math.floor(Math.random() * 900 + 100)}`,
                name: name || "New Client",
                totalValue: 0,
                last: "Never",
                status
            };
            if (token) {
                try {
                    await fetch(`/api/crm`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(newClient)
                    });
                } catch (e) { console.error(e); }
            }
            setCrm([newClient, ...crm]);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="obsidian-glass w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <h3 className="text-lg font-bold text-white">{initialData ? 'Edit Client' : 'Add Client'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white clickable">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Company / Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="Acme Corp" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as any)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable appearance-none bg-black">
                            <option value="Active">Active</option>
                            <option value="Premium">Premium</option>
                        </select>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                    <button onClick={onClose} className="clickable px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="clickable px-6 py-2.5 rounded-lg text-sm font-bold text-black bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">Save Client</button>
                </div>
            </div>
        </div>
    );
}
