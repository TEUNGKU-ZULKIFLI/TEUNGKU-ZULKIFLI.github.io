import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Model } from "./Model";

export function Experience() {
    return (
        <>
        <OrbitControls />
        <PerspectiveCamera makeDefault position={[-20, 10, 20]} />
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <rectAreaLight position={[-10, 5, 10]} intensity={1} />
        <pointLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[-10, 5, 10]} intensity={1} />
        <Model position={[-10, 5, -10]} />
        </>
    );
}