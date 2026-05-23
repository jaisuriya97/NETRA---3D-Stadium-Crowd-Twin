import React from 'react';
import { useStore } from '../../lib/store';
import { Button } from '../ui/Button';
import { motion } from 'motion/react';
import { Shield, Play, ArrowRight, Activity, Users } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setView } = useStore();

  return (
    <section className="relative bg-white py-16 md:py-24 px-8 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Text Block */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#FF385C]/10 border border-[#FF385C]/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#FF385C] uppercase tracking-wide mb-8"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>AI-Driven Predictive Safety Twins</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#222222] tracking-tight leading-[1.08] mb-6"
          >
            See the crash <br />
            <span className="text-[#FF385C]">before it happens.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#717171] font-medium leading-relaxed max-w-[560px] mb-10"
          >
            NETRA simulates 80,000+ cricket fans flowing through stadium choke points 4 hours before kickoff. Pre-position security details, predict bottle necks, and neutralize risks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              variant="primary"
              onClick={() => setView('twin')}
              className="w-full sm:w-auto flex items-center gap-2 py-3 px-8 text-base shadow-sm"
            >
              <span>Launch Live Twin</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a href="#how" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-[#F7F7F7]"
              >
                <Play className="h-4 w-4 text-[#FF385C]" />
                <span className="text-sm font-semibold">Watch 60-Second Video</span>
              </Button>
            </a>
          </motion.div>

          {/* Social Proof metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-8 border-t border-[#EBEBEB] w-full grid grid-cols-3 gap-6 text-[#717171] text-xs font-semibold uppercase tracking-wider"
          >
            <div>
              <div className="text-2xl font-bold text-[#222222] tabular-nums mb-1">100k+</div>
              <div>Sim/S Performance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#222222] tabular-nums mb-1"> Eden Gardens</div>
              <div>Active Twin Pilot</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#222222] tabular-nums mb-1">91%</div>
              <div>Risk Prediction Acc.</div>
            </div>
          </motion.div>
        </div>

        {/* Right Preview Card Block ("Hero shot") */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full aspect-[4/3] max-w-[540px] rounded-2xl bg-[#EBEBEB]/40 border border-[#DDDDDD] p-4 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Top glass indicators */}
            <div className="flex justify-between items-center z-10">
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/5 text-[11px] font-bold text-[#222222] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#00A699] animate-pulse"></span>
                <span>EDEN GARDENS TWIN ACTIVE</span>
              </div>
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/5 text-[11px] font-mono text-[#717171]">
                T-45: sunny influx
              </div>
            </div>

            {/* Simulated 3D isometric mockup illustration, highly technical schematic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Simulated stadium outlines */}
                <div className="absolute w-[240px] h-[160px] border border-[#222222]/10 rounded-full flex items-center justify-center transform rotate-x-[60deg] rotate-z-[25deg]">
                  <div className="w-[180px] h-[110px] border border-[#222222]/20 border-dashed rounded-full flex items-center justify-center">
                    <div className="w-[100px] h-[60px] bg-[#B5D49A]/30 border border-[#00A699]/30 rounded-full flex items-center justify-center">
                      <div className="w-[30px] h-[30px] rounded-full border border-dashed border-[#00A699]/40"></div>
                    </div>
                  </div>
                </div>

                {/* Simulated particles as glowing dots */}
                <motion.div
                  animate={{ scale: [0.98, 1.02, 0.98], rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[280px] h-[280px] flex items-center justify-center"
                >
                  <div className="absolute top-[30%] left-[20%] h-2.5 w-2.5 rounded-full bg-[#FFB400] animate-ping" />
                  <div className="absolute top-[30%] left-[20%] h-2.5 w-2.5 rounded-full bg-[#FFB400]" />
                  
                  <div className="absolute top-[60%] right-[10%] h-2.5 w-2.5 rounded-full bg-[#C13515] animate-ping" />
                  <div className="absolute top-[60%] right-[10%] h-2.5 w-2.5 rounded-full bg-[#C13515]" />

                  <div className="absolute bottom-[20%] left-[40%] h-2.5 w-2.5 rounded-full bg-[#00A699]" />
                  <div className="absolute top-[10%] right-[40%] h-2.5 w-2.5 rounded-full bg-[#00A699]" />
                  <div className="absolute top-[50%] left-[30%] h-2 w-2 rounded-full bg-[#00A699]/70" />
                  <div className="absolute bottom-[35%] right-[25%] h-2 w-2 rounded-full bg-[#00A699]/70" />
                </motion.div>
              </div>
            </div>

            {/* Bottom Panel */}
            <div className="bg-white border border-[#DDDDDD] p-4 rounded-xl flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-[#FF385C]/10 p-2 rounded-lg text-[#FF385C]">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#222222]">Live Agent Simulation</h4>
                  <p className="text-[11px] text-[#717171]">Modeling 1000 fan parameters</p>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => setView('twin')}
                className="py-1.5 px-4 text-xs font-bold"
              >
                Access Demo
              </Button>
            </div>
            
          </motion.div>
        </div>

      </div>
    </section>
  );
};
