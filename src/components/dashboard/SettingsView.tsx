import React, { useState } from 'react';
import { useAppContext, User } from '../../store/AppContext';
import { UserModal } from './modals/UserModal';
import { DeleteModal } from './modals/DeleteModal';
import { Settings, Users, Shield, Plus, Building2, Globe, CreditCard, Lock, Activity, Link as LinkIcon, Database } from 'lucide-react';

function IntegrationsComponent() {
    const { 
        upiId, setUpiId, paymentGateway, setPaymentGateway,
        razorpayApiKey, setRazorpayApiKey, paytmApiKey, setPaytmApiKey,
        integrationTestStatus, testIntegrationConnection
    } = useAppContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="obsidian-glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">UPI Payment Gateway</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Merchant VPA (UPI ID)</label>
                        <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm text-green-300 font-mono clickable" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Settlement Provider</label>
                        <select value={paymentGateway} onChange={e => setPaymentGateway(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable appearance-none bg-black text-white">
                            <option value="Razorpay">Razorpay Unified POS</option>
                            <option value="Paytm">Paytm Business</option>
                            <option value="PhonePe">PhonePe SmartSpeaker Gateway</option>
                            <option value="Cashfree">Cashfree Autocollect</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Razorpay API Key</label>
                            <input type="text" value={razorpayApiKey} onChange={e => setRazorpayApiKey(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-xs text-white font-mono clickable" placeholder="rzp_live_..." />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Paytm API Key</label>
                            <input type="password" value={paytmApiKey} onChange={e => setPaytmApiKey(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-xs text-white font-mono clickable" placeholder="Enter Paytm API Key" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between mb-1.5">
                            Auto-Reconciliation
                            <div className="w-8 h-4 rounded-full bg-green-500 p-0.5 clickable transition-colors">
                                <div className="w-3 h-3 bg-white rounded-full translate-x-4"></div>
                            </div>
                        </label>
                        <p className="text-[10px] text-gray-500 leading-relaxed mt-1">Automatically marks invoices as paid when UPI callbacks trigger.</p>
                    </div>
                    <div className="pt-2">
                        <button 
                            className={`w-full clickable font-bold py-2.5 rounded-lg text-[11px] uppercase tracking-widest transition-all flex justify-center items-center gap-2 ${
                                integrationTestStatus === 'success' ? 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 text-green-400 border' :
                                integrationTestStatus === 'error' ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400 border' :
                                'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-400 border'
                            }`}
                            onClick={testIntegrationConnection}
                            disabled={integrationTestStatus === 'testing'}
                        >
                            {integrationTestStatus === 'testing' ? (
                                <><span className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin inline-block"></span> Validating...</>
                            ) : integrationTestStatus === 'success' ? (
                                <><span className="text-green-400 flex gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Connection Verified</span></>
                            ) : integrationTestStatus === 'error' ? (
                                <><span className="text-red-400 flex gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Verification Failed</span></>
                            ) : (
                                'Test Connection'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SettingsView() {
    const { 
        users, setUsers, companyName, industry,
        currency, setCurrency, taxRate, setTaxRate, invoicePrefix, setInvoicePrefix,
        taxId, setTaxId, timezone, setTimezone, mfaEnabled, setMfaEnabled,
        apiEnv, setApiEnv, webhookUrl, setWebhookUrl,
        upiId, setUpiId, merchantName, setMerchantName, paymentGateway, setPaymentGateway,
        razorpayApiKey, setRazorpayApiKey, paytmApiKey, setPaytmApiKey
    } = useAppContext();
    
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [integrationTestStatus, setIntegrationTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    const [activeTab, setActiveTab] = useState('general');

    const handleEdit = (u: User) => {
        setSelectedUser(u);
        setIsUserModalOpen(true);
    };

    const handleNew = () => {
        setSelectedUser(null);
        setIsUserModalOpen(true);
    };

    const handleDeleteClick = (u: User) => {
        setSelectedUser(u);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedUser) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    await fetch(`/api/users/${selectedUser.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (e) {
                    console.error(e);
                }
            }
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
        }
    };

    const tabs = [
        { id: 'general', label: 'General Identity', icon: <Building2 className="w-4 h-4" /> },
        { id: 'billing', label: 'Global Billing', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'api', label: 'Developer API', icon: <Database className="w-4 h-4" /> },
        { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-4 h-4" /> },
        { id: 'personnel', label: 'Access Control', icon: <Users className="w-4 h-4" /> },
        { id: 'security', label: 'Security & Engine', icon: <Shield className="w-4 h-4" /> },
    ];

    return (
        <div className="w-full flex-col relative z-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">System Configuration</h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{companyName || 'Enterprise'} • Global Administration</p>
                </div>
                <button className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-2.5 px-6 rounded-xl text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <Database className="w-3.5 h-3.5" /> Save Configuration
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-px overflow-x-auto custom-scroll">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`clickable flex items-center gap-2 px-5 py-3 border-b-2 transition-all text-sm font-semibold whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'border-green-500 text-green-400 bg-white/[0.02]' 
                            : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Contents */}
            <div className="w-full min-h-[400px]">
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                        <div className="obsidian-glass rounded-2xl p-6 border border-white/5">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Corporate Identity</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Registered Entity Name</label>
                                    <input type="text" defaultValue={companyName || 'Khuble Enterprise'} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Industry Classification</label>
                                    <input type="text" defaultValue={industry || 'Technology'} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable" />
                                </div>
                            </div>
                        </div>

                        <div className="obsidian-glass rounded-2xl p-6 border border-white/5">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Localization</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">System Timezone</label>
                                    <select value={timezone} onChange={e => setTimezone(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable appearance-none bg-black">
                                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                        <option value="UTC">UTC (Universal)</option>
                                        <option value="America/New_York">America/New_York (EST)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Date Format</label>
                                    <select className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable appearance-none bg-black">
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                        <div className="obsidian-glass rounded-2xl p-6 border border-white/5">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Multi-Currency Engine</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Base Settlement Currency</label>
                                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable appearance-none bg-black">
                                        <option value="INR">INR (₹) - Indian Rupee</option>
                                        <option value="USD">USD ($) - US Dollar</option>
                                        <option value="EUR">EUR (€) - Euro</option>
                                        <option value="GBP">GBP (£) - British Pound</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between mb-1.5">
                                        Live Exchange Rates Sync
                                        <div className="w-8 h-4 rounded-full bg-green-500 p-0.5 clickable transition-colors">
                                            <div className="w-3 h-3 bg-white rounded-full translate-x-4"></div>
                                        </div>
                                    </label>
                                    <p className="text-[10px] text-gray-500 leading-relaxed mt-1">Rates auto-sync with European Central Bank (ECB) hourly.</p>
                                </div>
                            </div>
                        </div>

                        <div className="obsidian-glass rounded-2xl p-6 border border-white/5">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Global Taxation</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Corporate Tax ID / GSTIN</label>
                                    <input type="text" value={taxId} onChange={e => setTaxId(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm font-mono clickable uppercase text-white" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Default Tax Rate (%)</label>
                                    <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="obsidian-glass rounded-2xl p-6 border border-white/5">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Invoicing Logic</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">System Invoice Prefix</label>
                                    <input type="text" value={invoicePrefix} onChange={e => setInvoicePrefix(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm font-mono clickable uppercase text-white" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Default Payment Terms</label>
                                    <select className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable appearance-none bg-black text-white">
                                        <option value="net0">Due on Receipt (Net 0)</option>
                                        <option value="net15">Net 15</option>
                                        <option value="net30">Net 30</option>
                                        <option value="net60">Net 60</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        <div className="obsidian-glass rounded-2xl p-6 border border-white/5">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">REST API Keys</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Environment</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setApiEnv('production')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${apiEnv === 'production' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-gray-400 border border-transparent'}`}>Production</button>
                                        <button onClick={() => setApiEnv('sandbox')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${apiEnv === 'sandbox' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-white/5 text-gray-400 border border-transparent'}`}>Sandbox</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Secret Key</label>
                                    <div className="flex relative">
                                        <input type="password" value={apiEnv === 'production' ? 'sk_live_51M0...9xj2' : 'sk_test_51M0...abc1'} readOnly className="modern-input w-full rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300" />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white px-3 font-bold text-[10px] uppercase tracking-widest transition-colors clickable">Copy</button>
                                    </div>
                                </div>
                                <button className="clickable w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded-lg text-[11px] uppercase tracking-widest transition-all mt-2">Rotate Keys</button>
                            </div>
                        </div>

                        <div className="obsidian-glass rounded-2xl p-6 border border-white/5">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Webhooks & Event Sync</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Endpoint URL</label>
                                    <input type="text" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} className="modern-input w-full rounded-lg px-3 py-2.5 text-sm font-mono text-blue-300 clickable" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Subscribed Events</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-gray-300">invoice.paid</span>
                                        <span className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-gray-300">inventory.low</span>
                                        <span className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-gray-300">customer.created</span>
                                        <button className="px-2.5 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md text-[10px] font-bold hover:bg-green-500/20 transition-all uppercase tracking-widest">+ Add Scope</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'integrations' && (
                    <IntegrationsComponent />
                )}

                {activeTab === 'personnel' && (
                    <div className="animate-fade-in flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Global Personnel Directory</h3>
                            <button onClick={handleNew} className="clickable bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-2 transition-all">
                                <Plus className="w-3.5 h-3.5" /> Provision User
                            </button>
                        </div>
                        
                        <div className="obsidian-glass rounded-2xl overflow-hidden border border-white/5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-black/40 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                                            <th className="px-6 py-4 border-b border-white/5">User ID</th>
                                            <th className="px-6 py-4 border-b border-white/5">Identity</th>
                                            <th className="px-6 py-4 border-b border-white/5">Clearance Level</th>
                                            <th className="px-6 py-4 border-b border-white/5">System Status</th>
                                            <th className="px-6 py-4 border-b border-white/5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-300">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-400">{u.id}</td>
                                                <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-400 p-[1px] shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                                        <div className="w-full h-full bg-[#0a1510] rounded-lg flex items-center justify-center text-[10px] font-black text-green-400">
                                                            {u.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                                                        </div>
                                                    </div>
                                                    {u.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded border text-[9px] font-bold uppercase tracking-widest ${u.role === 'Root Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : u.role === 'Manager' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{u.role}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                                                        <span className="text-xs font-mono text-gray-400">{u.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleEdit(u)} className="text-[11px] font-bold text-blue-400 hover:text-blue-300 mr-4 clickable transition-colors uppercase tracking-widest">Modify</button>
                                                    <button onClick={() => handleDeleteClick(u)} className="text-[11px] font-bold text-red-400 hover:text-red-300 clickable transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed" disabled={u.role === 'Root Admin'}>Revoke</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                        <div className="obsidian-glass rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Authentication</h3>
                            <div className="space-y-5 relative z-10">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                        Multi-Factor Auth (MFA)
                                        <div className={`w-10 h-5 rounded-full p-1 clickable transition-colors ${mfaEnabled ? 'bg-green-500' : 'bg-gray-700'}`} onClick={() => setMfaEnabled(!mfaEnabled)}>
                                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${mfaEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </div>
                                    </label>
                                    <p className="text-xs text-gray-500 leading-relaxed">Require cryptographic hardware keys or TOTP for all administrator accounts.</p>
                                </div>
                                <hr className="border-white/5" />
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Session Expiry Time</label>
                                    <select className="modern-input w-full rounded-lg px-3 py-2.5 text-sm clickable appearance-none bg-black">
                                        <option value="15m">15 Minutes (Strict)</option>
                                        <option value="1h">1 Hour</option>
                                        <option value="12h">12 Hours (Default)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="obsidian-glass rounded-2xl p-6 border border-green-500/20 relative overflow-hidden group col-span-1 md:col-span-2 xl:col-span-1 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/10"></div>
                            <div className="flex items-center gap-2 mb-4 relative z-10">
                                <Shield className="w-5 h-5 text-green-400" />
                                <h3 className="text-sm font-bold text-white tracking-tight">Khuble NEO3+ Core</h3>
                            </div>
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-4 mb-5 relative z-10">
                                <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                                    <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-green-400 mb-1 tracking-widest uppercase">AI Engine Active</h4>
                                    <p className="text-xs text-green-500/70 leading-relaxed font-mono">Predictive analytics, zero-knowledge architecture, and auto-reconciliation active across all regional nodes.</p>
                                </div>
                            </div>
                            <button className="clickable w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl text-xs transition-all relative z-10 uppercase tracking-widest flex items-center justify-center gap-2">
                                <Activity className="w-4 h-4" /> Run Enterprise Diagnostic
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} initialData={selectedUser} />
            <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />
        </div>
    );
}
