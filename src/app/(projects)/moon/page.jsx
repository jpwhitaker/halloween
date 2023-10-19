"use client";
import { useRef, useState, useEffect, useMemo } from 'react';
import { AlwaysStencilFunc, ReplaceStencilOp, EqualStencilFunc } from 'three';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box, Plane, OrbitControls, Sphere, Float, MeshPortalMaterial, Mask, useMask } from "@react-three/drei";
import noiseShader from './NoiseShader';
import { useControls } from 'leva';
import { Man } from './Man'
import './styles.css';

export default function Moon() {
  return (
    <div id="canvas-container" className="h-full text-white">
      <Canvas flat>
        {/* <color attach="background" args={['blue']} /> */}
        <Scene />
      </Canvas>
    </div>
  );
};
const stencil = useMask(1)

const Scene = () => {
  const stencilRef = 1;
  const { size } = useThree();

  const { isStencilDisabled, numberOfCircles, minX, maxX, minY, maxY, minZ, maxZ } = useControls({
    isStencilDisabled: {
      value: false,
      label: "Disable Stencil & Change Color"
    },
    numberOfCircles: {
      value: 200,
      min: 1,
      max: 500,
      step: 1,
      label: "Number of Circles"
    },
    minX: { value: 0.5, min: -10, max: 10, label: 'Min X Position' },
    maxX: { value: 2, min: -10, max: 10, label: 'Max X Position' },
    minY: { value: -1, min: -10, max: 10, label: 'Min Y Position' },
    maxY: { value: 4, min: -10, max: 10, label: 'Max Y Position' },
    minZ: { value: -2, min: -10, max: 10, label: 'Min Y Position' },
    maxZ: { value: 2, min: -10, max: 10, label: 'Max Y Position' }
  });

  const getRandomPosition = (min, max) => {
    console.log(Math.random() * (max - min) + min)
    return Math.random() * (max - min) + min;
  }
  // debugger

  return (
    <>
      <OrbitControls />

      <ambientLight intensity={2} />


      {Array.from({ length: numberOfCircles }).map((_, i) => {
        console.log('my circle')
        return (
          <RegularDots
            key={i}
            position={[
              getRandomPosition(minX, maxX),
              getRandomPosition(minY, maxY),
              getRandomPosition(minZ, maxZ)
            ]}
          />
        )
      })}


      <Man position-y={-1} stencilWrite={true} stencilRef={stencilRef} stencilFunc={EqualStencilFunc} />


      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={100}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
};



const PortalDots = ({ isStencilDisabled, stencilRef, position }) => {
  
  return (
    <Float
      speed={3} // Animation speed, defaults to 1
      rotationIntensity={1} // XYZ rotation intensity, defaults to 1
      floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
    // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
    >
      <Mask id={1} position={position}>
        <sphereGeometry args={[0.1, 20]} position={position}>
          <meshBasicMaterial />
        </sphereGeometry>
      </Mask>
    </Float>
  );
}

const RegularDots = ({ position }) => {
  
  const meshRef = useRef();

  // Random speed and starting offset for the sphere
  const { speed, startOffset } = useMemo(() => ({
    speed: 1 + Math.random() * 10,  // Random speed between 0.5 and 1.5
    startOffset: 2 * Math.PI * Math.random()  // Random starting offset between 0 and 2*PI
  }), []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const x = Math.cos(elapsedTime * speed + startOffset) * position[0];
    const z = Math.sin(elapsedTime * speed + startOffset) * position[0];
    if (meshRef.current) {
      meshRef.current.position.x = x;
      meshRef.current.position.z = z;
    }
  });

  return (
    <Mask id={1} ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 20]} position={position}>
        <meshBasicMaterial />
      </sphereGeometry>
    </Mask>
  );
}

