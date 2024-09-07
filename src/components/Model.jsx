import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('./models/model.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-1.045, 2.459, -0.108]} rotation={[-1.571, 0, -0.001]} scale={[0.378, 0.296, 0.33]}>
        <mesh geometry={nodes.Plane001.geometry} material={materials.WindowsLogo2} />
        <mesh geometry={nodes.Plane001_1.geometry} material={materials.AndroidLogo2_2} />
        <mesh geometry={nodes.Plane001_2.geometry} material={materials.BlenderLogo2} />
        <mesh geometry={nodes.Plane001_3.geometry} material={materials.BlenderLogo2_2} />
        <mesh geometry={nodes.Plane001_4.geometry} material={materials.DiscordLogo2} />
        <mesh geometry={nodes.Plane001_5.geometry} material={materials.DiscordLogo2_2} />
        <mesh geometry={nodes.Plane001_6.geometry} material={materials.FacebookLogo2} />
        <mesh geometry={nodes.Plane001_7.geometry} material={materials.PatreonLogo2_2} />
        <mesh geometry={nodes.Plane001_8.geometry} material={materials.WindowsLogo4_2_5} />
        <mesh geometry={nodes.Plane001_9.geometry} material={materials.InstagramLogo2} />
        <mesh geometry={nodes.Plane001_10.geometry} material={materials.InstagramLogo2_2} />
        <mesh geometry={nodes.Plane001_11.geometry} material={materials.SketchfabLogo2} />
        <mesh geometry={nodes.Plane001_12.geometry} material={materials.SpotifyLogo2} />
        <mesh geometry={nodes.Plane001_13.geometry} material={materials.TikTokLogo2} />
        <mesh geometry={nodes.Plane001_14.geometry} material={materials.TikTokLogo2_2} />
        <mesh geometry={nodes.Plane001_15.geometry} material={materials.LinuxLogo2_3} />
        <mesh geometry={nodes.Plane001_16.geometry} material={materials.WhatsAppLogo2} />
        <mesh geometry={nodes.Plane001_17.geometry} material={materials.WindowsLogo3_2} />
        <mesh geometry={nodes.Plane001_18.geometry} material={materials.WindowsLogo5_2} />
        <mesh geometry={nodes.Plane001_19.geometry} material={materials.WindowsLogo5_2_2} />
        <mesh geometry={nodes.Plane001_20.geometry} material={materials.WindowsLogo2_2_2} />
        <mesh geometry={nodes.Plane001_21.geometry} material={materials.WindowsLogo5_2_4} />
        <mesh geometry={nodes.Plane001_22.geometry} material={materials.WindowsLogo4_2_4} />
        <mesh geometry={nodes.Plane001_23.geometry} material={materials.YoutubeLogo2_2} />
        <mesh geometry={nodes.Plane001_24.geometry} material={materials.LinkedinLogo2_2} />
        <mesh geometry={nodes.Plane001_25.geometry} material={materials.SteamLogo2} />
        <mesh geometry={nodes.Plane001_26.geometry} material={materials.TelegramLogo2} />
        <mesh geometry={nodes.Plane001_27.geometry} material={materials.QuoraLogo2_2} />
        <mesh geometry={nodes.Plane001_28.geometry} material={materials.LinuxLogo2_2} />
      </group>
      <mesh geometry={nodes.About.geometry} material={materials.Dinding} position={[-0.038, 0.001, -5.157]} scale={5.05} />
      <group position={[3.791, 2.53, -6.668]} rotation={[1.57, 0, -0.873]} scale={5.054}>
        <mesh geometry={nodes['TEUNGKU-BLUE001'].geometry} material={materials['TEUNGKU-BLUE']} />
        <mesh geometry={nodes['TEUNGKU-BLUE001_1'].geometry} material={nodes['TEUNGKU-BLUE001_1'].material} />
      </group>
      <mesh geometry={nodes.Python_Python_0.geometry} material={materials.Python} position={[-4.084, 1.747, -2.838]} rotation={[Math.PI / 2, 0, 0.873]} scale={0.046} />
      <mesh geometry={nodes['C#_C#_0'].geometry} material={materials.material} position={[-4.015, 1.736, -5.793]} rotation={[-Math.PI / 2, 0, 2.269]} scale={0.052} />
      <mesh geometry={nodes.Object_2.geometry} material={materials.Textured} position={[3.142, 1.455, -1.44]} rotation={[-1.606, 0.046, -2.485]} scale={2.61} />
      <mesh geometry={nodes['C++_C++_0'].geometry} material={materials['material.002']} position={[-3.935, 1.74, -8.86]} rotation={[-Math.PI / 2, 0, -0.873]} scale={-0.051} />
      <mesh geometry={nodes.Home.geometry} material={materials.Dinding} position={[-2.747, 0, 3.117]} scale={2.195} />
      <group position={[-2.558, 4.675, 6.559]} rotation={[-2.669, 1.142, 2.706]} scale={6.862}>
        <mesh geometry={nodes.mesh428138001.geometry} material={materials['mat7.001']} />
        <mesh geometry={nodes.mesh428138001_1.geometry} material={materials['mat2.001']} />
        <mesh geometry={nodes.mesh428138001_2.geometry} material={materials['mat4.001']} />
        <mesh geometry={nodes.mesh428138001_3.geometry} material={materials['mat18.001']} />
        <mesh geometry={nodes.mesh428138001_4.geometry} material={materials['mat19.001']} />
        <mesh geometry={nodes.mesh428138001_5.geometry} material={materials['mat12.001']} />
        <mesh geometry={nodes.mesh428138001_6.geometry} material={materials['mat20.001']} />
        <mesh geometry={nodes.mesh428138001_7.geometry} material={materials['mat9.001']} />
        <mesh geometry={nodes.mesh428138001_8.geometry} material={materials['mat10.001']} />
        <mesh geometry={nodes.mesh428138001_9.geometry} material={materials['mat5.001']} />
        <mesh geometry={nodes.mesh428138001_10.geometry} material={materials['mat11.001']} />
      </group>
      <mesh geometry={nodes.Project.geometry} material={materials.Dinding} position={[2.748, 0, 3.135]} scale={2.195} />
      <group position={[3.57, 0, 4.26]} rotation={[-Math.PI, 0.859, -Math.PI]} scale={0.248}>
        <mesh geometry={nodes['chair_Cube026-Mesh'].geometry} material={materials['795548']} />
        <mesh geometry={nodes['chair_Cube026-Mesh_1'].geometry} material={materials.DD9944} />
      </group>
      <mesh geometry={nodes.Collectable_Coffee_Mug_01.geometry} material={materials['In-Game_Collectables_Color_Palette_01.001']} position={[2.163, 2.139, 4.263]} rotation={[0, 0.876, 0]} />
      <mesh geometry={nodes.ComputerMouse_mesh.geometry} material={materials.ComputerMouse_mat1} position={[2.034, 1.794, 1.579]} rotation={[0, -1.016, 0]} scale={0.093} />
      <mesh geometry={nodes.Keyboard1.geometry} material={materials['lambert3SG.001']} position={[2.018, 1.789, 2.579]} rotation={[0, 1.571, 0]} scale={0.004} />
      <group position={[1.391, 1.791, 2.623]}>
        <mesh geometry={nodes['LapTop_Cube002-Mesh'].geometry} material={materials.DarkGray} />
        <mesh geometry={nodes['LapTop_Cube002-Mesh_1'].geometry} material={materials.lighterGray} />
        <mesh geometry={nodes['LapTop_Cube002-Mesh_2'].geometry} material={materials.Gray2} />
        <mesh geometry={nodes['LapTop_Cube002-Mesh_3'].geometry} material={materials.Screen} />
      </group>
      <group position={[2.026, 1.876, 3.774]} rotation={[Math.PI, -0.771, Math.PI]} scale={0.477}>
        <mesh geometry={nodes['Node-Mesh'].geometry} material={materials.mat22} />
        <mesh geometry={nodes['Node-Mesh_1'].geometry} material={materials.mat18} />
        <mesh geometry={nodes['Node-Mesh_2'].geometry} material={materials.mat21} />
        <mesh geometry={nodes['Node-Mesh_3'].geometry} material={materials.mat20} />
      </group>
      <mesh geometry={nodes.table.geometry} material={materials['wood.001']} position={[2.629, 0, 4.7]} rotation={[Math.PI, -1.57, Math.PI]} scale={[4.458, 5.49, 4.63]} />
    </group>
  )
}

useGLTF.preload('models/model.glb')
