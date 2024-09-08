import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Model } from "./Model3D";

export function Experience() {
    return (
        <>
        <OrbitControls 
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enablePan={false}
        enableZoom={false}
        />
        <PerspectiveCamera makeDefault position={[30, 10, 10]} />
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight intensity={1} color="#ffffff" />
        <Model />
        </>
    );
}