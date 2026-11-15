import React, { useEffect, useState } from 'react';

const bootTasks = [
    { weight: 15, status: 'Provisioning local storage...', delay: 600 },
    { weight: 20, status: 'Mounting Database Directories...', delay: 800 },
    { weight: 15, status: 'Linking Storage Engine Configurations...', delay: 700 },
    { weight: 20, status: 'Generating HEKL#+ Master Keys...', delay: 1000 },
    { weight: 15, status: 'Validating System Workspaces...', delay: 600 },
    { weight: 15, status: 'Compiling Professional Service Modules...', delay: 900 }
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing boot sequence...');
  const [isReady, setIsReady] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  useEffect(() => {
    let isCancelled = false;

    const runInit = async () => {
        let currentProgress = 0;
        await new Promise(r => setTimeout(r, 400));

        for (let i = 0; i < bootTasks.length; i++) {
            if (isCancelled) return;
            const task = bootTasks[i];
            setCurrentStepIndex(i);
            setStatus(task.status);
            
            const actualDelay = task.delay + (Math.random() * 200 - 100);
            await new Promise(r => setTimeout(r, actualDelay));
            if (isCancelled) return;
            
            currentProgress += task.weight;
            setProgress(currentProgress > 100 ? 100 : currentProgress);
        }

        if (isCancelled) return;
        setCurrentStepIndex(bootTasks.length);
        setProgress(100);
        setStatus('SYSTEM READY.');
        setIsReady(true);
        
        setTimeout(() => {
            if (!isCancelled) onComplete();
        }, 1500);
    };

    runInit();

    return () => {
        isCancelled = true;
    };
  }, [onComplete]);

  return (
    <main className="flex-1 flex items-center justify-center relative z-10 p-6 h-full">
      <div className={`animated-border-wrapper w-full max-w-6xl h-[85vh] transition-all duration-1000 ${isReady ? 'shadow-[0_0_100px_rgba(34,197,94,0.4)]' : ''}`}>
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#030303] rounded-3xl animate-fade-in relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] animate-pulse"></div>
            </div>
            <div className="relative z-10 w-full max-w-lg px-8 flex flex-col">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-4 shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-8 mx-auto animate-float">
                    <img src="./khubledb_lg.png" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" alt="Logo" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-8 tracking-tight text-center">Initializing Command Center</h2>
                
                <div className="w-full space-y-2 mb-8 flex flex-col justify-end">
                    {bootTasks.map((t, idx) => {
                        const isActive = currentStepIndex === idx;
                        const isDone = currentStepIndex > idx;
                        return (
                            <div key={idx} className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-green-400 translate-x-1' : isDone ? 'text-gray-500' : 'text-gray-800'}`}>
                                <span className="w-8 shrink-0">{isDone ? '[ OK ]' : isActive ? '[ >> ]' : '[ -- ]'}</span>
                                <span className={isActive ? 'animate-pulse' : ''}>{t.status}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="w-full mb-2 flex justify-between items-end font-mono text-[10px] uppercase tracking-widest">
                    <span className={`transition-colors duration-300 ${isReady ? 'text-white' : 'text-green-400'}`}>{status}</span>
                    <span className="text-gray-500">[{Math.round(progress)}%]</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden border border-white/10 relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-green-500/10 w-full animate-pulse"></div>
                    <div className="h-full bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_20px_rgba(34,197,94,1)] transition-all duration-[300ms] ease-out relative z-10" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="mt-8 flex justify-center items-center gap-2 opacity-50">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">HEKL#+ Encrypted Session</span>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
