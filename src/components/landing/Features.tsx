import React from 'react';
import { Eye, Activity, ShieldCheck, Cpu, Database, Compass } from 'lucide-react';
import { Card } from '../ui/Card';

export const Features: React.FC = () => {
  const cards = [
    {
      icon: Eye,
      title: "See the Future Flow",
      description: "Agents represent physical cricket fans running fast-forward pathfinding calculations along gates and stands, uncovering bottleneck choke-pts 4-hours before crowds arrive.",
      pill: "Simulation Engine"
    },
    {
      icon: Cpu,
      title: "Agentic AI Reasoning",
      description: "Four logical Gemini 3.5 agents analyze coordinates, query weather changes, propose interventions using structured tools, and live stream situational briefs directly to operators.",
      pill: "Gemini Intelligence"
    },
    {
      icon: ShieldCheck,
      title: "Pre-empt Incidents",
      description: "Translate reactive emergency response into predictive safety design. Open side doors, redirect flows, and dispatch volunteers following high-precision live models.",
      pill: "Tactical Response"
    }
  ];

  return (
    <section id="features" className="bg-[#F7F7F7] py-24 px-8 md:px-16 border-t border-[#DDDDDD]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <span className="text-[#FF385C] uppercase tracking-widest text-xs font-bold font-mono">
            OPERATIONAL ADVANTAGES
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mt-3 mb-4">
            Architected for Proactive Stadium Control.
          </h2>
          <p className="text-[#717171] font-semibold text-sm leading-relaxed">
            Combining fluid agent math with modern generative models to secure high-capacity sports environments before risks materialize.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((c, i) => (
            <Card key={i} interactive className="bg-white p-8 flex flex-col justify-between h-full group hover:shadow-md">
              <div>
                <div className="inline-block bg-[#F7F7F7] border border-[#DDDDDD] p-3 rounded-xl text-[#222222] mb-6 group-hover:bg-[#FF385C]/5 group-hover:border-[#FF385C]/10 transition-colors">
                  <c.icon strokeWidth={1.5} className="h-6 w-6 group-hover:text-[#FF385C] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#222222] mb-3">{c.title}</h3>
                <p className="text-xs text-[#717171] leading-relaxed mb-6 font-medium">
                  {c.description}
                </p>
              </div>
              <div>
                <span className="inline-flex bg-[#F7F7F7] border border-[#DDDDDD] rounded-full text-[10px] font-mono uppercase tracking-wider text-[#717171] px-3.5 py-1">
                  {c.pill}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed architectural system walkthrough */}
        <div className="mt-20 border border-[#DDDDDD] bg-white rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold text-[#717171] uppercase tracking-wider">How Platform Operates</span>
              <h3 className="text-2xl font-bold text-[#222222] mt-2 mb-4">The NETRA Three-Layer Architecture</h3>
              <p className="text-xs text-[#717171] leading-relaxed mb-6">
                Most platforms display legacy video telemetry. NETRA aligns a physics-based simulator with Gemini’s strategic reasoning to create an autonomous feedback loop.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="bg-[#FF385C]/10 h-6 w-6 rounded-full flex items-center justify-center text-[#FF385C] text-xs font-bold shrink-0">1</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#222222]">Simulation Layer</h4>
                    <p className="text-[11px] text-[#717171]">GPU mesh updates paths of thousands of crowd agents every frame.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="bg-[#FF385C]/10 h-6 w-6 rounded-full flex items-center justify-center text-[#FF385C] text-xs font-bold shrink-0">2</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#222222]">AI Intelligence Layer</h4>
                    <p className="text-[11px] text-[#717171]">Four Gemini agents analyze density thresholds and strategize actions.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="bg-[#FF385C]/10 h-6 w-6 rounded-full flex items-center justify-center text-[#FF385C] text-xs font-bold shrink-0">3</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#222222]">Visual Interface Layer</h4>
                    <p className="text-[11px] text-[#717171]">Frictionless light theme dashboards provide instant action access.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="how" className="lg:col-span-7 bg-[#F7F7F7] border border-[#DDDDDD] p-6 rounded-xl font-mono text-xs text-[#222222] overflow-x-auto">
              <div className="border-b border-[#DDDDDD] pb-3 mb-3 flex items-center justify-between font-semibold">
                <span>netra --core-monitoring-service</span>
                <span className="h-2 w-2 rounded-full bg-[#00A699]"></span>
              </div>
              <pre className="leading-5 text-[11px]">
{`[06:41:24] INF initializing agent graph
[06:41:24] INF loaded 8 entrance nodes with physical attributes
[06:41:25] INF spawn wave T-60 started: 1,500 fan instances generated
[06:41:25] AI  [Analyst Agent] evaluating edge weights...
[06:41:25] AI  [Analyst Agent] WARN: Gate 1 density ratio hits 1.45
[06:41:26] AI  [Strategist] dispatching remedial tools: "open_gate_side"
[06:41:26] INF gate 1A opened (capacity +24). Crowd relief ongoing
[06:41:27] INF simulation refreshed: average throughput speed restored
[06:41:27] INF system normal. 60 FPS verified.`}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
