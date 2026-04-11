import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

const BlinkingPoint = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.2;
      meshRef.current.scale.set(s, s, s);
    }
    if (glowRef.current) {
      const s = 2 + Math.sin(state.clock.getElapsedTime() * 5) * 1.5;
      glowRef.current.scale.set(s, s, s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 
        0.2 + Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Core Point */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>
      {/* Glow Effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
      </mesh>
      {/* Outer Pulse */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} />
      </mesh>
    </group>
  );
};

const Globe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [zoom, setZoom] = useState(6);

  // Load textures
  const [colorMap, bumpMap, specMap, lightsMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
  ]);

  useFrame(() => {
    const distance = camera.position.length();
    if (Math.abs(zoom - distance) > 0.05) {
      setZoom(distance);
    }
  });
  
  return (
    <group>
      {/* Atmosphere Glow */}
      <Sphere args={[2.2, 64, 64]}>
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.03} 
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Planetary Activity / Lights Layer */}
      <Sphere args={[2.01, 64, 64]}>
        <meshBasicMaterial 
          map={lightsMap} 
          transparent 
          opacity={0.6} 
          color="#60a5fa"
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Country Borders / Grid Overlay */}
      <Sphere args={[2.03, 64, 64]}>
        <meshStandardMaterial 
          color="#60a5fa" 
          wireframe={true} 
          transparent 
          opacity={Math.max(0.05, Math.min(0.2, (8 - zoom) / 10))} 
        />
      </Sphere>

      {/* Main Earth Sphere */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshStandardMaterial 
          map={colorMap}
          normalMap={bumpMap}
          roughnessMap={specMap}
          metalness={0.4}
          roughness={0.7}
          emissive="#1e293b"
          emissiveIntensity={0.1}
          color="#444"
        />
      </Sphere>

      {/* User Location - San Francisco approx */}
      <BlinkingPoint position={[0.8, 1.6, 1.0]} />
      
      {/* Lat/Long Lines */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.01, 2.015, 128]} />
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent 
            opacity={Math.max(0, (zoom - 4) / 40)} 
            side={THREE.DoubleSide} 
          />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[2.01, 2.015, 128]} />
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent 
            opacity={Math.max(0, (zoom - 4) / 40)} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>
    </group>
  );
};

export const WorldSphere: React.FC = () => {
  const controlsRef = useRef<any>(null);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full h-[400px] bg-slate-950/50 rounded-3xl overflow-hidden border border-slate-800 relative group">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Live Bio-Geographic Sync</h3>
        <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mt-1">Global Positioning System Active</p>
      </div>
      
      <div className="absolute bottom-6 left-6 z-10 flex flex-col items-start gap-2">
        <button 
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-all active:scale-95 flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset View
        </button>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">Signal Strength: 98%</span>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <React.Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <Globe />
          </Float>
          
          <OrbitControls 
            ref={controlsRef}
            enablePan={false} 
            enableZoom={true} 
            minDistance={3} 
            maxDistance={8}
            autoRotate
            autoRotateSpeed={0.3}
            makeDefault
          />
        </React.Suspense>
      </Canvas>
      
      <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent group-hover:border-blue-500/5 transition-all duration-700 rounded-3xl" />
    </div>
  );
};