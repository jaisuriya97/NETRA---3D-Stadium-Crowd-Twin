import React from 'react';
import { useStore } from '../../lib/store';
import { AlertCircle, UserCheck, Shield } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const TacticalGridView: React.FC = () => {
  const { agents, risks, params } = useStore();

  // Aggregate counts per gate
  const gateCounts: Record<number, number> = {};
  for (let i = 1; i <= 8; i++) gateCounts[i] = 0;

  agents.forEach(a => {
    gateCounts[a.gate] = (gateCounts[a.gate] || 0) + a.groupSize;
  });

  const getGateSeverityColor = (gateId: number) => {
    // Rely on associated active risks
    const risk = risks.find(r => r.location.includes(`Gate ${gateId}`));
    if (!risk) return 'bg-[#00A699]';
    if (risk.severity > 80) return 'bg-[#C13515] animate-pulse';
    if (risk.severity > 50) return 'bg-[#FFB400]';
    return 'bg-[#00A699]';
  };

  const gatesCoord = [
    { id: 1, label: "Gate 1", x: "85%", y: "50%", angle: "North-East" },
    { id: 2, label: "Gate 2", x: "75%", y: "75%", angle: "East" },
    { id: 3, label: "Gate 3", x: "50%", y: "85%", angle: "South-East" },
    { id: 4, label: "Gate 4", x: "25%", y: "75%", angle: "South" },
    { id: 5, label: "Gate 5", x: "15%", y: "50%", angle: "South-West" },
    { id: 6, label: "Gate 6", x: "25%", y: "25%", angle: "West" },
    { id: 7, label: "Gate 7", x: "50%", y: "15%", angle: "North-West" },
    { id: 8, label: "Gate 8", x: "75%", y: "25%", angle: "North" },
  ];

  return (
    <div className="w-full h-full bg-[#FFFFFF] border border-[#DDDDDD] rounded-2xl flex flex-col items-center justify-between p-6 overflow-hidden">
      
      {/* Header Info */}
      <div className="w-full flex justify-between items-center border-b border-[#F7F7F7] pb-4 mb-4">
        <div>
          <h3 className="font-bold text-[#222222] text-base">Stadium 2D Footprint Plan</h3>
          <p className="text-xs text-[#717171]">Mapping active queues & gate ingress loads</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#717171]">
            <span className="h-2 w-2 rounded-full bg-[#00A699]"></span> Safe
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#717171]">
            <span className="h-2 w-2 rounded-full bg-[#FFB400]"></span> Attention
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#717171]">
            <span className="h-2 w-2 rounded-full bg-[#C13515]"></span> Critical
          </span>
        </div>
      </div>

      {/* Grid Canvas representation */}
      <div className="relative w-full aspect-square max-w-[420px] bg-[#F7F7F7] rounded-full border border-[#DDDDDD] p-8 flex items-center justify-center">
        {/* Stadium Stands */}
        <div className="w-[84%] h-[84%] rounded-full border-4 border-[#DDDDDD] border-double bg-[#EBEBEB]/40 flex items-center justify-center">
          <div className="w-[66%] h-[66%] rounded-full border border-[#DDDDDD] bg-[#DDDDDD]/30 flex items-center justify-center">
            {/* Pitch */}
            <div className="w-[45%] h-[45%] rounded-full bg-[#B5D49A] border-2 border-white flex flex-col items-center justify-center text-center p-2 shadow-xs">
              <span className="font-bold text-[10px] text-[#222222]">EDEN PITCH</span>
              <span className="text-[8px] text-[#717171] uppercase font-mono mt-0.5">Grass Surface</span>
            </div>
          </div>
        </div>

        {/* Placing Gates label tags dynamically across the circular ring */}
        {gatesCoord.map((g) => (
          <div
            key={g.id}
            style={{ left: g.x, top: g.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          >
            <div className={`h-3 w-3 rounded-full border-2 border-white shadow-xs ${getGateSeverityColor(g.id)}`} />
            <div className="bg-white px-2 py-0.5 border border-[#DDDDDD] rounded shadow-2xs text-[9px] font-bold text-[#222222] uppercase mt-1">
              G{g.id}
            </div>
            <div className="text-[8px] text-[#717171] font-mono mt-0.5 font-semibold tabular-nums">
              {(gateCounts[g.id] * 70).toLocaleString()}f
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary metric metrics panel */}
      <div className="w-full mt-6 bg-[#F7F7F7] border border-[#DDDDDD] p-4 rounded-xl grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 border border-[#DDDDDD] rounded-lg text-[#FF385C]">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-[#222222]">Risk Density Mode</h4>
            <p className="text-[10px] text-[#717171]">Continuous dynamic monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 border border-[#DDDDDD] rounded-lg text-[#00A699]">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-[#222222]">Failsafe Activated</h4>
            <p className="text-[10px] text-[#717171]">Synchronized layout stream</p>
          </div>
        </div>
      </div>

    </div>
  );
};
