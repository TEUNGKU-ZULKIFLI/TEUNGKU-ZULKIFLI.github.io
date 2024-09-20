import React from 'react';
import './App.css';
import Experience from './components/Experience';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';


function App() {

  return (
    <Canvas>
      <Experience />
      <ContactShadows position={[0, -3, 0]} opacity={4} scale={20} blur={3} far={10} />
    </Canvas>
  );
}

export default App;
