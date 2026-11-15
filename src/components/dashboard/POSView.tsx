import React, { useState } from 'react';
import { useAppContext, InventoryItem } from '../../store/AppContext';
import { Search, ShoppingBag, CreditCard, X } from 'lucide-react';

export function POSView() {
    const { inventory, invoices, setInvoices, setInventory, companyName, industry } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<InventoryItem[]>([]);

    const filteredInventory = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const addToCart = (item: InventoryItem) => {
        if (item.stock <= 0) return; // Add toast here normally
        setCart([...cart, item]);
    };

    const removeFromCart = (indexToRemove: number) => {
        setCart(cart.filter((_, idx) => idx !== indexToRemove));
    };

    const checkout = () => {
        if (cart.length === 0) return;
        const subtotal = cart.reduce((s, i) => s + i.price, 0);
        const final = subtotal * 1.18;
        
        const newInvoice = {
            id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            client: "Retail / Counter Sale",
            date: new Date().toISOString(),
            amount: final,
            status: "Paid" as const
        };
        
        setInvoices([newInvoice, ...invoices]);
        
        // Decrement stock
        const newInv = [...inventory];
        cart.forEach(cItem => {
            const idx = newInv.findIndex(i => i.id === cItem.id);
            if (idx !== -1 && newInv[idx].stock > 0) newInv[idx].stock -= 1;
        });
        setInventory(newInv);
        setCart([]);
    };

    const sub = cart.reduce((s, i) => s + i.price, 0);
    const tax = sub * 0.18;
    const total = sub + tax;

    return (
        <div className="h-full w-full overflow-hidden relative z-10 flex flex-row animate-fade-in">
            <div className="flex-1 p-8 overflow-y-auto custom-scroll border-r border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Omnichannel POS</h2>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{companyName} • {industry}</p>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="modern-input w-72 rounded-xl pl-10 pr-4 py-3 text-sm clickable" placeholder="Scan barcode or search SKU..." />
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredInventory.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <ShoppingBag className="w-12 h-12 text-gray-500 mb-4" />
                            <p className="text-sm font-semibold text-white">No assets found</p>
                            <p className="text-xs text-gray-400 mt-1">Please populate the inventory module.</p>
                        </div>
                    ) : filteredInventory.map(item => (
                        <div key={item.id} onClick={() => addToCart(item)} className="obsidian-panel rounded-2xl p-5 cursor-pointer hover:border-green-500/50 transition-all clickable group relative overflow-hidden flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                            {item.stock <= 0 && <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center text-red-500 font-bold z-10 text-sm">OUT OF STOCK</div>}
                            <div className="w-full h-32 bg-white/5 rounded-xl mb-4 flex items-center justify-center text-gray-600 group-hover:text-green-400 group-hover:scale-105 transition-all duration-300">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <div className="flex-1 flex flex-col justify-end">
                                <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.name}</h4>
                                <div className="text-[10px] text-gray-500 font-mono mb-3">{item.id}</div>
                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                    <span className="text-sm font-extrabold text-green-400">₹{item.price.toLocaleString('en-IN')}</span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${item.stock < 10 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-gray-400'}`}>{item.stock} LEFT</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-96 bg-black/40 flex flex-col h-full shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20 border-l border-white/5">
                <div className="p-6 border-b border-white/10 shrink-0">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2"><CreditCard className="w-5 h-5 text-green-500" /> Current Invoice</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">TXN-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto custom-scroll space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-500 text-xs italic py-10 opacity-70">
                            Scan items or select from catalog to begin transaction.
                        </div>
                    ) : cart.map((c, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                            <div className="flex-1 min-w-0 pr-3">
                                <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                                <p className="text-[10px] text-gray-500 font-mono">{c.id}</p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                                <span className="text-xs font-bold text-green-400">₹{c.price.toLocaleString('en-IN')}</span>
                                <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-400 clickable p-1 bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-white/10 bg-[#030303] shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Subtotal</span>
                        <span className="text-xs text-white">₹{sub.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                        <span className="text-xs text-gray-400">GST (18%)</span>
                        <span className="text-xs text-white">₹{tax.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-extrabold text-green-400 tracking-tight">₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    <button onClick={checkout} className={`clickable w-full py-4 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${cart.length === 0 ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]'}`} disabled={cart.length === 0}>
                        {cart.length === 0 ? 'Terminal Locked' : 'Process Transaction'} <CreditCard className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
