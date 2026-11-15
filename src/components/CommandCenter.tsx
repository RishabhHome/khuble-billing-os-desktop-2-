import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from '../store/AppContext';
import { DashboardView } from './dashboard/DashboardView';
import { POSView } from './dashboard/POSView';
import { LedgerView } from './dashboard/LedgerView';
import { InventoryView } from './dashboard/InventoryView';
import { CRMView } from './dashboard/CRMView';
import { ReportsView } from './dashboard/ReportsView';
import { SettingsView } from './dashboard/SettingsView';
import { SystemTerminal } from './dashboard/SystemTerminal';
import { ToolsModal } from './dashboard/modals/ToolsModal';
import { LayoutDashboard, ShoppingCart, Receipt, Package, Users, LineChart, ShieldCheck, Search, Database, Globe, Cpu, Server, Activity, Terminal } from 'lucide-react';

export default function CommandCenter() {
    const [activeView, setActiveView] = useState('dashboard');
    const { industry, companyName } = useAppContext();
    const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [latency, setLatency] = useState(12);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const dateString = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
            setCurrentTime(`${dateString} [${timeString} UTC]`);
        };
        updateTime();
        const interval = setInterval(() => {
            updateTime();
            if(Math.random() > 0.7) setLatency(Math.floor(Math.random() * 15) + 8);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const navItems = [
        { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'pos', label: industry === 'hospitality' ? 'Restaurant POS' : industry === 'retail' ? 'Omnichannel POS' : 'Service Billing', icon: <ShoppingCart className="w-4 h-4" /> },
        { id: 'ledger', label: 'Accounts & Invoicing', icon: <Receipt className="w-4 h-4" /> },
        { id: 'inventory', label: industry === 'professional' || industry === 'corporate' ? 'Resource Management' : 'Asset & Inventory', icon: <Package className="w-4 h-4" /> },
    ];

    const enterpriseItems = [
        { id: 'crm', label: industry === 'healthcare' ? 'Patient Directory' : 'Client Relations (CRM)', icon: <Users className="w-4 h-4" /> },
        { id: 'reports', label: 'Financial Reports', icon: <LineChart className="w-4 h-4" /> },
    ];

    const configItems = [
        { id: 'settings', label: 'System Administration', icon: <ShieldCheck className="w-4 h-4" /> },
        { id: 'terminal', label: 'System Terminal', icon: <Terminal className="w-4 h-4" /> },
    ];

    const NavButton = ({ id, label, icon }: { key?: React.Key, id: string, label: string, icon: React.ReactNode }) => (
        <button 
            key={id}
            onClick={() => setActiveView(id)}
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold clickable transition-all duration-300 relative overflow-hidden ${
                activeView === id 
                ? 'text-green-400 bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
                : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/5 hover:translate-x-1 hover:border-white/10'
            }`}
        >
            {/* Active Left Indicator Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] transition-transform duration-300 ease-out origin-top ${activeView === id ? 'scale-y-100' : 'scale-y-0'}`}></div>
            
            {/* Background Hover Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${activeView === id ? '!opacity-0' : ''}`}></div>

            <span className={`transition-all duration-300 relative z-10 ${activeView === id ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] scale-110' : 'text-gray-500 group-hover:text-green-400/80 group-hover:scale-110'}`}>
                {icon}
            </span>
            
            <span className="tracking-wide text-[11px] font-bold tracking-wider relative z-10 transition-colors duration-300">{label}</span>
            
            {activeView === id && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse z-10"></div>
            )}
        </button>
    );

    return (
        <div className="flex-1 flex overflow-hidden relative z-10 bg-[#020202]">
            {/* Background Grid for Tech Aesthetic */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

            <aside className="w-[280px] obsidian-glass flex flex-col border-r border-white/10 relative z-20 shrink-0 shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 p-2 shadow-[0_0_20px_rgba(34,197,94,0.15)] flex items-center justify-center">
                        <img src="./khubledb_lg.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-extrabold tracking-tight text-white leading-tight">Global <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600">Billing OS</span></span>
                        <span className="text-[10px] text-green-500 font-mono tracking-widest uppercase mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> MNC Edition
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scroll">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 pl-2 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Core Operations
                    </div>
                    {navItems.map(item => <NavButton key={item.id} id={item.id} label={item.label} icon={item.icon} />)}
                    
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-8 mb-3 pl-2 flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Enterprise ERP
                    </div>
                    {enterpriseItems.map(item => <NavButton key={item.id} id={item.id} label={item.label} icon={item.icon} />)}
                    
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-8 mb-3 pl-2 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> System Control
                    </div>
                    {configItems.map(item => <NavButton key={item.id} id={item.id} label={item.label} icon={item.icon} />)}
                </nav>

                <div className="p-5 border-t border-white/5 bg-black/40 space-y-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
                            <span className="text-gray-500 uppercase">Network Status</span>
                            <span className="text-green-400">OPTIMAL</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[94%] shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-green-500/20 bg-green-500/5">
                            <Cpu className="w-3 h-3 text-green-500" />
                            <span className="text-[9px] text-green-400 font-mono tracking-widest uppercase">{latency}ms Latency</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]" title="System Integrity Verified"></span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-[88px] px-8 py-5 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md z-20 shrink-0 shadow-lg">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                {companyName || 'Enterprise'} Global Command
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-mono uppercase tracking-widest self-center">Authorized</span>
                            </h1>
                            <div className="flex items-center gap-4 mt-1.5">
                                <p className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
                                    <Server className="w-3 h-3" /> EU-WEST-Cluster
                                </p>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <p className="text-[11px] text-gray-400 font-mono">{currentTime}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="relative hidden xl:block">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="text" className="modern-input w-72 bg-black/40 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono clickable border border-white/10 focus:border-green-500/50 transition-all" placeholder="QUERY_RECORDS..." />
                        </div>
                        
                        <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
                        
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsToolsModalOpen(true)} className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-gray-400 flex items-center justify-center transition-all clickable group">
                                <svg className="w-4 h-4 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            </button>
                            
                            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10 shadow-inner">
                                <Database className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-[10px] text-gray-300 font-mono tracking-widest uppercase">Data Lake Sync</span>
                            </div>

                            <button onClick={() => {
                                localStorage.removeItem('auth_token');
                                window.location.reload();
                            }} className="relative ml-2 w-10 h-10 rounded-lg bg-gradient-to-tr from-green-600 to-green-400 p-[1px] clickable shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:scale-105 transition-transform group" title="Logout">
                                <div className="w-full h-full rounded-lg bg-[#0a1510] flex items-center justify-center text-sm font-extrabold text-green-400 group-hover:bg-green-900 transition-colors">RK</div>
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0a1510]"></div>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {activeView === 'dashboard' && <div className="flex-1 overflow-y-auto custom-scroll p-4 lg:p-8"><DashboardView onNavigate={setActiveView} /></div>}
                    {activeView === 'pos' && <div className="flex-1 h-full"><POSView /></div>}
                    {activeView === 'ledger' && <div className="flex-1 overflow-y-auto custom-scroll p-4 lg:p-8"><LedgerView /></div>}
                    {activeView === 'inventory' && <div className="flex-1 overflow-y-auto custom-scroll p-4 lg:p-8"><InventoryView /></div>}
                    {activeView === 'crm' && <div className="flex-1 overflow-y-auto custom-scroll p-4 lg:p-8"><CRMView /></div>}
                    {activeView === 'reports' && <div className="flex-1 overflow-y-auto custom-scroll p-4 lg:p-8"><ReportsView /></div>}
                    {activeView === 'settings' && <div className="flex-1 overflow-y-auto custom-scroll p-4 lg:p-8"><SettingsView /></div>}
                    {activeView === 'terminal' && <div className="flex-1 h-full"><SystemTerminal /></div>}
                </div>
            </main>

            <ToolsModal isOpen={isToolsModalOpen} onClose={() => setIsToolsModalOpen(false)} />
        </div>
    );
}

export function CommandCenterWrapper() {
    return (
        <AppProvider>
            <CommandCenter />
        </AppProvider>
    );
}
