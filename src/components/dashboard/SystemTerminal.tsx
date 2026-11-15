import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'system';
}

export function SystemTerminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'KhubleLabs OS Kernel (v1.0.4-secure)', type: 'system' },
    { text: 'Type "help" to see available administrative commands.', type: 'system' },
    { text: 'Waiting for secure input...', type: 'system' }
  ]);
  const [input, setInput] = useState('');
  const endOfTerminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { text: `root@khubleOS:~# ${trimmedCmd}`, type: 'input' }]);
    
    const parts = trimmedCmd.split(' ');
    const command = parts[0].toLowerCase();

    let response: TerminalLine[] = [];

    switch (command) {
      case 'help':
        response = [
          { text: 'Available Kernel Commands:', type: 'output' },
          { text: '  status       - Show core kernel health and resource usage', type: 'output' },
          { text: '  ping         - Test encrypted network relay latency', type: 'output' },
          { text: '  reboot       - Execute a soft-restart of the UI thread', type: 'output' },
          { text: '  users        - List active administrator sessions', type: 'output' },
          { text: '  mount        - Display mounted virtual filesystems', type: 'output' },
          { text: '  clear        - Clear the terminal buffer', type: 'output' }
        ];
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'status':
        response = [
          { text: '[OK] CPU Load: 12% (Stable)', type: 'output' },
          { text: '[OK] Memory Allocation: 104MB / 8192MB', type: 'output' },
          { text: '[OK] Encrypted Storage: Mounted (AES-256)', type: 'output' },
          { text: '[OK] Database Bridge: Connected', type: 'output' },
          { text: 'System health is nominal.', type: 'output' }
        ];
        break;
      case 'ping':
        response = [
          { text: 'PING gateway.khublelabs.internal (10.0.0.1) 56(84) bytes of data.', type: 'output' },
          { text: '64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=1.23 ms', type: 'output' },
          { text: '64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=1.01 ms', type: 'output' },
          { text: '64 bytes from 10.0.0.1: icmp_seq=3 ttl=64 time=1.15 ms', type: 'output' },
          { text: '--- gateway.khublelabs.internal ping statistics ---', type: 'output' },
          { text: '3 packets transmitted, 3 received, 0% packet loss, time 2003ms', type: 'output' }
        ];
        break;
      case 'reboot':
        response = [
          { text: 'Initiating soft reboot sequence...', type: 'system' },
          { text: 'Syncing filesystems... [OK]', type: 'system' },
          { text: 'Sending SIGTERM to active processes...', type: 'system' }
        ];
        setTimeout(() => window.location.reload(), 1500);
        break;
      case 'users':
        response = [
          { text: 'UID    USER       TTY      TIME      CMD', type: 'output' },
          { text: '0      root       tty1     00:00:15  /bin/khuble-kernel', type: 'output' },
          { text: '1000   admin      tty2     00:05:22  /usr/bin/dashboard', type: 'output' }
        ];
        break;
      case 'mount':
        response = [
          { text: '/dev/root on / type ext4 (rw,relatime)', type: 'output' },
          { text: 'khuble_db on /var/lib/khubledb type tmpfs (rw,nosuid,nodev)', type: 'output' },
          { text: 'secure_vault on /mnt/vault type vfat (rw,sync)', type: 'output' }
        ];
        break;
      case 'sudo':
        response = [
          { text: 'You are already running as root in the KhubleLabs Kernel environment.', type: 'error' }
        ];
        break;
      default:
        response = [
          { text: `bash: ${command}: command not found. Type "help" for a list of available commands.`, type: 'error' }
        ];
        break;
    }

    setHistory(prev => [...prev, ...response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030303] text-gray-200 overflow-hidden relative">
      <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between shrink-0 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-500">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">System Terminal</h2>
            <p className="text-[10px] text-gray-500 font-mono">root@khublelabs:/kernel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black border border-white/5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[9px] uppercase tracking-widest text-red-400 font-bold">Admin Mode</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="w-full h-full bg-black rounded-lg border border-white/10 shadow-[0_0_30px_rgba(34,197,94,0.05)] overflow-hidden flex flex-col font-mono text-sm">
          <div className="h-8 bg-[#111] border-b border-white/10 flex items-center px-4 gap-2 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 text-[10px] text-gray-500 flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              KhubleLabs Native Shell
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
            <div className="space-y-1.5">
              {history.map((line, index) => (
                <div key={index} className={`break-words ${
                  line.type === 'system' ? 'text-green-400 font-bold' :
                  line.type === 'error' ? 'text-red-400' :
                  line.type === 'input' ? 'text-gray-300' : 'text-green-500'
                }`}>
                  {line.text}
                </div>
              ))}
              <div ref={endOfTerminalRef} />
            </div>
            
            <div className="mt-2 flex items-center text-gray-300">
              <span className="shrink-0 text-green-400 mr-2">root@khubleOS:~#</span>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-gray-300 focus:ring-0 p-0 font-mono placeholder:text-gray-700"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
