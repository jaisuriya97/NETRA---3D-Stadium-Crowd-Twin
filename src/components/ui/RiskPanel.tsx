import React from 'react';
import { useStore } from '../../lib/store';
import { AlertCircle, ShieldAlert, BadgeInfo } from 'lucide-react';
import { motion } from 'motion/react';

export const RiskPanel: React.FC = () => {
  const { risks, setCameraView } = useStore();

  const getSeverityStyle = (srv: number) => {
    if (srv > 80) return { color: 'text-[#C13515]', bg: 'bg-[#C13515]' };
    if (srv > 40) return { color: 'text-[#FFB400]', bg: 'bg-[#FFB400]' };
    return { color: 'text-[#00A699]', bg: 'bg-[#00A699]' };
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert strokeWidth={1.5} className="h-5 w-5 text-[#C13515]" />
          <h3 className="text-base font-bold text-[#222222]">Risk Evaluation Feed</h3>
        </div>
        <p className="text-xs text-[#717171] mb-6">Real-time gate assessments. Click any item dry-run camera target.</p>

        <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[350px] pr-1">
          {risks.map((risk, i) => {
            const style = getSeverityStyle(risk.severity);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                onClick={() => setCameraView('GATE-LEVEL')}
                className="group border border-[#DDDDDD] hover:border-[#B0B0B0] bg-white rounded-xl p-4 cursor-pointer transition-all hover:bg-[#F7F7F7]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-[#222222] font-sans truncate pr-2 max-w-[210px]">
                    {risk.location}
                  </h4>
                  <div className={`text-xs font-black font-semibold tabular-nums ${style.color}`}>
                    {risk.severity}%
                  </div>
                </div>

                {/* Styled 6px capacity severity progress bar */}
                <div className="w-full bg-[#EBEBEB] h-1.5 rounded-full overflow-hidden mb-2.5">
                  <div
                    className={`h-full rounded-full ${style.bg}`}
                    style={{ width: `${risk.severity}%` }}
                  />
                </div>

                <div className="flex justify-between items-end gap-3 text-[10px]">
                  <span className="text-[#717171] leading-relaxed max-w-[220px] font-medium line-clamp-2">
                    {risk.reasoning}
                  </span>
                  <span className="text-[#B0B0B0] font-mono whitespace-nowrap uppercase tracking-wider font-extrabold shrink-0">
                    {risk.eta}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#F7F7F7] flex items-center justify-between text-[10px] text-[#B0B0B0] font-mono">
        <span>Evaluated continuously</span>
        <div className="flex items-center gap-1">
          <BadgeInfo className="h-3 w-3" />
          <span>Failsafe telemetry</span>
        </div>
      </div>
    </div>
  );
};
export default RiskPanel;
