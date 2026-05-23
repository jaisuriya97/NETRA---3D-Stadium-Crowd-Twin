import React from 'react';
import { useStore } from '../../lib/store';
import { Button } from './Button';
import { Activity, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const InterventionList: React.FC = () => {
  const { interventions, applyIntervention, previewIntervention } = useStore();

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck strokeWidth={1.5} className="h-5 w-5 text-[#00A699]" />
          <h3 className="text-base font-bold text-[#222222]">AI Tactical Mitigations</h3>
        </div>
        <p className="text-xs text-[#717171] mb-6">Course correction recommendations from Strategist Agent.</p>

        <div className="flex flex-col gap-3">
          {interventions.map((iv, i) => (
            <motion.div
              key={iv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={`border rounded-xl p-4 transition-all ${
                iv.applied
                  ? 'border-[#00A699]/30 bg-[#00A699]/5 shadow-2xs'
                  : iv.preview
                  ? 'border-[#428BCA]/30 bg-[#428BCA]/5'
                  : 'border-[#DDDDDD] bg-white '
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-[#222222]">{iv.action}</span>
                {iv.applied && (
                  <span className="bg-[#00A699]/10 text-[#00A699] text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
                {!iv.applied && iv.preview && (
                  <span className="bg-[#428BCA]/10 text-[#428BCA] text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded">
                    Previewing
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#717171] leading-relaxed mb-4 font-semibold">
                {iv.reasoning}
              </p>

              <div className="flex gap-2.5">
                <Button
                  variant="ghost"
                  onClick={() => previewIntervention(iv.id, !iv.preview)}
                  disabled={iv.applied}
                  className="py-1 px-3 text-[10px] bg-[#F7F7F7] border border-[#DDDDDD] hover:border-[#B0B0B0]"
                >
                  {iv.preview ? 'Reset Forecast' : 'Preview Forecast'}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => applyIntervention(iv.id, !iv.applied)}
                  className={`py-1 px-4 text-[10px] ${
                    iv.applied 
                      ? 'bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/20 hover:bg-[#FF385C]/20' 
                      : ''
                  }`}
                >
                  {iv.applied ? 'Rollback Action' : 'Apply Measure'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#F7F7F7] flex items-center justify-between text-[10px] text-[#717171] font-mono">
        <span>Continuous flow correction</span>
        <button className="hover:underline flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Failsafe docs</span>
        </button>
      </div>
    </div>
  );
};
export default InterventionList;
