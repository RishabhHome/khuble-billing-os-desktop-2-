import React, { useState } from 'react';
import { useAppContext, Invoice } from '../../store/AppContext';
import { InvoiceModal } from './modals/InvoiceModal';
import { DeleteModal } from './modals/DeleteModal';
import { FileText, Download, Plus, Search, Filter } from 'lucide-react';

export function LedgerView() {
    const { invoices, setInvoices, companyName } = useAppContext();
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const handleEdit = (inv: Invoice) => {
        setSelectedInvoice(inv);
        setIsInvoiceModalOpen(true);
    };

    const handleNew = () => {
        setSelectedInvoice(null);
        setIsInvoiceModalOpen(true);
    };

    const handleDeleteClick = (inv: Invoice) => {
        setSelectedInvoice(inv);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedInvoice) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    await fetch(`/api/invoices/${selectedInvoice.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (e) {
                    console.error(e);
                }
            }
            setInvoices(invoices.filter(i => i.id !== selectedInvoice.id));
            setIsDeleteModalOpen(false);
            setSelectedInvoice(null);
        }
    };

    return (
        <div className="w-full flex-col gap-6 relative z-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Master Ledger</h2>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{companyName} Financial Records</p>
                </div>
                <div className="flex gap-3">
                    <button className="clickable bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="clickable bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={handleNew} className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Plus className="w-4 h-4" /> New Invoice
                    </button>
                </div>
            </div>
            <div className="obsidian-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                            <th className="px-6 py-4 border-b border-white/5">Invoice ID</th>
                            <th className="px-6 py-4 border-b border-white/5">Entity / Reference</th>
                            <th className="px-6 py-4 border-b border-white/5">Timestamp</th>
                            <th className="px-6 py-4 border-b border-white/5">Amount (INR)</th>
                            <th className="px-6 py-4 border-b border-white/5 text-center">Status</th>
                            <th className="px-6 py-4 border-b border-white/5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-300">
                        {invoices.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-xs">No ledger entries found.</td></tr>
                        ) : invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-white/[0.02] border-b border-white/5 group transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-400 flex items-center gap-2">
                                    <FileText className="w-3 h-3 text-gray-600" />
                                    {inv.id}
                                </td>
                                <td className="px-6 py-4 font-bold text-white">{inv.client}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{new Date(inv.date).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td className="px-6 py-4 font-bold text-white">₹{inv.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${inv.status==='Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>{inv.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(inv)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 mr-4 clickable transition-colors opacity-0 group-hover:opacity-100">Modify</button>
                                    <button onClick={() => handleDeleteClick(inv)} className="text-xs font-semibold text-red-400 hover:text-red-300 clickable transition-colors opacity-0 group-hover:opacity-100">Void</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <InvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} initialData={selectedInvoice} />
            <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />
        </div>
    );
}
