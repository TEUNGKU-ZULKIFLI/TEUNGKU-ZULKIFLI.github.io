import './App.css';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import Experience from './components/Experience';


function App() {
  return (
    <Canvas>
      <ScrollControls pages={4} damping={0.5} >
        <Experience />
      </ScrollControls>
    </Canvas>
  );
}

export default App;
