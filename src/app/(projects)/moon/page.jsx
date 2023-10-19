"use client";
import { useRef, useState, useEffect } from 'react';
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
      value: 20,
      min: 1,
      max: 20,
      step: 1,
      label: "Number of Circles"
    },
    minX: { value: -0.8, min: -10, max: 10, label: 'Min X Position' },
    maxX: { value: 2.2, min: -10, max: 10, label: 'Max X Position' },
    minY: { value: -3, min: -10, max: 10, label: 'Min Y Position' },
    maxY: { value: 3, min: -10, max: 10, label: 'Max Y Position' },
    minZ: { value: -0.8, min: -10, max: 10, label: 'Min Y Position' },
    maxZ: { value: 1.2, min: -10, max: 10, label: 'Max Y Position' }
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
        return(
        
        <MyCircle
          key={i}
          
          position={[
            getRandomPosition(minX, maxX),
            getRandomPosition(minY, maxY),
            getRandomPosition(minZ, maxZ)
          ]}

        />
      )})}


{/* <Box args={[1, 1, 1]} >
          <meshStandardMaterial attach="material" color="red" {...stencil} />
        </Box> */}

      {/* <Sphere args={[0.7, 20]} position={[0,1,1]}>
      ＜<MeshPortalMaterial>
        <ambientLight intensity={0.7} />
        
      </MeshPortalMaterial>
    </Sphere> */}

      <Man position-y={-1} stencilWrite={true} stencilRef={stencilRef} stencilFunc={EqualStencilFunc} />


      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={100}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow"  />
      </mesh>
    </>
  );
};



const MyCircle = ({ isStencilDisabled, stencilRef, position }) => (
  <Float
    speed={3} // Animation speed, defaults to 1
    rotationIntensity={1} // XYZ rotation intensity, defaults to 1
    floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
  // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
  >
    <Mask id={1} position={position}>
      <sphereGeometry args={[0.1, 20]} position={position}>
        <meshBasicMaterial />
        {/* <meshPhongMaterial
        color={isStencilDisabled ? "pink" : ""}
        depthWrite={isStencilDisabled ? true : false}
        stencilWrite={!isStencilDisabled}
        stencilRef={stencilRef}
        stencilFunc={isStencilDisabled ? null : AlwaysStencilFunc}
        stencilZPass={isStencilDisabled ? null : ReplaceStencilOp}
      /> */}
      </sphereGeometry>
    </Mask>
  </Float>
);


