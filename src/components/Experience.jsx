import { OrbitControls } from "@react-three/drei";
import { Home } from "./Home";

export function Experience() {
    return (
        <>
        <OrbitControls enabled={false} />
        <ambientLight intensity={1} color="#ffffff" />
        <pointLight intensity={100} color="#8A2BE2" position={[0, -1, 0]} />
        <directionalLight intensity={1} color="#ffffff" />
        <Home scale={0.19}/>
        </>
    );
}