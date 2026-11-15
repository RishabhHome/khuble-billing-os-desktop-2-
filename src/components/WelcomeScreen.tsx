export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex-1 flex items-center justify-center relative z-10 p-6 w-full h-full overflow-hidden">
      <div className="animated-green-border w-full max-w-5xl animate-fade-in group">
        <div className="obsidian-glass relative z-10 w-full h-[85vh] !rounded-[22px] flex flex-col md:flex-row overflow-hidden">
          {/* Left panel */}
          <div className="md:w-5/12 relative p-10 flex flex-col justify-between overflow-hidden border-r border-white/5 bg-black/40">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-500/20 rounded-full blur-[80px] animate-pulse"></div>
              <div className="absolute bottom-10 -right-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-[60px]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)] opacity-70"></div>
            </div>
            
            <div className="relative z-10 animate-fade-in delay-100">
              <div className="flex items-center gap-5 mb-10 cursor-default group/brand">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center justify-center group-hover/brand:border-green-500/50 group-hover/brand:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-500 animate-float">
                  <img src="./khubledb_lg.png" alt="Khuble Billing OS Logo" className="h-full w-auto object-contain drop-shadow-[0_0_12px_rgba(34,197,94,0.4)] group-hover/brand:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-[26px] font-extrabold tracking-tight border-l-2 border-white/10 pl-5 leading-none">
                  <span className="text-white">Billing</span> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">OS</span>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-[10px] font-bold text-green-400 mb-6 uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                System Ready
              </div>

              <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Welcome to your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-green-100 to-green-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  Command Center
                </span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mt-4 max-w-[95%] font-light">
                The operating system for modern commerce. Secure, remarkably fast, and completely under your control.
              </p>
            </div>

            <div className="relative z-10 mt-12 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-2xl animate-fade-in delay-200">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <svg className="w-4.5 h-4.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <div className="text-[13px] text-white font-semibold">Environment Verified</div>
                    <div className="text-[10px] text-green-400/90 font-mono tracking-widest uppercase mt-0.5">HEKL#+ protected</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-500">
                  <span>Core Engine</span>
                  <span className="text-gray-300 font-medium">Khublelabs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="md:w-7/12 p-12 flex flex-col justify-center bg-black/20">
            <h3 className="text-2xl font-semibold text-white mb-8 tracking-tight animate-fade-in delay-100">Let's configure your workspace</h3>
            
            <div className="grid gap-3.5 mb-10">
              <div className="feature-box rounded-2xl p-5 flex gap-4 items-start animate-fade-in delay-200">
                <div className="mt-0.5 bg-green-500/10 p-2.5 rounded-xl text-green-400 border border-green-500/20 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-1.5">Khuble-Neotic Engine Integrated</h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed">Experience advanced predictive processing and live P&L diagnostics seamlessly right out of the box.</p>
                </div>
              </div>

              <div className="feature-box rounded-2xl p-5 flex gap-4 items-start animate-fade-in delay-300">
                <div className="mt-0.5 bg-green-500/10 p-2.5 rounded-xl text-green-400 border border-green-500/20 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-1.5">Zero-Knowledge Security</h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed">Your billing and inventory data remains encrypted locally on your drive. Complete data privacy.</p>
                </div>
              </div>

              <div className="feature-box rounded-2xl p-5 flex gap-4 items-start animate-fade-in delay-400">
                <div className="mt-0.5 bg-green-500/10 p-2.5 rounded-xl text-green-400 border border-green-500/20 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-1.5">Automated Setup</h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed">We will automatically initialize your local SQLite databases, inventory structures, and GST configurations.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-auto pt-4 animate-fade-in delay-400">
              <button onClick={onStart} className="clickable flex-1 bg-green-500 hover:bg-green-400 text-black font-extrabold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:-translate-y-1 flex justify-center items-center gap-2">
                Start Initial Setup
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
              <button className="clickable px-8 py-4 rounded-xl border border-white/10 hover:border-white/40 hover:bg-white/10 text-white text-[15px] font-semibold transition-all duration-300 hover:-translate-y-1">
                Import Backup
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
