import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Room(props) {
  const { nodes, materials } = useGLTF('./models/roomTeungku.gltf')

  return (
    <>
      <group {...props} dispose={null} position={[-0.5, -3, 0]} scale={0.2} >
        <group name="Kursi" position={[-4.296, 3.8, 5.863]} rotation={[0, 0.713, 0]} scale={0.955} userData={{ name: 'Kursi' }}>
          <mesh name="chair_Cube026-Mesh" geometry={nodes['chair_Cube026-Mesh'].geometry} material={materials['795548']} />
          <mesh name="chair_Cube026-Mesh_1" geometry={nodes['chair_Cube026-Mesh_1'].geometry} material={materials.DD9944} />
        </group>
        <mesh name="Kopi" geometry={nodes.Kopi.geometry} material={materials['In-Game_Collectables_Color_Palette_01.001']} position={[-4.315, 12.038, 0.446]} rotation={[0, -0.694, 0]} scale={3.852} userData={{ name: 'Kopi' }} />
        <mesh name="Mouse" geometry={nodes.Mouse.geometry} material={materials.ComputerMouse_mat1} position={[6.025, 10.711, -0.062]} rotation={[Math.PI, -0.556, Math.PI]} scale={0.358} userData={{ name: 'Mouse' }} />
        <mesh name="Keyboard" geometry={nodes.Keyboard.geometry} material={materials['lambert3SG.001']} position={[2.172, 10.693, -0.12]} rotation={[0, 0.001, 0]} scale={0.014} userData={{ name: 'Keyboard' }} />
        <group name="LapTop" position={[2.003, 10.7, -2.537]} rotation={[0, -1.57, 0]} scale={3.852} userData={{ name: 'LapTop' }}>
          <mesh name="LapTop_Cube002-Mesh" geometry={nodes['LapTop_Cube002-Mesh'].geometry} material={materials.DarkGray} />
          <mesh name="LapTop_Cube002-Mesh_1" geometry={nodes['LapTop_Cube002-Mesh_1'].geometry} material={materials.lighterGray} />
          <mesh name="LapTop_Cube002-Mesh_2" geometry={nodes['LapTop_Cube002-Mesh_2'].geometry} material={materials.Gray2} />
          <mesh name="LapTop_Cube002-Mesh_3" geometry={nodes['LapTop_Cube002-Mesh_3'].geometry} material={materials.Screen} />
        </group>
        <group name="Asbak" position={[-2.431, 11.025, -0.087]} rotation={[-Math.PI, 0.799, -Math.PI]} scale={1.837} userData={{ name: 'Asbak' }}>
          <mesh name="Node-Mesh" geometry={nodes['Node-Mesh'].geometry} material={materials.mat22} />
          <mesh name="Node-Mesh_1" geometry={nodes['Node-Mesh_1'].geometry} material={materials.mat18} />
          <mesh name="Node-Mesh_2" geometry={nodes['Node-Mesh_2'].geometry} material={materials.mat21} />
          <mesh name="Node-Mesh_3" geometry={nodes['Node-Mesh_3'].geometry} material={materials.mat20} />
        </group>
        <mesh name="Meja" geometry={nodes.Meja.geometry} material={materials['wood.001']} position={[-5.995, 3.8, 2.241]} rotation={[Math.PI, 0, Math.PI]} scale={[17.172, 21.149, 17.836]} userData={{ name: 'Meja' }} />
        <group name="TeungkubgMerah" position={[-3.413, 11.858, -3.25]} rotation={[Math.PI / 2, 0, -0.511]} scale={2.293} userData={{ name: 'TeungkubgMerah' }}>
          <mesh name="TeungkubgMerah_1" geometry={nodes.TeungkubgMerah_1.geometry} material={materials.TeungkubgMerah} />
          <mesh name="TeungkubgMerah_2" geometry={nodes.TeungkubgMerah_2.geometry} material={materials.BingkaiFoto} />
          <mesh name="Cube" geometry={nodes.Cube.geometry} material={materials.BingkaiFoto} position={[0, -0.172, 0.207]} rotation={[0.592, 0, -3.142]} scale={[0.097, 0.054, 0.387]} userData={{ name: 'Cube' }} />
        </group>
        <group name="PohonSakura" position={[8.228, 13.232, -4.204]} rotation={[-3.033, -0.006, 3.09]} scale={3.85} userData={{ name: 'PohonSakura' }}>
          <mesh name="mesh1241039242" geometry={nodes.mesh1241039242.geometry} material={materials.mat2} />
          <mesh name="mesh1241039242_1" geometry={nodes.mesh1241039242_1.geometry} material={materials.mat4} />
          <mesh name="mesh1241039242_2" geometry={nodes.mesh1241039242_2.geometry} material={materials['mat18.002']} />
          <mesh name="mesh1241039242_3" geometry={nodes.mesh1241039242_3.geometry} material={materials.mat19} />
          <mesh name="mesh1241039242_4" geometry={nodes.mesh1241039242_4.geometry} material={materials.mat12} />
          <mesh name="mesh1241039242_5" geometry={nodes.mesh1241039242_5.geometry} material={materials['mat20.002']} />
          <mesh name="mesh1241039242_6" geometry={nodes.mesh1241039242_6.geometry} material={materials.mat9} />
          <mesh name="mesh1241039242_7" geometry={nodes.mesh1241039242_7.geometry} material={materials.mat7} />
          <mesh name="mesh1241039242_8" geometry={nodes.mesh1241039242_8.geometry} material={materials.mat10} />
          <mesh name="mesh1241039242_9" geometry={nodes.mesh1241039242_9.geometry} material={materials.mat5} />
          <mesh name="mesh1241039242_10" geometry={nodes.mesh1241039242_10.geometry} material={materials.mat11} />
        </group>
        <group name="PohonMerah" position={[6.241, 10.735, -5.192]} rotation={[0, 0.535, 0]} scale={0.174} userData={{ name: 'PohonMerah' }}>
          <mesh name="TwistedTree_1" geometry={nodes.TwistedTree_1.geometry} material={materials['Bark_TwistedTree.001']} />
          <mesh name="TwistedTree_1_1" geometry={nodes.TwistedTree_1_1.geometry} material={materials['Leaves_TwistedTree.001']} />
        </group>
        <mesh name="Lantai" geometry={nodes.Lantai.geometry} material={materials.BingkaiFoto} position={[1.34, 1.488, 1.185]} rotation={[-Math.PI, 0, -Math.PI]} scale={[12.69, 9.065, 12.69]} userData={{ name: 'Lantai' }} >
          <pointLight intensity={20} color={'#D300FF'} />
        </mesh>
      </group>
    </>
  )
}

useGLTF.preload('./models/roomTeungku.gltf')
