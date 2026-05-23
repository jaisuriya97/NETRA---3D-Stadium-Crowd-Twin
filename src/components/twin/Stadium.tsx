import React from 'react';
import * as THREE from 'three';

export const Stadium: React.FC = () => {
  return (
    <group>
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#E8E5E0" roughness={0.9} />
      </mesh>

      {/* Grid Helper for technical floor look */}
      <gridHelper args={[160, 40, '#DDDDDD', '#E5E5E5']} position={[0, 0.01, 0]} />

      {/* Central Cricket Pitch */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[14, 14, 0.1, 32]} />
        <meshStandardMaterial color="#B5D49A" roughness={0.8} />
      </mesh>
      
      {/* Pitch Outer Circle boundary */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.9, 14.1, 64]} />
        <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} opacity={0.6} transparent />
      </mesh>

      {/* Concentric Tiered Seating Stands */}
      {/* Lower Tier Stand */}
      <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[22, 25, 2.4, 48, 1, true]} />
        <meshStandardMaterial color="#D6D3CE" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Middle Tier Stand */}
      <mesh position={[0, 3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[28, 32, 3, 48, 1, true]} />
        <meshStandardMaterial color="#C5C2BD" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Upper Premium Tier Stand */}
      <mesh position={[0, 6.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[35, 40, 4, 48, 1, true]} />
        <meshStandardMaterial color="#BDB9B4" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Structural Pillars */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 16;
        const radius = 41;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, 4.25, z]}>
            <cylinderGeometry args={[0.5, 0.5, 8.5, 8]} />
            <meshStandardMaterial color="#C5C2BD" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Symmetrical Entrance Gate Indicators */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const radius = 55;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={i} position={[x, 0.05, z]} rotation={[0, -angle, 0]}>
            {/* Base Gate Platform */}
            <mesh>
              <boxGeometry args={[10, 0.1, 4]} />
              <meshStandardMaterial color="#E0DCD5" roughness={0.8} />
            </mesh>
            {/* Structural side pillars for arch */}
            <mesh position={[-4, 1.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 3]} />
              <meshStandardMaterial color="#A3A09B" />
            </mesh>
            <mesh position={[4, 1.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 3]} />
              <meshStandardMaterial color="#A3A09B" />
            </mesh>
            {/* Header Arch */}
            <mesh position={[0, 3, 0]}>
              <boxGeometry args={[8.6, 0.4, 0.8]} />
              <meshStandardMaterial color="#8C8883" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
