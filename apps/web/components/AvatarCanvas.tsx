"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { Suspense } from 'react';

function AvatarModel() {
  // Placeholder avatar - simple geometric shape until you provide your GLB file
  // Replace this with useGLTF when you have your avatar file
  return (
    <>
      {React.createElement('ambientLight' as any, { intensity: 0.6 })}
      {React.createElement('directionalLight' as any, { position: [5, 5, 5], intensity: 0.8 })}
      {React.createElement('pointLight' as any, { position: [-5, -5, -5], intensity: 0.4 })}
      
      {/* Placeholder avatar - replace with your GLB when ready */}
      {React.createElement('mesh' as any, {},
        React.createElement('boxGeometry' as any, { args: [1, 1, 1] }),
        React.createElement('meshStandardMaterial' as any, { color: '#3b82f6' })
      )}
    </>
  );
}

export default function AvatarCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [2.5, 2.5, 2.5], fov: 50 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <AvatarModel />
          <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}
