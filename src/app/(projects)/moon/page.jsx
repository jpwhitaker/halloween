"use client";
import {useRef, useEffect} from 'react'
import { Vector3, AlwaysStencilFunc, ReplaceStencilOp, EqualStencilFunc, LessEqualStencilFunc } from 'three'
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PresentationControls, Stars, Box, Plane, OrbitControls } from "@react-three/drei";
import noiseShader from './NoiseShader'
import './styles.css';
export default function Moon() {


  return (
    <div id="canvas-container" className="h-full text-white">
      

      <Canvas >
        <Scene/>

      </Canvas>

    </div>
  );
};



const Scene = () => {
  const stencilRef = 1
  const shaderRef = useRef();
  const { size } = useThree();

  useEffect(() => {
    console.log(shaderRef.current);
    debugger
    if (shaderRef.current.uniforms.iResolution) {
        // debugger
        console.log("useEff")
        shaderRef.current.uniforms.iResolution.value.set(size.width, size.height, 1);
    }
}, [size]);

useFrame(({ clock }) => {
  if (shaderRef.current.uniforms.iTime) {
    // debugger
      shaderRef.current.uniforms.iTime.value = clock.getElapsedTime();
  }
});

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
        <meshStandardMaterial color="greenyellow" />
      </mesh>

    <Plane args={[2, 2]}>
      {/* <meshPhongMaterial
        depthWrite={false}
        stencilWrite={true}
        stencilRef={stencilRef}
        stencilFunc={AlwaysStencilFunc}
        stencilZPass={ReplaceStencilOp}
      /> */}
      <shaderMaterial ref={shaderRef} args={[noiseShader]} />
    </Plane>
    <Box position={[0, 0, -1]}>
      <meshPhongMaterial color="red" stencilWrite={true} stencilRef={stencilRef} stencilFunc={EqualStencilFunc} />
    </Box>

    

  </>
);
};
