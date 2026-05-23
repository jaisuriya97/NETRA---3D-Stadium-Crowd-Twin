import { AgentData, ScenarioParams, RiskItem, SimMetrics, Intervention } from '../../types';

// Deterministic seedable random number generator
function seedRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export class StadiumSimulator {
  public agents: AgentData[] = [];
  public currentSimTime = -60; // Start at T-60 mins
  public metrics: SimMetrics = {
    totalInStadium: 0,
    activeOutside: 0,
    bottleneckCount: 0,
    flowRate: 0,
    averageWaitTime: 0,
  };
  public risks: RiskItem[] = [];

  private params: ScenarioParams;
  private interventions: Intervention[] = [];
  private rng = seedRandom(42);

  // Gates positioned at 8 polar coordinates (radius = 65)
  private gates = [
    { id: 1, angle: 0, capacity: 25, isCovered: true, label: "Gate 1 (North-East)" },
    { id: 2, angle: Math.PI / 4, capacity: 20, isCovered: true, label: "Gate 2 (East)" },
    { id: 3, angle: Math.PI / 2, capacity: 30, isCovered: false, label: "Gate 3 (South-East)" },
    { id: 4, angle: (3 * Math.PI) / 4, capacity: 15, isCovered: false, label: "Gate 4 (South)" },
    { id: 5, angle: Math.PI, capacity: 25, isCovered: false, label: "Gate 5 (South-West)" },
    { id: 6, angle: (5 * Math.PI) / 4, capacity: 20, isCovered: true, label: "Gate 6 (West)" },
    { id: 7, angle: (3 * Math.PI) / 2, capacity: 32, isCovered: true, label: "Gate 7 (North-West)" },
    { id: 8, angle: (7 * Math.PI) / 4, capacity: 22, isCovered: true, label: "Gate 8 (North)" },
  ];

  constructor(params: ScenarioParams) {
    this.params = params;
    this.generateAllAgents();
    this.updateMetricsAndRisks();
  }

  public updateParams(params: ScenarioParams) {
    this.params = params;
    this.generateAllAgents();
    this.updateMetricsAndRisks();
  }

  public applyInterventions(interventions: Intervention[]) {
    this.interventions = interventions;
  }

  // Pre-generate agent pathways & spawn profiles
  private generateAllAgents() {
    this.agents = [];
    const count = Math.min(this.params.totalFans / 70, 1500); // Scale down for high-performance 60fps rendering in mobile/desktops
    const rng = seedRandom(12345);

    for (let i = 0; i < count; i++) {
      const groupSize = Math.floor(rng() * 4) + 1;
      
      // Select gate bias depending on weather or scenario
      let gateIndex = Math.floor(rng() * 8);

      // Scenario Biases
      if (this.params.weather === 'Rainy' || this.params.weather === 'Sudden Rain') {
        // Fans prefer covered gates (1, 2, 6, 7, 8)
        const coveredIndices = [0, 1, 5, 6, 7];
        if (rng() < 0.75) {
          gateIndex = coveredIndices[Math.floor(rng() * coveredIndices.length)];
        }
      }

      const gate = this.gates[gateIndex];
      const gateAngle = gate.angle;

      // Spawn time distribution based on arrivalCurve
      let spawnOffset = 0;
      const baseVal = rng();
      if (this.params.arrivalCurve === 'early-surge') {
        spawnOffset = -55 + baseVal * 45; // Surge between T-55 and T-10
      } else if (this.params.arrivalCurve === 'delayed-rush') {
        spawnOffset = -25 + baseVal * 35; // Late rush between T-25 and T+10
      } else {
        spawnOffset = -45 + baseVal * 55; // Standard distribution T-45 to T+10
      }

      // Add a potential rain weather triggers
      if (this.params.weather === 'Sudden Rain' && spawnOffset > this.params.weatherChangeAt) {
        // Redraw gate index to covered gates due to rush from rain at T-15
        const coveredIndices = [0, 1, 5, 6, 7];
        if (rng() < 0.85) {
          gateIndex = coveredIndices[Math.floor(rng() * coveredIndices.length)];
        }
      }

      const selectedGate = this.gates[gateIndex];

      // Walk Speed with random noise
      const baseSpeed = 1.2 + rng() * 0.4; // 1.2 to 1.6 m/s

      // Seat stand assignment (angle around stand, circles of different heights)
      const seatAngle = rng() * Math.PI * 2;
      const seatSection = ["East Wing", "West Pavilion", "North Stand", "South Club", "Legends Terrace"][Math.floor(rng() * 5)];

      // Store initial coordinate states at Gate spawn radius (approx 70m from stadium pit)
      const radialOffset = 65 + rng() * 10;
      this.agents.push({
        id: i,
        x: Math.cos(selectedGate.angle) * radialOffset,
        y: 0.35, // small elevation from pitch
        z: Math.sin(selectedGate.angle) * radialOffset,
        speed: baseSpeed,
        status: 'safe',
        gate: selectedGate.id,
        section: seatSection,
        groupSize,
      });
    }
  }

  // Runs a simulation step of deltaTime in minutes
  public step(dt: number) {
    this.currentSimTime += dt;
    if (this.currentSimTime > 60) {
      this.currentSimTime = -60; // loop back
      this.generateAllAgents();
    }

    // Capacity multiplier based on interventions
    const openGatesMod = this.interventions.find(iv => iv.id === 'open_gate_side' && iv.applied);
    const redirectMod = this.interventions.find(iv => iv.id === 'redirect_flow' && iv.applied);
    const preemPushMod = this.interventions.find(iv => iv.id === 'preemp_push' && iv.applied);

    // Compute localized densities at gates
    const agentsAtGate: Record<number, number> = {};
    this.gates.forEach(g => {
      agentsAtGate[g.id] = 0;
    });

    this.agents.forEach(agent => {
      // An agent is considered "approaching gate plaza" if within radius range [30, 75]
      const dist = Math.sqrt(agent.x * agent.x + agent.z * agent.z);
      if (dist > 28 && dist < 70) {
        agentsAtGate[agent.gate] += agent.groupSize;
      }
    });

    // Move agents
    this.agents.forEach(agent => {
      const dist = Math.sqrt(agent.x * agent.x + agent.z * agent.z);
      
      // Determine destination target radius (center is pitch at radius 0-15)
      // Destination is inside stand rings (radius 18 to 25)
      const targetRadius = 18 + (agent.id % 8); 

      if (dist <= targetRadius) {
        // Agent is safely inside stadium! Keep static or small ambient motion
        agent.status = 'safe';
        agent.x = Math.max(Math.min(agent.x, 30), -30);
        agent.z = Math.max(Math.min(agent.z, 30), -30);
        return;
      }

      // Density at this agent's gate
      const gateInfo = this.gates.find(g => g.id === agent.gate)!;
      let capacity = gateInfo.capacity;

      // Adjust capacity / route based on applied interventions
      if (openGatesMod && agent.gate === 1) {
        capacity += 24; // Side-gate doubles Gate 1 capacity!
      }
      if (redirectMod && agent.gate === 1) {
        // Redistribution: 35% of Gate 1 traffic safely routed to Gate 8
        if (agent.id % 3 === 0) {
          const gate8 = this.gates[7];
          agent.gate = 8;
        }
      }

      const activeDensity = agentsAtGate[agent.gate] || 0;
      const densityRatio = activeDensity / capacity;

      // Behavior rules
      let currentSpeed = agent.speed;
      if (densityRatio > 1.8) {
        agent.status = 'critical';
        currentSpeed = agent.speed * 0.05; // Almost stuck
      } else if (densityRatio > 1.2) {
        agent.status = 'warning';
        currentSpeed = agent.speed * 0.4;  // Slowed down
      } else if (redirectMod && agent.gate === 8 && (agent.id % 3 === 0)) {
        agent.status = 'info'; // Highlight redirected flow
        currentSpeed = agent.speed * 1.1;
      } else {
        agent.status = 'safe';
        currentSpeed = agent.speed;
      }

      if (preemPushMod) {
        // Pre-emptive warnings speed up flow through clearer queuing
        currentSpeed *= 1.2;
      }

      // Step inwards towards center (0, 0, 0)
      // dt is in minutes. Multiply by 60 for seconds, then move
      const moveDistance = currentSpeed * (dt * 60);

      // Vector toward center
      const angle = Math.atan2(agent.z, agent.x);
      const nextRadius = Math.max(dist - moveDistance, targetRadius);

      agent.x = Math.cos(angle) * nextRadius;
      agent.z = Math.sin(angle) * nextRadius;
    }
    );

    this.updateMetricsAndRisks();
  }

  private updateMetricsAndRisks() {
    let totalInStadium = 0;
    let activeOutside = 0;
    let bottleneckCount = 0;

    // Check count of agents inside/outside
    this.agents.forEach(agent => {
      const dist = Math.sqrt(agent.x * agent.x + agent.z * agent.z);
      if (dist <= 26) {
        totalInStadium += agent.groupSize;
      } else {
        activeOutside += agent.groupSize;
        if (agent.status === 'critical') {
          bottleneckCount++;
        }
      }
    });

    // Compute metric rates
    const flowRate = Math.floor(totalInStadium > 0 ? (totalInStadium / (this.currentSimTime + 61)) * 10 : 85);
    const averageWaitTime = Math.max(1, Math.floor(bottleneckCount * 0.15 + (this.params.weather === 'Rainy' ? 12 : 3)));

    this.metrics = {
      totalInStadium: Math.floor(totalInStadium * 70), // Scale back up to resemble full cricket stadium
      activeOutside: Math.floor(activeOutside * 70),
      bottleneckCount,
      flowRate,
      averageWaitTime,
    };

    // Construct risks based on model densities
    const tempRisks: RiskItem[] = [];

    this.gates.forEach(g => {
      // Find active agents approaching this gate
      const count = this.agents.filter(a => a.gate === g.id && Math.sqrt(a.x * a.x + a.z * a.z) > 28).reduce((acc, a) => acc + a.groupSize, 0) * 70;
      
      let severity = 10;
      let reasoning = "Normal fan queuing patterns. Security pre-positioned active.";
      let eta = "No structural delays";

      // Rainy weather surge biases
      if (this.params.weather === 'Sudden Rain' && g.id === 1) {
        severity = 94;
        reasoning = "Critical bottlenecks forming as fans flee uncovered South/East seating to sheltered stand entrances.";
        eta = "Crash event projected in T-12 mins";
      } else if (this.params.weather === 'Sudden Rain' && g.id === 2) {
        severity = 78;
        reasoning = "Heavy crowding at East entrance due to rain shelter demand.";
        eta = "Crowding forming; ETA T-8 mins";
      } else if (this.params.weather === 'Rainy' && (g.id === 1 || g.id === 7)) {
        severity = 82;
        reasoning = "Sustained high usage at northern covered entrances due to ongoing rainfall.";
        eta = "Bottleneck expected in T-15 mins";
      } else if (this.params.totalFans > 90000 && g.id === 4) {
        // Overflow scenario
        severity = 96;
        reasoning = "Excess unticketed crowd build-up blocks physical gate entrances. High crash index detected.";
        eta = "Heavy surge; structural stall detected";
      } else {
        // Standard density metrics
        if (count > 8000) {
          severity = 65;
          reasoning = "Sustained high queue volume ahead of IPL kick-off peak ingress wave.";
          eta = "Delays likely; ETA T-25 mins";
        } else if (count > 4000) {
          severity = 40;
          reasoning = "Moderate flow density. Checked queuing in optimal ranges.";
          eta = "Stable queue; 4 min wait time";
        }
      }

      // Check interventions
      const isGate1Open = this.interventions.find(iv => iv.id === 'open_gate_side' && iv.applied);
      const isRedirected = this.interventions.find(iv => iv.id === 'redirect_flow' && iv.applied);

      if (g.id === 1 && isGate1Open) {
        severity = Math.max(15, Math.floor(severity * 0.35));
        reasoning = "Side gate 1A opened. Crowd redistributed, bottleneck cleared safely.";
        eta = "Resolved · Flow normalized";
      } else if (g.id === 1 && isRedirected) {
        severity = Math.max(25, Math.floor(severity * 0.5));
        reasoning = "Flow redirection in progress. 35% of current volumes re-routed to North gate.";
        eta = "Mitigation Active";
      }

      tempRisks.push({
        location: g.label,
        severity,
        eta,
        reasoning,
      });
    });

    this.risks = tempRisks.sort((a, b) => b.severity - a.severity);
  }
}
