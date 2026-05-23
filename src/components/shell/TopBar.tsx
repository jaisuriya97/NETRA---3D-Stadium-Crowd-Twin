import React from 'react';
import { useStore } from '../../lib/store';
import { Button } from '../ui/Button';
import { Eye, Shield, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const TopBar: React.FC = () => {
  const { currentView, setView, currentSimTime, params, resetDemo, isRunning, setIsRunning } = useStore();

  const formattedTime = () => {
    const isNegative = currentSimTime < 0;
    const minutes = Math.abs(currentSimTime);
    return `${isNegative ? 'T-' : 'T+'}${minutes} min`;
  };

  return (
    <header className="sticky top-0 z-50 h-20 w-full bg-white border-b border-[#DDDDDD] px-8 flex items-center justify-between">
      {/* Left Area */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => setView('landing')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-[#FF385C] h-9 w-9 rounded-lg flex items-center justify-center text-white">
            <Shield strokeWidth={1.75} className="h-5 w-5" />
          </div>
          <span className="font-serif font-bold text-2xl tracking-normal text-[#222222] select-none">
            NETRA
          </span>
        </div>

        {currentView === 'twin' && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-2 border-l border-[#DDDDDD] pl-6 text-sm text-[#717171] font-medium"
          >
            <span>Stadiums</span>
            <span>/</span>
            <span className="text-[#222222] font-semibold">Eden Gardens</span>
            <span>/</span>
            <span className="text-[#FF385C] font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#FF385C] animate-pulse"></span>
              Live Digital Twin
            </span>
          </motion.div>
        )}
      </div>

      {/* Center Navigation / Status */}
      <div className="flex items-center gap-8">
        {currentView === 'landing' ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#222222]">
            <a href="#how" className="hover:text-[#717171] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#717171] transition-colors">Core Engine</a>
            <a href="#ipl" className="hover:text-[#717171] transition-colors">IPL 2026</a>
          </nav>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-[#F7F7F7] border border-[#DDDDDD] px-4 py-2 rounded-full text-xs font-semibold"
          >
            <div className="flex items-center gap-1.5 text-[#222222]">
              <span className="h-2 w-2 rounded-full bg-[#00A699]"></span>
              <span>{params.matchType}</span>
            </div>
            <span className="h-4 w-px bg-[#DDDDDD]"></span>
            <div className="flex items-center gap-1.5 text-neutral-800">
              <span className="font-mono bg-white border border-[#DDDDDD] rounded px-1.5 py-0.5 shadow-2xs">
                {formattedTime()}
              </span>
              <span className="text-[#717171]">Current Match Timeline</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-3">
        {currentView === 'landing' ? (
          <Button 
            variant="primary" 
            onClick={() => setView('twin')}
            className="font-semibold"
          >
            Launch Digital Twin →
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={resetDemo}
              className="flex items-center gap-2 hover:border-[#222222]"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset Demo</span>
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setView('landing')}
            >
              Exit Command
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
