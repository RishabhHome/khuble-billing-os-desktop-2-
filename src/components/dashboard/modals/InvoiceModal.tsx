import React, { useState, useEffect } from 'react';
import { useAppContext, Invoice } from '../../../store/AppContext';

export function InvoiceModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: Invoice | null }) {
    const { invoices, setInvoices } = useAppContext();
    const [client, setClient] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');

    useEffect(() => {
        if (initialData) {
            setClient(initialData.client);
            setAmount(initialData.amount.toString());
            setStatus(initialData.status);
        } else {
            setClient('');
            setAmount('');
            setStatus('Paid');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const parsedAmount = parseFloat(amount) || 0;
        const token = localStorage.getItem('auth_token');

        if (initialData) {
            const updated = { ...initialData, client, amount: parsedAmount, status };
            if (token) {
                try {
                    await fetch(`/api/invoices/${initialData.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(updated)
                    });
                } catch (e) { console.error(e); }
            }
            setInvoices(invoices.map(i => i.id === initialData.id ? updated : i));
        } else {
            const newInvoice: Invoice = {
                id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
                client: client || "Retail Walk-in",
                amount: parsedAmount,
                status,
                date: new Date().toISOString()
            };
            if (token) {
                try {
                    await fetch(`/api/invoices`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(newInvoice)
                    });
                } catch (e) { console.error(e); }
            }
            setInvoices([newInvoice, ...invoices]);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="obsidian-glass w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <h3 className="text-lg font-bold text-white">{initialData ? 'Edit Invoice' : 'Generate Invoice'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white clickable">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Client Reference / Name</label>
                        <input type="text" value={client} onChange={e => setClient(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="e.g. Acme Corp or Walk-in" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Amount (INR)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="modern-input w-full rounded-xl pl-8 pr-4 py-3 text-sm clickable" placeholder="0.00" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Payment Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as any)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable appearance-none bg-black">
                            <option value="Paid">Paid (Closed)</option>
                            <option value="Pending">Pending (Awaiting Collection)</option>
                        </select>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                    <button onClick={onClose} className="clickable px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="clickable px-6 py-2.5 rounded-lg text-sm font-bold text-black bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">Save Invoice</button>
                </div>
            </div>
        </div>
    );
}
