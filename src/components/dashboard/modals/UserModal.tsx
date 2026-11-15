import React, { useState, useEffect } from 'react';
import { useAppContext, User } from '../../../store/AppContext';

export function UserModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: User | null }) {
    const { users, setUsers } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Staff');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setRole(initialData.role);
            setEmail('');
            setPassword('');
        } else {
            setName('');
            setEmail('');
            setPassword('');
            setRole('Staff');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const token = localStorage.getItem('auth_token');
        if (initialData) {
            const updated = { ...initialData, name, role };
            if (token) {
                try {
                    await fetch(`/api/users/${initialData.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(updated)
                    });
                } catch (e) { console.error(e); }
            }
            setUsers(users.map(u => u.id === initialData.id ? updated : u));
        } else {
            let newUser: User = {
                id: `USR-00${users.length + 1}`,
                name: name || "New User",
                role,
                status: 'Offline'
            };
            if (token) {
                try {
                    const res = await fetch(`/api/users`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ name, email, password, role, status: 'Offline' })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        newUser = { ...newUser, id: data.id };
                    }
                } catch (e) { console.error(e); }
            }
            setUsers([...users, newUser]);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="obsidian-glass w-full max-w-sm rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <h3 className="text-lg font-bold text-white">{initialData ? 'Edit System User' : 'Provision User'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white clickable">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="e.g. John Doe" />
                    </div>
                    {!initialData && (
                        <>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="admin@mnc.com" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="••••••••" />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Security Clearance / Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable appearance-none bg-black">
                            <option value="Root Admin">Root Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                    <button onClick={onClose} className="clickable px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="clickable px-6 py-2.5 rounded-lg text-sm font-bold text-black bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">Save User</button>
                </div>
            </div>
        </div>
    );
}
