import { create } from 'zustand';
import { AgentData, ScenarioParams, RiskItem, SimMetrics, Intervention, PresetScenario } from '../types';
import { StadiumSimulator } from './simulation/simulator';

interface AppState {
  currentView: 'landing' | 'twin' | 'briefing';
  setView: (view: 'landing' | 'twin' | 'briefing') => void;
  
  // Scenarios & parameters
  params: ScenarioParams;
  setParams: (p: Partial<ScenarioParams>) => void;
  activePresetId: string | null;
  selectPreset: (presetId: string) => void;
  
  // Sim play state
  isRunning: boolean;
  setIsRunning: (run: boolean) => void;
  simSpeed: 1 | 6 | 30 | 60;
  setSimSpeed: (speed: 1 | 6 | 30 | 60) => void;
  currentSimTime: number; // -60 to +60 minutes
  setSimTime: (t: number) => void;

  // Simulator instance & agents
  agents: AgentData[];
  metrics: SimMetrics;
  risks: RiskItem[];
  interventions: Intervention[];
  setInterventions: (ivs: Intervention[]) => void;
  applyIntervention: (id: string, applied: boolean) => void;
  previewIntervention: (id: string, preview: boolean) => void;

  // AI Streaming Briefing
  briefingText: string;
  isStreamingBriefing: boolean;
  setBriefingText: (txt: string) => void;
  startBriefingStream: (fullTxt: string) => Promise<void>;

  // AI loading and statuses
  loadingScenario: boolean;
  loadingAnalyze: boolean;
  loadingStrategize: boolean;
  setLoadingState: (key: 'scenario' | 'analyze' | 'strategize', val: boolean) => void;

  // Camera presets
  cameraView: 'TOP-DOWN' | 'ISOMETRIC' | 'GATE-LEVEL';
  setCameraView: (view: 'TOP-DOWN' | 'ISOMETRIC' | 'GATE-LEVEL') => void;

  // Demo auto-timeline state
  demoStep: number;
  incrementDemoStep: () => void;
  resetDemo: () => void;

  // Manual update callback
  tickSim: (dt: number) => void;
}

// Default Params
const defaultParams: ScenarioParams = {
  totalFans: 80000,
  weather: 'Sunny',
  weatherChangeAt: -15,
  matchType: 'IPL Semi Final',
  arrivalCurve: 'standard',
  unticketedFansEstimate: 1200,
};

// Initial Interventions
const defaultInterventions: Intervention[] = [
  {
    id: 'open_gate_side',
    action: 'Open North-East Side Gate 1A',
    reasoning: 'Redistributes entry density from Gate 1 to side turnstiles. Eliminates bottleneck within 4 minutes.',
    applied: false,
    preview: false,
  },
  {
    id: 'redirect_flow',
    action: 'Reroute 35% East Traffic to Gate 8',
    reasoning: 'Redistribute fans from high-congestion East sectors to low-density North sector using video boards & stewards.',
    applied: false,
    preview: false,
  },
  {
    id: 'preemp_push',
    action: 'Pre-emptive Security Placement at Gate 4',
    reasoning: 'Pre-positions 2 rapid security details and deploys physical queue barriers to prevent un-ticketed crowd formation.',
    applied: false,
    preview: false,
  }
];

// Presets
export const presets: PresetScenario[] = [
  {
    id: 'preset_sunny',
    name: 'IPL Final · Sunny',
    description: '80k capacity with normal crowd arrival peaking at T-30 min.',
    icon: 'Sun',
    params: {
      totalFans: 82000,
      weather: 'Sunny',
      weatherChangeAt: 0,
      matchType: 'IPL Championship Final',
      arrivalCurve: 'standard',
      unticketedFansEstimate: 1500,
    }
  },
  {
    id: 'preset_rain',
    name: 'IPL Final · Sudden Rain',
    description: 'Crowd rush to covered gates at T-15 as heavy rain breaks out.',
    icon: 'CloudRain',
    params: {
      totalFans: 85000,
      weather: 'Sudden Rain',
      weatherChangeAt: -15,
      matchType: 'IPL Final Run',
      arrivalCurve: 'delayed-rush',
      unticketedFansEstimate: 2000,
    }
  },
  {
    id: 'preset_overflow',
    name: "Kohli's Final · Overflow",
    description: '95,000 ticketed fans with unticketed buildup at Gate 4.',
    icon: 'Flame',
    params: {
      totalFans: 95000,
      weather: 'Overcast',
      weatherChangeAt: 0,
      matchType: 'Kohli Retirement Match',
      arrivalCurve: 'early-surge',
      unticketedFansEstimate: 5000,
    }
  }
];

