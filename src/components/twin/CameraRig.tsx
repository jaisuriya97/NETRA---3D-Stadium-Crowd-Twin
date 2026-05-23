import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../lib/store';

export const CameraRig: React.FC = () => {
  const { cameraView } = useStore();
  const { camera } = useThree();

  // Target vectors
  const targetPos = useRef(new THREE.Vector3(60, 80, 60));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (cameraView === 'TOP-DOWN') {
      targetPos.current.set(0, 100, 0.1);
      targetLookAt.current.set(0, 0, 0);
    } else if (cameraView === 'GATE-LEVEL') {
      // Aim at Gate 1 (angle 0, coordinates (61, 0, 0)) to witness bottleneck closeup
      targetPos.current.set(50, 6, 25);
      targetLookAt.current.set(62, 1, 0);
    } else {
      // ISOMETRIC
      targetPos.current.set(60, 80, 60);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [cameraView]);

  useFrame((state) => {
    // Smoothly lerp camera position
    camera.position.lerp(targetPos.current, 0.075);
    
    // Look at target point
    const currentLook = new THREE.Vector3(0, 0, 0);
    state.camera.getWorldDirection(currentLook);
    // Since we want to lerp what we are looking at, we configure a smooth look-at transition
    camera.lookAt(targetLookAt.current);
  });

  return null;
};
