import React, { useState } from 'react';
import { Calculator, ScrollText, Globe, Percent } from 'lucide-react';

export function ToolsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [activeTool, setActiveTool] = useState('calc');
    const [calcDisplay, setCalcDisplay] = useState('0');
    const [calcValue, setCalcValue] = useState('');
    const [note, setNote] = useState('');
    const [taxAmount, setTaxAmount] = useState('');
    const [taxRate, setTaxRate] = useState('18');

    if (!isOpen) return null;

    const handleCalc = (val: string) => {
        if(val === 'C') { setCalcValue(''); setCalcDisplay('0'); return; }
        if(val === '=') { 
            try { 
                // eslint-disable-next-line no-eval
                const res = eval(calcValue).toString(); 
                setCalcValue(res); setCalcDisplay(res); 
            } catch(e) { setCalcDisplay('Error'); setCalcValue(''); } 
            return; 
        }
        const newVal = calcValue + val;
        setCalcValue(newVal); 
        setCalcDisplay(newVal);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="obsidian-glass w-full max-w-4xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex h-[500px]">
                
                {/* Tools Sidebar */}
                <div className="w-48 border-r border-white/5 bg-black/40 p-4 flex flex-col gap-2">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 pl-2">Global Tools</div>
                    <button onClick={() => setActiveTool('calc')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold clickable transition-all ${activeTool === 'calc' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Calculator className="w-4 h-4" /> Calculator
                    </button>
                    <button onClick={() => setActiveTool('gst')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold clickable transition-all ${activeTool === 'gst' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Percent className="w-4 h-4" /> GST / Tax Calc
                    </button>
                    <button onClick={() => setActiveTool('currency')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold clickable transition-all ${activeTool === 'currency' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Globe className="w-4 h-4" /> Currency Sync
                    </button>
                    <button onClick={() => setActiveTool('notes')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold clickable transition-all ${activeTool === 'notes' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <ScrollText className="w-4 h-4" /> Scratchpad
                    </button>
                </div>

                {/* Tool Canvas */}
                <div className="flex-1 bg-black/20 flex flex-col relative">
                    <div className="absolute top-4 right-4 z-10">
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors clickable border border-white/10">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {activeTool === 'calc' && (
                        <div className="flex-1 p-8 flex flex-col max-w-sm mx-auto w-full animate-fade-in">
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><Calculator className="w-4 h-4" /> Quick Calculator</h3>
                            <input type="text" value={calcDisplay} className="modern-input w-full rounded-lg px-4 py-3 text-right font-mono text-xl mb-4 bg-black/50" readOnly />
                            <div className="grid grid-cols-4 gap-3 flex-1">
                                {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
                                    <button key={btn} onClick={() => handleCalc(btn)} className={`obsidian-panel rounded-lg py-3 hover:bg-white/10 clickable text-sm transition-all ${['/','*','-','+'].includes(btn) ? 'text-blue-400 font-bold bg-blue-500/5' : btn === 'C' ? 'text-red-400 font-bold bg-red-500/5' : btn === '=' ? 'bg-blue-500 hover:bg-blue-400 text-black font-extrabold shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-white'}`}>
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTool === 'gst' && (
                        <div className="flex-1 p-8 animate-fade-in flex flex-col">
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><Percent className="w-4 h-4 text-green-400" /> Taxation & GST Estimator</h3>
                            <div className="max-w-md w-full space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Base Amount</label>
                                    <input type="number" value={taxAmount} onChange={e => setTaxAmount(e.target.value)} className="modern-input w-full rounded-lg px-4 py-3 text-lg font-mono text-white clickable" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">GST Rate (%)</label>
                                    <div className="flex gap-2">
                                        {['5', '12', '18', '28'].map(rate => (
                                            <button key={rate} onClick={() => setTaxRate(rate)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all clickable ${taxRate === rate ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'}`}>{rate}%</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="obsidian-panel rounded-xl p-6 border border-white/5 space-y-3 mt-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Base Amount</span>
                                        <span className="text-white font-mono">{Number(taxAmount || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                        <span className="text-gray-400">+ GST ({taxRate}%)</span>
                                        <span className="text-green-400 font-mono">{(Number(taxAmount || 0) * (Number(taxRate) / 100)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-bold pt-1">
                                        <span className="text-white">Total Amount</span>
                                        <span className="text-white font-mono">{(Number(taxAmount || 0) * (1 + Number(taxRate) / 100)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTool === 'currency' && (
                        <div className="flex-1 p-8 animate-fade-in flex items-center justify-center">
                             <div className="text-center">
                                 <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                                 <h3 className="text-lg font-bold text-white mb-2">Live ECB Sync Active</h3>
                                 <p className="text-sm text-gray-500 max-w-sm mx-auto">Currency exchange rates are automatically handled by the Khuble Global Billing Engine configured in System Settings.</p>
                             </div>
                        </div>
                    )}

                    {activeTool === 'notes' && (
                        <div className="flex-1 p-8 flex flex-col animate-fade-in">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><ScrollText className="w-4 h-4 text-orange-400" /> Admin Scratchpad</h3>
                            <textarea value={note} onChange={e => setNote(e.target.value)} className="modern-input w-full flex-1 rounded-xl p-4 text-sm resize-none custom-scroll clickable bg-black/50 text-orange-100 font-mono" placeholder="Type temporary scratchpad notes here... (Clears on reboot)"></textarea>
                            <div className="mt-4 flex justify-end">
                                <button onClick={onClose} className="clickable px-6 py-2.5 rounded-lg text-xs font-bold text-black bg-orange-500 hover:bg-orange-400 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]">Save to Session</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
