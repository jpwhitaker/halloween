"use client";
import { useRef, useEffect, useMemo } from 'react'
import { Vector3, AlwaysStencilFunc, ReplaceStencilOp, EqualStencilFunc, LessEqualStencilFunc, AdditiveBlending, PlaneGeometry } from 'three'
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { PresentationControls, Stars, Box, Plane, OrbitControls } from "@react-three/drei";
import { createNoise2D } from 'simplex-noise';

import NoiseShader from './NoiseShader'
import './styles.css';
export default function Moon() {
  extend({ NoiseShader })

  return (
    <div id="canvas-container" className="h-full text-white">
      <Canvas >
        <Scene />
      </Canvas>
    </div>
  );
};

const Scene = () => {

  return (
    <>
      <OrbitControls />

      <ambientLight intensity={2} />
      {/* <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={100}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh> */}
      <NoisePlane />

      {/* <Plane args={[2, 2]}>
        <noiseShader blending={AdditiveBlending} />
      </Plane> */}
    </>
  );
};


function NoisePlane() {
  const meshRef = useRef();
  const [widthSegments, heightSegments] = [100, 100];

  const vertices = useMemo(() => {
    const geometry = new PlaneGeometry(10, 10, widthSegments, heightSegments);
    const simplex = createNoise2D();
    const threshold = 0.5;
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
    
      const noiseValue = simplex(x, y);
      console.log(noiseValue);
    
      positions[i + 2] = noiseValue > threshold ? 0.5 : 0;
    }

    geometry.computeVertexNormals();

    return geometry;
  }, [widthSegments, heightSegments]);

  return (
    <mesh ref={meshRef} geometry={vertices}>
      <meshBasicMaterial color={0x00ff00} wireframe />
    </mesh>
  );
}