import React, { useState, useEffect } from 'react';
import { useAppContext, InventoryItem } from '../../../store/AppContext';

export function InventoryModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: InventoryItem | null }) {
    const { inventory, setInventory } = useAppContext();
    const [name, setName] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setStock(initialData.stock.toString());
            setPrice(initialData.price.toString());
        } else {
            setName('');
            setStock('');
            setPrice('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const parsedStock = parseInt(stock) || 0;
        const parsedPrice = parseFloat(price) || 0;
        const token = localStorage.getItem('auth_token');

        if (initialData) {
            const updated = { ...initialData, name, stock: parsedStock, price: parsedPrice };
            if (token) {
                try {
                    await fetch(`/api/inventory/${initialData.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(updated)
                    });
                } catch (e) { console.error(e); }
            }
            setInventory(inventory.map(i => i.id === initialData.id ? updated : i));
        } else {
            const newItem: InventoryItem = {
                id: `SKU-00${Math.floor(Math.random() * 900 + 100)}`,
                name: name || "New Product",
                stock: parsedStock,
                price: parsedPrice
            };
            if (token) {
                try {
                    await fetch(`/api/inventory`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(newItem)
                    });
                } catch (e) { console.error(e); }
            }
            setInventory([newItem, ...inventory]);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="obsidian-glass w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <h3 className="text-lg font-bold text-white">{initialData ? 'Edit SKU' : 'Add New SKU'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white clickable">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Product Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="Product Name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Stock Level</label>
                            <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="0" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Price (INR)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="0.00" />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                    <button onClick={onClose} className="clickable px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="clickable px-6 py-2.5 rounded-lg text-sm font-bold text-black bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">Save Product</button>
                </div>
            </div>
        </div>
    );
}
