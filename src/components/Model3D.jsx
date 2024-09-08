import React from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Model(props) {
  const { nodes, materials } = useGLTF('./models/model3D.glb');
  
  const Dinding = new THREE.MeshStandardMaterial({ color: '#4b4b4b', roughness: 0.8, metalness: 0.0 });
  const Batu = new THREE.MeshStandardMaterial({ color: '#2F4F4F', roughness: 0.0, metalness: 0.0 });

    return (
      <group {...props} dispose={null} position={[5, -5, 20]}>
      <group name="Tech" position={[-1.32, 2.895, 1.314]} rotation={[-1.57, 0, 3.14]} scale={[0.378, 0.296, 0.33]}>
        <mesh name="Plane001" geometry={nodes.Plane001.geometry} material={materials.WindowsLogo2} />
        <mesh name="Plane001_1" geometry={nodes.Plane001_1.geometry} material={materials.AndroidLogo2_2} />
        <mesh name="Plane001_2" geometry={nodes.Plane001_2.geometry} material={materials.BlenderLogo2} />
        <mesh name="Plane001_3" geometry={nodes.Plane001_3.geometry} material={materials.BlenderLogo2_2} />
        <mesh name="Plane001_4" geometry={nodes.Plane001_4.geometry} material={materials.DiscordLogo2} />
        <mesh name="Plane001_5" geometry={nodes.Plane001_5.geometry} material={materials.DiscordLogo2_2} />
        <mesh name="Plane001_6" geometry={nodes.Plane001_6.geometry} material={materials.FacebookLogo2} />
        <mesh name="Plane001_7" geometry={nodes.Plane001_7.geometry} material={materials.PatreonLogo2_2} />
        <mesh name="Plane001_8" geometry={nodes.Plane001_8.geometry} material={materials.WindowsLogo4_2_5} />
        <mesh name="Plane001_9" geometry={nodes.Plane001_9.geometry} material={materials.InstagramLogo2} />
        <mesh name="Plane001_10" geometry={nodes.Plane001_10.geometry} material={materials.InstagramLogo2_2} />
        <mesh name="Plane001_11" geometry={nodes.Plane001_11.geometry} material={materials.SketchfabLogo2} />
        <mesh name="Plane001_12" geometry={nodes.Plane001_12.geometry} material={materials.SpotifyLogo2} />
        <mesh name="Plane001_13" geometry={nodes.Plane001_13.geometry} material={materials.TikTokLogo2} />
        <mesh name="Plane001_14" geometry={nodes.Plane001_14.geometry} material={materials.TikTokLogo2_2} />
        <mesh name="Plane001_15" geometry={nodes.Plane001_15.geometry} material={materials.LinuxLogo2_3} />
        <mesh name="Plane001_16" geometry={nodes.Plane001_16.geometry} material={materials.WhatsAppLogo2} />
        <mesh name="Plane001_17" geometry={nodes.Plane001_17.geometry} material={materials.WindowsLogo3_2} />
        <mesh name="Plane001_18" geometry={nodes.Plane001_18.geometry} material={materials.WindowsLogo5_2} />
        <mesh name="Plane001_19" geometry={nodes.Plane001_19.geometry} material={materials.WindowsLogo5_2_2} />
        <mesh name="Plane001_20" geometry={nodes.Plane001_20.geometry} material={materials.WindowsLogo2_2_2} />
        <mesh name="Plane001_21" geometry={nodes.Plane001_21.geometry} material={materials.WindowsLogo5_2_4} />
        <mesh name="Plane001_22" geometry={nodes.Plane001_22.geometry} material={materials.WindowsLogo4_2_4} />
        <mesh name="Plane001_23" geometry={nodes.Plane001_23.geometry} material={materials.YoutubeLogo2_2} />
        <mesh name="Plane001_24" geometry={nodes.Plane001_24.geometry} material={materials.LinkedinLogo2_2} />
        <mesh name="Plane001_25" geometry={nodes.Plane001_25.geometry} material={materials.SteamLogo2} />
        <mesh name="Plane001_26" geometry={nodes.Plane001_26.geometry} material={materials.TelegramLogo2} />
        <mesh name="Plane001_27" geometry={nodes.Plane001_27.geometry} material={materials.QuoraLogo2_2} />
        <mesh name="Plane001_28" geometry={nodes.Plane001_28.geometry} material={materials.LinuxLogo2_2} />
      </group>
      <group name="TEUNGKU-BLUE" position={[-5.936, 2.988, 1.291]} rotation={[1.571, 0, Math.PI]} scale={5.054}>
        <mesh name="TEUNGKU-BLUE001" geometry={nodes['TEUNGKU-BLUE001'].geometry} material={materials['TEUNGKU-BLUE']} />
        <mesh name="TEUNGKU-BLUE001_1" geometry={nodes['TEUNGKU-BLUE001_1'].geometry} material={materials.BingkaiFoto} />
      </group>
      <mesh name="Python" geometry={nodes.Python.geometry} material={materials.Python} position={[2.953, 1.638, 1.438]} rotation={[Math.PI / 2, 0, -Math.PI]} scale={0.05} />
      <mesh name="C#" geometry={nodes['C#'].geometry} material={materials.material} position={[6.951, 1.791, 1.445]} rotation={[-Math.PI / 2, 0, 0]} scale={0.052} />
      <mesh name="gajahPhP" geometry={nodes.gajahPhP.geometry} material={materials.Textured} position={[6.585, 1.455, 5.324]} rotation={[-1.625, -0.02, -1.214]} scale={2.61} />
      <mesh name="C++" geometry={nodes['C++'].geometry} material={materials['material.002']} position={[4.873, 4.298, 1.526]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={-0.051} />
      <group name="PohanSakura" position={[10.793, 4.675, -2.953]} rotation={[-2.895, -0.68, -2.985]} scale={6.862}>
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
      <group name="Kursi" position={[-5.053, 0.051, -7.992]} rotation={[Math.PI, -1.537, Math.PI]} scale={0.369}>
        <mesh name="chair_Cube026-Mesh" geometry={nodes['chair_Cube026-Mesh'].geometry} material={materials['795548']} />
        <mesh name="chair_Cube026-Mesh_1" geometry={nodes['chair_Cube026-Mesh_1'].geometry} material={materials.DD9944} />
      </group>
      <mesh name="Kopi" geometry={nodes.Kopi.geometry} material={materials['In-Game_Collectables_Color_Palette_01.001']} position={[-3.514, 3.23, -6.578]} rotation={[Math.PI, -0.13, Math.PI]} scale={1.486} />
      <mesh name="Mouse" geometry={nodes.Mouse.geometry} material={materials.ComputerMouse_mat1} position={[-6.081, 2.718, -3.517]} rotation={[0, 1.38, 0]} scale={0.138} />
      <mesh name="Keyboard" geometry={nodes.Keyboard.geometry} material={materials['lambert3SG.001']} position={[-5.055, 2.711, -4.593]} rotation={[Math.PI, -0.825, Math.PI]} scale={0.005} />
      <group name="LapTop" position={[-4.326, 2.714, -4.007]} rotation={[-Math.PI, 0.746, -Math.PI]} scale={1.486}>
        <mesh name="LapTop_Cube002-Mesh" geometry={nodes['LapTop_Cube002-Mesh'].geometry} material={materials.DarkGray} />
        <mesh name="LapTop_Cube002-Mesh_1" geometry={nodes['LapTop_Cube002-Mesh_1'].geometry} material={materials.lighterGray} />
        <mesh name="LapTop_Cube002-Mesh_2" geometry={nodes['LapTop_Cube002-Mesh_2'].geometry} material={materials.Gray2} />
        <mesh name="LapTop_Cube002-Mesh_3" geometry={nodes['LapTop_Cube002-Mesh_3'].geometry} material={materials.Screen} />
      </group>
      <group name="Asbak" position={[-3.857, 2.839, -5.904]} rotation={[0, 0.025, 0]} scale={0.709}>
        <mesh name="Node-Mesh" geometry={nodes['Node-Mesh'].geometry} material={materials.mat22} />
        <mesh name="Node-Mesh_1" geometry={nodes['Node-Mesh_1'].geometry} material={materials.mat18} />
        <mesh name="Node-Mesh_2" geometry={nodes['Node-Mesh_2'].geometry} material={materials.mat21} />
        <mesh name="Node-Mesh_3" geometry={nodes['Node-Mesh_3'].geometry} material={materials.mat20} />
      </group>
      <mesh name="Meja" geometry={nodes.Meja.geometry} material={materials['wood.001']} position={[-3.582, 0.051, -7.524]} rotation={[0, 0.824, 0]} scale={[6.626, 8.161, 6.882]} />
      <group name="PohonMerah" position={[2.897, 0.252, -7.505]} rotation={[0, 1.351, 0]}>
        <mesh name="TwistedTree_1" geometry={nodes.TwistedTree_1.geometry} material={materials.Bark_TwistedTree} />
        <mesh name="TwistedTree_1_1" geometry={nodes.TwistedTree_1_1.geometry} material={materials.Leaves_TwistedTree} />
      </group>
      <mesh name="PatungMoai" geometry={nodes.PatungMoai.geometry} material={Batu} position={[3.97, 1.782, -3.588]} rotation={[-1.563, -0.02, 1.929]} scale={1.94} />
      <mesh name="Lantai" geometry={nodes.Lantai.geometry} material={Dinding} position={[-0.005, -1.681, 0.014]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-13.537, -0.56, -13.537]} />
      <mesh name="Home" geometry={nodes.Home.geometry} material={Dinding} position={[4.863, 1.445, -4.923]} scale={4.641} />
      <mesh name="Project" geometry={nodes.Project.geometry} material={Dinding} position={[-4.953, 1.445, -4.971]} rotation={[0, Math.PI / 2, 0]} scale={4.641} />
      <mesh name="About" geometry={nodes.About.geometry} material={Dinding} position={[0, -0.95, 6.042]} scale={[10.008, 1, 5.946]} />
    </group>
  )
}

useGLTF.preload('./models/model3D.glb')
