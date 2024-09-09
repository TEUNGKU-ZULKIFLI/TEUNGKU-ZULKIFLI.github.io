import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function Home(props) {
  const { nodes, materials } = useGLTF('./models/home.glb')
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group ref={groupRef} {...props} dispose={null} position={[0, -2.5, 0]} rotation={[0, Math.PI / -1.5, 0]}>
      <group name="PohanSakura" position={[16.18, 16.764, 6.628]} rotation={[-2.895, -0.68, -2.985]} scale={19.197}>
        <mesh name="mesh428138001" geometry={nodes.mesh428138001.geometry} material={materials['mat7.001']} />
        <mesh name="mesh428138001_1" geometry={nodes.mesh428138001_1.geometry} material={materials['mat2.001']} />
        <mesh name="mesh428138001_2" geometry={nodes.mesh428138001_2.geometry} material={materials['mat4.001']} />
        <mesh name="mesh428138001_3" geometry={nodes.mesh428138001_3.geometry} material={materials['mat18.001']} />
        <mesh name="mesh428138001_4" geometry={nodes.mesh428138001_4.geometry} material={materials['mat19.001']} />
        <mesh name="mesh428138001_5" geometry={nodes.mesh428138001_5.geometry} material={materials['mat12.001']} />
        <mesh name="mesh428138001_6" geometry={nodes.mesh428138001_6.geometry} material={materials['mat20.001']} />
        <mesh name="mesh428138001_7" geometry={nodes.mesh428138001_7.geometry} material={materials['mat9.001']} />
        <mesh name="mesh428138001_8" geometry={nodes.mesh428138001_8.geometry} material={materials['mat10.001']} />
        <mesh name="mesh428138001_9" geometry={nodes.mesh428138001_9.geometry} material={materials['mat5.001']} />
        <mesh name="mesh428138001_10" geometry={nodes.mesh428138001_10.geometry} material={materials['mat11.001']} />
      </group>
      <group name="PohonMerah" position={[-5.908, 4.391, -6.107]} rotation={[0, 1.351, 0]} scale={2.797}>
        <mesh name="TwistedTree_1" geometry={nodes.TwistedTree_1.geometry} material={materials.Bark_TwistedTree} />
        <mesh name="TwistedTree_1_1" geometry={nodes.TwistedTree_1_1.geometry} material={materials.Leaves_TwistedTree} />
      </group>
      <mesh name="PatungMoai" geometry={nodes.PatungMoai.geometry} material={materials.Material} position={[-2.907, 8.67, 4.851]} rotation={[-1.563, -0.02, 1.929]} scale={5.428} />
      <mesh name="Home" geometry={nodes.Home.geometry} material={nodes.Home.material} position={[-0.005, 3.191, 0.014]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-13.537, -0.56, -13.537]} />
    </group>
  )
}

useGLTF.preload('./models/home.glb')
