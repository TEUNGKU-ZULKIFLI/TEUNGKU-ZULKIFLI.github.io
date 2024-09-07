import { OrbitControls } from "@react-three/drei";
import { Model } from "./Model";

export function Experience() {
    return (
        <>
        <OrbitControls />
        <ambientLight intensity={1}/>
        <Model />
        </>
    );
}