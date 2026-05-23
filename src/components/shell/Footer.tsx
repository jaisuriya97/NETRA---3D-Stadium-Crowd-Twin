import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F7F7F7] border-t border-[#DDDDDD] py-16 px-12 text-[#717171] text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-[#222222] mb-4">Core Engine</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:underline">Stadium Fluid Dynamics</a></li>
            <li><a href="#" className="hover:underline">Dynamic Buffer Mapping</a></li>
            <li><a href="#" className="hover:underline">Edge Capacity Sensors</a></li>
            <li><a href="#" className="hover:underline">GPU Instanced Mesh</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[#222222] mb-4">Safety Agents</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:underline">Scenario Simulator</a></li>
            <li><a href="#" className="hover:underline">Risk Analyst Agent</a></li>
            <li><a href="#" className="hover:underline">Tactical Mitigator</a></li>
            <li><a href="#" className="hover:underline">Intel Narrator (Gemini)</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[#222222] mb-4">Integrations</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:underline">BCCI Operations Panel</a></li>
            <li><a href="#" className="hover:underline">Eden Gardens Telemetry</a></li>
            <li><a href="#" className="hover:underline">Karnataka Police Portal</a></li>
            <li><a href="#" className="hover:underline">IPL Safety Dashboard</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif font-bold text-[#222222] text-xl mb-4">NETRA</h3>
          <p className="leading-relaxed text-xs">
            NETRA is an advanced agentic crowd simulation digital twin designed to pre-emptively model physical flow mechanics in high-density sports events, saving lives through proactive interventions.
          </p>
          <div className="mt-4 text-xs font-mono">
            Platform Protocol: v2.6.2-Safe
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#EBEBEB] flex flex-col sm:flex-row justify-between items-center text-xs gap-4">
        <div>
          © 2026 NETRA (Sanskrit for "Eye"). Built in context of IPL cricket crowd safety operations.
        </div>
        <div className="flex gap-6 font-semibold text-[#222222]">
          <a href="#" className="hover:underline">Privacy Statement</a>
          <a href="#" className="hover:underline">Terms of Protocol</a>
          <a href="#" className="hover:underline">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};
