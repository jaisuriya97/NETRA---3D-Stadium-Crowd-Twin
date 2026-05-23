export interface AgentData {
  id: number;
  x: number;
  y: number;
  z: number;
  speed: number;
  status: 'safe' | 'warning' | 'critical' | 'info';
  gate: number;
  section: string;
  groupSize: number;
}

export interface RiskItem {
  location: string;
  severity: number; // 0 to 100
  eta: string;
  reasoning: string;
}

export interface ScenarioParams {
  totalFans: number;
  weather: 'Sunny' | 'Rainy' | 'Sudden Rain' | 'Overcast';
  weatherChangeAt: number; // in mins
  matchType: string;
  arrivalCurve: 'standard' | 'delayed-rush' | 'early-surge';
  unticketedFansEstimate: number;
}

export interface Intervention {
  id: string;
  action: string;
  reasoning: string;
  applied: boolean;
  preview: boolean;
}

export interface SimMetrics {
  totalInStadium: number;
  activeOutside: number;
  bottleneckCount: number;
  flowRate: number; // agents/min
  averageWaitTime: number; // in mins
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  params: ScenarioParams;
}
