"use client";
import { useRef, } from 'react'
import { AlwaysStencilFunc, ReplaceStencilOp, EqualStencilFunc, LessDepth } from 'three'
import { Canvas, useThree, } from "@react-three/fiber";
import { Box, Plane, OrbitControls, useTexture } from "@react-three/drei";
import noiseShader from './NoiseShader'
import './styles.css';
export default function Moon() {
  return (
    <div id="canvas-container" className="h-full text-white">
      <Canvas >
        <Scene />
      </Canvas>
    </div>
  );
};

const Scene = () => {
  const stencilRef = 1
  const shaderRef = useRef();
  const { size } = useThree();
  const alphaTexture = useTexture('./fog.jpg');

  return (
    <>
      <OrbitControls />

      <ambientLight intensity={2} />
      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={100}
      >
        <planeGeometry />
        <meshPhongMaterial color="greenyellow" stencilWrite={false} stencilRef={stencilRef} stencilFunc={EqualStencilFunc} />
      </mesh>

      <Plane args={[2, 2]}>
        <meshPhongMaterial
          depthWrite={false}
          stencilWrite={true}
          stencilRef={stencilRef}
          stencilFunc={AlwaysStencilFunc}
          stencilZPass={ReplaceStencilOp}
        />
      </Plane>

      <Plane args={[2, 2]} position={[0, 0, 0.001]}>  {/* A slight Z offset to avoid z-fighting */}
        <meshPhongMaterial
          depthWrite={false}
          alphaMap={alphaTexture}
          transparent={true}
          visible={true}
          depthTest={true}
          depthFunc={LessDepth} // Ensures it only draws over previous content if it's closer
        />
      </Plane>
      <Box position={[0, 0, -1]}>
        <meshPhongMaterial color="red" stencilWrite={true} stencilRef={stencilRef} stencilFunc={EqualStencilFunc} />
      </Box>
    </>
  );
};
