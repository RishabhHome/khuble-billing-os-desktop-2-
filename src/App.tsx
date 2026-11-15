/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { WizardScreen } from './components/WizardScreen';
import { BootSequence } from './components/BootSequence';
import { Auth } from './components/auth';
import { LaunchScreen } from './components/LaunchScreen';
import { CommandCenterWrapper } from './components/CommandCenter';
import { AppProvider } from './store/AppContext';

export default function App() {
  const [view, setView] = useState<'launching' | 'welcome' | 'wizard' | 'booting' | 'os' | 'dashboard'>(() => {
    const token = localStorage.getItem('auth_token');
    if (token) return 'dashboard';
    return 'launching';
  });
  const [isMaximized, setIsMaximized] = useState(false);

  const handleToggleMaximize = () => setIsMaximized(!isMaximized);
  const handleMinimize = () => console.log('Minimize window');
  const handleClose = () => console.log('Close application');

  const getTitle = () => {
    switch(view) {
      case 'launching': return 'Enterprise Bootloader';
      case 'welcome': return 'Global Billing OS Setup';
      case 'wizard': return 'Global Billing OS Configuration';
      case 'booting': return 'Initializing Enterprise Kernel...';
      case 'os': return 'Enterprise Security Gateway';
      case 'dashboard': return 'Global Billing OS - Executive Dashboard';
      default: return 'Global Billing OS';
    }
  };

  return (
    <AppProvider>
      <div className={`h-screen w-screen flex flex-col relative border ${isMaximized ? 'border-transparent' : 'border-white/10'} overflow-hidden bg-black text-white transition-all`}>
        <TitleBar 
          title={getTitle()}
          isMaximized={isMaximized}
          onToggleMaximize={handleToggleMaximize}
          onMinimize={handleMinimize}
          onClose={handleClose}
        />
        
        <div className="flex-1 flex flex-col min-h-0 relative">
          {view === 'launching' && <LaunchScreen onComplete={() => {
              const isSetup = localStorage.getItem('os_setup_complete');
              if (isSetup) {
                  setView('os');
              } else {
                  setView('welcome');
              }
          }} />}
          {view === 'welcome' && <WelcomeScreen onStart={() => setView('wizard')} />}
          {view === 'wizard' && <WizardScreen onComplete={() => setView('booting')} />}
          {view === 'booting' && <BootSequence onComplete={() => {
              const token = localStorage.getItem('auth_token');
              if (token) {
                  setView('dashboard');
              } else {
                  setView('os');
              }
          }} />}
          {view === 'os' && <Auth onComplete={(token) => {
              localStorage.setItem('auth_token', token);
              setView('dashboard');
          }} />}
          {view === 'dashboard' && <CommandCenterWrapper />}
        </div>
      </div>
    </AppProvider>
  );
}
