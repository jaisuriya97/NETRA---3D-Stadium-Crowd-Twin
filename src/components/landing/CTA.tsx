import React from 'react';
import { useStore } from '../../lib/store';
import { Button } from '../ui/Button';

export const CTA: React.FC = () => {
  const { setView } = useStore();

  return (
    <section id="ipl" className="relative bg-white py-24 px-8 md:px-16 border-t border-[#DDDDDD] text-center overflow-hidden">
      {/* Background soft red mesh orb */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#FF385C]/5 filter blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto flex flex-col items-center">
        <span className="text-xs font-bold text-[#FF385C] tracking-widest uppercase font-mono bg-[#FF385C]/10 border border-[#FF385C]/20 rounded-full px-4 py-1.5 mb-6">
          PRE-MATCH DRILL IN PROGRESS
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-[#222222] tracking-tight leading-tight mb-6">
          Built for the 2026 IPL Season.
        </h2>
        <p className="text-base text-[#717171] leading-relaxed max-w-[580px] mb-10 font-medium">
          Ready to run pre-match crowd safety simulations for Eden Gardens? Test sunny, rainfall, and capacity overflow presets with live generative AI.
        </p>
        <Button
          variant="primary"
          onClick={() => setView('twin')}
          className="py-3 px-10 text-base shadow-sm font-bold flex items-center gap-1"
        >
          <span>Launch Twin Simulator</span>
          <span>→</span>
        </Button>
      </div>
    </section>
  );
};
