import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, Box, useMask } from "@react-three/drei";

export function Man(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/Man.glb");
  const { actions } = useAnimations(animations, group);
  // debugger

  const stencil = useMask(1)
  console.log(stencil)

  const stencilProps = {
    stencilWrite: props.stencilWrite,
    stencilRef: props.stencilRef,
    stencilFunc: props.stencilFunc
  };
  // debugger

  useEffect(() => {
    // applyStencilPropsToMaterials(materials, stencilProps);

  }, [materials, stencilProps]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="HumanArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Bone} />
          </group>
          <group name="BaseHuman" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="BaseHuman_1"
              geometry={nodes.BaseHuman_1.geometry}
              material={Object.assign(materials.Shirt, stencil)}
              skeleton={nodes.BaseHuman_1.skeleton}

            />
            <skinnedMesh
              name="BaseHuman_2"
              geometry={nodes.BaseHuman_2.geometry}
              material={Object.assign(materials.Skin, stencil)}
              skeleton={nodes.BaseHuman_2.skeleton}
            />
            <skinnedMesh
              name="BaseHuman_3"
              geometry={nodes.BaseHuman_3.geometry}
              material={Object.assign(materials.Pants, stencil)}
              skeleton={nodes.BaseHuman_3.skeleton}
            />
            <skinnedMesh
              name="BaseHuman_4"
              geometry={nodes.BaseHuman_4.geometry}
              material={Object.assign(materials.Eyes, stencil)}
              skeleton={nodes.BaseHuman_4.skeleton}
            />
            <skinnedMesh
              name="BaseHuman_5"
              geometry={nodes.BaseHuman_5.geometry}
              material={Object.assign(materials.Socks, stencil)}
              skeleton={nodes.BaseHuman_5.skeleton}
            />
            <skinnedMesh
              name="BaseHuman_6"
              geometry={nodes.BaseHuman_6.geometry}
              material={Object.assign(materials.Hair, stencil)}
              skeleton={nodes.BaseHuman_6.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

function applyStencilPropsToMaterials(materials, stencilProps) {
  Object.values(materials).forEach(material => {
    Object.assign(material, stencilProps);
    material.needsUpdate = true; // This is needed to inform Three.js that the material has changed
  });
}


useGLTF.preload("/Man.glb");
