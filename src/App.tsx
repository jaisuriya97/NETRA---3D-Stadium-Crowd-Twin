import React, { useEffect, useState } from 'react';
import { useStore } from './lib/store';
import { TopBar } from './components/shell/TopBar';
import { Footer } from './components/shell/Footer';
import { Hero } from './components/landing/Hero';
import { Features } from './components/landing/Features';
import { CTA } from './components/landing/CTA';
import { MetricCard } from './components/ui/MetricCard';
import { Scene } from './components/twin/Scene';
import { TacticalGridView } from './components/twin/TacticalGridView';
import { ScenarioPanel } from './components/ui/ScenarioPanel';
import { RiskPanel } from './components/ui/RiskPanel';
import { InterventionList } from './components/ui/InterventionList';
import { BriefingPanel } from './components/ui/BriefingPanel';
import { TimeScrubber } from './components/ui/TimeScrubber';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Eye, 
  Map, 
  Info, 
  Users, 
  Activity, 
  Clock, 
  Play, 
  Pause, 
  Zap,
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';

export default function App() {
  const {
    currentView,
    setView,
    isRunning,
    setIsRunning,
    simSpeed,
    tickSim,
    metrics,
    params,
    demoStep,
  } = useStore();

  const [visualizerMode, setVisualizerMode] = useState<'3D' | '2D'>('3D');

  // Simulation Game Tick sync
  useEffect(() => {
    if (!isRunning) return;

    const intervalMs = 150;
    // Maps simSpeed dynamically to simulated minutes
    // at 6x speed, 1 real second = 6 sim seconds.
    // So 150ms real time = 150ms * simSpeed simulated time
    const tickInterval = setInterval(() => {
      const dtSimMinutes = (intervalMs / 1000) * (simSpeed / 60);
      tickSim(dtSimMinutes);
    }, intervalMs);

    return () => clearInterval(tickInterval);
  }, [isRunning, simSpeed, tickSim]);

  // Determine dynamic health metric details
  const getOverallImpactText = () => {
    const isSideGateOpen = useStore.getState().interventions[0].applied;
    const isRedirectActive = useStore.getState().interventions[1].applied;

    if (isSideGateOpen && isRedirectActive) {
      return "Flow secured. 92% throughput efficiency maintained. Incident chance neutral.";
    }
    if (params.weather === 'Sudden Rain' && demoStep < 4) {
      return "Rain emergency underway. Severe congestions forming at Gate 1 & 2.";
    }
    return "Queues within active parameters. High throughput stability verified.";
  };

  const getOverallTrendType = () => {
    const isSideGateOpen = useStore.getState().interventions[0].applied;
    if (isSideGateOpen) return 'safe';
    if (params.weather === 'Sudden Rain' && demoStep < 4) return 'critical';
    return 'neutral';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar />

      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          /* LANDING PAGE - Airbnb style promo */
          <motion.main
            key="landing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            <Hero />
            <Features />
            <CTA />
            <Footer />
          </motion.main>
        ) : (
          /* TWIN VISUALIZER - Command center dashboard */
          <motion.main
            key="twin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col relative bg-[#F7F7F7]"
            style={{ height: 'calc(100vh - 80px)' }}
          >
            
            {/* Top Stats HUD bar */}
            <div className="w-full bg-white border-b border-[#DDDDDD] px-8 py-3.5 grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 z-30 shadow-2xs">
              <MetricCard
                title="Active Flow Influx"
                value={`${metrics.flowRate.toLocaleString()} fans/m`}
                subtitle="Aggregated turnstile throughput index"
                icon={Activity}
                trendType="safe"
              />
              <MetricCard
                title="Accumulated Queues"
                value={`${metrics.activeOutside.toLocaleString()} fans`}
                subtitle="Supporters approaching outer plaza"
                icon={Users}
                trendType={params.weather === 'Sudden Rain' && demoStep < 4 ? 'warning' : 'neutral'}
              />
              <MetricCard
                title="Administrative Delay"
                value={`${metrics.averageWaitTime} mins`}
                subtitle="Estimated queuing check-out buffer"
                icon={Clock}
                trendType={params.weather === 'Sudden Rain' && demoStep < 4 ? 'critical' : 'neutral'}
              />
              
              {/* Symmetrical Action confirmation Hud panel */}
              <Card className="flex flex-col justify-between p-4 bg-white border border-[#DDDDDD] h-full rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">
                      Failsafe Prognostic Index
                    </h4>
                    <p className={`text-xs font-bold mt-1 max-w-[190px] ${
                      getOverallTrendType() === 'safe'
                        ? 'text-[#00A699]'
                        : getOverallTrendType() === 'critical'
                        ? 'text-[#C13515]'
                        : 'text-[#222222]'
                    }`}>
                      {getOverallImpactText()}
                    </p>
                  </div>
                  {getOverallTrendType() === 'safe' ? (
                    <CheckCircle2 className="h-5 w-5 text-[#00A699] shrink-0" />
                  ) : getOverallTrendType() === 'critical' ? (
                    <AlertTriangle className="h-5 w-5 text-[#C13515] shrink-0 animate-bounce" />
                  ) : (
                    <Info className="h-4 w-4 text-[#717171] shrink-0" />
                  )}
                </div>
              </Card>
            </div>

            {/* Main Interactive Map & Float Sidebar columns */}
            <div className="flex-grow flex flex-col xl:flex-row relative overflow-hidden">
              
              {/* Left Column Controls */}
              <div className="w-full xl:w-96 border-r border-[#DDDDDD] bg-white overflow-y-auto p-6 shrink-0 z-10 flex flex-col gap-6">
                <ScenarioPanel />
              </div>

              {/* Central Map Canvas Window */}
              <div className="flex-grow relative h-[45vh] xl:h-auto min-h-[350px]">
                {/* Visualizer Selector tabs */}
                <div className="absolute top-4 left-4 z-20 flex gap-1 p-0.5 bg-white border border-black/5 rounded-xl shadow-md">
                  <button
                    onClick={() => setVisualizerMode('3D')}
                    className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                      visualizerMode === '3D'
                        ? 'bg-[#FF385C] text-white shadow-xs'
                        : 'text-[#717171] hover:text-[#222222]'
                    }`}
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>3D Digital Twin</span>
                  </button>
                  <button
                    onClick={() => setVisualizerMode('2D')}
                    className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                      visualizerMode === '2D'
                        ? 'bg-[#FF385C] text-white shadow-xs'
                        : 'text-[#717171] hover:text-[#222222]'
                    }`}
                  >
                    <Map className="h-3.5 w-3.5" />
                    <span>2D Tactical Blueprints</span>
                  </button>
                </div>

                {/* Simulation Play/Pause HUD controls */}
                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur border border-black/5 p-1 rounded-xl shadow-md flex gap-1">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-1.5 text-[#222222] hover:bg-[#F7F7F7] rounded-lg transition-colors cursor-pointer"
                    title={isRunning ? "Pause Sim" : "Play Sim"}
                  >
                    {isRunning ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 text-[#00A699]" />
                    )}
                  </button>
                </div>

                {/* Render Selected Viewport Mode */}
                <div className="w-full h-full">
                  {visualizerMode === '3D' ? (
                    <Scene />
                  ) : (
                    <div className="w-full h-full p-8 flex items-center justify-center bg-[#F0EFEA] relative">
                      <div className="w-full max-w-[500px] aspect-square">
                        <TacticalGridView />
                      </div>
                    </div>
                  )}
                </div>

                {/* Absolute Floating Center-Bottom Timetable scrubber */}
                <div className="absolute bottom-6 left-6 right-6 z-20 max-w-xl mx-auto">
                  <TimeScrubber />
                </div>
              </div>

              {/* Right Columns Block for Evaluation Risks / Remedial list */}
              <div className="w-full xl:w-96 border-l border-[#DDDDDD] bg-white overflow-y-auto shrink-0 z-10 flex flex-col border-t xl:border-t-0 divide-y divide-[#F7F7F7]">
                <div className="p-6">
                  <RiskPanel />
                </div>
                <div className="p-6">
                  <InterventionList />
                </div>
                <div className="p-6">
                  <BriefingPanel />
                </div>
              </div>

            </div>

          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
