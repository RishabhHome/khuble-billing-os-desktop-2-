import React, { useState } from 'react';
import { useAppContext, CRMClient } from '../../store/AppContext';
import { CRMModal } from './modals/CRMModal';
import { DeleteModal } from './modals/DeleteModal';
import { Users, Filter, Cloud, Plus, MoreHorizontal } from 'lucide-react';

export function CRMView() {
    const { crm, setCrm, companyName } = useAppContext();
    const [isCRMModalOpen, setIsCRMModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);

    const handleEdit = (client: CRMClient) => {
        setSelectedClient(client);
        setIsCRMModalOpen(true);
    };

    const handleNew = () => {
        setSelectedClient(null);
        setIsCRMModalOpen(true);
    };

    const handleDeleteClick = (client: CRMClient) => {
        setSelectedClient(client);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedClient) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    await fetch(`/api/crm/${selectedClient.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (e) {
                    console.error(e);
                }
            }
            setCrm(crm.filter(c => c.id !== selectedClient.id));
            setIsDeleteModalOpen(false);
            setSelectedClient(null);
        }
    };

    return (
        <div className="w-full flex-col gap-6 relative z-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Client Directory (CRM)</h2>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{companyName} Partner Network</p>
                </div>
                <div className="flex gap-3">
                    <button className="clickable bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all">
                        <Filter className="w-4 h-4" /> Filter Records
                    </button>
                    <button className="clickable bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all">
                        <Cloud className="w-4 h-4" /> Sync Cloud
                    </button>
                    <button onClick={handleNew} className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Plus className="w-4 h-4" /> Add Partner
                    </button>
                </div>
            </div>
            <div className="obsidian-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                            <th className="px-6 py-4 border-b border-white/5">Client ID</th>
                            <th className="px-6 py-4 border-b border-white/5">Company / Name</th>
                            <th className="px-6 py-4 border-b border-white/5">Lifetime Value (INR)</th>
                            <th className="px-6 py-4 border-b border-white/5 text-center">Status</th>
                            <th className="px-6 py-4 border-b border-white/5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-300">
                        {crm.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-xs">No client records found. Initialize directory by adding a partner.</td></tr>
                        ) : crm.map(c => (
                            <tr key={c.id} className="hover:bg-white/[0.02] border-b border-white/5 group">
                                <td className="px-6 py-4 font-mono text-xs text-gray-400">{c.id}</td>
                                <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 p-[1px]">
                                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-bold text-blue-400">
                                            {c.name.substring(0,2).toUpperCase()}
                                        </div>
                                    </div>
                                    {c.name}
                                </td>
                                <td className="px-6 py-4 font-bold text-white">₹{c.totalValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${c.status === 'Premium' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>{c.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(c)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 mr-4 clickable transition-colors opacity-0 group-hover:opacity-100">Modify</button>
                                    <button onClick={() => handleDeleteClick(c)} className="text-xs font-semibold text-red-400 hover:text-red-300 clickable transition-colors opacity-0 group-hover:opacity-100">Revoke</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CRMModal isOpen={isCRMModalOpen} onClose={() => setIsCRMModalOpen(false)} initialData={selectedClient} />
            <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />
        </div>
    );
}
