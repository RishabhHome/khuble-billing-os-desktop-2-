import React, { useState } from 'react';
import { useAppContext, InventoryItem } from '../../store/AppContext';
import { InventoryModal } from './modals/InventoryModal';
import { DeleteModal } from './modals/DeleteModal';
import { Box, AlertTriangle, IndianRupee, Plus, Filter, Download } from 'lucide-react';

export function InventoryView() {
    const { inventory, setInventory, industry } = useAppContext();
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const totalValue = inventory.reduce((sum, i) => sum + (i.price * i.stock), 0);
    const lowStockCount = inventory.filter(i => i.stock < 10).length;

    const handleEdit = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsInventoryModalOpen(true);
    };

    const handleNew = () => {
        setSelectedItem(null);
        setIsInventoryModalOpen(true);
    };

    const handleDeleteClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedItem) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    await fetch(`/api/inventory/${selectedItem.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (e) {
                    console.error(e);
                }
            }
            setInventory(inventory.filter(i => i.id !== selectedItem.id));
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
        }
    };

    return (
        <div className="w-full flex-col gap-6 relative z-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Asset & Inventory Management</h2>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{industry ? `${industry} Logistics` : 'Global Logistics'}</p>
                </div>
                <div className="flex gap-3">
                    <button className="clickable bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all">
                        <Filter className="w-4 h-4" /> Filter Catalog
                    </button>
                    <button className="clickable bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all">
                        <Download className="w-4 h-4" /> Export Stock
                    </button>
                    <button onClick={handleNew} className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Plus className="w-4 h-4" /> Add Asset SKU
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="obsidian-panel rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/10"></div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 text-green-400 border border-white/5"><Box className="w-5 h-5" /></div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active SKUs</h3>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-extrabold text-white tracking-tight">{inventory.length}</span>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-green-400 font-bold">Catalog Tracked</div>
                    </div>
                </div>

                <div className="obsidian-panel rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/10"></div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 text-yellow-400 border border-white/5"><AlertTriangle className="w-5 h-5" /></div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Restock Alerts</h3>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-extrabold text-white tracking-tight">{lowStockCount}</span>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-yellow-400 font-bold">Items Below Threshold</div>
                    </div>
                </div>

                <div className="obsidian-panel rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10"></div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 text-blue-400 border border-white/5"><IndianRupee className="w-5 h-5" /></div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Valuation</h3>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-extrabold text-white tracking-tight">₹{totalValue.toLocaleString('en-IN')}</span>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-400 font-bold">Liquid Asset Value</div>
                    </div>
                </div>
            </div>

            <div className="obsidian-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                            <th className="px-6 py-4 border-b border-white/5">SKU Code</th>
                            <th className="px-6 py-4 border-b border-white/5">Asset / Product Name</th>
                            <th className="px-6 py-4 border-b border-white/5">Stock Level</th>
                            <th className="px-6 py-4 border-b border-white/5">Unit Value (INR)</th>
                            <th className="px-6 py-4 border-b border-white/5 text-center">Health</th>
                            <th className="px-6 py-4 border-b border-white/5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-300">
                        {inventory.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-xs">No catalog assets. Register your first product SKU.</td></tr>
                        ) : inventory.map(item => (
                            <tr key={item.id} className="hover:bg-white/[0.02] border-b border-white/5 group transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-400 flex items-center gap-2">
                                    <Box className="w-3 h-3 text-gray-600" />
                                    {item.id}
                                </td>
                                <td className="px-6 py-4 font-bold text-white">{item.name}</td>
                                <td className={`px-6 py-4 ${item.stock < 10 ? 'text-yellow-500 font-extrabold' : 'text-white'}`}>{item.stock} Units</td>
                                <td className="px-6 py-4 font-bold text-white">₹{item.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${item.stock < 10 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>{item.stock < 10 ? 'Low Stock' : 'Optimal'}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(item)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 mr-4 clickable transition-colors opacity-0 group-hover:opacity-100">Modify</button>
                                    <button onClick={() => handleDeleteClick(item)} className="text-xs font-semibold text-red-400 hover:text-red-300 clickable transition-colors opacity-0 group-hover:opacity-100">Purge</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <InventoryModal isOpen={isInventoryModalOpen} onClose={() => setIsInventoryModalOpen(false)} initialData={selectedItem} />
            <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />
        </div>
    );
}
