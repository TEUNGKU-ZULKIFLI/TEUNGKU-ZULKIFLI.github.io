import './App.css';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';

function App() {
  return (
    <Canvas >
      <color attach="background" args={['#3a0e4c']} />
      <Experience />
    </Canvas>
  );
}

export default App;
