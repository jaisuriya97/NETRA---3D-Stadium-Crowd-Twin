import React from 'react';
import { useStore } from '../../lib/store';
import { Terminal, Shield, Sparkles } from 'lucide-react';

export const BriefingPanel: React.FC = () => {
  const { briefingText, isStreamingBriefing } = useStore();

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-[#F7F7F7] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal strokeWidth={1.5} className="h-4 w-4 text-[#FF385C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#222222]">
              Command Intel Briefing
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            <Sparkles className="h-2.5 w-2.5" />
            <span>Gemini Live Feed</span>
          </span>
        </div>

        {/* Dynamic streamed output with blink typing cursor */}
        <div className="text-sm font-sans text-[#4A4A4A] leading-relaxed max-h-[290px] overflow-y-auto pr-1">
          <p className={`${isStreamingBriefing ? 'typing-cursor' : ''} text-[#4A4A4A] whitespace-pre-line`}>
            {briefingText}
          </p>
        </div>
      </div>

      {/* Attribution detail floor */}
      <div className="mt-6 pt-3 border-t border-[#F7F7F7] flex justify-between items-center text-[10px] text-[#B0B0B0] font-mono">
        <span>Classification: Operational Detail</span>
        <span className="flex items-center gap-1 bg-neutral-100 text-[#717171] px-2 py-0.5 rounded">
          <Shield className="h-2.5 w-2.5" /> Failsafe Feed
        </span>
      </div>
    </div>
  );
};
export default BriefingPanel;
