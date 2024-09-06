import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Scenefixs(props) {
  const { nodes, materials } = useGLTF('./models/scenefixs.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.About.geometry} material={materials.Dinding} position={[-0.038, 0.024, -5.157]} scale={5.05}>
        <mesh geometry={nodes['C#_C#_0'].geometry} material={materials.material} position={[-0.788, 0.339, -0.126]} rotation={[-Math.PI / 2, 0, 2.269]} scale={0.01} />
        <mesh geometry={nodes['C++_C++_0'].geometry} material={materials['material.002']} position={[-0.772, 0.34, -0.733]} rotation={[-Math.PI / 2, 0, -0.873]} scale={-0.01} />
        <mesh geometry={nodes.Object_2.geometry} material={materials.Textured} position={[0.63, 0.283, 0.736]} rotation={[-1.606, 0.046, -2.485]} scale={0.517} />
        <mesh geometry={nodes.Python_Python_0.geometry} material={materials.Python} position={[-0.801, 0.341, 0.459]} rotation={[Math.PI / 2, 0, 0.873]} scale={0.009} />
        <mesh geometry={nodes.Tech.geometry} material={nodes.Tech.material} position={[-0.199, 0.482, 1]} rotation={[-1.571, 0, -0.001]} scale={[0.075, 0.059, 0.065]}>
          <group position={[-2.28, 0.276, 3.983]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.AndroidLogo2_AndroidLogo2_0.geometry} material={materials.WindowsLogo2} />
            <mesh geometry={nodes.AndroidLogo2_AndroidLogo2_2_0.geometry} material={materials.AndroidLogo2_2} />
          </group>
          <group position={[-0.039, 0.508, 2.007]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.BlenderLogo2_BlenderLogo2_0.geometry} material={materials.BlenderLogo2} />
            <mesh geometry={nodes.BlenderLogo2_BlenderLogo2_2_0.geometry} material={materials.BlenderLogo2_2} />
          </group>
          <group position={[-1.953, 0.052, -1.928]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.DiscordLogo2_DiscordLogo2_0.geometry} material={materials.DiscordLogo2} />
            <mesh geometry={nodes.DiscordLogo2_DiscordLogo2_2_0.geometry} material={materials.DiscordLogo2_2} />
          </group>
          <group position={[2.497, 0.404, -3.894]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.FacebookLogo2_FacebookLogo2_0.geometry} material={materials.FacebookLogo2} />
            <mesh geometry={nodes.FacebookLogo2_FacebookLogo2_2_0.geometry} material={materials.DiscordLogo2_2} />
          </group>
          <group position={[1.785, 0.422, 2.035]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.GitHubLogo2_GitHubLogo2_0.geometry} material={materials.PatreonLogo2_2} />
            <mesh geometry={nodes.GitHubLogo2_GitHubLogo2_2_0.geometry} material={materials.WindowsLogo4_2_5} />
          </group>
          <group position={[4.217, 0.341, -3.819]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.InstagramLogo2_InstagramLogo2_0.geometry} material={materials.InstagramLogo2} />
            <mesh geometry={nodes.InstagramLogo2_InstagramLogo2_2_0.geometry} material={materials.InstagramLogo2_2} />
          </group>
          <group position={[0.795, 0.072, -3.854]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.LinkedinLogo2_LinkedinLogo2_0.geometry} material={materials.PatreonLogo2_2} />
            <mesh geometry={nodes.LinkedinLogo2_LinkedinLogo2_2_0.geometry} material={materials.LinkedinLogo2_2} />
          </group>
          <group position={[-0.908, 0.209, 3.9]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.LinuxLogo2_LinuxLogo2_0.geometry} material={materials.WindowsLogo4_2_5} />
            <mesh geometry={nodes.LinuxLogo2_LinuxLogo2_2_0.geometry} material={materials.LinuxLogo2_2} />
            <mesh geometry={nodes.LinuxLogo2_LinuxLogo2_3_0.geometry} material={materials.LinuxLogo2_3} />
          </group>
          <group position={[0.757, 0.443, 0.006]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.PatreonLogo2_PatreonLogo2_0.geometry} material={materials.WindowsLogo4_2_5} />
            <mesh geometry={nodes.PatreonLogo2_PatreonLogo2_2_0.geometry} material={materials.PatreonLogo2_2} />
          </group>
          <group position={[-0.931, 0.157, 0.071]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.QuoraLogo2_QuoraLogo2_0.geometry} material={materials.PatreonLogo2_2} />
            <mesh geometry={nodes.QuoraLogo2_QuoraLogo2_2_0.geometry} material={materials.QuoraLogo2_2} />
          </group>
          <group position={[-1.984, 0.464, 1.992]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.SketchfabLogo2_SketchfabLogo2_0.geometry} material={materials.SketchfabLogo2} />
            <mesh geometry={nodes.SketchfabLogo2_SketchfabLogo2_2_0.geometry} material={materials.PatreonLogo2_2} />
          </group>
          <group position={[-0.237, 0.384, -1.901]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.SpotifyLogo2_SpotifyLogo2_0.geometry} material={materials.SpotifyLogo2} />
            <mesh geometry={nodes.SpotifyLogo2_SpotifyLogo2_2_0.geometry} material={materials.WindowsLogo4_2_5} />
          </group>
          <group position={[-2.653, 0.138, 0.061]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.SteamLogo2_SteamLogo2_0.geometry} material={materials.SteamLogo2} />
            <mesh geometry={nodes.SteamLogo2_SteamLogo2_2_0.geometry} material={materials.PatreonLogo2_2} />
          </group>
          <group position={[-2.66, 0.074, -3.866]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.TelegramLogo2_TelegramLogo2_0.geometry} material={materials.TelegramLogo2} />
            <mesh geometry={nodes.TelegramLogo2_TelegramLogo2_2_0.geometry} material={materials.PatreonLogo2_2} />
          </group>
          <group position={[-4.344, 0.325, -3.872]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.TikTokLogo2_TikTokLogo2_0.geometry} material={materials.TikTokLogo2} />
            <mesh geometry={nodes.TikTokLogo2_TikTokLogo2_2_0.geometry} material={materials.TikTokLogo2_2} />
          </group>
          <group position={[2.531, 0.482, 0.05]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.UnityLogo2_UnityLogo2_0.geometry} material={materials.LinuxLogo2_3} />
            <mesh geometry={nodes.UnityLogo2_UnityLogo2_2_0.geometry} material={materials.WindowsLogo4_2_5} />
          </group>
          <group position={[-0.983, 0.365, -3.813]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.WhatsAppLogo2_WhatsAppLogo2_0.geometry} material={materials.WhatsAppLogo2} />
            <mesh geometry={nodes.WhatsAppLogo2_WhatsAppLogo2_2_0.geometry} material={materials.LinuxLogo2_3} />
          </group>
          <group position={[0.784, 0.236, 4.02]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.WindowsLogo3_2_WindowsLogo3_2_0.geometry} material={materials.WindowsLogo3_2} />
            <mesh geometry={nodes.WindowsLogo3_2_WindowsLogo3_2_2_0.geometry} material={materials.WindowsLogo4_2_5} />
          </group>
          <group position={[2.504, 0.193, 3.994]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.WindowsLogo5_2_WindowsLogo5_2_0.geometry} material={materials.WindowsLogo5_2} />
            <mesh geometry={nodes.WindowsLogo5_2_WindowsLogo5_2_2_0.geometry} material={materials.WindowsLogo5_2_2} />
            <mesh geometry={nodes.WindowsLogo5_2_WindowsLogo5_2_3_0.geometry} material={materials.WindowsLogo2_2_2} />
            <mesh geometry={nodes.WindowsLogo5_2_WindowsLogo5_2_4_0.geometry} material={materials.WindowsLogo5_2_4} />
            <mesh geometry={nodes.WindowsLogo5_2_WindowsLogo5_2_5_0.geometry} material={materials.WindowsLogo4_2_4} />
          </group>
          <group position={[1.738, 0.296, -2.016]} rotation={[-1.57, 0.009, 3.139]} scale={[1.906, 2.18, 2.436]}>
            <mesh geometry={nodes.YoutubeLogo2_YoutubeLogo2_0.geometry} material={materials.LinuxLogo2_3} />
            <mesh geometry={nodes.YoutubeLogo2_YoutubeLogo2_2_0.geometry} material={materials.YoutubeLogo2_2} />
          </group>
        </mesh>
        <group position={[0.758, 0.496, -0.299]} rotation={[1.57, 0, -0.873]} scale={1.001}>
          <mesh geometry={nodes['TEUNGKU-BLUE001'].geometry} material={materials['TEUNGKU-BLUE']} />
          <mesh geometry={nodes['TEUNGKU-BLUE001_1'].geometry} material={nodes['TEUNGKU-BLUE001_1'].material} />
        </group>
      </mesh>
      <mesh geometry={nodes.Home.geometry} material={materials.Dinding} position={[-2.747, 0.457, 2.748]} scale={2.195}>
        <group position={[0.086, 2.129, 1.568]} rotation={[-2.669, 1.142, 2.706]} scale={3.126}>
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
      </mesh>
      <mesh geometry={nodes.Project.geometry} material={materials.Dinding} position={[2.748, 0.458, 2.765]} scale={2.195}>
        <group position={[0.374, 0, 0.513]} rotation={[-Math.PI, 0.859, -Math.PI]} scale={0.113}>
          <mesh geometry={nodes['chair_Cube026-Mesh'].geometry} material={materials['795548']} />
          <mesh geometry={nodes['chair_Cube026-Mesh_1'].geometry} material={materials.DD9944} />
        </group>
        <mesh geometry={nodes.Collectable_Coffee_Mug_01.geometry} material={materials['In-Game_Collectables_Color_Palette_01.001']} position={[-0.266, 0.972, 0.514]} rotation={[0, 0.876, 0]} scale={0.455} />
        <mesh geometry={nodes.ComputerMouse_mesh.geometry} material={materials.ComputerMouse_mat1} position={[-0.325, 0.818, -0.709]} rotation={[0, -1.016, 0]} scale={0.042} />
        <mesh geometry={nodes.Keyboard1.geometry} material={materials['lambert3SG.001']} position={[-0.332, 0.815, -0.253]} rotation={[0, Math.PI / 2, 0]} scale={0.002} />
        <group position={[-0.618, 0.816, -0.233]} scale={0.455}>
          <mesh geometry={nodes['LapTop_Cube002-Mesh'].geometry} material={materials.DarkGray} />
          <mesh geometry={nodes['LapTop_Cube002-Mesh_1'].geometry} material={materials.lighterGray} />
          <mesh geometry={nodes['LapTop_Cube002-Mesh_2'].geometry} material={materials.Gray2} />
          <mesh geometry={nodes['LapTop_Cube002-Mesh_3'].geometry} material={materials.Screen} />
        </group>
        <group position={[-0.329, 0.855, 0.291]} rotation={[Math.PI, -0.771, Math.PI]} scale={0.217}>
          <mesh geometry={nodes['Node-Mesh'].geometry} material={materials.mat22} />
          <mesh geometry={nodes['Node-Mesh_1'].geometry} material={materials.mat18} />
          <mesh geometry={nodes['Node-Mesh_2'].geometry} material={materials.mat21} />
          <mesh geometry={nodes['Node-Mesh_3'].geometry} material={materials.mat20} />
        </group>
        <mesh geometry={nodes.table.geometry} material={materials['wood.001']} position={[-0.054, 0, 0.713]} rotation={[Math.PI, -1.57, Math.PI]} scale={[2.03, 2.501, 2.109]} />
      </mesh>
    </group>
  );
}

useGLTF.preload('./models/scenefixs.glb')
