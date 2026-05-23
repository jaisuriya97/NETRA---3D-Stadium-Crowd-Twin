import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../lib/store';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Hex Status Color Mapping from our Design System:
const statusColorsMap = {
  safe: '#00A699',      // teal
  warning: '#FFB400',   // amber
  critical: '#C13515',  // deep safe red
  info: '#428BCA',      // blue routing
};

export const FanParticles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const agents = useStore((state) => state.agents);

  // Set initial instanced count
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.count = agents.length;
    }
  }, [agents.length]);

  useFrame(() => {
    if (!meshRef.current) return;

    agents.forEach((agent, i) => {
      // 1. Position and scale agent sphere
      tempObject.position.set(agent.x, agent.y, agent.z);
      
      // Give warning & critical particles slightly larger presence
      const size = agent.status === 'critical' ? 0.65 : agent.status === 'warning' ? 0.55 : 0.45;
      tempObject.scale.set(size, size, size);
      
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      // 2. Set Status Color
      const hexColor = statusColorsMap[agent.status] || '#00A699';
      tempColor.set(hexColor);
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null as any, null as any, 1500]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial roughness={0.3} metalness={0.1} />
    </instancedMesh>
  );
};
