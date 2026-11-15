import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Invoice = { id: string; client: string; date: string; amount: number; status: 'Paid' | 'Pending' };
export type InventoryItem = { id: string; name: string; stock: number; price: number };
export type User = { id: string; name: string; role: string; status: 'Active' | 'Offline' };
export type CRMClient = { id: string; name: string; totalValue: number; last: string; status: 'Active' | 'Premium' };

interface AppState {
    companyName: string;
    industry: string;
    setCompanyName: (name: string) => void;
    setIndustry: (industry: string) => void;
    
    // Global Billing & Configuration State
    currency: string;
    setCurrency: (c: string) => void;
    taxRate: string;
    setTaxRate: (t: string) => void;
    invoicePrefix: string;
    setInvoicePrefix: (p: string) => void;
    taxId: string;
    setTaxId: (t: string) => void;
    timezone: string;
    setTimezone: (t: string) => void;
    mfaEnabled: boolean;
    setMfaEnabled: (m: boolean) => void;
    apiEnv: string;
    setApiEnv: (e: string) => void;
    webhookUrl: string;
    setWebhookUrl: (w: string) => void;
    
    // Payment Gateway Integrations
    upiId: string;
    setUpiId: (u: string) => void;
    merchantName: string;
    setMerchantName: (m: string) => void;
    paymentGateway: string;
    setPaymentGateway: (g: string) => void;
    razorpayApiKey: string;
    setRazorpayApiKey: (k: string) => void;
    paytmApiKey: string;
    setPaytmApiKey: (k: string) => void;
    integrationTestStatus: 'idle' | 'testing' | 'success' | 'error';
    setIntegrationTestStatus: (status: 'idle' | 'testing' | 'success' | 'error') => void;
    testIntegrationConnection: () => void;

    invoices: Invoice[];
    inventory: InventoryItem[];
    users: User[];
    crm: CRMClient[];
    setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setCrm: React.Dispatch<React.SetStateAction<CRMClient[]>>;
    refreshData: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [companyName, setCompanyName] = useState('My Company');
    const [industry, setIndustry] = useState('corporate');
    
    // Global Billing & Configuration State
    const [currency, setCurrency] = useState('INR');
    const [taxRate, setTaxRate] = useState('18');
    const [invoicePrefix, setInvoicePrefix] = useState('INV-');
    const [taxId, setTaxId] = useState('');
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [mfaEnabled, setMfaEnabled] = useState(true);
    const [apiEnv, setApiEnv] = useState('production');
    const [webhookUrl, setWebhookUrl] = useState('');
    
    // Payment Gateway & UPI Integrations
    const [upiId, setUpiId] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [paymentGateway, setPaymentGateway] = useState('Razorpay');
    const [razorpayApiKey, setRazorpayApiKey] = useState('');
    const [paytmApiKey, setPaytmApiKey] = useState('');
    const [integrationTestStatus, setIntegrationTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    // Generate dates for the last 7 days for realistic charts
    const now = new Date();
    const getPastDate = (daysAgo: number, hoursOffset: number = 0) => {
        const d = new Date(now);
        d.setDate(d.getDate() - daysAgo);
        d.setHours(d.getHours() - hoursOffset);
        return d.toISOString();
    };

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [crm, setCrm] = useState<CRMClient[]>([]);

    const refreshData = () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            const headers = { 'Authorization': `Bearer ${token}` };
            
            Promise.all([
                fetch('/api/invoices', { headers }).then(r => r.json()),
                fetch('/api/inventory', { headers }).then(r => r.json()),
                fetch('/api/crm', { headers }).then(r => r.json()),
                fetch('/api/users', { headers }).then(r => r.json())
            ]).then(([inv, stk, c, u]) => {
                if (!inv.error) setInvoices(inv);
                if (!stk.error) setInventory(stk);
                if (!c.error) setCrm(c);
                if (!u.error) setUsers(u);
            }).catch(console.error);
        }
    };

    React.useEffect(() => {
        refreshData();
    }, []);

    const testIntegrationConnection = () => {
        setIntegrationTestStatus('testing');
        setTimeout(() => {
            // Simple validation logic: if no keys are provided, it fails.
            if (!razorpayApiKey && !paytmApiKey) {
                setIntegrationTestStatus('error');
            } else {
                setIntegrationTestStatus('success');
            }
            
            setTimeout(() => {
                setIntegrationTestStatus('idle');
            }, 3000);
        }, 1500);
    };

    return (
        <AppContext.Provider value={{ 
            companyName, setCompanyName, industry, setIndustry, 
            currency, setCurrency, taxRate, setTaxRate, invoicePrefix, setInvoicePrefix,
            taxId, setTaxId, timezone, setTimezone, mfaEnabled, setMfaEnabled,
            apiEnv, setApiEnv, webhookUrl, setWebhookUrl,
            upiId, setUpiId, merchantName, setMerchantName, paymentGateway, setPaymentGateway,
            razorpayApiKey, setRazorpayApiKey, paytmApiKey, setPaytmApiKey,
            integrationTestStatus, setIntegrationTestStatus, testIntegrationConnection,
            invoices, inventory, users, crm, setInvoices, setInventory, setUsers, setCrm, refreshData
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
