import { OrbitControls } from "@react-three/drei";
import { Scenefixs } from "./Scenefixs";

export function Experience() {
    return (
        <>
        <ambientLight intensity={3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <OrbitControls />
        <Scenefixs />
        </>
    );
}