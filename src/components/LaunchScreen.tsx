import React, { useEffect, useState } from 'react';

export function LaunchScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [telemetry, setTelemetry] = useState('Initializing Boot Sequence...');
    const [status, setStatus] = useState('SYSTEM WAKE');
    const [isReady, setIsReady] = useState(false);
    const [telemetryOpacity, setTelemetryOpacity] = useState(1);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        
        const runBootSequence = async () => {
            const sys = {
                cores: navigator.hardwareConcurrency || 4,
                ram: (navigator as any).deviceMemory || 8,
                platform: navigator.platform || 'System',
                res: `${window.innerWidth}x${window.innerHeight}`
            };

            const tasks = [
                { log: `Mounting virtual memory... [${sys.ram}GB RAM]`, weight: 10, status: 'MOUNTING STORAGE', delay: 400 },
                { log: `Loading core_kernel.sys on ${sys.platform}...`, weight: 10, status: 'MOUNTING STORAGE', delay: 350 },
                { log: `Allocating thread pool... [${sys.cores} CPU Cores]`, weight: 5, status: 'MOUNTING STORAGE', delay: 250 },
                { log: `Verifying display matrix... [${sys.res}]`, weight: 10, status: 'SECURING ENVIRONMENT', delay: 350 },
                { log: "Connecting to local SQLite nodes...", weight: 5, status: 'SECURING ENVIRONMENT', delay: 300 },
                { log: "Checking database integrity... [OK]", weight: 10, status: 'SECURING ENVIRONMENT', delay: 600 },
                { log: "Initializing HEKL#+ cryptographic layer...", weight: 15, status: 'SECURING ENVIRONMENT', delay: 500 },
                { log: "Generating session keys... [RSA-4096]", weight: 10, status: 'SECURING ENVIRONMENT', delay: 450 },
                { log: "Validating Zero-Knowledge proofs...", weight: 5, status: 'SECURING ENVIRONMENT', delay: 350 },
                { log: "Mounting Khuble-Neotic Engine...", weight: 5, status: 'LOADING NEOTIC ENGINE', delay: 650 },
                { log: "Loading predictive AI models... [OK]", weight: 5, status: 'LOADING NEOTIC ENGINE', delay: 350 },
                { log: "Allocating hardware EXE handlers...", weight: 5, status: 'LOADING NEOTIC ENGINE', delay: 300 },
                { log: "Starting UI compositing window...", weight: 5, status: 'LOADING NEOTIC ENGINE', delay: 450 },
            ];

            let currentProgress = 0;
            
            // Initial small delay
            await new Promise(r => setTimeout(r, 400));
            
            for (const task of tasks) {
                if (isCancelled) return;
                
                setTelemetryOpacity(0.5);
                await new Promise(r => setTimeout(r, 60)); // Small dip for visual blink effect
                if (isCancelled) return;

                setTelemetry(task.log);
                setStatus(task.status);
                setTelemetryOpacity(1);
                
                // Simulate actual work delay with slight randomization
                const actualDelay = task.delay + (Math.random() * 100 - 50); 
                await new Promise(r => setTimeout(r, actualDelay));
                if (isCancelled) return;

                currentProgress += task.weight;
                setProgress(currentProgress > 100 ? 100 : currentProgress);
            }

            if (isCancelled) return;
            
            setTelemetry("All services operational.");
            setStatus('SYSTEM READY.');
            setProgress(100);
            setIsReady(true);
            
            // Screen flash effect
            setFlash(true);
            setTimeout(() => { if (!isCancelled) setFlash(false); }, 500);

            // Wait before transitioning to the next screen
            setTimeout(() => {
                if (!isCancelled) onComplete();
            }, 1800);
        };

        runBootSequence();

        return () => {
            isCancelled = true;
        };
    }, [onComplete]);

    return (
        <div className={`flex-1 flex items-center justify-center relative z-10 w-full transition-colors duration-500 ${flash ? 'bg-[#050505]' : 'bg-transparent'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-600/5 rounded-full blur-[150px] animate-ambient"></div>
            </div>

            <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center relative z-10">
                <div className="relative z-10 w-44 h-44 mb-8 mx-auto animate-float-slow flex items-center justify-center">
                    <img src="./khubledb_lg.png" alt="Khuble Billing OS" className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]" />
                </div>

                <div className="relative z-10 mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1 drop-shadow-md">
                        Khuble <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Billing OS</span>
                    </h1>
                </div>

                <div className="relative z-10 w-full max-w-md h-[2px] bg-white/10 overflow-hidden mb-4">
                    <div className="absolute top-0 bottom-0 left-0 bg-green-500/20 w-full animate-pulse"></div>
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_15px_rgba(34,197,94,1)] transition-all duration-[300ms] ease-out relative z-10" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="relative z-10 w-full max-w-md h-12 overflow-hidden telemetry-mask flex flex-col justify-end text-center">
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase transition-opacity duration-200" style={{ opacity: telemetryOpacity }}>
                        {telemetry}
                    </p>
                    <p className={`text-[11px] font-mono tracking-widest uppercase mt-1 font-bold ${isReady ? 'text-white' : 'text-green-400'}`}>
                        {status}
                    </p>
                </div>
            </div>
        </div>
    );
}
