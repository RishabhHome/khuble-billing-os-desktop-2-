import React, { useMemo } from 'react';
import { useAppContext } from '../../store/AppContext';
import { InvoiceModal } from './modals/InvoiceModal';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { Briefcase, CreditCard, Box, ShieldCheck, Download, Filter } from 'lucide-react';

export function DashboardView({ onNavigate }: { onNavigate: (view: string) => void }) {
    const { invoices, inventory, industry } = useAppContext();
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);

    const revenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
    const pendingCount = invoices.filter(i => i.status === 'Pending').length;
    const inventoryValue = inventory.reduce((sum, i) => sum + (i.price * i.stock), 0);

    // Prepare chart data (last 7 days revenue vs expenses)
    const chartData = useMemo(() => {
        const data = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = startOfDay(subDays(today, i));
            
            const dayInvoices = invoices.filter(inv => {
                const invDate = new Date(inv.date);
                return isSameDay(invDate, d) && inv.status === 'Paid';
            });
            
            const dailyRevenue = dayInvoices.reduce((sum, inv) => sum + inv.amount, 0);
            const dailyExpenses = 0; // Removing mock expenses so chart shows real data
            
            data.push({
                name: format(d, 'MMM dd'),
                revenue: dailyRevenue,
                expenses: dailyExpenses,
                profit: dailyRevenue - dailyExpenses
            });
        }
        return data;
    }, [invoices]);

    return (
        <div className="w-full flex-col relative z-10 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h2>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="uppercase tracking-widest">{industry ? `${industry} Operations Center` : 'Global Operations Center'}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="clickable bg-black/40 hover:bg-black/60 border border-white/10 text-white font-semibold py-2 px-4 rounded-xl text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all">
                        <Filter className="w-3.5 h-3.5 text-gray-400" /> Filter Range
                    </button>
                    <button className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-2 px-4 rounded-xl text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Download className="w-3.5 h-3.5" /> Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
                {/* KPI Cards */}
                <div className="md:col-span-6 xl:col-span-3 obsidian-glass rounded-2xl p-5 relative overflow-hidden group border border-white/5 hover:border-green-500/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-green-500/20 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20"><Briefcase className="w-4 h-4" /></div>
                        <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">+14.2% YoY</div>
                    </div>
                    <div className="relative z-10 mt-auto">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cash Flow Analysis</h3>
                        <span className="text-2xl font-extrabold text-white tracking-tight">₹{revenue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                </div>

                <div className="md:col-span-6 xl:col-span-3 obsidian-glass rounded-2xl p-5 relative overflow-hidden group border border-white/5 hover:border-yellow-500/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-yellow-500/20 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"><CreditCard className="w-4 h-4" /></div>
                        <div className="flex items-center gap-1.5 text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">Action Req</div>
                    </div>
                    <div className="relative z-10 mt-auto">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Accounts Receivable</h3>
                        <span className="text-2xl font-extrabold text-white tracking-tight">{pendingCount} <span className="text-sm font-medium text-gray-500 lowercase">pending</span></span>
                    </div>
                </div>

                <div className="md:col-span-6 xl:col-span-3 obsidian-glass rounded-2xl p-5 relative overflow-hidden group border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-blue-500/20 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"><Box className="w-4 h-4" /></div>
                        <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">Synced</div>
                    </div>
                    <div className="relative z-10 mt-auto">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Inventory Health</h3>
                        <span className="text-2xl font-extrabold text-white tracking-tight">₹{inventoryValue.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="md:col-span-6 xl:col-span-3 obsidian-glass rounded-2xl p-5 relative overflow-hidden group border border-green-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20"><ShieldCheck className="w-4 h-4" /></div>
                        <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                        </div>
                    </div>
                    <div className="relative z-10 mt-auto">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">System Integrity</h3>
                        <span className="text-xl font-extrabold text-green-400 tracking-tight">Operational</span>
                        <div className="text-[10px] text-gray-500 mt-1">All enterprise nodes active</div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="col-span-1 md:col-span-12 xl:col-span-8 obsidian-glass rounded-2xl p-6 border border-white/5 flex flex-col min-h-[340px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Real-Time Daily Revenue</h3>
                            <span className="text-white text-lg font-bold">Financial Performance</span>
                        </div>
                        <select className="modern-input rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none clickable bg-black/50 border border-white/10 font-mono">
                            <option value="week">7 Day Rollup</option>
                            <option value="month">Monthly Index</option>
                        </select>
                    </div>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10, fontWeight: 600}} tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(34,197,94,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    labelStyle={{ color: '#9ca3af', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}
                                    formatter={(value: number, name: string) => [`₹${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Net Profit']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#4ade80' }} name="revenue" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions Array */}
                <div className="col-span-1 md:col-span-12 xl:col-span-4 obsidian-glass rounded-2xl p-6 border border-white/5 flex flex-col">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Directives</h3>
                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                        <button onClick={() => setIsInvoiceModalOpen(true)} className="clickable w-full flex items-center justify-between p-4 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-green-500/30 transition-all text-left group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">Generate Invoice</div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">New Billing Record</div>
                                </div>
                            </div>
                        </button>
                        <button onClick={() => onNavigate('pos')} className="clickable w-full flex items-center justify-between p-4 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-left group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 text-gray-400 group-hover:text-white flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white group-hover:text-white transition-colors">Launch POS</div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Omnichannel terminal</div>
                                </div>
                            </div>
                        </button>
                        <button className="clickable w-full flex items-center justify-between p-4 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-left group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 text-gray-400 group-hover:text-white flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white group-hover:text-white transition-colors">Tax Report</div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Export GST/Compliance</div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Ledger Log */}
                <div className="col-span-1 md:col-span-12 obsidian-glass rounded-2xl overflow-hidden border border-white/5">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent Transactions</h3>
                        </div>
                        <button onClick={() => onNavigate('ledger')} className="text-[11px] font-bold text-green-400 hover:text-green-300 uppercase tracking-widest clickable">View Full Ledger &rarr;</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                                    <th className="px-6 py-4 border-b border-white/5">Event ID</th>
                                    <th className="px-6 py-4 border-b border-white/5">Entity Reference</th>
                                    <th className="px-6 py-4 border-b border-white/5">Timestamp</th>
                                    <th className="px-6 py-4 border-b border-white/5">Value (INR)</th>
                                    <th className="px-6 py-4 border-b border-white/5 text-right">State</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-300">
                                {invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-xs">No ledger events recorded.</td>
                                    </tr>
                                ) : invoices.slice(0, 4).map((inv, idx) => (
                                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">{inv.id}</td>
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                            {inv.client}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{new Date(inv.date).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="px-6 py-4 font-bold text-white">₹{inv.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-1 rounded border text-[9px] uppercase font-bold tracking-wider ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>{inv.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <InvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} />
        </div>
    );
}
