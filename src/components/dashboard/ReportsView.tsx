import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Download, Activity, TrendingUp, BookOpen, Scale, FileText, CalendarDays } from 'lucide-react';

export function ReportsView() {
    const { invoices, crm, currency } = useAppContext();
    const [activeTab, setActiveTab] = useState('pnl');
    const [isExporting, setIsExporting] = useState(false);

    // Tally Data Mocks based on actual invoices
    const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
    const paidRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
    const pendingRevenue = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
    
    // Derived Tally fields
    const capitalAccount = 500000;
    const currentLiabilities = 45000;
    const profitAndLoss = totalRevenue - 120000; // Mock Expenses
    const fixedAssets = 250000;
    const currentAssets = (capitalAccount + currentLiabilities + profitAndLoss) - fixedAssets;
    
    const tabs = [
        { id: 'balancesheet', label: 'Balance Sheet', icon: <Scale className="w-4 h-4" /> },
        { id: 'pnl', label: 'Profit & Loss A/c', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'daybook', label: 'Day Book', icon: <CalendarDays className="w-4 h-4" /> },
        { id: 'analytics', label: 'Visual Analytics', icon: <Activity className="w-4 h-4" /> },
    ];

    const statusData = useMemo(() => [
        { name: 'Collected', value: paidRevenue, color: '#22c55e' },
        { name: 'Pending', value: pendingRevenue, color: '#eab308' }
    ], [paidRevenue, pendingRevenue]);

    const clientData = useMemo(() => crm
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5)
        .map(c => ({
            name: c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name,
            LTV: c.totalValue
        })), [crm]);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "Metric,Value\n"
                + `Total Taxable Value,${totalRevenue}\n`
                + `CGST (9%),${(totalRevenue * 0.09).toFixed(2)}\n`
                + `SGST (9%),${(totalRevenue * 0.09).toFixed(2)}\n`
                + `Net Tax Payable,${totalRevenue * 0.18}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `tax_summary_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsExporting(false);
        }, 1000);
    };

    return (
        <div className="w-full flex-col h-full relative z-10 animate-fade-in flex">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                        Financial Reports
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Real-time ledger accounting and financial statements.</p>
                </div>
                <button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`clickable bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all flex items-center gap-2 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isExporting ? (
                        <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block"></span> Exporting...</>
                    ) : (
                        <><Download className="w-3.5 h-3.5" /> Export Summary</>
                    )}
                </button>
            </div>

            {/* Custom Tab Strip */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all clickable ${
                            activeTab === tab.id 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                            : 'bg-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'balancesheet' && (
                    <div className="obsidian-panel rounded-xl overflow-hidden flex flex-col h-full border border-white/5 animate-fade-in">
                        <div className="bg-black/60 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest text-center w-full">Balance Sheet <br/><span className="text-[10px] text-gray-500">As of {new Date().toLocaleDateString()}</span></h3>
                        </div>
                        <div className="flex flex-1 text-sm font-mono text-gray-300">
                            {/* Liabilities Column */}
                            <div className="flex-1 border-r border-white/10 flex flex-col">
                                <div className="grid grid-cols-2 p-3 font-bold text-gray-400 border-b border-white/5 uppercase text-[10px] tracking-widest">
                                    <span>Liabilities</span>
                                    <span className="text-right">Amount</span>
                                </div>
                                <div className="flex-1 p-3 space-y-2">
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer">
                                        <span className="font-bold text-white">Capital Account</span>
                                        <span className="text-right">{currency} {capitalAccount.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer pl-4">
                                        <span className="text-gray-400">Reserves & Surplus</span>
                                        <span className="text-right">{currency} {(capitalAccount * 0.2).toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer mt-4">
                                        <span className="font-bold text-white">Current Liabilities</span>
                                        <span className="text-right">{currency} {currentLiabilities.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer pl-4">
                                        <span className="text-gray-400">Sundry Creditors</span>
                                        <span className="text-right">{currency} 15,000</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer pl-4">
                                        <span className="text-gray-400">Duties & Taxes</span>
                                        <span className="text-right">{currency} 30,000</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer mt-4">
                                        <span className="font-bold text-green-400">Profit & Loss A/c</span>
                                        <span className="text-right text-green-400">{currency} {profitAndLoss.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 p-3 font-bold text-white border-t border-white/10 bg-black/40">
                                    <span>Total</span>
                                    <span className="text-right">{currency} {(capitalAccount + currentLiabilities + profitAndLoss).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Assets Column */}
                            <div className="flex-1 flex flex-col">
                                <div className="grid grid-cols-2 p-3 font-bold text-gray-400 border-b border-white/5 uppercase text-[10px] tracking-widest">
                                    <span>Assets</span>
                                    <span className="text-right">Amount</span>
                                </div>
                                <div className="flex-1 p-3 space-y-2">
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer">
                                        <span className="font-bold text-white">Fixed Assets</span>
                                        <span className="text-right">{currency} {fixedAssets.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer mt-4">
                                        <span className="font-bold text-white">Current Assets</span>
                                        <span className="text-right">{currency} {currentAssets.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer pl-4">
                                        <span className="text-gray-400">Closing Stock</span>
                                        <span className="text-right">{currency} 125,000</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer pl-4">
                                        <span className="text-gray-400">Sundry Debtors</span>
                                        <span className="text-right">{currency} {pendingRevenue.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer pl-4">
                                        <span className="text-gray-400">Cash-in-hand</span>
                                        <span className="text-right">{currency} 45,000</span>
                                    </div>
                                    <div className="grid grid-cols-2 hover:bg-white/5 p-1 rounded transition-colors cursor-pointer pl-4">
                                        <span className="text-gray-400">Bank Accounts</span>
                                        <span className="text-right">{currency} {(currentAssets - 125000 - pendingRevenue - 45000).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 p-3 font-bold text-white border-t border-white/10 bg-black/40">
                                    <span>Total</span>
                                    <span className="text-right">{currency} {(capitalAccount + currentLiabilities + profitAndLoss).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'daybook' && (
                    <div className="obsidian-panel rounded-xl overflow-hidden border border-white/5 animate-fade-in">
                        <div className="bg-black/60 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Day Book</h3>
                            <span className="text-[10px] text-gray-500 font-mono">Date: {new Date().toLocaleDateString()}</span>
                        </div>
                        <table className="w-full text-left font-mono text-[11px]">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 uppercase tracking-widest">
                                    <th className="p-3 border-b border-white/10">Date</th>
                                    <th className="p-3 border-b border-white/10">Particulars</th>
                                    <th className="p-3 border-b border-white/10">Vch Type</th>
                                    <th className="p-3 border-b border-white/10">Vch No.</th>
                                    <th className="p-3 border-b border-white/10 text-right">Debit (In)</th>
                                    <th className="p-3 border-b border-white/10 text-right">Credit (Out)</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300">
                                {invoices.map((inv, idx) => (
                                    <tr key={inv.id} className="hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5">
                                        <td className="p-3">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="p-3 font-bold text-white">{inv.client} <br/><span className="text-gray-500 text-[10px] font-normal">Being goods sold</span></td>
                                        <td className="p-3 text-blue-400">Sales</td>
                                        <td className="p-3">{inv.id}</td>
                                        <td className="p-3 text-right"></td>
                                        <td className="p-3 text-right">{inv.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {invoices.filter(i => i.status === 'Paid').map((inv, idx) => (
                                    <tr key={`${inv.id}-rcpt`} className="hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5">
                                        <td className="p-3">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="p-3 font-bold text-white">Bank A/c <br/><span className="text-gray-500 text-[10px] font-normal">Receipt against {inv.id}</span></td>
                                        <td className="p-3 text-green-400">Receipt</td>
                                        <td className="p-3">RCPT-{9000 + idx}</td>
                                        <td className="p-3 text-right">{inv.amount.toLocaleString()}</td>
                                        <td className="p-3 text-right"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                        {/* Revenue Breakdown */}
                        <div className="obsidian-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity className="w-5 h-5 text-green-400" />
                                <h3 className="text-sm font-bold text-white tracking-wide">Revenue Health</h3>
                            </div>
                            <div className="flex-1 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            formatter={(value: number) => [`${currency} ${value.toLocaleString()}`, 'Amount']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Invoiced</span>
                                    <span className="text-xl font-bold text-white">{currency} {(statusData[0].value + statusData[1].value).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Clients by LTV */}
                        <div className="obsidian-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                <h3 className="text-sm font-bold text-white tracking-wide">Top Clients (LTV)</h3>
                            </div>
                            <div className="flex-1 w-full relative">
                                {clientData.length === 0 ? (
                                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">No CRM data available</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={clientData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                                            <Tooltip 
                                                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                                contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                                formatter={(value: number) => [`${currency} ${value.toLocaleString()}`, 'LTV']}
                                            />
                                            <Bar dataKey="LTV" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                                {clientData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#60a5fa'} opacity={1 - (index * 0.15)} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'pnl' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in h-full">
                        <div className="lg:col-span-8 obsidian-panel p-6 rounded-xl border border-white/5 flex flex-col">
                            <h3 className="text-sm font-bold text-white tracking-wide mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /> Live Profit & Loss Trajectory</h3>
                            <div className="flex-1 w-full min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { month: 'Apr', revenue: 120000, expenses: 85000 },
                                        { month: 'May', revenue: 145000, expenses: 92000 },
                                        { month: 'Jun', revenue: 130000, expenses: 88000 },
                                        { month: 'Jul', revenue: 175000, expenses: 105000 },
                                        { month: 'Aug', revenue: 160000, expenses: 95000 },
                                        { month: 'Sep', revenue: totalRevenue, expenses: 120000 }
                                    ]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} tickFormatter={(value) => `${value/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            formatter={(value: number) => [`${currency} ${value.toLocaleString()}`, undefined]}
                                        />
                                        <Bar dataKey="revenue" fill="#22c55e" name="Gross Revenue" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expenses" fill="#ef4444" name="Operating Expenses" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="obsidian-panel p-6 rounded-xl border border-white/5">
                                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Net Profit Margin</h3>
                                <div className="text-4xl font-extrabold text-white tracking-tight mb-2">{(profitAndLoss > 0 ? (profitAndLoss / totalRevenue) * 100 : 0).toFixed(1)}%</div>
                                <div className="text-xs text-gray-500">Based on YTD operating metrics</div>
                            </div>
                            
                            <div className="obsidian-panel p-6 rounded-xl border border-white/5 flex-1">
                                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Automated Tax Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-xs text-gray-400">Total Taxable Value</span>
                                        <span className="text-sm font-bold text-white">{currency} {totalRevenue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-xs text-gray-400">CGST (9%)</span>
                                        <span className="text-sm font-mono text-gray-300">{currency} {(totalRevenue * 0.09).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-xs text-gray-400">SGST (9%)</span>
                                        <span className="text-sm font-mono text-gray-300">{currency} {(totalRevenue * 0.09).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Net Tax Payable</span>
                                        <span className="text-sm font-extrabold text-blue-400">{currency} {(totalRevenue * 0.18).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
