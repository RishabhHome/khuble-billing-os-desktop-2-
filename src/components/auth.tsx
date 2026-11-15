import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';

export function Auth({ onComplete }: { onComplete: (token: string) => void }) {
    const { refreshData } = useAppContext();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [authProgress, setAuthProgress] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setAuthProgress(30);
        setErrorMsg('');

        try {
            const response = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            setAuthProgress(70);
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Authentication failed');
            }
            
            const data = await response.json();
            localStorage.setItem('auth_token', data.token);
            refreshData();

            setAuthProgress(100);
            setIsSuccess(true);
            
            setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                    onComplete(data.token);
                }, 300);
            }, 800);
        } catch (err: any) {
            setErrorMsg(err.message);
            setIsAuthenticating(false);
            setAuthProgress(0);
        }
    };

    return (
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
                <div className="w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[130px] animate-ambient"></div>
            </div>

            <main className="flex-1 flex items-center justify-center relative z-10 p-6">
                <div className={`animated-green-border w-full max-w-4xl h-[500px] animate-fade-in shadow-[0_0_80px_rgba(0,0,0,0.9)] transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="obsidian-glass relative z-10 w-full h-full flex overflow-hidden !rounded-[22px]">
                        
                        <div 
                        className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-[1500ms] ease-out z-50 shadow-[0_0_15px_rgba(34,197,94,1)]"
                        style={{ width: `${authProgress}%` }}
                    ></div>

                    <div className="w-5/12 relative p-10 flex flex-col justify-between overflow-hidden border-r border-white/5 bg-[#030303]/90">
                        
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                            <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-500/10 rounded-full blur-[70px]"></div>
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] opacity-50"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-3 shadow-lg mb-8 animate-float flex items-center justify-center">
                                <img src="./khubledb_lg.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                            </div>
                            
                            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2 leading-tight">
                                Khuble <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Billing OS</span>
                            </h2>
                            <p className="text-xs text-gray-400 leading-relaxed font-light mb-6">
                                Khuble-Neotic Engine v2.5.0 (Live Data)
                            </p>

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Node Online
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <div className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">
                                Khublelabs Private Limited<br />
                                Bilimora, India
                            </div>
                        </div>
                    </div>

                    <div className="w-7/12 p-12 flex flex-col justify-center bg-black/40 relative">
                        
                        <div className="w-full max-w-sm mx-auto transition-opacity duration-300">
                            <div className="mb-6">
                                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 tracking-tight">System Login</h3>
                                <p className="text-sm text-gray-400">Enter your credentials to access the command center.</p>
                                {errorMsg && <p className="text-sm text-red-400 mt-2">{errorMsg}</p>}
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4">
                                
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex justify-between">
                                        <span>Admin Email Address</span>
                                    </label>
                                    <div className="relative">
                                        <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="modern-input w-full rounded-xl pl-11 pr-4 py-3 text-sm" required disabled={isAuthenticating || isSuccess} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex justify-between">
                                        <span>Password</span>
                                        <a href="#" className="text-green-500 hover:text-green-400 transition-colors">Forgot?</a>
                                    </label>
                                    <div className="relative">
                                        <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="modern-input w-full rounded-xl pl-11 pr-4 py-3 text-lg tracking-[0.3em] font-mono" placeholder="••••••••" minLength={8} required disabled={isAuthenticating || isSuccess} />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" disabled={isAuthenticating || isSuccess} className={`w-full font-extrabold py-4 px-6 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 ${
                                        isSuccess 
                                        ? 'bg-white text-black' 
                                        : 'bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-0.5'
                                    }`}>
                                        <span>{isSuccess ? "Access Granted" : isAuthenticating ? "Verifying Keys..." : "Unlock Dashboard"}</span>
                                        {isSuccess ? (
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                        ) : isAuthenticating ? (
                                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-8 w-full flex justify-between items-center px-6 relative z-10 opacity-40 shrink-0">
                <div className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">
                    Khuble NEO3+ Network
                </div>
                <div className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">
                    Zero-Knowledge Architecture
                </div>
            </footer>
        </div>
    );
}