// Instantiating simulator
const simulatorInstance = new StadiumSimulator(defaultParams);

export const useStore = create<AppState>((set, get) => ({
  currentView: 'landing',
  setView: (view) => set({ currentView: view }),

  params: defaultParams,
  setParams: (p) => {
    const freshParams = { ...get().params, ...p };
    simulatorInstance.updateParams(freshParams);
    set({
      params: freshParams,
      agents: [...simulatorInstance.agents],
      metrics: { ...simulatorInstance.metrics },
      risks: [...simulatorInstance.risks],
    });
  },

  activePresetId: null,
  selectPreset: (presetId) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      simulatorInstance.updateParams(preset.params);
      set({
        activePresetId: presetId,
        params: preset.params,
        agents: [...simulatorInstance.agents],
        metrics: { ...simulatorInstance.metrics },
        risks: [...simulatorInstance.risks],
      });
    }
  },

  isRunning: true,
  setIsRunning: (run) => set({ isRunning: run }),
  simSpeed: 6,
  setSimSpeed: (speed) => set({ simSpeed: speed }),
  currentSimTime: -60,
  setSimTime: (t) => {
    simulatorInstance.currentSimTime = t;
    set({
      currentSimTime: t,
      agents: [...simulatorInstance.agents],
      metrics: { ...simulatorInstance.metrics },
      risks: [...simulatorInstance.risks],
    });
  },

  agents: [...simulatorInstance.agents],
  metrics: { ...simulatorInstance.metrics },
  risks: [...simulatorInstance.risks],
  interventions: defaultInterventions,
  setInterventions: (ivs) => {
    simulatorInstance.applyInterventions(ivs);
    set({ interventions: ivs });
  },

  applyIntervention: (id, applied) => {
    const updated = get().interventions.map(iv =>
      iv.id === id ? { ...iv, applied } : iv
    );
    simulatorInstance.applyInterventions(updated);
    set({ interventions: updated });
    // Instantly refresh model metrics
    get().tickSim(0);
  },

  previewIntervention: (id, preview) => {
    const updated = get().interventions.map(iv =>
      iv.id === id ? { ...iv, preview } : iv
    );
    set({ interventions: updated });
  },

  briefingText: "Awaiting simulation variables and data input. Click 'Run Simulation' to activate the commander briefing pipeline.",
  isStreamingBriefing: false,
  setBriefingText: (txt) => set({ briefingText: txt }),
  startBriefingStream: async (fullTxt) => {
    set({ isStreamingBriefing: true, briefingText: "" });
    const delay = 35; // typing delay
    let currentText = "";
    const words = fullTxt.split(" ");
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? "" : " ") + words[i];
      set({ briefingText: currentText });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    set({ isStreamingBriefing: false });
  },

  loadingScenario: false,
  loadingAnalyze: false,
  loadingStrategize: false,
  setLoadingState: (key, val) => {
    if (key === 'scenario') set({ loadingScenario: val });
    if (key === 'analyze') set({ loadingAnalyze: val });
    if (key === 'strategize') set({ loadingStrategize: val });
  },

  cameraView: 'ISOMETRIC',
  setCameraView: (view) => set({ cameraView: view }),

  demoStep: 0,
  incrementDemoStep: () => set((state) => ({ demoStep: state.demoStep + 1 })),
  resetDemo: () => {
    simulatorInstance.updateParams(defaultParams);
    simulatorInstance.applyInterventions(defaultInterventions);
    simulatorInstance.currentSimTime = -60;
    set({
      demoStep: 0,
      currentSimTime: -60,
      params: defaultParams,
      agents: [...simulatorInstance.agents],
      metrics: { ...simulatorInstance.metrics },
      risks: [...simulatorInstance.risks],
      interventions: defaultInterventions,
      briefingText: "Awaiting simulation variables and data input. Click 'Run Simulation' to activate the commander briefing pipeline.",
      cameraView: 'ISOMETRIC',
      simSpeed: 6,
    });
  },

  tickSim: (dt) => {
    simulatorInstance.step(dt);
    set({
      currentSimTime: simulatorInstance.currentSimTime,
      agents: [...simulatorInstance.agents],
      metrics: { ...simulatorInstance.metrics },
      risks: [...simulatorInstance.risks],
    });
  }
}));
