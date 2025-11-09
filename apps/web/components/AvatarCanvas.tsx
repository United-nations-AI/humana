"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { Suspense } from 'react';

function AvatarModel() {
  // Sample GLB; replace with provided asset later
  const { scene } = useGLTF('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
  return React.createElement('primitive' as any, { object: scene });
}

export default function AvatarCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [2.5, 2.5, 2.5], fov: 50 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          {/* Simple lighting setup - created programmatically to avoid TypeScript issues */}
          {React.createElement('ambientLight' as any, { intensity: 0.6 })}
          {React.createElement('directionalLight' as any, { position: [5, 5, 5], intensity: 0.8 })}
          {React.createElement('pointLight' as any, { position: [-5, -5, -5], intensity: 0.4 })}
          
          {/* Avatar model */}
          <AvatarModel />
          
          {/* Camera controls */}
          <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}
