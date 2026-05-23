import React from 'react';
import { Text } from '@react-three/drei';

const gatesList = [
  { id: 1, angle: 0, label: "GATE 1" },
  { id: 2, angle: Math.PI / 4, label: "GATE 2" },
  { id: 3, angle: Math.PI / 2, label: "GATE 3" },
  { id: 4, angle: (3 * Math.PI) / 4, label: "GATE 4" },
  { id: 5, angle: Math.PI, label: "GATE 5" },
  { id: 6, angle: (5 * Math.PI) / 4, label: "GATE 6" },
  { id: 7, angle: (3 * Math.PI) / 2, label: "GATE 7" },
  { id: 8, angle: (7 * Math.PI) / 4, label: "GATE 8" },
];

export const Gates: React.FC = () => {
  return (
    <group>
      {gatesList.map((g) => {
        const radius = 62;
        const x = Math.cos(g.angle) * radius;
        const z = Math.sin(g.angle) * radius;
        
        return (
          <group key={g.id} position={[x, 3.8, z]}>
            {/* Float Label */}
            <Text
              color="#222222"
              fontSize={1.8}
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.15}
              outlineColor="#FFFFFF"
            >
              {g.label}
            </Text>
            {/* Draw gate connection beam helper */}
            <mesh position={[0, -1.8, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 3.2]} />
              <meshBasicMaterial color="#FF385C" transparent opacity={0.65} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
