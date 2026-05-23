import React from 'react';
import { useStore } from '../../lib/store';

export const TimeScrubber: React.FC = () => {
  const { currentSimTime, setSimTime, params } = useStore();

  const formattedTime = (val: number) => {
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    return `${isNegative ? 'T-' : 'T+'}${absVal}m`;
  };

  const getTimelineDetails = () => {
    if (params.weather === 'Sudden Rain') {
      return `T${params.weatherChangeAt} min: Sudden rain begins · Influx redirects`;
    }
    if (params.totalFans > 90000) {
      return `T-30 min: Max queue buildup · Gate 4 overflow`;
    }
    return `T-20 min: Optimal arrival curve peak`;
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-black/5 shadow-md flex flex-col gap-3">
      {/* Dynamic pill above timeline */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-[#FF385C] uppercase tracking-wider text-[10px] font-mono">
          MATCH LINE TIMETABLE
        </span>
        <span className="font-semibold text-[#717171] text-[11px]">
          {getTimelineDetails()}
        </span>
      </div>

      {/* Styled native slider scrubber for maximum reliability */}
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-bold text-[#717171] shrink-0 font-mono">T-60m</span>
        <div className="relative flex-1 group">
          <input
            type="range"
            min="-60"
            max="60"
            value={currentSimTime}
            onChange={(e) => setSimTime(parseInt(e.target.value))}
            className="w-full h-1.5 bg-[#EBEBEB] rounded-lg appearance-none cursor-pointer accent-[#FF385C] focus:outline-none"
          />
          <div 
            className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-[10px] font-mono font-bold bg-[#222222] text-white px-2 py-0.5 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `${((currentSimTime + 60) / 120) * 100}%` }}
          >
            {formattedTime(currentSimTime)}
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#717171] shrink-0 font-mono">T+60m</span>
      </div>

      {/* Timeline key milestones */}
      <div className="flex justify-between items-center text-[10px] text-[#B0B0B0] font-mono select-none px-1">
        <span>T-60: gates open</span>
        <span className="relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-1.5 h-1.5 w-px bg-[#DDDDDD]" />
          T-30m: peak flow
        </span>
        <span className="relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-1.5 h-1.5 w-px bg-[#DDDDDD]" />
          T-0: kickoff
        </span>
        <span>T+60m: full stadium</span>
      </div>
    </div>
  );
};
export default TimeScrubber;
