import React, { useState } from 'react';
import { useStore, presets } from '../../lib/store';
import { Button } from './Button';
import { Badge } from './Badge';
import { Send, Sun, CloudRain, Flame, Zap, Camera, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ScenarioPanel: React.FC = () => {
  const {
    params,
    setParams,
    activePresetId,
    selectPreset,
    simSpeed,
    setSimSpeed,
    loadingScenario,
    setLoadingState,
    startBriefingStream,
    setInterventions,
    cameraView,
    setCameraView,
    demoStep,
    incrementDemoStep,
    tickSim,
  } = useStore();

  const [promptInput, setPromptInput] = useState("");

  // Handles natural language API submit
  const handlePromptSubmit = async () => {
    if (!promptInput.trim()) return;
    setLoadingState('scenario', true);

    try {
      // 1. Fetch scenario params
      const response = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naturalLanguageInput: promptInput })
      });
      const generatedParams = await response.json();
      setParams(generatedParams);

      // 2. Mock or fetch related strategic agents
      setLoadingState('analyze', true);
      const resAnalyze = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalFans: generatedParams.totalFans,
          weather: generatedParams.weather,
          bottleneckCount: 1,
          averageWaitTime: 8,
        })
      });
      const generatedAnalyze = await resAnalyze.json();

      setLoadingState('strategize', true);
      const resStrategize = await fetch('/api/strategize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMetrics: { flowRate: 90, totalInStadium: 45000 },
          activeRisks: generatedAnalyze.risks
        })
      });
      const generatedStrategize = await resStrategize.json();
      if (generatedStrategize.interventions) {
        setInterventions(generatedStrategize.interventions);
      }

      setLoadingState('scenario', false);
      setLoadingState('analyze', false);
      setLoadingState('strategize', false);

      // 3. Narrative Briefing stream
      const resNarrate = await fetch('/api/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: generatedParams,
          metrics: { averageWaitTime: 9 },
          risks: generatedAnalyze.risks
        })
      });
      const generatedNarrate = await resNarrate.json();
      startBriefingStream(generatedNarrate.text);

    } catch (e) {
      console.error(e);
      setLoadingState('scenario', false);
      setLoadingState('analyze', false);
      setLoadingState('strategize', false);
    }
  };

  // Automated step-by-step Demo timeline
  const triggerNextDemoStep = async () => {
    if (demoStep === 0) {
      // Step 1: Pre-fills Sudden Rain and runs AI
      incrementDemoStep(); // Step 1
      selectPreset('preset_rain');
      setPromptInput("IPL Final under Sudden Rainfall conditions starting at T-15 mins");
      
      setLoadingState('scenario', true);
      await new Promise(r => setTimeout(r, 1200));
      setLoadingState('scenario', false);

    } else if (demoStep === 1) {
      // Step 2: Influx particles trigger, analyst runs
      incrementDemoStep(); // Step 2
      setLoadingState('analyze', true);
      await new Promise(r => setTimeout(r, 1500));
      setLoadingState('analyze', false);
      setCameraView('GATE-LEVEL'); // Rotate fly-by to bottleneck

    } else if (demoStep === 2) {
      // Step 3: Recommend interventions
      incrementDemoStep(); // Step 3
      setLoadingState('strategize', true);
      await new Promise(r => setTimeout(r, 1600));
      setLoadingState('strategize', false);

    } else if (demoStep === 3) {
      // Step 4: Stream Narrator brief
      incrementDemoStep(); // Step 4
      
      const payload = {
        params: presets[1].params,
        metrics: { totalInStadium: 52000, activeOutside: 33000, bottleneckCount: 2, flowRate: 85, averageWaitTime: 14 },
        risks: [
          { location: "Gate 1 (North-East Entrance)", severity: 94, eta: "T-12 mins", reasoning: "Heavy rain surge forcing fans to crowd at Gate 1." }
        ]
      };

      try {
        const response = await fetch('/api/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        startBriefingStream(data.text);
      } catch (error) {
        startBriefingStream("Commander, we are tracking emergency rain surge levels. Redirection pipelines have been initialized at Gate 1.");
      }
    }
  };

  const currentDemoStepText = () => {
    if (demoStep === 0) return "Start Demo Timeline";
    if (demoStep === 1) return "Analyze Inflow Risks";
    if (demoStep === 2) return "Strategize Mitigations";
    if (demoStep === 3) return "Call Commander Briefing";
    return "All Steps Integrated";
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Cinematic camera controls floating top-center within card context */}
      <div className="border-b border-[#F7F7F7] pb-4">
        <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider mb-2.5 block">
          Camera Viewports
        </span>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl">
          {(['TOP-DOWN', 'ISOMETRIC', 'GATE-LEVEL'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCameraView(view)}
              className={`text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all ${
                cameraView === view
                  ? 'bg-white text-[#222222] shadow-2xs border border-black/5'
                  : 'text-[#717171] hover:text-[#222222]'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Main Core Form */}
      <div>
        <h3 className="text-base font-bold text-[#222222] mb-1">Scenario Parameters</h3>
        <p className="text-xs text-[#717171] mb-4">Input conditions or describe them organically.</p>
        
        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g., Kohli retirement game with 95k fans, overcast sky, delayed rush at Gate 4..."
            className="w-full text-xs p-3.5 bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl focus:bg-white focus:ring-1 focus:ring-black placeholder-[#B0B0B0] text-[#222222] min-h-[75px] resize-none focus:outline-none"
          />
          <button
            onClick={handlePromptSubmit}
            disabled={loadingScenario || !promptInput.trim()}
            className="absolute bottom-3.5 right-3.5 p-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Presets */}
      <div>
        <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider block mb-2.5">
          Select Preset Scenarios
        </span>
        <div className="flex flex-col gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                selectPreset(preset.id);
                setPromptInput(preset.params.weather === 'Sudden Rain' ? "Rainfall surge" : preset.name);
              }}
              className={`text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                activePresetId === preset.id
                  ? 'bg-[#FF385C]/5 border-[#FF385C]'
                  : 'bg-white hover:bg-[#F7F7F7] border-[#DDDDDD]'
              }`}
            >
              <div className="flex gap-3">
                <div className={`p-1.5 rounded-lg border shrink-0 ${
                  activePresetId === preset.id 
                    ? 'bg-white border-[#FF385C]/20 text-[#FF385C]' 
                    : 'bg-[#F7F7F7] border-[#DDDDDD] text-[#717171]'
                }`}>
                  {preset.params.weather === 'Sunny' && <Sun className="h-4 w-4" />}
                  {preset.params.weather === 'Sudden Rain' && <CloudRain className="h-4 w-4" />}
                  {preset.params.weather === 'Overcast' && <Flame className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#222222]">{preset.name}</h4>
                  <p className="text-[10px] text-[#717171] leading-normal mt-0.5">{preset.description}</p>
                </div>
              </div>
              {activePresetId === preset.id && (
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF385C]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Speed dial */}
      <div className="border-t border-[#F7F7F7] pt-4 flex justify-between items-center">
        <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">
          Simulation speed
        </span>
        <div className="flex gap-1 p-0.5 bg-[#F7F7F7] border border-[#DDDDDD] rounded-lg">
          {([1, 6, 30, 60] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => setSimSpeed(spd)}
              className={`text-[10px] font-bold font-mono px-3 py-1 rounded transition-all ${
                simSpeed === spd
                  ? 'bg-white text-[#222222] shadow-2xs border border-neutral-200'
                  : 'text-[#717171] hover:text-[#222222]'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Failsafe step orchestrator loop */}
      <div className="border-t border-[#F7F7F7] pt-4">
        <button
          onClick={triggerNextDemoStep}
          disabled={demoStep >= 4}
          className="w-full flex items-center justify-between bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl p-3.5 text-xs font-bold transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            {demoStep === 4 ? (
              <CheckCircle2 className="h-4 w-4 text-[#00A699]" />
            ) : (
              <Zap className="h-4 w-4 text-[#FFB400] animate-pulse" />
            )}
            <span>{currentDemoStepText()}</span>
          </div>
          <span className="bg-white/10 px-2 py-0.5 rounded text-[10px]">
            {demoStep}/4
          </span>
        </button>
      </div>

    </div>
  );
};
