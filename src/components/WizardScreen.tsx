import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ToggleSwitch } from './ToggleSwitch';
import { StorageOption } from './StorageOption';
import { billingCategories } from '../data/billingCategories';

const stepTitles = ["Business Profile", "Billing Services", "Storage Engine", "App Settings", "Security Check"];

export function WizardScreen({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const { setCompanyName, setIndustry, refreshData } = useAppContext();

  const [category, setCategory] = useState('');
  const [localCompanyName, setLocalCompanyName] = useState('');
  const [subBranches, setSubBranches] = useState<Record<string, boolean>>({});

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    const initialToggles: Record<string, boolean> = {};
    if (billingCategories[val]) {
      billingCategories[val].forEach((_, idx) => {
        initialToggles[idx] = idx === 0 || idx === 1; // Default first two checked
      });
    }
    setSubBranches(initialToggles);
  };

  const [storageType, setStorageType] = useState('hybrid');
  const [mountDir, setMountDir] = useState('');
  const [appSettings, setAppSettings] = useState({
    autoUpdate: true,
    notifications: true,
    launchOnStartup: false
  });
  
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleBrowseDir = async () => {
    // In modern environments we can use window.showDirectoryPicker, but it often requires secure context and user gesture.
    // For universal compatibility in our mock/preview environment, we'll prompt the user.
    try {
        if ('showDirectoryPicker' in window) {
            const dirHandle = await (window as any).showDirectoryPicker();
            setMountDir(dirHandle.name);
        } else {
            const path = prompt('Enter mount directory path:', 'C:\\KhubleOS\\Data');
            if (path) setMountDir(path);
        }
    } catch (e) {
        // If user aborts or it fails, fallback to prompt
        const path = prompt('Enter mount directory path:', 'C:\\KhubleOS\\Data');
        if (path) setMountDir(path);
    }
  };

  const handleComplete = async () => {
      setAuthError('');
      if (!adminEmail || !adminEmail.includes('@')) {
          setAuthError('Please enter a valid admin email.');
          return;
      }
      if (adminPassword.length < 8) {
          setAuthError('Password must be at least 8 characters long.');
          return;
      }
      if (adminPassword !== confirmPassword) {
          setAuthError('Passwords do not match.');
          return;
      }

      setIsRegistering(true);
      try {
          const res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Root Admin', email: adminEmail, password: adminPassword })
          });
          
          if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error || 'Registration failed');
          }
          
          const data = await res.json();
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('os_setup_complete', 'true');
          refreshData();

          if (localCompanyName) setCompanyName(localCompanyName);
          if (category) setIndustry(category);
          onComplete();
      } catch (err: any) {
          setAuthError(err.message);
      } finally {
          setIsRegistering(false);
      }
  };

  return (
    <main className="flex-1 flex items-center justify-center relative z-10 p-6 h-full overflow-hidden">
      <div className="animated-green-border w-full max-w-6xl h-[85vh]">
        <div id="main-window" className="obsidian-glass relative z-10 w-full h-full !rounded-[22px] flex flex-col md:flex-row overflow-hidden transition-all duration-500">
          
          {/* Left Panel: Stepper */}
          <div className="md:w-4/12 relative p-10 flex flex-col justify-between overflow-hidden border-r border-white/5 bg-[#030303]/80 hidden md:flex">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-[70px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)] opacity-50"></div>
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-2 shadow-lg flex items-center justify-center">
                        <img src="./khubledb_lg.png" alt="Logo" className="h-full w-auto object-contain" />
                    </div>
                    <div className="text-lg font-extrabold tracking-tight">
                        <span className="text-white">Khuble Billing</span> <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600">OS</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Workspace Setup</h2>
                <p className="text-[11px] text-gray-400 mb-8 leading-relaxed">Initialize your command center environment and provision professional modules.</p>

                <div className="space-y-4">
                  {stepTitles.map((title, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;
                    const isUpcoming = stepNum > currentStep;

                    return (
                      <div key={title} className={`flex items-center gap-3.5 transition-all duration-300 ${isCurrent ? 'transform translate-x-2' : ''} ${isUpcoming ? 'opacity-50' : ''}`}>
                        <div className={`relative flex items-center justify-center w-7 h-7 rounded-full ${
                          isCompleted ? 'bg-green-500 border border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                          isCurrent ? 'bg-green-500/20 border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                          'bg-white/5 border border-white/10'
                        }`}>
                          {isCompleted ? (
                             <svg className="w-3.5 h-3.5 text-black font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                          ) : (
                            <span className={`text-xs font-bold ${isCurrent ? 'text-green-400' : 'text-gray-500'}`}>{stepNum}</span>
                          )}
                          {stepNum !== totalSteps && (
                            <div className={`absolute top-7 left-1/2 w-px h-5 -translate-x-1/2 ${isCompleted || isCurrent ? 'bg-green-500/50' : 'bg-white/10'}`}></div>
                          )}
                        </div>
                        <span className={`font-medium text-[13px] ${
                          isCompleted ? 'text-gray-300 line-through decoration-green-500/50' :
                          isCurrent ? 'text-white font-semibold drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' :
                          'text-gray-500'
                        }`}>{title}</span>
                      </div>
                    )
                  })}
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">HEKL#+ Protected</span>
                </div>
            </div>
          </div>

          {/* Right Panel: Content */}
          <div className="w-full md:w-8/12 bg-black/60 overflow-hidden relative flex flex-col h-full">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="flex flex-col p-6 md:p-10 h-full animate-slide-in-right">
                <div className="mb-6 shrink-0">
                    <h3 className="text-3xl font-semibold text-white mb-2 tracking-tight">Business Profile</h3>
                    <p className="text-sm text-gray-400">Configure your professional identity for enterprise accounting and compliance.</p>
                </div>
                <div className="space-y-5 flex-1 overflow-y-auto custom-scroll pr-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Registered Legal Name</label>
                        <input type="text" value={localCompanyName} onChange={(e) => setLocalCompanyName(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="e.g. Khublelabs Private Limited" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Entity Type</label>
                            <select className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable appearance-none bg-[#050505]">
                                <option value="" disabled>Select business structure...</option>
                                <option value="sole">Sole Proprietorship</option>
                                <option value="partnership">Partnership Firm</option>
                                <option value="llp">Limited Liability Partnership (LLP)</option>
                                <option value="pvt_ltd">Private Limited Company</option>
                                <option value="pub_ltd">Public Limited Company</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">GSTIN / Tax ID</label>
                            <input type="text" className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable font-mono uppercase" placeholder="24AAAAA0000A1Z5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Financial Year Starts</label>
                            <select className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable appearance-none bg-[#050505]">
                                <option value="apr">April 1 (Indian Standard)</option>
                                <option value="jan">January 1</option>
                                <option value="jul">July 1</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Default Currency</label>
                            <select className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable appearance-none bg-[#050505]">
                                <option value="INR">INR (₹) - Indian Rupee</option>
                                <option value="USD">USD ($) - US Dollar</option>
                                <option value="EUR">EUR (€) - Euro</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Primary Operation Branch</label>
                        <input type="text" className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="e.g. Bilimora, Gujarat, India" />
                    </div>
                </div>
                <div className="flex items-center justify-end mt-6 pt-4 border-t border-white/10 shrink-0">
                    <button onClick={() => setCurrentStep(2)} className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] flex items-center gap-2">
                        Next Step 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="flex flex-col p-6 md:p-10 h-full animate-slide-in-right">
                <div className="mb-4 shrink-0 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-white tracking-tight">Billing Purpose & Services</h3>
                        <p className="text-xs text-gray-400">Select your industry category to provision professional sub-modules.</p>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col min-h-0 space-y-4 pr-2">
                    <div className="shrink-0">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Primary Industry Category</label>
                        <select value={category} onChange={handleCategoryChange} className="modern-input w-full rounded-xl px-4 py-3.5 text-sm clickable appearance-none font-semibold bg-[#050505]">
                            <option value="" disabled>Select Main Industry Category...</option>
                            <option value="retail">🏪 Retail, E-Commerce & Food Service</option>
                            <option value="healthcare">🏥 Healthcare & Life Sciences</option>
                            <option value="industrial">🏭 Industrial, Manufacturing & Logistics</option>
                            <option value="tech">💻 Technology & Telecommunications</option>
                            <option value="corporate">🏢 Corporate, Financial & Enterprise</option>
                            <option value="professional">⚖️ Professional Services</option>
                            <option value="infrastructure">⚡ Infrastructure & Utilities</option>
                        </select>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scroll border border-white/5 bg-black/40 rounded-xl p-4 shadow-inner">
                          {!category ? (
                            <div className="text-center text-gray-500 text-sm py-12 italic">Select an industry category above to load professional sub-modules and active switches.</div>
                          ) : (
                            <div className="space-y-3">
                              {billingCategories[category as keyof typeof billingCategories].map((sub, idx) => (
                                <ToggleSwitch 
                                  key={idx} 
                                  checked={subBranches[idx] || false} 
                                  onChange={() => setSubBranches(prev => ({...prev, [idx]: !prev[idx]}))}
                                  label={
                                    <>
                                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0"></div>
                                      {sub}
                                    </>
                                  } 
                                />
                              ))}
                            </div>
                          )}
                    </div>

                    <div className="shrink-0 p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between flex-wrap gap-4">
                          <div>
                              <div className="text-[11px] text-gray-400 font-bold mb-1">Missing a professional sector or service branch?</div>
                              <div className="text-xs text-gray-500">Our core development team can engineer custom enterprise billing routines for you.</div>
                          </div>
                          <a href="#" className="clickable text-xs text-black font-bold bg-white hover:bg-gray-200 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)] shrink-0">
                              Report to Support
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          </a>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 shrink-0">
                    <button onClick={() => setCurrentStep(1)} className="clickable text-gray-400 hover:text-white text-sm font-medium transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg> Back
                    </button>
                    <button onClick={() => setCurrentStep(3)} className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] flex items-center gap-2">
                        Storage Config 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="flex flex-col p-6 md:p-10 h-full animate-slide-in-right">
                <div className="mb-6 shrink-0">
                    <h3 className="text-3xl font-semibold text-white mb-2 tracking-tight">Storage Architecture</h3>
                    <p className="text-sm text-gray-400">Select where your encrypted SQLite clusters will be mounted.</p>
                </div>
                
                <div className="flex flex-col gap-4 flex-1 pr-2 overflow-y-auto custom-scroll">
                    <StorageOption 
                      id="db-local" value="local" checked={storageType === 'local'} onChange={(e: any) => setStorageType(e.target.value)}
                      title="Local Offline Storage" description="Strictly air-gapped. Data resides entirely on your local machine."
                    >
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                          <label className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-2 block">Mount Directory Path</label>
                          <div className="flex gap-2 items-center">
                              <div className="modern-input rounded-lg px-3 py-2.5 flex-1 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                  <input type="text" value={mountDir} className="bg-transparent border-none text-gray-300 font-mono text-xs w-full focus:outline-none" readOnly placeholder="Select Mount Directory..." />
                              </div>
                              <button onClick={handleBrowseDir} className="clickable bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-all">Browse...</button>
                          </div>
                      </div>
                    </StorageOption>

                    <StorageOption 
                      id="db-cloud" value="cloud" checked={storageType === 'cloud'} onChange={(e: any) => setStorageType(e.target.value)}
                      title="Khublelabs Cloud Only" description="Zero-knowledge encrypted cloud via India-based server hosting."
                    >
                      <div className="p-4 rounded-xl border border-white/5 bg-black/40 mb-3 flex items-center justify-between">
                          <div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Standard Node</div>
                              <div className="text-sm text-green-400 font-mono font-bold">1GB Free Storage Included</div>
                          </div>
                          <a href="#" className="clickable text-xs text-black font-bold bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                              Upgrade Storage <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                      </div>
                    </StorageOption>

                    <StorageOption 
                      id="db-hybrid" value="hybrid" checked={storageType === 'hybrid'} onChange={(e: any) => setStorageType(e.target.value)}
                      title="Hybrid Architecture (Recommended)" description="Stores databases locally for speed, and syncs encrypted backups to the cloud."
                    >
                      <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                              <label className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-2 block">Local Mount Directory</label>
                              <div className="flex gap-2 items-center">
                                  <div className="modern-input rounded-lg px-3 py-2.5 flex-1 flex items-center gap-2">
                                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                      <input type="text" value={mountDir} className="bg-transparent border-none text-gray-300 font-mono text-xs w-full focus:outline-none" readOnly placeholder="Select Mount Directory..." />
                                  </div>
                                  <button onClick={handleBrowseDir} className="clickable bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-all">Browse...</button>
                              </div>
                          </div>
                          <div className="p-4 rounded-xl border border-white/5 bg-black/40 flex items-center justify-between">
                              <div><div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Standard Cloud Sync</div><div className="text-sm text-green-400 font-mono font-bold">1GB Free Storage</div></div>
                              <a href="#" className="clickable text-[11px] text-white font-bold bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5">Manage Subscription <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                          </div>
                      </div>
                    </StorageOption>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 shrink-0">
                    <button onClick={() => setCurrentStep(2)} className="clickable text-gray-400 hover:text-white text-sm font-medium transition-all flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg> Back</button>
                    <button onClick={() => setCurrentStep(4)} className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] flex items-center gap-2">App Settings <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="flex flex-col p-6 md:p-10 h-full animate-slide-in-right">
                <div className="mb-6 shrink-0">
                    <h3 className="text-3xl font-semibold text-white mb-2 tracking-tight">Application Settings</h3>
                    <p className="text-sm text-gray-400">Configure core behaviors and UI preferences for your workspace.</p>
                </div>
                <div className="space-y-4 flex-1 overflow-y-auto custom-scroll pr-2">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">System Theme</label>
                            <select className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable appearance-none bg-[#050505]">
                                <option value="obsidian">Obsidian Black (Premium)</option>
                                <option value="cyberpunk">Cyberpunk Glass</option>
                                <option value="system">Sync with System Preferences</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Default Timezone</label>
                            <select className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable appearance-none bg-[#050505]">
                                <option value="IST">India Standard Time (IST)</option>
                                <option value="UTC">Coordinated Universal Time (UTC)</option>
                            </select>
                        </div>
                    </div>

                    <ToggleSwitch checked={appSettings.autoUpdate} onChange={() => setAppSettings(p => ({...p, autoUpdate: !p.autoUpdate}))} label="Auto-Install Updates" description="Download and apply critical OS patches in the background." />
                    <ToggleSwitch checked={appSettings.notifications} onChange={() => setAppSettings(p => ({...p, notifications: !p.notifications}))} label="Desktop Notifications" description="Enable system alerts for low inventory and sync status." />
                    <ToggleSwitch checked={appSettings.launchOnStartup} onChange={() => setAppSettings(p => ({...p, launchOnStartup: !p.launchOnStartup}))} label="Launch at Startup" description="Boot Khuble Billing OS automatically when Windows starts." />

                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 shrink-0">
                    <button onClick={() => setCurrentStep(3)} className="clickable text-gray-400 hover:text-white text-sm font-medium transition-all flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg> Back</button>
                    <button onClick={() => setCurrentStep(5)} className="clickable bg-green-500 hover:bg-green-400 text-black font-extrabold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] flex items-center gap-2">Final Security <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {currentStep === 5 && (
              <div className="flex flex-col p-6 md:p-10 h-full animate-slide-in-right">
                <div className="mb-6 shrink-0">
                    <h3 className="text-3xl font-semibold text-white mb-2 tracking-tight">Security Credentials</h3>
                    <p className="text-sm text-gray-400">Establish the local master credentials for this instance.</p>
                </div>
                <div className="space-y-5 flex-1 pr-2 overflow-y-auto custom-scroll">
                    {authError && <div className="text-red-400 text-sm mb-2">{authError}</div>}
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Admin Email</label>
                        <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-sm clickable" placeholder="e.g. admin@khuble.com" disabled={isRegistering} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password (Min 8 Chars)</label>
                            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-lg tracking-widest clickable font-mono" placeholder="••••••••" disabled={isRegistering} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="modern-input w-full rounded-xl px-4 py-3 text-lg tracking-widest clickable font-mono" placeholder="••••••••" disabled={isRegistering} />
                        </div>
                    </div>
                    <div className="p-4 mt-2 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <div>
                            <h4 className="text-sm font-bold text-white">Ready for Initialization</h4>
                            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Proceeding will build the directory structure, lock environment variables, and compile the core into memory.</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 shrink-0">
                    <button onClick={() => setCurrentStep(4)} disabled={isRegistering} className="clickable text-gray-400 hover:text-white text-sm font-medium transition-all flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg> Back</button>
                    <button onClick={handleComplete} disabled={isRegistering} className={`clickable ${isRegistering ? 'bg-green-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]'} text-black font-extrabold py-3.5 px-10 rounded-xl transition-all flex items-center gap-3 group`}>
                        {isRegistering ? 'Initializing...' : 'Launch OS System'} 
                        {!isRegistering && <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
                    </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
