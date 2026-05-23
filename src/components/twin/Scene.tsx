import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Stadium } from './Stadium';
import { Gates } from './Gates';
import { FanParticles } from './FanParticles';
import { CameraRig } from './CameraRig';

export const Scene: React.FC = () => {
  return (
    <div className="w-full h-full relative" style={{ backgroundColor: '#F0EFEA' }}>
      <Canvas
        shadows
        camera={{ position: [60, 80, 60], fov: 35 }}
        gl={{ antialias: true }}
      >
        {/* Soft, studio-quality model lighting */}
        <ambientLight intensity={0.65} color="#FFFFFF" />
        
        {/* Warm sunlight direction */}
        <directionalLight
          position={[40, 60, 30]}
          intensity={0.65}
          color="#FFFAF0"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Studio architectural glow sky/ground */}
        <hemisphereLight
          color="#E6F0FF"
          groundColor="#FFE4C4"
          intensity={0.35}
        />

        {/* Suspended geometries with fallback loaders */}
        <Suspense fallback={
          <Html center>
            <div className="bg-white/90 px-4 py-2 rounded-lg border border-neutral-200 text-xs font-semibold text-[#222222] animate-pulse">
              Buffering Digital Twin...
            </div>
          </Html>
        }>
          <Stadium />
          <Gates />
          <FanParticles />
          <CameraRig />
        </Suspense>

        {/* Restrained OrbitControls prevents under-ground rotation */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.15}
          minPolarAngle={Math.PI / 8}
          maxDistance={140}
          minDistance={15}
        />
      </Canvas>
    </div>
  );
};
export default Scene;
